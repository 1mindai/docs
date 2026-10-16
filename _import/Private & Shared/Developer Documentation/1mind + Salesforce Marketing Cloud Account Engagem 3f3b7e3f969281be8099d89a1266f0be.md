# 1mind + Salesforce Marketing Cloud Account Engagement (Pardot) Integration Guide

*Last updated October 8, 2026*

<aside>
ℹ️

**Audience:** Marketing Operations, Account Engagement (Pardot) administrators, Salesforce administrators, Revenue Operations

**Purpose:** How to connect 1mind to Account Engagement through the **1mind External Client App**, how 1mind uses Account Engagement before, during, and after a conversation, and which Prospect fields and conversation-history options 1mind can write.

</aside>

---

## 1. Introduction

### 1.1 Overview

1mind deploys **Superhumans** that hold real-time voice and chat conversations with website visitors, prospects, and customers. A Superhuman answers product questions, qualifies the buyer against the customer's own criteria, and books the right meeting. Every conversation produces structured output: a summary, a readable transcript, qualification and discovery signals, the meeting outcome, and attribution data.

The Account Engagement (Pardot) integration sends that output to the customer's marketing automation platform and to Salesforce. Depending on where the customer routes leads, 1mind writes approved data to:

- **Salesforce** (Lead, Contact, Task, or a 1mind conversation custom object), through the 1mind Salesforce connector; and/or
- **Account Engagement Prospects** (default and custom Prospect fields, list membership, and optionally External Activities), through the **Account Engagement API v5**.

Account Engagement then does what it already does: scoring and grading, automation rules, Engagement Studio, completion actions, assignment, and synchronization with Salesforce through the Salesforce connector.

**One app per customer.** Every Salesforce customer installs the **1mind External Client App (1mind ECA)**, and the same app authorizes 1mind for Salesforce and for Account Engagement. The customer does not build an OAuth app and never runs two apps for 1mind. Their work is limited to installing the app, approving access as a dedicated integration user, and giving 1mind the Account Engagement Business Unit ID.

### 1.2 What this guide covers

| Part | What it covers | Primary reader |
| --- | --- | --- |
| **2. Technical Setup** | Connection path, integration user, Business Unit ID, 1mind ECA install and approval, Prospect fields, lists, Salesforce history object, connection testing | Account Engagement admin, Salesforce admin, 1mind implementation engineer |
| **3. The 1mind Conversation Lifecycle** | Pre-conversation, in-conversation, and post-processing stages, and where Account Engagement participates in each | Marketing Ops, RevOps |
| **4. Use Cases** | Which use cases read from or write to Account Engagement or Salesforce, and at which stage | Marketing Ops, RevOps, business owners |
| **5. Data Model and Field Options** | Prospect fields, history-layer options (Account Engagement has no custom data objects), limits, and write rules | Account Engagement and Salesforce admins |
| **6–10. Automation, testing, operations** | Automation patterns, acceptance tests, monitoring, go-live checklist, intake | Marketing Ops, 1mind |

This guide does not cover Superhuman persona design, content training, or website deployment. Those are handled in the 1mind onboarding process.

1mind fits into the customer's existing lead-management process instead of creating a parallel one. **The first system 1mind writes to is the system where routing happens today.**

### 1.3 Guiding principle: keep your existing workflow and write order

| Your current lead flow | 1mind's first write | What happens next | 1mind must not |
| --- | --- | --- | --- |
| **Salesforce routes first.** Leads are created in Salesforce (web-to-lead, Lead Assignment Rules, LeanData, Distribution Engine, Flow), then sync to Account Engagement. | **Salesforce** (Lead/Contact, Task, 1mind conversation object) | Salesforce routing assigns the Lead; the Salesforce connector creates or updates the Prospect in Account Engagement; Account Engagement automation runs on the synced data. | Create the Prospect in Account Engagement first, which would bypass Salesforce routing. |
| **Account Engagement routes first.** Prospects are created, scored, graded, and assigned in Account Engagement (automation rules, Engagement Studio, completion actions, "Assign via Salesforce active assignment rule"), and the Salesforce connector then creates or updates the Lead/Contact. | **Account Engagement** (Prospect upsert; list membership or External Activity) | Account Engagement automation scores and assigns the Prospect; the Salesforce connector creates or updates the Lead or Contact with the correct owner, exactly as for a form handler or form fill. | Write the same Lead/Contact directly to Salesforce, which would bypass Account Engagement assignment and create duplicates or sync conflicts. |
| **Hybrid.** Account Engagement owns marketing qualification (MQL); Salesforce owns sales assignment after hand-off. | Account Engagement first | Account Engagement qualifies and triggers assignment; Salesforce routes after hand-off. | Write sales-owned Salesforce fields (owner, status, opportunity) unless the signed design delegates them. |

