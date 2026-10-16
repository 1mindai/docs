# Attribution Guide: Pipeline and Revenue Influence (Salesforce)

*Last updated August 13, 2026*

Attribution syncs Accounts, Leads, Contacts, and Opportunities from your CRM with 1mind conversations. This allows you to monitor pipeline and revenue your Superhuman influenced at the Workspace and Account level directly within 1mind. 

---

# Requirements

- **Salesforce CRM (Hubspot is in-development)**
- **Salesforce Admin privileges.** The person who installs the package and authenticates with 1mind must be the Salesforce admin for your production instance.
    - They will need to also be invited as a workspace admin to the [1mind console](http://app.1mind.com).
- **Read access** to Accounts, Contacts, Leads, and Opportunities for the connected CRM instance.

> **This is a separate connection from your pre- and post-processing CRM integration.** Influence Attribution reads pipeline and account data for 1mind, which is a different data flow from the CRM connection your Superhuman uses for personalization and write-back. If you already connect Salesforce for [Pre & Post Processing](Pre%20&%20Post%20Processing%2023fb7e3f969280268957f6954168b54e.md), Influence Attribution still needs to be setup as a separate connection.
> 

> **Best Practice:** Use a dedicated Salesforce integration user rather than an individual employee account, so the connection survives role changes and departures. See [Salesforce Integration](Salesforce%20Integration%2023fb7e3f96928002b0a4e827b6ae3449.md) for the recommended integration-user configuration.
> 

---

# Turning it on

Your Salesforce admin, once invited as a `Workspace Admin` role within 1mind, must start the setup from the **Integrations** page in the [1mind console](http://app.1mind.com) (under Workspace modules). 

1. Install the managed package by clicking on the button
    
    ![CleanShot 2026-08-06 at 16.52.44@2x.png](Attribution%20Guide%20Pipeline%20and%20Revenue%20Influence%20(/CleanShot_2026-08-06_at_16.52.442x.png)
    
2. Once installed, come back to 1mind and click on **“Already installed? Skip to authorization”** to continue to the Oauth connection. 

After both steps are complete, allow **12 to 24 hours** for the initial record sync, depending on how many records exist in your org. 1mind matches records between your CRM and 1mind, then activates Influence Attribution in your account so you can confirm your report is populating correctly.

---

# How influence is defined

You can modify to fit your definition of include - your metrics will adjust accordingly. A conversation counts toward influence once it reaches the number of turns you have chosen:

| Threshold | Conversation depth |
| --- | --- |
| All sessions | 1 or more turns |
| 4+ turns *(default; "Meaningful")* | 4 or more turns |
| 10+ turns | 10 or more turns |

The threshold names above match the **Engagement** filter on the Pipeline & Revenue page. **One turn = one visitor input plus the Superhuman's reply to it.** A visitor input can be a typed or spoken message, or a click on a suggested question or action button. The Superhuman's opening greeting does not count, so a 4-turn conversation is the greeting plus 4 visitor inputs, each answered by the Superhuman. This is the same turn count behind the **Meaningful** stage on the Analytics dashboard.

1mind defaults to **Meaningful** — sustained back-and-forth rather than a one-off exchange. Opportunities that closed before a 1mind conversation took place are automatically excluded from the influence report.

---

# Frequently asked questions

### 1. Data privacy — who can see our data and how is it stored?

**How we access your data:**

- You connect your CRM to 1mind with read permissions on accounts, contacts, leads, and opportunities only for necessary fields
- We recommend using a dedicated Integration User so the connection isn't tied to any individual (e.g. if the person who set it up leaves, the integration stays intact)
- 1mind can only read what the connected CRM user has access to — nothing more
- By default, we sync records going back to your 1mind org creation date

**How your data is stored:**

- Data is scoped to your 1mind account and accessible only to your workspace admin role members
- CRM data is treated the same as any other record in 1mind (conversations, accounts, etc.) and subject to the same data handling policies per our Terms of Service

### 2. How does account matching work? What if our CRM data isn't clean?

- By default, we match by cross-referencing the account domain in 1mind against the account website field in your CRM.
- If your CRM hygiene is imperfect, some accounts may not match and relevant Opportunities will not be included in the influence report. The accuracy of the report is a direct reflection of the records that exist in the CRM
- (Roadmap) You will be able to customize the matching logic to align with how you match accounts today. If two or more CRM accounts match the same domain, you will be able to define a tiebreaker rule to determine which record takes priority — for example, the oldest record, the most recently updated, or whichever has a specific field populated.

### 3. How do you differentiate "1mind influenced this deal" from "1mind just happened to be present"?

- We use timeline: only opportunities that were opened or still active after a first meaningful 1mind conversation at that account are counted. We never claim credit for influencing deals that predated our first touch.

### 4. What if I have an enterprise account with 10 subsidiaries and 3 open opportunities — are you saying one anonymous chat influenced all three deals?

- Not necessarily - Where subsidiaries have distinct domains, we match at that level and keep attribution scoped to a single account record.
- Where subsidiaries share a domain, right now we'll default use the first Account that is returned. This may result in missed Opportunities influenced. After we support configuring account and opportunity tiebreaker matching rules, your reporting will become more accurate.

### 5. What are the objects and fields we're requesting to sync from your CRM?

- **Lead:** Id, Email, FirstName, LastName, Company, Status, LeadSource, CreatedDate, Phone, Title, Description
- **Contact:** Id, Email, FirstName, LastName, AccountId, CreatedDate
- **Account:** Id, Name, Website, CreatedDate, Industry, Type, Description
- **Opportunity:** Id, Name, AccountId, StageName, Amount, CloseDate, CreatedDate, IsClosed, IsWon

---

# Related documentation

- [Salesforce Integration](Salesforce%20Integration%2023fb7e3f96928002b0a4e827b6ae3449.md) — integration-user requirements, object permissions, and security scope
- [Pre & Post Processing](Pre%20&%20Post%20Processing%2023fb7e3f969280268957f6954168b54e.md) — the separate read/write CRM data flows that power Superhuman personalization
- [Technical Integration Guide: CRM, MAP and Web Visitor Identification](Technical%20Integration%20Guide%20CRM,%20MAP%20and%20Web%20Visit%2023fb7e3f969280269c23faf3d904a4e6.md) — the broader CRM and web identification requirements

---

# Support

For help with setup or with validating your influence report:

- **Email:** [support@1mind.com](mailto:support@1mind.com)
- **Your 1mind Customer Success Manager:** use your existing channel