# 1mind Data API: Databricks Implementation Guide

*Last updated August 13, 2026*

This guide covers loading 1mind data into Databricks — Unity Catalog volumes, `COPY INTO` and Auto Loader, the medallion pattern, and Delta `MERGE`. It picks up after you have an Account API Key and an extraction job producing files.

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
S3, ADLS, GCS, or a Unity Catalog volume
      |
      v
Bronze Delta table
      |
      v
Validation and schema enforcement
      |
      v
Silver Delta table
      |
      v
MERGE into your gold / reporting tables
```

Databricks recommends governing access to cloud storage with Unity Catalog external locations or volumes, which combine a storage path with a storage credential and workspace permissions. Landing files in a Unity Catalog volume keeps the whole path governed and auditable.

---

# Step 1 — Extract and land

```
/Volumes/main/landing/one_mind/load_date=2026-07-02/part-0001.ndjson
```

Or an external location backed by S3, ADLS, or GCS. Use date-partitioned paths and unique filenames so files can be traced and replayed.

---

# Step 2 — Choose your ingestion path

Two options. `COPY INTO` suits scheduled file batches; Auto Loader suits ongoing or larger-scale ingestion.

- **Option A — `COPY INTO`**
    
    Databricks describes `COPY INTO` as retryable and idempotent for file ingestion, so re-running it will not reload files it has already processed.
    
    ```sql
    CREATE TABLE IF NOT EXISTS main.bronze.one_mind_reports (
        payload      VARIANT,
        source_file  STRING,
        loaded_at    TIMESTAMP
    );
    
    COPY INTO main.bronze.one_mind_reports
    FROM (
        SELECT
            parse_json(_c0)      AS payload,
            _metadata.file_path  AS source_file,
            current_timestamp()  AS loaded_at
        FROM '/Volumes/main/landing/one_mind/'
    )
    FILEFORMAT = JSON;
    ```
    
    Adjust the syntax to your runtime version and landing file format. On runtimes without the `VARIANT` type, use a `STRING` column and parse on read, or let Auto Loader infer a struct.
    
- **Option B — Auto Loader**
    
    Auto Loader incrementally processes new files arriving in S3, ADLS, GCS, Azure Blob Storage, or Unity Catalog volumes, with schema inference and evolution built in — a good fit while the report payload is still being characterized.
    
    ```python
    source_path     = "/Volumes/main/landing/one_mind/"
    schema_path     = "/Volumes/main/checkpoints/one_mind_schema/"
    checkpoint_path = "/Volumes/main/checkpoints/one_mind_bronze/"
    
    reports = (
        spark.readStream
        .format("cloudFiles")
        .option("cloudFiles.format", "json")
        .option("cloudFiles.schemaLocation", schema_path)
        .option("cloudFiles.schemaEvolutionMode", "rescue")
        .load(source_path)
    )
    
    (
        reports.writeStream
        .option("checkpointLocation", checkpoint_path)
        .trigger(availableNow=True)
        .toTable("main.bronze.one_mind_reports")
    )
    ```
    
    `trigger(availableNow=True)` processes everything currently available and stops, which suits a scheduled batch job. Use a continuous trigger only if you have a reason to keep a stream running.
    

---

# Step 3 — Structure your medallion layers

- **Bronze** — the source payload plus lineage
    
    Store the source payload with minimal transformation, plus lineage columns:
    
    - Source filename
    - Extraction timestamp
    - Load timestamp
    - Batch identifier
    - Source date range requested
    - Raw payload
    - Parsing status
- **Silver** — validated and typed
    
    Apply type conversion, field naming standards, null handling, deduplication, required-field validation, personal-information controls, rejected-record handling, and your confirmed report key.
    
- **Gold** — your reporting objects
    
    Build your own reporting objects — conversation facts, contact and account dimensions, topic tables, activity summaries, agent metrics. These are models you define; they aren't fields guaranteed by the API.
    

---

# Step 4 — Inspect the payload before designing silver

```sql
SELECT source_file, payload, loaded_at
FROM main.bronze.one_mind_reports
LIMIT 25;
```

From real records, decide your business key, your incremental timestamp, which fields become typed columns, and which carry personal information.

---

# Step 5 — Merge into silver

Once your business key is confirmed:

```sql
MERGE INTO main.silver.conversations AS target
USING main.bronze.one_mind_conversations_latest AS source
ON target.conversation_key = source.conversation_key

WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;
```

<aside>
⚠️

`main.bronze.one_mind_conversations_latest` should be a view or table that has already collapsed duplicates from overlapping extract windows — Delta `MERGE` fails if the source supplies more than one row for the same target key:

</aside>

```sql
CREATE OR REPLACE VIEW main.bronze.one_mind_conversations_latest AS
SELECT * EXCEPT (rn) FROM (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY conversation_key
            ORDER BY loaded_at DESC
        ) AS rn
    FROM main.bronze.one_mind_conversations_typed
)
WHERE rn = 1;
```

---

# Step 6 — Schedule, secure, and monitor

**Orchestration.** Databricks Lakeflow Jobs coordinate multiple tasks, schedules, dependencies, retries, and control flow. Jobs can run on a schedule, on file-arrival triggers, on table-update triggers, or continuously.

**Secrets and access.** Hold the Account API Key in a Databricks secret scope or your own secrets manager, and inject it into the extraction job at runtime. Govern the landing path with a Unity Catalog external location or volume, and grant the job's identity only the `READ VOLUME` / `WRITE VOLUME` permissions it needs. Consider tighter access on bronze than on silver and gold.

- **What to monitor**
    
    
    | Category | What to watch |
    | --- | --- |
    | Extraction | Job status, API error rate, pagination completion |
    | Reconciliation | `total` and `recordCount` against rows loaded |
    | Ingestion | New files detected, rows loaded, rescued and corrupt records |
    | Data quality | Duplicate keys, null business keys, failed expectations |
    | Pipeline health | Checkpoint state, stream backlog, Delta merge results |
    | Freshness | End-to-end latency, time since last successful run |
    | Change | Schema evolution events, new fields in the rescued-data column |
    
    Auto Loader's rescued-data column is worth alerting on specifically — it's where unexpected new fields land, and a non-empty rescued column is usually the first sign the payload has changed.
    

---

# Databricks-specific troubleshooting

For authentication errors, pagination problems, missing records, and export-link failures, see *Troubleshooting* in [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md).

- **`MERGE` fails with a multiple-source-rows error**
    
    Your source has more than one row per key. Collapse duplicates with a `ROW_NUMBER()` view before merging, as shown in Step 5.
    
- **Auto Loader isn't picking up new files**
    
    Check that the checkpoint location hasn't been reused from a different source path, and that the schema location is writable. Deleting a checkpoint reprocesses everything, so do that deliberately.
    
- **Fields keep landing in `_rescued_data`**
    
    The inferred schema no longer matches the payload. Inspect the rescued column, decide whether the new fields matter, and evolve the schema explicitly.
    
- **Permission denied on a volume path**
    
    Confirm the external location's storage credential, and that the job's identity has `READ VOLUME` / `WRITE VOLUME` grants in Unity Catalog.
    

---

# Related documentation

- [1mind Data API](1mind%20Data%20API%203bbb7e3f969281719c8ee306a144aeb3.md) — authentication, endpoints, extraction patterns, and the questions to settle before you build
- [**Snowflake Implementation Guide**](1mind%20Data%20API%20Snowflake%20Implementation%20Guide%203bbb7e3f969281598ce3ff95bf94c95b.md) — the equivalent pattern for stages and `VARIANT`
- [**BigQuery Implementation Guide**](1mind%20Data%20API%20BigQuery%20Implementation%20Guide%203bbb7e3f96928196b0f6d4470764f8fc.md) — the equivalent pattern for Cloud Storage and the native `JSON` type
- [**Amazon Redshift Implementation Guide**](1mind%20Data%20API%20Amazon%20Redshift%20Implementation%20Guid%203bbb7e3f9692817e9132ef3a8f5d006e.md) — the equivalent pattern for S3 staging and the `SUPER` type