Because Account Engagement and Salesforce share data through the Salesforce connector, also confirm the **field sync behavior** for every field 1mind writes (*Use Salesforce's value*, *Use Account Engagement's value*, or *Use the most recently updated value*). A field that 1mind writes in Account Engagement but that is set to *Use Salesforce's value* is overwritten at the next sync.

### 1.4 Connection paths and readiness

The write order decides whether 1mind needs the Account Engagement API at all.

| Path | When to use | What the customer does | Status |
| --- | --- | --- | --- |
| **A. Salesforce only, through the 1mind ECA** | Salesforce routes first. Account Engagement receives 1mind data through its existing Salesforce connector sync. | Install the 1mind ECA; approve access as the integration user. | **Production-ready** |
| **B. Salesforce + Account Engagement, through the 1mind ECA**  | Account Engagement routes first, or the design needs list membership or External Activities. | Install the 1mind ECA; approve access as an integration user who is also an Account Engagement user; provide the Business Unit ID. | **Production-ready** |

**Choosing a path:**

1. If Salesforce routes first, use **Path A**. No Account Engagement API access is needed; the Salesforce connector carries 1mind fields to the Prospect.
2. If Account Engagement routes first, use **Path B**.

### 1.5 Setup at a glance

| # | Step | Owner | Paths | Output |
| --- | --- | --- | --- | --- |
| 1 | Confirm write order, sync behavior, and connection path | Marketing Ops + RevOps + Salesforce admin + 1mind | All | Signed decision |
| 2 | Create the integration user | Salesforce admin + Account Engagement admin | All | Integration user (Account Engagement user for B) |
| 3 | Record the Business Unit ID | Salesforce admin | B | Business Unit ID |
| 4 | Install and authorize the 1mind ECA | Salesforce admin + integration user | A, B | Authorized 1mind connections |
| 5 | 1mind configures the connections | 1mind | All | Salesforce and Account Engagement connections |
| 6 | Create Prospect custom fields | Account Engagement admin | All | Field API names, sync behavior |
| 7 | Create lists and (optional) External Activity type | Account Engagement admin | B | List IDs, extension and activity type names |
| 8 | Prepare the Salesforce history layer (if used) | Salesforce admin | All | Custom object or Task design |
| 9 | Smoke-test the connections | 1mind + admins | All | Verified read/write |
| 10 | Configure Account Engagement automation | Marketing Ops | All | Automation rules / Engagement Studio live |

---

## 2. Technical Setup

### Prerequisites

- Salesforce **System Administrator**, or a user who can install apps and manage permission sets.
- Account Engagement **Administrator** role.
- **Salesforce User Sync** enabled in Account Engagement (standard for current accounts).
- The signed write-order and connection-path decision (Step 1).
- An approved list of Prospect fields and history-layer fields (Part 5).

### Step 1 — Confirm write order, sync behavior, and connection path

Answer these questions with Marketing Ops, RevOps, and the Salesforce administrator:

1. Where are new leads created and routed today: Salesforce or Account Engagement? (Section 1.3.)
2. How does Account Engagement create Salesforce records: assignment-driven sync, or *Automatically create prospects in Salesforce as leads*?
3. For every field 1mind will write, what is the Salesforce connector sync behavior?
4. May 1mind **create** net-new Leads/Prospects, or only **update** existing ones?
5. Which stages use Account Engagement: pre-conversation context, in-conversation tool calls, post-processing writes? (Part 3.)
6. Where will conversation history live: a Salesforce custom object, Salesforce Tasks, External Activities, or Prospect fields only? (Section 5.4.)
7. Which connection path applies: A or B (Section 1.4.)

**Output:** a one-page decision recorded in the customer's 1mind solution blueprint.

### Step 2 — Create the integration user

