# LeanData BookIt Integration

*Last updated October 1, 2025*

## **1. Business Context**

Modern buyers expect instant engagement. A website visitor who is qualified and ready to talk to sales can lose interest if forced through forms, email back-and-forth, or slow SDR follow-up.

With **1mind’s Superhumans + LeanData’s BookIt**, companies can:

- Accelerate pipeline creation by converting inbound traffic into qualified meetings instantly.
- Route intelligently based on CRM/MAP data (account, territory, industry, etc.).
- Provide a seamless handoff from digital conversation → human rep.

This integration ensures your best prospects don’t wait — they talk, qualify, and book a meeting in a single flow.

---

## **2. Integration Overview**

### **1mind’s Role**

- Host the **Superhuman Family** on your site, including:
    - Website BDR (qualification and routing)
    - CSM Onboarding Superhuman (customer activation)
    - Tech Support Superhuman (troubleshooting + escalation)
    - Ride-Along Sales Engineer Superhuman (deep technical assistance)
- Generate unique **Smart Booking Links** dynamically.
- Pass CRM/MAP/account data into BookIt for routing.
- **Construct the BookIt/BOOKIT link once all required information is provided by the customer** (see §3 and §7).

Example: Superhuman **Candace** is used for Cisco inbound BDR conversations.

### **Customer’s Role**

- Configure routing logic inside LeanData **BookIt** (e.g., territories, account ownership, verticals).
- **Provide the following to 1mind (must-have):**
    1. **Org ID** (LeanData BookIt → Settings)
    2. **Trigger Node name (`nodeName`)** from the FlowBuilder **Trigger Node**
    3. **All mapped fields from the LeanData Canvas** that BookIt expects at that Trigger Node, including:
        - **Field descriptions/types** (e.g., string, picklist)
        - **Required/optional** designation per field
- Ensure Salesforce (or other CRM/MAP) is ready to store **BookIt Log IDs** (object + field).

### **LeanData’s Role**

- Execute the scheduling workflow.
- Update Salesforce lead/contact with booked meeting details.

**Key Note:** The technical routing is handled inside **BookIt (LeanData)**. **1mind constructs and delivers the booking link** once **Org ID, `nodeName`, and all required mapped fields** are provided by the customer.

---

## **3. Technical Setup**

### **Step 1: Unique BookIt Log ID**

- Each session requires a UUID (e.g., `sessionID` + random number).
- This ID is passed into Salesforce / MAP to tie the booking event to the correct lead/contact.
- **1mind** will generate the UUID and post to **SFDC** or **Marketing Automation Platform** contact/lead record.
    
    **Customer must provide:** the **OBJECT** and **FIELD NAME** where the UUID should be posted.
    

**Example UUID:** `session12345-random6789`

### **Step 2: Smart Booking Link Format**

```html
https://app.leandata.com/r?id=<OrgID>&nodeName=<TriggerNode>&chat=1mind&isUsingHerokuId=true&uid=<BookItLogID>
```

- 
    
    **OrgID:** Found in LeanData → BookIt → Settings.
    
- **nodeName (TriggerNode):** The **exact FlowBuilder Trigger Node name**.
- **BookItLogID:** Generated UUID per session.

**Important:** **1mind will construct the BookIt (BOOKIT) link after receiving** the customer’s **Org ID, exact nodeName, and the full list of mapped fields** from the LeanData Canvas (see Step 3). Links cannot be finalized without these inputs.

### **Step 3: Add Routing Parameters**

Append fields that drive BookIt routing decisions. Parameter **keys must match the Trigger Node  field names** defined in your LeanData Canvas mapping.

**Example:**

`&firstname=John&lastname=Smith&email=john.smith@acme.com`

`&state=CA&country=US&accountName=Acme%20Corp&industry=Technology`

**Field Sources:** CRM/MAP, web session, local storage, 6sense, Demandbase, ZoomInfo, etc.

**Customer must provide (from LeanData Canvas):**

- A list (spreadsheet is fine) of **all mapped fields** expected by BookIt at the Trigger Node, including for each field:
    - **Label/description**
    - **Type** (string, email, picklist, etc.)
    - **Required?** (Yes/No)
    - **Example value**

**Once these are provided**, **1mind Superhuman** will **construct the complete BOOKIT link** with the correct parameters and encoding.

### **Sample Mapping Table (for reference)**

