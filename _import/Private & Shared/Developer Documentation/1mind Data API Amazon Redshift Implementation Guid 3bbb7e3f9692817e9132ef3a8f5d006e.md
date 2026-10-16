# 1mind Data API: Amazon Redshift Implementation Guide

*Last updated August 13, 2026*

This guide covers loading 1mind data into Amazon Redshift — S3 staging, `COPY`, the `SUPER` type, and `MERGE`. It picks up after you have an Account API Key and an extraction job producing files.

**Prerequisite:** authentication, endpoints, query parameters, extraction patterns, and API-level troubleshooting are documented once, in [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md). This page does not repeat them — read it first.

---

# Flow

```
1mind Data API
      |
      v
Your extraction job (Lambda, ECS/Fargate task, Glue, or MWAA/Airflow)
      |
      v
Amazon S3 landing bucket
      |
      v
Redshift staging table (COPY)
      |
      v
Validation and deduplication
      |
      v
MERGE into your curated tables
```

---

# Step 1 — Land in S3

```
s3://your-data/1mind/conversations/load_date=2026-07-02/part-0001.ndjson
```

Use date-partitioned prefixes and unique filenames so files can be traced and replayed.

<aside>
⚠️

**Lambda has a hard execution timeout.** If a backfill window paginates for longer than that, run the extraction as an ECS/Fargate task or a Glue job instead, or split the work into smaller date windows.

</aside>

---

# Step 2 — Create the staging table

Redshift's `SUPER` type holds semi-structured data, which is the right landing type while the payload schema is still being validated:

```sql
CREATE TABLE IF NOT EXISTS raw.one_mind_reports (
    payload      SUPER,
    source_file  VARCHAR(1024),
    loaded_at    TIMESTAMPTZ DEFAULT GETDATE()
);
```

---

# Step 3 — Load with `COPY`

JSON landing files:

```sql
COPY raw.one_mind_reports (payload)
FROM 's3://your-data/1mind/conversations/load_date=2026-07-02/'
IAM_ROLE 'arn:aws:iam::<account-id>:role/<redshift-copy-role>'
FORMAT JSON 'auto'
REGION 'us-east-1';
```

CSV from the export endpoint — the column list must match the actual export headers you receive:

```sql
COPY raw.one_mind_reports_csv
FROM 's3://your-data/1mind/exports/2026-01/'
IAM_ROLE 'arn:aws:iam::<account-id>:role/<redshift-copy-role>'
FORMAT CSV
IGNOREHEADER 1
REGION 'us-east-1';
```

Use an IAM role attached to the cluster or Serverless workgroup rather than access keys embedded in SQL. Redshift tracks loaded files in its load history, but unique filenames and deterministic prefixes still matter for replay and reconciliation.

<aside>
💡

**Alternative:** Redshift Spectrum lets you query the S3 landing zone directly through an external schema over the AWS Glue Data Catalog, without loading. That's useful for exploratory work on a backfill before you commit to a table design.

</aside>

---

# Step 4 — Inspect the payload and decide your mappings

```sql
SET enable_case_sensitive_identifier TO true;

SELECT source_file, payload, loaded_at
FROM raw.one_mind_reports
LIMIT 25;
```

Field access uses dot and bracket notation on the `SUPER` column, for example `payload."some_field"::VARCHAR`.

<aside>
⚠️

The `enable_case_sensitive_identifier` setting matters here — without it, Redshift lowercases identifiers and lookups against camelCase JSON keys will return null. Set it at the session or cluster level for any code touching `SUPER` columns.

</aside>

From real records, determine your business key, your incremental timestamp, which fields become typed columns, which contain personal information, and which malformed records to quarantine.

---

# Step 5 — Merge into your curated tables

Template only — replace `<business_key>` with a field confirmed from actual API output.