1. In Salesforce **Setup → Users**, create a dedicated user, for example `1mind Integration`, with a monitored team mailbox. A *Salesforce Integration* user license is appropriate where available.
2. Assign a permission set that grants **API Enabled** and the object access the design needs (Lead, Contact, Task, Campaign Member, and the 1mind conversation object).
3. **Paths B:** make the user an Account Engagement user in the target business unit:
    - Assign the **Account Engagement** permission set license and a role mapping that syncs the user to Account Engagement with permission to create and edit Prospects and use the API (for example, *Marketing* or a custom role).
    - Confirm in **Account Engagement Settings → Users** that the user appears in the target business unit with the expected role.
4. All 1mind writes are attributed to this user.

<aside>
ℹ️

**Scope versus user access.** The `pardot_api` scope belongs to the OAuth app (the 1mind ECA), not to the user. The user needs Account Engagement access in the business unit. Both are required: without the Account Engagement user record, API calls are rejected even when Salesforce access works.

</aside>

### Step 3 — Record the Business Unit ID (Paths B)

1. In Salesforce **Setup**, search for **Account Engagement** → **Business Unit Setup** (or **Account Engagement Settings → Account Setup**).
2. Copy the 18-character ID that starts with `0Uv`. It is different from the numeric Pardot account ID. If you have separate staging and production business units, record both. Share this with 1mind. 
3. Every Account Engagement API call sends this ID in the `Pardot-Business-Unit-Id` header. 1mind stores it on the connection.

### Step 4 — Install and authorize the 1mind ECA (Paths A and B)

1. Install the **1mind External Client App** using the install link from your 1mind implementation engineer (production and sandbox orgs are installed separately).
2. In **Setup → External Client App Manager → 1mind**, set the policies:

| Policy | Value |
| --- | --- |
| **Permitted Users** | Admin-approved users are pre-authorized |
| **Access** | Assign the integration user's permission set or profile |
| **IP Relaxation** | Per your security policy (1mind provides egress IPs on request) |
| **Refresh Token Policy** | Valid until revoked, or per your policy |
1. 1mind sends an **Authorize** link from the 1mind console. The integration user opens it, signs in to Salesforce, and approves access. Approve once for each 1mind connection the design uses (Salesforce, and Account Engagement for Path B).
2. Salesforce returns the org's address with the approval, so the customer does not provide a My Domain URL or any app credentials.

**Re-authorization** is required if the integration user is deactivated, the refresh token is revoked, or 1mind adds a scope to the ECA (for example, when moving from Path A to Path B).

### Step 5 — 1mind configures the connections

1mind creates the connections below. They are listed so Ops can review and audit them.

| Connection | Path | Credential | Requests go to |
| --- | --- | --- | --- |
| **Salesforce** | A, B | 1mind ECA, authorization code | The org's Salesforce instance |
| **Account Engagement** | B | 1mind ECA, authorization code, with `pardot_api` scope | `https://pi.pardot.com` (`https://pi.demo.pardot.com` for developer and demo orgs), with the `Pardot-Business-Unit-Id` header |

Both connections use the same app on every path.

### Step 6 — Create Prospect custom fields

1. In the Account Engagement app, go to **Account Engagement Settings → Object and Field Configuration → Prospect Fields → Custom Fields → + Add Custom Field**.
2. For each approved 1mind field (section 5.3):
    - **Field Name:** for example `1mind Qualification Status`.
    - **API Field Name:** generated from the name. Record it exactly; API v5 references custom fields by this name (typically ending in `__c`).
    - **Type:** Text, Text Area, Dropdown, Number, Date, or Checkbox, as listed.
    - **Salesforce Field Name:** map to the matching Lead/Contact field. On Path A this mapping is how the value reaches the Prospect.
    - **Sync Behavior:** per the Step 1 decision. For fields 1mind writes in Salesforce (Path A), use *Use Salesforce's value* or *Use the most recently updated value*. For fields 1mind writes in Account Engagement (Paths B), use *Use Account Engagement's value* or *Use the most recently updated value*.
3. For dropdown fields, record the exact allowed values. 1mind writes the value, not the label.

### Step 7 — Create lists and (optional) External Activity type (Paths B)

**Lists** give automation a clean trigger.

1. **Account Engagement → Segmentation → Lists → + Add List.**
2. Create static lists such as `1mind – Qualified Conversation`, `1mind – Nurture`, `1mind – Partner/Support`.
3. Record each **List ID**.

