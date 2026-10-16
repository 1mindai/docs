# 1mind Data API

*Last updated August 13, 2026*

The 1mind Data API, documented as the **Integration Reports API**, gives your team programmatic access to your account's integration and conversation report data, so you can load it into your own data warehouse, lake, or BI platform. This page covers the API itself — authentication, endpoints, extraction patterns, and the decisions to settle before you build. It applies regardless of where you load the data.

**Who this is for:** data engineering and analytics teams, or the ETL partner building on your behalf.

**Platform-specific steps** — landing location, staging objects, load mechanism, and merge pattern — live in the four implementation guides listed under *Platform implementation guides* at the end of this page. Read this page first.

---

# Responsibilities

1mind does not provide a managed warehouse connector that writes directly into your tables. Your warehouse schema, business keys, security model, transformation logic, and reporting requirements are specific to your organization, so your data engineering team or ETL partner builds and operates the ingestion pipeline. This page and the platform guides give you everything needed to do that.

| Area | You / your ETL partner own | 1mind provides |
| --- | --- | --- |
| API access | Storing and rotating your Account API Key | Provisioning the key through a secure channel; reissuing it on request |
| Documentation | — | This page, the platform guides, and clarification of documented API behavior |
| Extraction | Calling the API on a schedule, handling pagination, downloading export files | Availability of the data through the documented endpoints |
| Landing zone | Your cloud storage location, its retention policy, and file naming | — |
| Warehouse objects | Stages, external locations, volumes, raw and curated tables | — |
| Data model | Target schema, field mappings, typed columns, your unique business key | — |
| Load logic | Incremental logic, checkpoints, deduplication, transformations, upserts, backfill execution | — |
| Data quality | Validation rules, quarantining malformed records, reconciliation | — |
| Orchestration | Scheduling, retries, monitoring, alerting, failure recovery | — |
| Security &amp; privacy | Personal-information handling, retention and deletion, access control | — |
| Cost | Warehouse compute and storage | — |
| Support | Ongoing maintenance of your pipeline | Support for questions about retrieving the source data; escalation of API defects |

---

# What this API does not provide

Worth reading before you scope the work — each of these is something teams commonly assume is available.

| Not provided | What to do instead |
| --- | --- |
| A managed connector for Snowflake, Databricks, BigQuery, or Redshift | Build the extraction and load yourself, or with your ETL partner. The platform guides give you a working pattern for each. |
| Direct writes into your warehouse tables | Land API output in storage you control, then load from there. |
| Streaming or change-data-capture delivery | Poll on a schedule that matches your freshness requirement. Batch is the delivery model. |
| Webhooks or event push | Same — schedule an extraction job rather than waiting to be notified. |
| A published schema contract for the report objects | Land the payload in a schema-flexible column first (`JSON`, `VARIANT`, `SUPER`), inspect real records, then promote fields into typed columns. Do not design your target schema from assumptions. |
| Documented rate limits | Build defensively regardless: conservative pacing, exponential backoff, retry on `429` and `5xx`. |
| A stated lifetime for export download links | Treat `downloadUrl` as short-lived. Fetch the file immediately and copy it into your own storage rather than queuing the URL. |
| An asynchronous export job-status endpoint | None is needed — the export call is synchronous and returns a completed file. Size your client timeout accordingly. |
| A guaranteed refresh frequency or data-freshness SLA | If you have a contractual freshness requirement, raise it with your 1mind contact rather than inferring one from observed behavior. |
| Delete / hard-delete propagation semantics | Not documented. Apply your own retention and deletion policy in your warehouse and landing zone. |

---

# Before you build

<aside>
⚠️

Work through these with your data team **before writing pipeline code**. The answers determine your table design, and changing them later usually means a reload.

</aside>

- **Scope** — 4 questions
    1. Is this a one-time historical export, an ongoing incremental load, or both?
    2. How frequently should the data refresh?
    3. What historical date range do you need?
    4. Which report flows do you need? (Use `flow=conversation` for conversation-related reports.)
- **Data model** — 4 questions
    1. Which field will be your unique record key? *Answer this only after inspecting real API output.*
    2. Which timestamp drives your incremental processing?
    3. Can records change after they are first created? If so, your load must upsert rather than append.
    4. Which fields should be promoted into typed columns, and which stay in the raw payload?