| **API Key** | **Label/Description** | **Type** | **Required** | **Example Value** |
| --- | --- | --- | --- | --- |
| `firstname` | First Name | string | Yes | John |
| `lastname` | Last Name | string | Yes | Smith |
| `email` | Email | email | Yes | john.smith@acme.com |
| `state` | State/Region | string | Optional | CA |
| `country` | Country | string | Optional | US |
| `accountName` | Account Name | string | Optional | Acme Corp |
| `industry` | Industry | picklist | Optional | Technology |

---

## **4. Routing Examples**

**By Geography**

- `state=CA` → Route to West Coast AE.
- `country=DE` → Route to EMEA DACH team.

**By Account**

- `accountName=Acme Corp` → Route to Account Owner.

**By Segment / Industry**

- `industry=Healthcare` → Route to healthcare vertical AE.

---

## **5. SIMULATED Example Conversation**

⚠️ This is a simulated, NOT real conversation.

**Scenario:** Prospect interested in Cisco Routers & Switches, routed by U.S. West Coast territory.

**20-Turn Conversation**

- **Superhuman Candace:** Hi 👋 I’m Candace from Cisco. Are you exploring networking today?
- **Prospect:** Yes, routers for enterprise.
- **Superhuman Candace:** Great. Could you share your company name?
- **Prospect:** We’re Acme Corp.
- **Superhuman Candace:** Thanks! Which region are you based in?
- **Prospect:** California HQ, some offices in Texas.
- **Superhuman Candace:** Got it. And how many employees are you supporting?
- **Prospect:** About 2,500 globally.
- **Superhuman Candace:** Cisco Catalyst switches + ISR routers fit that scale. Do you currently use Cisco equipment?
- **Prospect:** Yes, but we need SD-WAN support.
- **Superhuman Candace:** Perfect — Cisco’s Catalyst 8000 Edge supports SD-WAN. Would you like to meet with a Cisco specialist?
- **Prospect:** Yes.
- **Superhuman Candace:** Great! Can I confirm your first/last name and email?
- **Prospect:** John Smith, john.smith@acme.com.
- **Superhuman Candace:** Thanks, John. Are you responsible for IT infrastructure decisions at Acme?
- **Prospect:** Yes, I lead IT infrastructure.
- **Superhuman Candace:** Excellent. I’ll route you to Cisco’s West Coast team.
- **Prospect:** Perfect.
- **Superhuman Candace:** I’ve created a scheduling link for you.

**Superhuman Candace (shows link):**

```html
https://app.leandata.com/r?id=<LEANDATAOrgID>&nodeName=SuperhumanStart&chat=1mind&isUsingHerokuId=true&uid=session12345-random6789&firstname=John&lastname=Smith&email=john.smith@acme.com&state=CA&country=US&accountName=Acme%20Corp&industry=Technology
```

Prospect clicks → BookIt routes to the West Coast Cisco AE and books a meeting.

---

## **6. Other Business Use Cases**

- **Sales (BDR/AE Superhuman):** Reduce inbound drop-off; prospects qualify + schedule instantly.
- **Marketing (PLG/MQL flow):** Push high-intent leads from website → BookIt without waiting.
- **Customer Success (CSM Superhuman):** Onboard customers, confirm product usage, and book time with CSM.
- **Tech Support Superhuman:** Troubleshoot and escalate critical support issues with instant scheduling.
- **Ride-Along Sales Engineer Superhuman:** Provide technical validation during sales conversations and route to SE calendars.

---

## **7. Next Steps**

### **From Customer (required)**

1. **Org ID** (LeanData BookIt → Settings)
2. **Trigger Node name (`nodeName`)** from the FlowBuilder **Trigger Node**
3. **Full mapping list from LeanData Canvas** for the Trigger Node (Field names, type, required/optional, example values)
4. **SFDC/MAP object & field** where **BookIt Log ID** should be written

### **From 1mind**

- **Construct Smart Booking (BOOKIT) Links** **after** receiving all required inputs above
- Append routing parameters using the **exact** API field names from the provided mapping
- Support validation during workshop with a mapping spreadsheet and sample links

---

With this integration, the Superhuman Family — from BDR to CSM to Support — ensures every qualified conversation becomes a scheduled meeting, maximizing pipeline efficiency.

**Reminder:** Link construction depends on customer-provided **Org ID**, **`nodeName`**, and **all mapped fields** from the LeanData Canvas.