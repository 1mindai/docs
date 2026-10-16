# 1mind Data API: Snowflake Implementation Guide

*Last updated August 13, 2026*

This guide covers loading 1mind data into Snowflake — staging, `COPY INTO`, deduplication, and `MERGE`. It picks up after you have an Account API Key and an extraction job producing files.

**Prerequisite:** authentication, endpoints, query parameters, extraction patterns, and API-level troubleshooting are documented once, in [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md). This page does not repeat them — read it first.

---

# Flow

```
1mind Data API
      |
      v
Your extraction job or ETL platform
      |
      v
S3, Google Cloud Storage, Azure Storage, or a Snowflake internal stage
      |
      v
Snowflake raw table (VARIANT)
      |
      v
Validation and deduplication
      |
      v
MERGE into your target tables
```

Snowflake loads files from internal or external stages with `COPY INTO`. External stages can reference S3, Google Cloud Storage, or Azure locations that you control. Storage integrations let you govern access to those locations without placing long-lived cloud credentials in SQL.

---

# Step 1 — Extract and land

Point your extraction job at a date-partitioned path with unique filenames, so any file can be traced and replayed:

```
s3://your-data/1mind/conversations/load_date=2026-07-02/part-0001.ndjson
gcs://your-data/1mind/conversations/load_date=2026-07-02/part-0001.ndjson
azure://your-container/1mind/conversations/load_date=2026-07-02/part-0001.ndjson
```

Newline-delimited JSON is the natural landing format for the `GET` endpoint. The CSV from the export endpoint loads equally well with a CSV file format.

---

# Step 2 — Create the file format, stage, and raw table

Because the report schema is not fixed by a published contract, use a `VARIANT` column so the payload lands without a declared structure:

```sql
CREATE FILE FORMAT IF NOT EXISTS RAW.ONE_MIND_JSON_FORMAT
    TYPE = JSON;

CREATE STAGE IF NOT EXISTS RAW.ONE_MIND_STAGE
    URL = 's3://your-data/1mind/'
    STORAGE_INTEGRATION = YOUR_STORAGE_INTEGRATION
    FILE_FORMAT = RAW.ONE_MIND_JSON_FORMAT;

CREATE TABLE IF NOT EXISTS RAW.ONE_MIND_REPORTS (
    PAYLOAD      VARIANT,
    SOURCE_FILE  STRING,
    LOADED_AT    TIMESTAMP_TZ
);
```

Replace the stage URL and integration name with your own Snowflake configuration.

---

# Step 3 — Load the raw table

```sql
COPY INTO RAW.ONE_MIND_REPORTS
    (PAYLOAD, SOURCE_FILE, LOADED_AT)
FROM (
    SELECT
        $1,
        METADATA$FILENAME,
        CURRENT_TIMESTAMP()
    FROM @RAW.ONE_MIND_STAGE
)
FILE_FORMAT = (FORMAT_NAME = RAW.ONE_MIND_JSON_FORMAT)
ON_ERROR = 'ABORT_STATEMENT';
```

If you're loading the CSV export instead, create a CSV file format and a staging table whose columns match the actual export headers you receive.

<aside>
💡

Snowflake records file-loading status and avoids reloading the same staged file under normal `COPY INTO` load-history behavior. Even so, use unique filenames, deterministic paths, and target-level deduplication in production — load history is a convenience, not your deduplication strategy.

</aside>

---

# Step 4 — Inspect the payload and decide your mappings

```sql
SELECT SOURCE_FILE, PAYLOAD, LOADED_AT
FROM RAW.ONE_MIND_REPORTS
LIMIT 25;
```

Field access uses colon-path syntax on the `VARIANT` column, for example `PAYLOAD:some_field::STRING`.

From real records, determine:

- Which field is your report or conversation key
- Which timestamp drives incremental processing
- Which fields contain personal information
- Which fields should be promoted into typed columns
- Whether records can be updated after creation
- Which malformed records should be rejected or quarantined

---

# Step 5 — Merge into your target table

Template only — replace `<business_key>` and the target mappings with fields confirmed from actual API output.