- **Operations** — 6 questions
    1. Who owns the ETL process — an internal team or an implementation partner?
    2. Where will raw files land, and what is the retention policy on that landing zone?
    3. Which secrets manager will hold the Account API Key?
    4. How will failed or rejected records be handled — quarantined, alerted, or dropped?
    5. What reconciliation process compares source counts (`total` / `recordCount`) against rows loaded?
    6. Who monitors the pipeline after launch, and where do alerts go?
- **Governance** — 3 questions
    1. Which fields contain personal or regulated information?
    2. What retention and deletion requirements apply to conversation data in your warehouse?
    3. Is there an internal security or privacy review to clear before data leaves 1mind?

## Recommended sequence

```
Receive API key
   → Discovery pull (small date range, inspect real records)
   → Define your unique key and typed columns
   → Build the incremental pipeline
   → Run the historical backfill
   → Enable scheduling and monitoring
```

The single most useful first step is a small `GET` against a narrow date range, so your engineers can look at actual report objects before designing anything.

---

# The API

The API offers two access patterns: a paginated `GET` for record-level retrieval, and a `POST` export that generates a downloadable CSV file.

<aside>
🔑

**Base URL**

`https://interaction.1mind.com/platform/api/v1/integration-reports`

**Authentication** — every request carries your Account API Key as a header:

`x-api-key: your_api_key_here`

There is no OAuth flow and no token refresh. A single account-scoped key authenticates every request. Your 1mind contact provisions it through a secure channel.

</aside>

- **`GET /platform/api/v1/integration-reports`** — list and query reports
    
    Retrieves your integration reports as a paginated list.
    
    **Query parameters**
    
    | Parameter | Required | Default | Format / values | Notes |
    | --- | --- | --- | --- | --- |
    | `flow` | Optional | — | String | Workflow flow filter. Use `conversation` to request conversation-related reports. |
    | `start-date` | Optional | — | `YYYY-MM-DD` or ISO 8601 | Start of the filter window. |
    | `end-date` | Optional | — | `YYYY-MM-DD` or ISO 8601 | End of the filter window. |
    | `limit` | Optional | `100` | Integer | Maximum records returned per request. |
    | `offset` | Optional | `0` | Integer | Records to skip, for pagination. |
    | `sort-by` | Optional | `created_at` | Field name | Field used for sorting. |
    | `sort-order` | Optional | — | `asc` or `desc` | Sort direction. |
    
    <aside>
    💡
    
    **Note the hyphenated parameter names** — `start-date`, `end-date`, `sort-by`, `sort-order`. They are not snake_case. This is a common source of silently-ignored filters when query strings are built from a config object.
    
    </aside>
    
    **Request examples**
    
    Minimal call:
    
    ```bash
    curl -X GET \
      "https://interaction.1mind.com/platform/api/v1/integration-reports" \
      -H "x-api-key: your_api_key_here"
    ```
    
    With filtering, pagination, and sorting:
    
    ```bash
    curl -X GET \
      "https://interaction.1mind.com/platform/api/v1/integration-reports?start-date=2026-07-01&end-date=2026-07-31&limit=50&offset=0&sort-by=created_at&sort-order=asc" \
      -H "x-api-key: your_api_key_here"
    ```
    
    With the flow filter applied:
    
    ```bash
    curl -X GET \
      "https://interaction.1mind.com/platform/api/v1/integration-reports?flow=conversation&start-date=2026-07-01&end-date=2026-07-31" \
      -H "x-api-key: your_api_key_here"
    ```
    
    **Response format**
    
    ```json
    {
      "data": [
        {
          // Integration report objects
        }
      ],
      "total": 150,
      "limit": 100,
      "offset": 0
    }
    ```
    
    | Field | Meaning |
    | --- | --- |
    | `data` | Array of integration report objects. |
    | `total` | Total records matching the filter across all pages. Drive your pagination loop from this, and use it to reconcile row counts after loading. |
    | `limit` | Page size in effect. |
    | `offset` | Offset in effect. |