```sql
MERGE INTO analytics.conversations AS target
USING (
    SELECT
        payload."<business_key>"::VARCHAR AS conversation_key,
        payload                           AS source_payload,
        loaded_at
    FROM (
        SELECT
            payload,
            loaded_at,
            ROW_NUMBER() OVER (
                PARTITION BY payload."<business_key>"::VARCHAR
                ORDER BY loaded_at DESC
            ) AS rn
        FROM raw.one_mind_reports
        WHERE payload."<business_key>" IS NOT NULL
    )
    WHERE rn = 1
) AS source
ON target.conversation_key = source.conversation_key

WHEN MATCHED THEN UPDATE SET
    source_payload = source.source_payload,
    updated_at     = GETDATE()

WHEN NOT MATCHED THEN INSERT (
    conversation_key, source_payload, created_at, updated_at
)
VALUES (
    source.conversation_key, source.source_payload, GETDATE(), GETDATE()
);
```

On older cluster versions without `MERGE`, use the classic staging pattern inside a single transaction: `DELETE` matching keys from the target, `INSERT` the deduplicated staging rows, then `COMMIT`.

---

# Step 6 — Schedule, secure, and monitor

**Orchestration.** EventBridge Scheduler triggering a Lambda or ECS task covers most extraction jobs. AWS Glue workflows or MWAA (Managed Airflow) suit multi-step pipelines. The Redshift Data API lets you submit SQL steps asynchronously without holding a JDBC connection open.

**Secrets.** AWS Secrets Manager for the Account API Key, read at runtime by the extraction task's execution role.

**Access control.** An S3 bucket policy plus a scoped IAM role for `COPY`; schema-level grants in Redshift; column-level or row-level security for personal information.

**Table design and housekeeping.** Choose a distribution key and sort key aligned to your confirmed business key and primary timestamp. Run `VACUUM` and `ANALYZE` after large merges, since merge-heavy workloads leave unsorted rows and stale statistics behind.

- **What to monitor**
    
    
    | Category | What to watch |
    | --- | --- |
    | Extraction | Job status, API error rate, pagination completion |
    | Reconciliation | `total` and `recordCount` against rows loaded |
    | Load | Load errors and rejected rows in the system load views |
    | Data quality | Duplicate keys, null business keys, quarantined records |
    | Freshness | Time since last successful load, checkpoint progression |
    | Cluster health | Unsorted-row percentage, disk usage, queue wait times |
    
    The system load views give you per-file load outcomes and per-row error detail for alerting.
    

---

# Redshift-specific troubleshooting

For authentication errors, pagination problems, missing records, and export-link failures, see *Troubleshooting* in [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md).

- **`SUPER` field lookups return null**
    
    Almost always the case-sensitivity setting. Run `SET enable_case_sensitive_identifier TO true;` and double-quote the key exactly as it appears in the payload.
    
- **`COPY` fails on oversized values**
    
    `SUPER` has a per-value size limit. If individual report objects are large — long transcripts, for example — split the payload during extraction or store the oversized field separately.
    
- **`COPY` reports rows loaded but the table looks empty**
    
    Check that you committed, and that you're querying the same schema the `COPY` targeted. Redshift's `COPY` runs inside the enclosing transaction.
    
- **Access denied on `COPY`**
    
    Verify the IAM role is attached to the cluster or workgroup, that the role's trust policy allows Redshift, and that the bucket policy permits that role. The role ARN in the `COPY` statement must be one associated with the cluster.
    
- **Merge performance degrades over time**
    
    Check the unsorted-row percentage and run `VACUUM`; confirm the sort key supports the merge predicate.
    

---

# Related documentation

- [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md) — authentication, endpoints, extraction patterns, and the questions to settle before you build
- [**Snowflake Implementation Guide**](1mind%20Data%20API%20Snowflake%20Implementation%20Guide%203bbb7e3f969281598ce3ff95bf94c95b.md) — the equivalent pattern for stages and `VARIANT`
- [**Databricks Implementation Guide**](1mind%20Data%20API%20Databricks%20Implementation%20Guide%203bbb7e3f969281eca061e229c6033bcd.md) — the equivalent pattern for Unity Catalog volumes, Auto Loader, and Delta
- [**BigQuery Implementation Guide**](1mind%20Data%20API%20BigQuery%20Implementation%20Guide%203bbb7e3f96928196b0f6d4470764f8fc.md) — the equivalent pattern for Cloud Storage and the native `JSON` type