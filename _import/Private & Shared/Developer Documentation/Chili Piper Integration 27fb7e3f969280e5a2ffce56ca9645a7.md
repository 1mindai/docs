# Chili Piper Integration

*Last updated October 1, 2025*

## **1. Business Context**

Modern buyers expect instant engagement. A website visitor who is qualified and ready to talk to sales can lose interest if forced through forms, email back-and-forth, or slow SDR follow-up.

With 1mind's Superhumans + Chili Piper, companies can:

- **Accelerate pipeline creation** by converting inbound traffic into qualified meetings instantly
- **Route intelligently** based on CRM/MAP data (account, territory, industry, etc.)
- **Provide seamless handoff** from digital conversation to human rep

This integration ensures your best prospects don't wait — they talk, qualify, and book a meeting in a single flow.

## **2. Integration Overview**

### **1mind's Role**

- Hosts the Superhuman Family on your site, including:
    - Website BDR (qualification and routing)
    - CSM Onboarding Superhuman (customer activation)
    - Tech Support Superhuman (troubleshooting + escalation)
    - Ride-Along Sales Engineer Superhuman (deep technical assistance)
- Generates unique Smart Booking Links dynamically
- Passes CRM/MAP/account data into Chili Piper for routing

*Example: Superhuman Candace is used for Cisco inbound BDR conversations.*

### **Customer's Role**

- Configure routing and assignment inside Chili Piper (e.g., Distro/Handoff queues, owner rules, round-robin, territory)
- Provide 1mind with your router/queue URL and required parameters (e.g., meeting type)
- Ensure CRM (Salesforce, HubSpot, Dynamics) integration is active for booking + activity sync

### **Chili Piper's Role**

- Uses the identifiers provided (primarily email) to apply your queue/owner rules
- Presents availability, books the meeting, and updates CRM automatically

## **3. How the Flow Works (End-to-End)**

1. A visitor engages with a Superhuman on your website
2. The Superhuman conducts lightweight qualification (name, email, company, region, use case)
3. Based on the conversation, 1mind constructs your Chili Piper router/queue link with the right identifiers
4. Visitor clicks the link → Chili Piper routes to the correct rep/team and books directly
5. Chili Piper logs the meeting back into your CRM

## **4. Link Construction (What 1mind Builds)**

### **4.1 Base router/queue link (you provide)**