- **`POST /platform/api/v1/integration-reports/export`** — generate a downloadable file
    
    Generates a downloadable file of your integration report data. Filters are supplied as **query parameters**, not as a request body.
    
    **Query parameters**
    
    | Parameter | Required | Format / values | Notes |
    | --- | --- | --- | --- |
    | `flow` | Optional | String | Workflow flow filter. |
    | `start-date` | Optional | `YYYY-MM-DD` or ISO 8601 | Start of the filter window. |
    | `end-date` | Optional | `YYYY-MM-DD` or ISO 8601 | End of the filter window. |
    
    The export endpoint does not accept `limit`, `offset`, `sort-by`, or `sort-order`. It covers the entire result set for the filter window.
    
    **Request examples**
    
    ```bash
    curl -X POST \
      "https://interaction.1mind.com/platform/api/v1/integration-reports/export?start-date=2026-07-01&end-date=2026-07-31" \
      -H "x-api-key: your_api_key_here"
    ```
    
    With the flow filter applied:
    
    ```bash
    curl -X POST \
      "https://interaction.1mind.com/platform/api/v1/integration-reports/export?flow=conversation&start-date=2026-07-01&end-date=2026-07-31" \
      -H "x-api-key: your_api_key_here"
    ```
    
    **Response format**
    
    ```json
    {
      "message": "Export completed successfully",
      "downloadUrl": "https://storage.googleapis.com/bucket/file.csv",
      "fileName": "integration-reports-export.csv",
      "recordCount": 150
    }
    ```
    
    | Field | Meaning |
    | --- | --- |
    | `message` | Status text. |
    | `downloadUrl` | A Google Cloud Storage URL for the generated file. |
    | `fileName` | Generated filename. The default form is `integration-reports-export.csv`, so the export is CSV. |
    | `recordCount` | Number of records in the file. Use this to reconcile against rows loaded into your warehouse. |
    
    The call is synchronous — the response contains a completed export rather than a job ID to poll.
    
    <aside>
    ⏱️
    
    **Download the file promptly.** The lifetime of `downloadUrl` is not specified. Treat it as short-lived: fetch the file immediately after the export response and copy it into your own storage rather than queuing the URL for later processing.
    
    </aside>
    
- **Choosing between the two endpoints**
    
    
    |  | `GET /integration-reports` | `POST /integration-reports/export` |
    | --- | --- | --- |
    | Returns | JSON records inline | A `downloadUrl` to a CSV file |
    | Pagination | Yes — `limit` / `offset` | Not applicable |
    | Sorting | Yes — `sort-by` / `sort-order` | Not available |
    | Filters | `flow`, `start-date`, `end-date` | `flow`, `start-date`, `end-date` |
    | Default page size | 100 | — |
    | Reconciliation field | `total` | `recordCount` |
    | Best for | Ongoing incremental, record-level loads | Historical backfills and file-oriented batch loads |
    
    **Use the paginated `GET` when** you want record-level control, your job needs to manage pagination itself, you want to write JSON or newline-delimited JSON, you prefer smaller incremental requests, or you want to inspect and validate records before landing them.
    
    **Use the export when** you want a batch file, you're running a historical backfill, CSV suits your ingestion process, or you want to reconcile against `recordCount`.
    
    Most production setups use both: the export endpoint for the initial backfill, the `GET` endpoint for the ongoing incremental load.
    
- **Implementation notes** — build defensively around these six
    
    These are practical recommendations rather than documented API guarantees.
    
    - **Pagination loop.** Page with `offset` until the number of records retrieved reaches `total`, or until a page returns zero records. Guard against an infinite loop if `total` is missing from a response. Increment `offset` by the number of records actually returned, not by the requested `limit`.
    - **Stable sorting.** Paginating an actively-written dataset while sorting `desc` can shift records between pages and cause skips. Sorting `asc` on `created_at` is generally safer for extraction jobs.
    - **Date boundaries.** The documentation does not state whether `start-date` and `end-date` are inclusive or exclusive, or which time zone applies to date-only values. Test this against your own data, and use slightly overlapping windows plus deduplication rather than assuming adjoining windows cannot overlap.
    - **Rate limits.** Rate limits are not documented. Build for them anyway: conservative pacing, exponential backoff, and retry on `429` and `5xx` responses.
    - **Retries.** Treat network errors and `5xx` as retryable. Treat `4xx` as a configuration problem to investigate rather than something to retry in a loop.
    - **Report schema.** The structure of the objects inside `data` is not fixed by a published schema contract. Land the payload in a schema-flexible column first, inspect real records, then promote fields into typed columns.