**External Activities** (optional) record each conversation as an engagement event for automation rules, Engagement Studio, and scoring. Edition availability varies; confirm with your Salesforce account team.

1. **Setup → Marketing App Extensions → New**: name `1mind`, assign to the business unit.
2. Add an **Activity Type**, for example `AI Conversation`, enabled for automation rules, segmentation, and Engagement Studio.
3. Record the extension name and activity type name exactly.

### Step 8 — Prepare the Salesforce history layer (if used)

Account Engagement has no custom data objects. For a per-conversation record with summary, transcript, and discovery detail, use a Salesforce custom object related to the Lead and Contact (section 5.4). This works on every path because it uses the Salesforce connection.

1. **Setup → Object Manager → Create → Custom Object**: `1mind Conversation` (`AI_Conversation__c`).
2. Add fields from section 5.5. Mark **1mind Conversation ID** as **External ID** and **Unique**.
3. Add lookup fields to **Lead** and **Contact** (optionally **Account** and **Campaign**).
4. Grant the integration user create, read, and edit access, and add a related list to the Lead and Contact page layouts.
5. If Account Engagement automation needs this object, enable Account Engagement **Custom Object** sync for it where your edition supports it.

### Step 9 — Smoke-test the connections

Run these in a sandbox or demo business unit first, then in production.

| # | Test | Paths | Expected result |
| --- | --- | --- | --- |
| 1 | Authorize the 1mind ECA (Paths A, B) | All | Connections show **Authorized** in the 1mind console |
| 2 | Find a test Lead/Contact by email; update a 1mind field | All | Value visible in Salesforce; no other fields changed |
| 3 | Wait for the Salesforce connector sync | All | Mapped value appears on the Prospect with the expected sync behavior |
| 4 | `GET /api/v5/objects/custom-fields?fields=id,name,fieldId,type` | B | Returns the 1mind custom fields with the API names from Step 7 |
| 5 | Upsert a test Prospect with a 1mind field value | B | Value visible in Account Engagement; no other fields changed |
| 6 | Add the test Prospect to a 1mind list; post an External Activity (if used) | B | Membership and activity visible on the Prospect |
| 7 | Write the history record twice with the same conversation ID | All (if used) | One record, updated in place |
| 8 | Run a full test conversation | All | All writes per the signed mapping |

### Step 10 — Configure Account Engagement automation

Configure the customer-owned automation that reacts to 1mind data (Part 6). Do this after Step 10 so the automation is tested against real 1mind records.

---

## 3. The 1mind Conversation Lifecycle and Where Account Engagement Is Used

Every 1mind deployment runs up to three kinds of workflows around a conversation. Each workflow can read from or write to connected systems.

```mermaid
flowchart LR
    A["Visitor arrives<br>(web page, email link, meeting)"] --> B["PRE-CONVERSATION<br>Pre-processing / pre-call workflow<br>Read context"]
    B --> C["IN-CONVERSATION<br>Superhuman conversation<br>Tool calls on demand"]
    C --> D["POST-PROCESSING<br>Post-processing workflow<br>Write outcomes"]
    D --> E{"Write order"}
    E -->|"Salesforce routes first (Path A)"| G["Salesforce<br>Lead/Contact, conversation record<br>→ assignment → sync to Account Engagement"]
    E -->|"Account Engagement routes first (Path B)"| F["Account Engagement<br>Prospect, lists, activities<br>→ automation → Salesforce connector"]
```

### 3.1 Pre-conversation

**When it runs:** when the session starts, before the Superhuman speaks. For scheduled meetings, a pre-call workflow runs before the meeting.

**What it does:** gathers context so the Superhuman does not ask questions the business already knows. Inputs include URL parameters (UTM values, campaign, a known email passed from an Account Engagement email link), the visitor token, and Salesforce or Account Engagement data.

**Typical setup:** read context from **Salesforce** (Lead, Contact, Account, Opportunity, owner) through the Salesforce connection. Account Engagement syncs with Salesforce, and the CRM holds ownership and opportunity data. Read the Prospect directly (Paths B) only when it holds data Salesforce does not, such as score, grade, or engagement history.

### 3.2 In-conversation (tool calls)

**When it runs:** during the conversation, when the Superhuman decides it needs data or an action. Each tool call is a named workflow the Superhuman can invoke.