```sql
MERGE INTO ANALYTICS.CONVERSATIONS AS TARGET
USING (
    SELECT
        PAYLOAD:<business_key>::STRING AS CONVERSATION_KEY,
        PAYLOAD AS SOURCE_PAYLOAD,
        LOADED_AT
    FROM RAW.ONE_MIND_REPORTS
    WHERE PAYLOAD:<business_key> IS NOT NULL
    QUALIFY ROW_NUMBER() OVER (
        PARTITION BY PAYLOAD:<business_key>::STRING
        ORDER BY LOADED_AT DESC
    ) = 1
) AS SOURCE
ON TARGET.CONVERSATION_KEY = SOURCE.CONVERSATION_KEY

WHEN MATCHED THEN UPDATE SET
    TARGET.SOURCE_PAYLOAD = SOURCE.SOURCE_PAYLOAD,
    TARGET.UPDATED_AT = CURRENT_TIMESTAMP()

WHEN NOT MATCHED THEN INSERT (
    CONVERSATION_KEY, SOURCE_PAYLOAD, CREATED_AT, UPDATED_AT
)
VALUES (
    SOURCE.CONVERSATION_KEY, SOURCE.SOURCE_PAYLOAD,
    CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
);
```

The `QUALIFY ROW_NUMBER()` clause collapses duplicates from overlapping extract windows, so `MERGE` sees at most one row per key.

---

# Step 6 — Schedule, secure, and monitor

**Orchestration.** Orchestrate the extraction with your existing ETL platform. For warehouse-side SQL processing, Snowflake Tasks can run on a schedule or be triggered by data-related events. For file-arrival-driven ingestion, Snowpipe can detect files in a stage through cloud messaging or the Snowpipe REST API — a Snowflake-side design choice, independent of the 1mind API.

**Secrets and access.** Hold the Account API Key in your secrets manager and inject it into the extraction job at runtime. On the Snowflake side, use a storage integration to govern stage access rather than embedding cloud credentials in SQL, and apply least-privilege grants on the raw and curated schemas. Consider tighter access on the raw payload schema than on your curated layer.

- **What to monitor**
    
    
    | Category | What to watch |
    | --- | --- |
    | Extraction | Job status, API error rate, records extracted, pagination completion |
    | Reconciliation | `total` and `recordCount` against rows loaded |
    | Files | File count, file size, unexpected or missing files |
    | Load | Rows parsed, rows loaded, rows rejected, `COPY INTO` errors |
    | Data quality | Duplicate keys, null business keys, quarantined records |
    | Freshness | Time since last successful load, checkpoint progression |
    | Change | New or changed payload fields, task failures |
    
    Snowflake exposes load-history information and validation functions you can query to inspect load errors.
    

---

# Snowflake-specific troubleshooting

For authentication errors, pagination problems, missing records, and export-link failures, see *Troubleshooting* in [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md).

- **`COPY INTO` reports zero rows loaded**
    
    Snowflake's load history skips files it has already ingested from that stage. Query the load history for the stage to confirm, or use `FORCE = TRUE` deliberately during testing only.
    
- **Payload arrives as a single string rather than parsed JSON**
    
    Confirm the file format is `TYPE = JSON`, and that your extraction job wrote newline-delimited JSON — one object per line, with no wrapping array.
    
- **Field lookups return null**
    
    `VARIANT` path lookups are case-sensitive. `PAYLOAD:createdAt` and `PAYLOAD:created_at` are different paths.
    
- **Stage access denied**
    
    Verify the storage integration's trust relationship, and that the external ID and cloud IAM policy match the values Snowflake reports for the integration.
    

---

# Related documentation

- [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md) — authentication, endpoints, extraction patterns, and the questions to settle before you build
- [**Databricks Implementation Guide**](1mind%20Data%20API%20Databricks%20Implementation%20Guide%203bbb7e3f969281eca061e229c6033bcd.md) — the equivalent pattern for Unity Catalog volumes, Auto Loader, and Delta
- [**BigQuery Implementation Guide**](1mind%20Data%20API%20BigQuery%20Implementation%20Guide%203bbb7e3f96928196b0f6d4470764f8fc.md) — the equivalent pattern for Cloud Storage and the native `JSON` type
- [**Amazon Redshift Implementation Guide**](1mind%20Data%20API%20Amazon%20Redshift%20Implementation%20Guid%203bbb7e3f9692817e9132ef3a8f5d006e.md) — the equivalent pattern for S3 staging and the `SUPER` type