---

# Reference architecture

```
1mind Data API
      |
      v
Your extraction job or ETL platform
      |
      v
Your cloud storage landing area
      |
      v
Raw / Bronze warehouse table
      |
      v
Validation, deduplication, and transformation
      |
      v
Curated / Silver / Gold tables
      |
      v
BI, analytics, ML, or downstream applications
```

- **Why land the data in storage first**
    
    For most production implementations, the extraction job should save API output to your own cloud storage before loading it into the warehouse. This gives you:
    
    - A replayable copy of every extract
    - Separation between API retrieval and warehouse availability
    - Simpler failure recovery
    - Auditability and file-level reconciliation
    - Protection from temporary warehouse outages
    - The ability to reprocess data after transformation logic changes
    
    For small, low-frequency loads you can write API results directly into a warehouse table, but a landing layer is generally safer in production.
    
- **Incremental extraction pattern**
    
    A scheduled extraction job should maintain a checkpoint holding the last successfully processed date or timestamp:
    
    1. Read the previous successful checkpoint.
    2. Query a slightly overlapping date range.
    3. Retrieve all pages.
    4. Save the records to the landing area.
    5. Load them into the raw warehouse table.
    6. Deduplicate using your confirmed business key.
    7. Commit the new checkpoint **only after** the load succeeds.
    
    The overlap protects against late-arriving records and date-boundary behavior.
    
- **Example — incremental extraction job (Python)**
    
    Placeholders throughout — adapt to your storage platform and confirmed report schema.
    
    ```python
    import json
    import os
    import time
    from datetime import date
    from pathlib import Path
    
    import requests
    
    BASE_URL = (
        "https://interaction.1mind.com/"
        "platform/api/v1/integration-reports"
    )
    
    api_key = os.environ["ONE_MIND_ACCOUNT_API_KEY"]
    
    params = {
        "flow": "conversation",
        "start-date": "2026-07-01",
        "end-date": "2026-07-02",
        "limit": 100,
        "offset": 0,
        "sort-by": "created_at",
        "sort-order": "asc",
    }
    
    output_path = Path(
        f"1mind-conversations-{date.today().isoformat()}.ndjson"
    )
    
    session = requests.Session()
    session.headers.update({"x-api-key": api_key})
    
    with output_path.open("w", encoding="utf-8") as output_file:
        while True:
            for attempt in range(5):
                response = session.get(BASE_URL, params=params, timeout=60)
                if response.status_code < 500 and response.status_code != 429:
                    break
                time.sleep(2 ** attempt)
    
            response.raise_for_status()
    
            body = response.json()
            records = body.get("data", [])
    
            for record in records:
                output_file.write(json.dumps(record) + "\n")
    
            params["offset"] += len(records)
    
            if not records or params["offset"] >= body.get("total", 0):
                break
    ```
    
- **Example — historical backfill via the export endpoint (Python)**
    
    ```python
    import os
    import requests
    
    EXPORT_URL = (
        "https://interaction.1mind.com/"
        "platform/api/v1/integration-reports/export"
    )
    
    response = requests.post(
        EXPORT_URL,
        headers={"x-api-key": os.environ["ONE_MIND_ACCOUNT_API_KEY"]},
        params={
            "flow": "conversation",
            "start-date": "2026-01-01",
            "end-date": "2026-01-31",
        },
        timeout=300,
    )
    response.raise_for_status()
    export = response.json()
    
    # Download promptly — link lifetime is not specified.
    csv_bytes = requests.get(export["downloadUrl"], timeout=300).content
    
    # Reconcile row counts against export["recordCount"] after loading.
    ```
    
    Run backfills in controlled date ranges rather than one large window, saving each batch to storage and reconciling counts as you go.
    

---

# Security

<aside>
🔒

**1mind will never ask you to send your API key over Slack, email, a support ticket, or a shared document.** If you need a key reissued, ask your 1mind contact to provision a new one through the secure channel.

</aside>

Your Account API Key is a secret. It is account-scoped and grants access to your account's report data.