| Tool call | System | When to use |
| --- | --- | --- |
| Returning-visitor lookup | Salesforce (default) or Account Engagement Prospect | Visitor was anonymous at session start and gives an email mid-conversation |
| Meeting routing and booking link | Salesforce owner and the booking tool | Inbound qualification and meeting booking |
| Opt-out / preference check | Account Engagement Prospect (Paths B) | Before offering to email content |

### 3.3 Post-processing

**When it runs:** after the conversation ends and 1mind has generated the summary, transcript, and extracted fields.

**What it does:** writes the outcome in the order set by the write-order decision (section 1.3).

**Salesforce-first sequence (Path A):**

| # | Action | Detail |
| --- | --- | --- |
| 1 | Guard | Stop if there is no conversation ID. |
| 2 | Find Lead/Contact | Search Salesforce by email (Contact first, then Lead). |
| 3 | Upsert Lead/Contact | Update the existing record or create a Lead (if approved), with approved 1mind fields. **Salesforce** assignment rules route new Leads. |
| 4 | Write history record | Upsert `AI_Conversation__c` by conversation ID, related to the Lead/Contact; or create a Task. |
| 5 | Campaign Member (optional) | Add to the 1mind Salesforce campaign with an outcome status. |
| 6 | Verify and report | Record Salesforce IDs for monitoring. Prospect values arrive through the Salesforce connector sync. |

**Account Engagement-first sequence (Paths B ):**

| # | Action | Detail |
| --- | --- | --- |
| 1 | Guard | Stop if there is no conversation ID or no email (Prospects are keyed by email). |
| 2 | Prepare values | Normalize to Account Engagement formats (dropdown values, country, state); truncate to field limits. |
| 3 | Upsert Prospect | `POST /api/v5/objects/prospects/do/upsertLatestByEmail` with default and 1mind custom fields. Creates the Prospect only if creation is approved. |
| 4 | Add to list | Add to the 1mind list that matches the outcome (qualified, nurture, partner/support). |
| 5 | Post External Activity (optional) | One activity per conversation. |
| 6 | Write history record (optional) | Salesforce `AI_Conversation__c` upsert by conversation ID through the Salesforce connection, after the connector has created the Lead/Contact. |
| 7 | Verify and report | Record Prospect ID, list result, and history record ID for monitoring. |

Account Engagement automation then scores, grades, and assigns the Prospect; the Salesforce connector creates or updates the Lead/Contact.

---

## 4. Use Cases and Where Account Engagement Is Used

### 4.1 Use-case map

| Use case | Pre-conversation (read) | In-conversation (tool call) | Post-processing (write) | Automation afterwards |
| --- | --- | --- | --- | --- |
| **Website product expert** | Salesforce record by email if known | Optional returning-visitor lookup | Lead/Contact or Prospect with summary, topics, product interest; history record | Score product interest; Engagement Studio product track |
| **Inbound qualification and meeting booking** | Salesforce owner and routing context | Booking link (Salesforce owner / booking tool) | Qualification and meeting fields; list `1mind – Qualified` (Paths B); history record with discovery detail | Salesforce assignment (Path A) or automation rule assigns and syncs (Paths B) |
| **Email or campaign follow-up** | Prospect or Lead by the email in the Account Engagement email link; UTM/campaign | Optional opt-out check | Intent and next step; External Activity (Paths B) | Engagement Studio branch on field or activity; alert assigned user |
| **Event or webinar follow-up** | Lead/Contact and event context | — | Qualification fields; External Activity (Paths B); history record | Post-event program; high-intent alert |
| **Re-engagement of cold leads** | Prior 1mind fields, score, grade | Optional returning-visitor lookup | Re-engagement reason and objections | Re-score; notify assigned user |
| **Partner, support, or careers deflection** | — | — | Status `Partner`/`Support`; partner list (Paths B) | Route to partner/support process; no sales assignment |

### 4.2 Use-case detail

#### Inbound qualification and meeting booking

- **Business goal:** qualify the visitor and book a meeting with the right seller, with discovery already captured.
- **Pre-conversation:** read Salesforce ownership and routing context.
- **In-conversation:** booking-link tool call against the Salesforce owner or routing rules.
- **Post-processing (Path A):** upsert the Lead/Contact; write `AI_Conversation__c`; add Campaign Member.
- **Post-processing (Paths B):** upsert the Prospect with qualification status, meeting booked, product interest, and summary; add to `1mind – Qualified Conversation`; write the history record.
- **Automation:** Salesforce assignment routes the Lead (Path A), or an automation rule on list membership or `1mind Qualification Status` adjusts score, sets MQL, and assigns via the Salesforce active assignment rule (Paths B).
- **Measure:** conversation-to-meeting rate, MQL-to-SQL conversion, pipeline influenced.