- [https://calendar.chilipiper.com/router/inbound-bdr](https://calendar.chilipiper.com/router/inbound-bdr)

*(This path is an example. Use your actual Chili Piper router/queue URL.)*

### **4.2 Minimum parameter (required)**

- `id=<prospect_email>` — the primary identifier Chili Piper uses to match or create the record and apply routing/owner rules

### **4.3 Common optional parameters**

- `meetingTypeId=<UUID>` — selects a specific meeting template/flow (e.g., Demo, Discovery)*
- `by=<name-or-id>` — credits the booker (e.g., for SDR→AE handoff reporting)

*If your workspace uses a legacy format, the meeting type may be indicated with type=<name> instead of `meetingTypeId`.*

### **4.4 Example (BDR demo)**

```html
https://calendar.chilipiper.com/router/inbound-bdr?id=john.smith@acme.com&meetingTypeId=<your_meeting_type_uuid>&by=superhuman
```

**Note:** In a prospecting flow we typically do not rely on Account IDs or Opportunity IDs gathered in-chat. Chili Piper can still route correctly from the email + your configured rules.

## **5. What the Superhuman Collects (in Conversation)**

- **First name & last name** (rep context)
- **Email** (required for routing/CRM match)
- **Company name** (rep context)
- **Country/Region** (helps if your queues use territory rules)
- **Use case or request type** (can inform the `meetingTypeId` you choose)

These details are gathered conversationally and can be echoed to the rep via the calendar description or CRM notes. If you wish to make additional fields part of routing, ensure those fields are included in your Chili Piper router/queue configuration.

## Updating Data Fields

The values collected in the superhuman must match the values that are in the Chili Piper “Data Fields” page.

These are the respective to what is collected on the form as required by your settings.

1. Navigate to “Data Fields” in your respective workspace.
2. Go to a specific data field that is being used (eg. First Name) and add in a value under the “Smart Parameter” section - `firstName`
    
    ![image.png](Chili%20Piper%20Integration/image.png)
    
3. Continue to add all of these data fields respective to what your form is required to collect. Please use camel case where applicable.
    1. `lastName`
    2. `email`
    3. `company`
    4. etc.

NOTE: Under “Meeting Type”, for the form that the superhuman will reference - you can enable “**Skip the Form when possible**” and it will allow the user to bypass the form and just select a time if the superhuman has been able to pass all the fields respectively to Chili Piper. Furthermore, if this is NOT enabled, it will show the form pre-filled to the user and then they can choose to edit any info prior to submitting and scheduling the call.

![image.png](Chili%20Piper%20Integration/image%201.png)

## **6. Routing Patterns (Configured in Chili Piper)**

- **Owner-based routing** (email matches Lead/Contact/Account owner)
- **Round-robin** across a team/queue
- **Territory-based queues** (e.g., by country/region/state)
- **Meeting-type queues** (e.g., Demo vs. Discovery vs. Onboarding)

1mind does not change your routing logic; we pass the right identifiers so your Chili Piper configuration applies cleanly.

## **7. Example Conversation Flow (Cisco Example)**

*⚠️ Simulated demonstration only — not real data.* *This example intentionally uses Superhuman Candace for Cisco's inbound BDR flow.*

**Superhuman Candace:** Hi 👋 I'm Candace from Cisco. Are you exploring networking today?

**Prospect:** Yes, routers for enterprise.

**Superhuman Candace:** Great! What's your company name?

**Prospect:** Acme Corp.

**Superhuman Candace:** Thanks! Which region are you based in?

**Prospect:** California HQ; some offices in Texas.

**Superhuman Candace:** Got it. About how many employees do you support?

**Prospect:** ~2,500 globally.

**Superhuman Candace:** That aligns with Cisco Catalyst + ISR. Are you seeking SD-WAN?

**Prospect:** Yes, evaluating options.

**Superhuman Candace:** Catalyst 8000 Edge fits well. Would you like to meet a Cisco specialist?

**Prospect:** Yes.

**Superhuman Candace:** May I have your first & last name?

**Prospect:** John Smith.

**Superhuman Candace:** Thanks—what's your best email?

**Prospect:** john.smith@acme.com

**Superhuman Candace:** Perfect. You're US-based, correct?

**Prospect:** Yes.

**Superhuman Candace:** Great—here's your scheduling link to meet our specialist.

*Superhuman Candace shares link:*

```html
https://calendar.chilipiper.com/router/inbound-bdr?id=john.smith@acme.com&meetingTypeId=<your_meeting_type_uuid>&by=superhuman
```

Prospect clicks → Chili Piper applies your configured queue/owner rules, shows availability, books, and logs to CRM.

## **8. Customer Checklist (What We Need From You)**

| **Item** | **Example** | **Notes** |
| --- | --- | --- |
| Router/Queue URL | `https://calendar.chilipiper.com/router/inbound-bdr` | Your actual Chili Piper link |
| Meeting Type | Demo → `meetingTypeId=<UUID>` | Or legacy `type=<name>` |
| Routing Mode | Owner / Round-robin / Territory | Configured in Chili Piper |
| Credit Booker (optional) | `by=superhuman` | SDR/BDR attribution |
| CRM | SFDC / HubSpot / Dynamics | Ensure Chili Piper CRM sync is active |

*We can provide a mapping spreadsheet template for these inputs.*

## 

## **9. Deliverables from 1mind**

- Workshop to align routing needs and data capture
- Link construction logic aligned to your Chili Piper router/queue configuration
- Conversation prompts for Superhumans to capture the required details smoothly
- Validation in your staging/test queue before going live

## **10. Security & Data Handling**

- 1mind collects only the minimal fields needed for scheduling
- Links are generated per interaction and include only approved parameters
- Meeting outcomes and CRM writes occur within your Chili Piper + CRM connection

## **11. FAQ**

**Do we need forms?** No additional forms are required. Your Superhuman gathers the same details conversationally and we pass the identifiers to Chili Piper.

**What's the minimum data needed to route?** The prospect email (`id=`) so Chili Piper can match in CRM and apply your rules.

**Can we enforce a specific meeting type?** Yes—include `meetingTypeId=<UUID>` (or `type=<name>` in legacy setups).

**What if we want territories or custom queues?** Configure that in Chili Piper; 1mind will pass identifiers so those rules apply.

## **12. Summary**

Superhuman conversation → Chili Piper scheduling → CRM logging, all in one seamless flow.

Your team controls routing logic in Chili Piper; 1mind ensures the right identifiers are captured in conversation and included in the link.

**Result:** Faster handoffs, higher conversion, and more qualified meetings—without adding friction for your buyers within the superhuman qualification