- **Recommended handling** — 9 practices
    - Store it in an approved secrets manager and inject it at runtime, rather than baking it into images, notebooks, or config files
    - Restrict access to the extraction service identity only
    - Keep it out of source control and CI logs
    - Avoid printing request headers in logs
    - Rotate it according to your security policy
    - Use encrypted storage and transport throughout
    - Apply least-privilege permissions on both cloud storage and the warehouse
    - Review conversation data for personal or regulated information before it reaches broad-access reporting layers
    - Apply your retention and deletion policies to the landing zone as well as the warehouse

---

# Troubleshooting

Symptoms below are API-level and apply to every platform. For platform-specific errors — load failures, permission errors, merge behavior — see your implementation guide.

- **Authentication errors**
    
    Confirm that:
    
    - The request includes the `x-api-key` header — not `Authorization`, not a bearer token
    - You are using the **Account** API Key
    - The key is not wrapped in extra quotation marks by your shell or config loader
    - The request targets the documented base URL
    - A proxy or secret-substitution step is not modifying or stripping the header
- **Fewer records returned than expected**
    
    Check:
    
    - `start-date` and `end-date` values and formats
    - The `flow` filter — is it narrowing more than intended?
    - `limit` and `offset` — did the pagination loop terminate early?
    - Whether your loop compares retrieved count against `total`
    - Time-zone assumptions on date-only values
    - Whether records were removed downstream by a transformation or quarantine rule
- **Pagination appears to skip or repeat records**
    - Sorting `desc` while new records arrive can shift rows across page boundaries. Try `sort-by=created_at&sort-order=asc`.
    - Confirm `offset` is incremented by the number of records actually returned, not by the requested `limit`.
    - Confirm the loop exits on an empty `data` array as well as on the `total` comparison.
- **Duplicate records in the warehouse**
    
    Confirm that:
    
    - Overlapping extract windows are backed by downstream deduplication
    - Landed files are uniquely named
    - The warehouse is not reloading the same files through a different path or prefix
    - You have identified a stable business key from real payloads
    - Your upsert logic is operating on the right key
    - The pipeline commits checkpoints only after a successful target load
- **Export download fails, or the link no longer works**
    - Download immediately after the export response and copy the file into your own storage.
    - Do not store `downloadUrl` in a queue for later processing.
    - Re-issue the export call rather than retrying a stale URL.
- **The payload structure changed**
    - Preserve the raw source payload so nothing is lost
    - Detect new or changed fields before they reach typed tables
    - Quarantine incompatible records rather than dropping them silently
    - Update typed tables deliberately, then test downstream dashboards and models

---

# Getting help

Your 1mind contact can help with:

- Provisioning and reissuing your Account API Key
- Questions about documented API behavior, endpoints, and parameters
- Troubleshooting API access and authentication issues
- Escalating suspected API defects

Warehouse design decisions — schema, business keys, transformations, orchestration, and monitoring — sit with your data engineering team or ETL partner, since they depend on your environment and data model. If you'd like 1mind to take on part of the implementation, ask your account contact about a scoped engagement.

---

# Platform implementation guides

Read this page first, then follow the guide for your platform. Each one covers only the platform-specific steps: landing location, staging objects, load mechanism, merge pattern, monitoring, and platform-specific troubleshooting.

- [**Snowflake**](1mind%20Data%20API%20Snowflake%20Implementation%20Guide%203bbb7e3f969281598ce3ff95bf94c95b.md) — staging, `COPY INTO`, deduplication, `MERGE`
- [**Databricks**](1mind%20Data%20API%20Databricks%20Implementation%20Guide%203bbb7e3f969281eca061e229c6033bcd.md) — Unity Catalog volumes, `COPY INTO` and Auto Loader, the medallion pattern, Delta `MERGE`
- [**BigQuery**](1mind%20Data%20API%20BigQuery%20Implementation%20Guide%203bbb7e3f96928196b0f6d4470764f8fc.md) — Cloud Storage landing, the native `JSON` type, load and external-table options, `MERGE`
- [**Amazon Redshift**](1mind%20Data%20API%20Amazon%20Redshift%20Implementation%20Guid%203bbb7e3f9692817e9132ef3a8f5d006e.md) — S3 staging, `COPY`, the `SUPER` type, `MERGE`