#### Email or campaign follow-up

- **Business goal:** turn an email click into a conversation and capture intent.
- **Pre-conversation:** read the record by the email passed in the link; read UTM/campaign.
- **Post-processing:** intent, product interest, and next step; External Activity `AI Conversation` (Paths B).
- **Automation:** an Engagement Studio rule on the field or External Activity moves the Prospect to the right track or alerts Sales.
- **Measure:** click-to-conversation rate, nurture progression.

#### Partner, support, or careers deflection

- **Business goal:** keep non-sales conversations out of sales routing.
- **Post-processing:** `1mind Qualification Status = Partner` or `Support`; partner/support list (Paths B); no score change.
- **Automation:** route to the partner or support process; exclude from MQL automation.
- **Measure:** correct-route rate, reduction in seller noise.

---

## 5. Data Model and Field Options

### 5.1 Where each kind of data belongs

| Record | Holds | Lifecycle | Use for |
| --- | --- | --- | --- |
| **Prospect default fields** | Identity and firmographics | Updated per write rules | Matching, assignment, personalization |
| **Prospect 1mind custom fields** | **Latest** 1mind state | Overwritten each conversation | Automation rules, Engagement Studio, scoring, Salesforce sync |
| **List membership** (Paths B) | Outcome bucket | Added per conversation | Clean automation triggers |
| **External Activity** (optional; Paths B) | One engagement event per conversation | Write-once | Engagement history, Engagement Studio, scoring |
| **Salesforce `AI_Conversation__c`** (recommended history layer) | **One record per conversation** with full detail | Upserted by conversation ID | Reporting, sales view, follow-up content |
| **External transcript (1mind)** | Full transcript and recording | Governed by retention policy | Audit; link stored on the history record |

### 5.2 Prospect — default fields

| Account Engagement field | API v5 name | 1mind source | Default write rule |
| --- | --- | --- | --- |
| Email | `email` | Captured email, else email passed in the URL | **Match key.** Never overwritten. |
| First Name | `firstName` | Captured first name | Write if empty (or overwrite, if approved) |
| Last Name | `lastName` | Captured last name | Write if empty (or overwrite, if approved) |
| Company | `company` | Captured company | Write if empty |
| Job Title | `jobTitle` | Captured role | Write if empty |
| Phone | `phone` | Captured phone | Write if empty |
| Country | `country` | Captured country, normalized | Write if empty |
| State | `state` | Captured state, normalized | Write if empty |
| City | `city` | Captured city | Optional |
| Website | `website` | Company domain | Optional |
| Industry | `industry` | Captured industry | Optional |
| Employees | `employees` | Captured company size | Optional |
| Source | `source` | `1mind` (first touch only) | Write if empty |
| Score / Grade | `score` / `grade` | — | **Read only.** Owned by Account Engagement scoring and grading. |
| Assigned User | `assignedToUser` | — | **Read only.** Owned by assignment automation. |

On Path A, 1mind writes the matching Salesforce Lead/Contact fields and the connector carries them to the Prospect.

### 5.3 Prospect — 1mind custom fields (options)

Create only the fields your automation will use. Map each to a Salesforce Lead/Contact field when the value must reach Sales (always, on Path A).

| Suggested field name | Suggested API name | Type | 1mind source | Purpose |
| --- | --- | --- | --- | --- |
| 1mind Last Conversation ID | `oneMind_Last_Conversation_ID__c` | Text | Conversation ID | Correlation with 1mind and the history record |
| 1mind Last Conversation Date | `oneMind_Last_Conversation_Date__c` | Date | Conversation date | Recency |
| 1mind Qualification Status | `oneMind_Qualification_Status__c` | Dropdown | Outcome (`Qualified`, `Nurture`, `Disqualified`, `Partner`, `Support`, `No Outcome`) | Automation and assignment trigger |
| 1mind Primary Intent | `oneMind_Primary_Intent__c` | Text | Extracted intent | Segmentation |
| 1mind Urgency | `oneMind_Urgency__c` | Dropdown | Extracted urgency | Prioritization |
| 1mind Product Interest | `oneMind_Product_Interest__c` | Text | Extracted products | Engagement Studio track |
| 1mind Next Best Action | `oneMind_Next_Best_Action__c` | Text Area | Recommended follow-up | Sales follow-up |
| 1mind Meeting Booked | `oneMind_Meeting_Booked__c` | Checkbox | Booking outcome | Suppress nurture; alert |
| 1mind Meeting Date | `oneMind_Meeting_Date__c` | Date | Booked meeting start | Reporting |
| 1mind Last Summary | `oneMind_Last_Summary__c` | Text Area | Summary | Sales and personalization |
| 1mind Conversation URL | `oneMind_Conversation_URL__c` | Text | Link to the conversation in 1mind | Full transcript access |
| 1mind Source URL | `oneMind_Source_URL__c` | Text | Page where the conversation started | Attribution |
| 1mind Times Engaged | `oneMind_Times_Engaged__c` | Number | Conversation count | Engagement scoring |

Account Engagement generates the API name from the field name. Record the actual name in Step 7.

### 5.4 Conversation history options (Account Engagement has no custom data objects)

| Option | Holds | Pros | Considerations | Recommended when |
| --- | --- | --- | --- | --- |
| **A. Salesforce custom object `AI_Conversation__c`** | Full per-conversation detail (section 5.5) | Unlimited history; reportable in Salesforce; visible to Sales; upsert by External ID prevents duplicates; works on every path | Account Engagement automation sees it only with Custom Object sync | **Default** |
| **B. Salesforce Task** | Summary and outcome as an activity | No new object; appears in the activity timeline | Limited structured fields; long text truncated in some views | Lightweight history |
| **C. Account Engagement External Activity** | One event per conversation (type + value) | Native trigger in Engagement Studio, automation rules, scoring | Paths B only; value is a short string; edition-dependent | Engagement and nurture triggers |
| **D. Prospect fields only** | Latest state | Simplest | History is overwritten | Pilots |

Options can be combined. A common design is **A + C**: the Salesforce object holds the detail; the External Activity drives Account Engagement automation.

### 5.5 Salesforce `AI_Conversation__c` — field options

**Core (required)**

| Field | API name | Type | Source |
| --- | --- | --- | --- |
| 1mind Conversation ID | `Conversation_ID__c` | Text(100), **External ID, Unique** | Session ID (upsert key) |
| Lead | `Lead__c` | Lookup(Lead) | Matched Lead |
| Contact | `Contact__c` | Lookup(Contact) | Matched Contact |
| Email | `Email__c` | Email | Captured email |
| Conversation Date | `Conversation_Date__c` | Date/Time | Conversation start |
| Status | `Status__c` | Picklist | Outcome |
| Summary | `Summary__c` | Long Text Area(32,768) | Summary |
| Transcript | `Transcript__c` | Long Text Area(131,072) | Readable transcript (truncated to limit) |
| Conversation URL | `Conversation_URL__c` | URL | Link to the full conversation in 1mind |
| Source URL | `Source_URL__c` | URL | Starting page |
| Duration (seconds) | `Duration_Seconds__c` | Number | Duration |
| Environment | `Environment__c` | Text(50) | Test or production |

**Optional groups:** qualification and discovery (pain points, current solution, tech stack, integrations, products interested, use cases, budget, contract end, persona match); MEDDPICC; objections and risk; meeting and hand-off (meeting date, demo/POC/trial requested, booked host); sales follow-up content (recommended opening, key quotes, critical context, follow-up email body).

### 5.6 Field rules

| Rule | Detail |
| --- | --- |
| Text limit | 255 characters for Account Engagement Text fields. 1mind truncates. |
| Text Area | Confirm the limit in your account; keep summaries concise and store the full transcript on the history record or in 1mind. |
| Dropdowns | 1mind writes the exact value. Provide the allowed values. |
| Checkbox | `true` / `false`. |
| Request body | Account Engagement v5 rejects unknown fields. 1mind sends only approved field API names. |
| Empty values | Omitted. 1mind never blanks an existing value. |
| Idempotency | Prospect keyed by email; history record keyed by conversation ID; External Activity posted once per conversation ID. |
| Read-only | Score, grade, assigned user, and Salesforce-owned fields are not written. |

### 5.7 Mapping worksheet

| 1mind source | Destination (Lead/Contact / Prospect / list / activity / history object) | Field name | API name | Type | Max | Write rule | Sync behavior | Used by automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |

---

## 6. Account Engagement Automation After 1mind Writes

1mind writes data; Account Engagement and Salesforce own what happens next.

| Pattern | Configuration | Trigger |
| --- | --- | --- |
| **Qualified conversation → assignment** | Automation rule: match `1mind Qualification Status = Qualified` or list membership; actions: adjust score, add to Salesforce campaign, **Assign via Salesforce active assignment rule** (or assign to user/queue) | Prospect field or list |
| **Nurture** | Engagement Studio program with a rule on `1mind Product Interest` or the External Activity | Field or activity |
| **Suppress nurture after booking** | Suppression list or rule on `1mind Meeting Booked = true` | Field |
| **Scoring** | Scoring rule or automation rule adjusting score for an External Activity or qualified status | Activity or field |
| **Partner / support routing** | Automation rule on status `Partner` / `Support`; notify the right team; exclude from MQL | Field or list |
| **Sales alert** | Notify assigned user; Salesforce Task via completion action | Field or list |

Rules:

- Keep one path to Salesforce. In an Account Engagement-first design, the Salesforce connector creates and updates Leads; 1mind does not also write the Lead.
- Extend existing automation rules and Engagement Studio programs with 1mind conditions, alongside form-fill logic, rather than building a separate 1mind-only routing path.
- Confirm sync behavior for every 1mind field so the connector does not overwrite it.

---

## 7. Testing and Acceptance

| # | Scenario | Expected result |
| --- | --- | --- |
| 1 | Known record, qualified, meeting booked | Record updated; qualified list or assignment fires; Lead/Contact and Prospect in sync; history record created |
| 2 | Net-new email (creation approved) | Lead or Prospect created; assignment and sync per automation |
| 3 | Net-new email (creation not approved) | No Lead or Prospect created; history handled per design |
| 4 | No email captured | No person write; history record per design |
| 5 | Same conversation re-processed | No duplicate list action, activity, or history record |
| 6 | Long summary and URL | Truncated; write succeeds |
| 7 | Dropdown value outside the allowed list | Normalized or omitted; no API error |
| 8 | Partner conversation | Partner status or list; no sales assignment |
| 9 | Field sync behavior | 1mind value is not unexpectedly overwritten by the connector |
| 10 | Refresh token revoked or integration user deactivated | Write fails and alerts; succeeds after re-authorization |
| 11 | Wrong Business Unit ID (Paths B) | Error surfaced; no write to another business unit |

**Acceptance:** all scenarios pass, no duplicate Leads, Prospects, or history records, automation fires as designed, and Marketing Ops signs off.

---

1mind records each post-processing run with the conversation ID, Salesforce record IDs, the Prospect ID, list and activity results, and the HTTP status of any failure. Error response bodies 

---

## Appendix A — Account Engagement API v5 reference used by 1mind

All Account Engagement calls:

```
Authorization: Bearer {access_token}
Pardot-Business-Unit-Id: {businessUnitId}
```

**Read Prospect by email** (the 1mind engineer confirms the filter syntax in the sandbox)

```
GET https://pi.pardot.com/api/v5/objects/prospects?fields=id,email,firstName,lastName,company,score,grade,oneMind_Qualification_Status__c&email=jane@example.com
```

**Upsert Prospect by email**

```
POST https://pi.pardot.com/api/v5/objects/prospects/do/upsertLatestByEmail
Content-Type: application/json

{
  "matchEmail": "jane@example.com",
  "prospect": {
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "company": "Acme Corp",
    "jobTitle": "VP Operations",
    "oneMind_Qualification_Status__c": "Qualified",
    "oneMind_Meeting_Booked__c": true,
    "oneMind_Last_Summary__c": "Jane asked about…"
  },
  "fields": ["id", "email", "oneMind_Qualification_Status__c"]
}
```

**Add to list**

```
POST https://pi.pardot.com/api/v5/objects/list-memberships
Content-Type: application/json

{ "listId": 12345, "prospectId": 67890 }
```

**External Activity**

```
POST https://pi.pardot.com/api/v5/external-activities
Content-Type: application/json

{ "extension": "1mind", "type": "AI Conversation", "value": "Qualified", "email": "jane@example.com" }
```

Field API names above are illustrative. Use the names recorded in Step 7.