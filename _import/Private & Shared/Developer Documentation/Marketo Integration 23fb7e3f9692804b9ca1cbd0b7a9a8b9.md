# Marketo Integration

*Last updated July 30, 2026*

### **Introduction:**

At 1mind, we recognize the dynamic nature of B2B sales and marketing. Organizations consistently seek innovative approaches to expedite lead qualification, personalize buyer journeys, and accelerate revenue generation. The **1mind Superhuman** is designed to fulfill these objectives by functioning as an always-on, intelligent online Business Development Representative and Sales Engineer, engaging prospects with sophisticated understanding and adhering to methodologies such as MEDDPICC, BANT, and SPICED.

This document details the integration of the 1mind Superhuman with your **Marketo instance**, which is designed to transform lead qualification and nurturing processes. By utilizing Marketo's rich data, the Superhuman can deliver a truly personalized experience, identify high-intent leads, and promptly direct them to your sales team (Account Executives, Directors, or SDR/MDR), bypassing traditional bottlenecks with summarized and detailed insights from the Superhuman.

### **Our Integration Approach:**

Our integration strategy is designed for maximum impact and minimal disruption:

- **Intelligent Pre-Processing (Read):** We rapidly access relevant Marketo Contact/Person data and activity history. This allows the 1mind Superhuman to understand context instantly, ensuring every conversation is informed and highly personalized from the first interaction. We've optimized this for speed, recognizing the critical few seconds available for a smooth user experience.
    - **Marketo APIs Used in Pre-Processing:** We retrieve core fields from the **Lead (Person)** record and summarized activity data. To avoid performance bottlenecks and excessive API calls:
    - **Person/Lead Information:**
        - GET /rest/v1/lead/{id}.json
        - GET /rest/v1/leads.json (for batch retrieval by email or other filters)
        - **Fields extracted:**
            - First name, last name, email
- Job title, company, industry
- Lead score, acquisition program
- Custom boolean or scoring fields (e.g., Aggregated_Content_Engagement_Score__c)
- **Activity Insights (with summarization):** Instead of querying thousands of raw activity records (e.g., Email Clicked, Web Page Visited), we recommend using **custom aggregated fields**, populated via:
- **Smart Campaigns**
- **Batch workflows**
- **Marketo Data Value Change triggers**
- These fields may include:
    - Recent_Web_Activity__c
    - Aggregated_Email_Engagement_Score__c
    - Last_Content_Topic__c
    - Recent_Program_Memberships__c
    - Intent_Activity_Score__c
- **Program Membership:**
    - GET /rest/v1/leads/{leadId}/programs.json
        - Used to detect:
            - Content engagement
            - Event attendance
            - Webinar registrations
- **Actionable Post-Processing (Write):** We precisely update Marketo records with critical qualification details and valuable engagement signals. This granular, 1mind-derived data empowers your teams to execute hyper-targeted segmentation, nurture campaigns, and robust reporting.
    - Marketo Updated with:
        - **1mind-derived insights**
        - **Qualification metadata**
        - **Conversation summaries**
        - **Full Transcript**
    - **API Used:**
        - **POST /rest/v1/leads.json**
        - **With action=createOrUpdate**
        - **Includes custom fields (see below)Optional:**
            - **Custom Objects (via API or UI)**
            - **Full conversation URLs**
            - Structured summaries
- **Accelerated Workflow Enhancement:** We seamlessly integrate with your existing Marketo programs and sales processes, amplifying their effectiveness. Our goal is to dramatically accelerate the flow of truly qualified leads directly to your sales team or adding contacts to smart campaigns in Marketo for people who require additional nurturing.

## **Part 1: Use Cases with 1mind Superhuman & Marketo**

Let's explore key B2B marketing scenarios where the 1mind Superhuman and  Marketo, delivers tangible results, prioritizing direct prospect engagement:

### **Use Case 1: On-Demand Product Exploration & Feature Deep Dive**

- **The Opportunity:** A prospect lands on your site, often via web search, actively exploring a specific product or solution. The 1mind Superhuman proactively engages or is launched by the prospect, providing expert, real-time guidance.
- **How We Do It:**
    - **Pre-Processing:** We identify the **marketoContactId**, their **Historical Product Interest**, and their **Existing Customer Status** from aggregated Marketo Contact fields (customer to provide). This contextual understanding allows the Superhuman to tailor its approach. (Crucial Note: The availability of the Marketo Contact ID or email via your web session, cookie, or local storage is a prerequisite for this personalized experience. Without it, the user is treated as anonymous).
    - Marketo APIs used:
        - GET /leads.json
        - Aggregated fields like Previous_Product_Interest__c, Is_Existing_Customer__c
        - Optionally: GET /activities.json for last 5 web visits
    - **1mind Superhuman in Action:** "I see you're interested in [Product Name]! Can I answer any questions about its features, pricing, or how it compares to other solutions?" Acting as a true Sales Engineer, the 1mind Superhuman provides detailed product information, answers technical queries, offers relevant use cases, and gathers specific requirements for a tailored demo. Crucially, it can directly present product slides, feature comparisons, or technical specification PDFs to address specific queries on-demand, creating a highly interactive and informative experience without the need for downloads.
- **Marketo Outcome (Post-Processing):** We enrich the prospect's Marketo Person record and potentially a dedicated Custom Object with granular, 1mind-derived insights from the conversation. Custom fields includes:
    - **1mind_Product_Interest_Detail__c:** Specific features discussed, modules explored.
    - **1mind_Technical_Questions_Asked__c:** Key technical inquiries raised by the prospect.
    - **1mind_Pricing_Discussion_Level__c:** Detailed notes on pricing discussions.
    - **1mind_Proposed_Use_Cases__c:** Use cases the prospect directly related to.
    - **1mind_Summary__c:** A concise summary of the entire conversation.
    - **1mind_Top_Topics__c:** A list of the most prominent topics discussed during the engagement.
    - **Full_Transcript__c:** The complete conversation transcript.

### 

### **Use Case 2: On-Demand Content Presentation & Instant Qualification**

- **The Opportunity:** Instead of relying on prospects to download content, the 1mind Superhuman can directly present valuable whitepapers, ebooks, or case studies in an interactive format, fostering immediate engagement and qualification.
- **How We Do It:**
    - **Pre-Processing:** We identify the **marketoContactId**, **firstName**, **lastName**, **job title**, **company**, **industry data**, **leadScore**, any **recent content downloads/views**, **website visits** related to content, and relevant **program memberships**. (Crucial Note: The availability of the Marketo Contact ID or email via your web session, cookie, or local storage is a prerequisite for this personalized experience. Without it, the user is treated as anonymous).
    - Extract via:
        - GET /leads.json (job title, company)
        - Custom fields like Recent_Content_Topic__c, Content_Engagement_Score__c
        - GET /leads/{leadId}/programs.json for relevant content programs
    - **1mind Superhuman in Action:** "Thanks for showing interest in [Content Topic], [Prospect Name]! I'd be happy to walk you through our latest guide on [Whitepaper Topic] right now." The 1mind Superhuman can present the whitepaper directly, navigating through its sections, highlighting key points, and answering questions in real-time. The Superhuman can also **explain and present relevant business cases**. This creates a more dynamic and personalized learning experience.
- **Marketo Outcome (Post-Processing):** We update the Marketo Person record and/or a Custom Object with precise insights derived from the interaction:
    - **1mind_Content_Consumed_Via_Agent__c:** The specific content (e.g., "AI Trends Whitepaper," "Product X Case Study") presented by the Superhuman.
    - **1mind_Content_Areas_of_Interest__c:** Specific sections or themes within the content that the prospect focused on or asked questions about.
    - **1mind_Content_Related_Pains__c:** Any pain points expressed in relation to the content's themes.
    - **1mind_Summary__c:** A concise summary of the entire conversation.
    - **1mind_Top_Topics__c:** A list of the most prominent topics discussed during the engagement.
    - **Full_Transcript__c:** The complete conversation transcript.

### **Use Case 3: Hyper-Personalized Engagements & Instant Qualification from Email Campaigns**

- **The Opportunity:** Imagine a prospect clicks on one of your Marketo email campaigns. Instead of a generic experience, they're greeted by a live, interactive 1mind Superhuman that already knows them.
- **How We Do It:**
    - **Pre-Processing:** Our system intelligently pulls **Marketo Contact ID or email from web storage/session** and queries the Marketo API for their **Lead Score**, **web activity**, **company**, **job role**, and **industry**. **Email and contact ID are inputs to the Marketo API**. (Crucial Note: The availability of the Marketo Contact ID or email via your web session, cookie, or local storage is a prerequisite for this personalized experience. Without it, the user is treated as anonymous).
    - GET /leads.json by email
        
        Pull:
        
        - Lead score
        - Recent campaign ID
        - Last clicked email topic (Last_Email_Click_Topic__c)
    - **1mind Superhuman in Action:** The 1mind Superhuman greets the prospect by name, references their recent interest (e.g., "Welcome back, [Prospect Name]! I noticed your recent interest in our [Email Subject]. How can I help you learn more about [Product/Topic]?"). It then leverages its deep understanding of your sales methodologies (MEDDPICC, BANT, SPICED) to dynamically tailor qualification questions. If a prospect showed interest in specific product information, the 1mind Superhuman proactively offers in-depth details, presenting relevant slides or PDFs directly within the conversation, just like a human expert would.
- **Marketo Outcome (Post-Processing):** We enrich the prospect's Marketo Person record and Custom Objects with derived insights such as:
    - **1mind_Campaign_Engagement_Depth__c:** A range of values, based on customer-defined engagement levels, reflecting how deeply the prospect engaged with the Superhuman post-campaign click, derived from automated analysis.
    - **1mind_Email_Content_Follow_Up_Topic__c:** A flag indicating if the user requested a follow-up or a summary email.
    - **1mind_Summary__c:** A concise summary of the entire conversation.
    - **1mind_Top_Topics__c:** A list of the most prominent topics discussed during the engagement.
    - **Full_Transcript__c:** The complete conversation transcript (typically a long text with a minimum size of 30K characters).

### **Use Case 4: Re-engaging Stalled Opportunities & Warming Up Cold Leads**

- **The Opportunity:** Opportunities sometimes go cold. Leads become inactive. The 1mind Superhuman provides a scalable, intelligent way to re-engage these valuable prospects.
- **How We Do It:**
    - **Pre-Processing:** We pull **marketoContactId**, any associated **Opportunity ID**, **Last Activity Date**, **Current Sales Stage**, and **Products of Interest**. (Crucial Note: The availability of the Marketo Contact ID or email via your web session, cookie, or local storage is a prerequisite for this personalized experience. Without it, the user is treated as anonymous).
    - From Marketo:
        - GET /leads.json for contact fields
        - GET /activities.json for Last_Activity_Date
        - Custom fields: Current_Sales_Stage__c, Prior_Objections__c
- **1mind Superhuman in Action:** "Hi [Prospect Name], I noticed your recent activity or we haven't connected in a while regarding [Product/Opportunity]. Is there anything new on your end or any questions I can answer to help move things forward?" The 1mind Superhuman acts as a persistent, knowledgeable BDR, adept at uncovering new requirements, addressing concerns, and identifying a new champion. It can even present updated product sheets or solution briefs relevant to the stalled opportunity.
- **Marketo Outcome (Post-Processing):** We update the Marketo Person record and/or a Custom Object with specific, derived re-engagement intelligence:
    - **1mind_Re_Engagement_Reason__c:** The reason for re-engagement (e.g., "New Need Identified," "Stalled Issue Addressed," "New Contact Engaged," "Seeking Further Information").
    - **1mind_Previous_Objections_Addressed__c:** Details on how previously known objections were addressed.
    - **1mind_New_Competitive_Insights__c:** Any new competitor information revealed.
    - **1mind_Summary__c:** A concise summary of the entire conversation.
    - **1mind_Top_Topics__c:** A list of the most prominent topics discussed during the engagement.
    - **Full_Transcript__c:** The complete conversation transcript (typically a long text with a minimum size of 30K characters)

### 

### **Use Case 5: Intelligent Event Follow-up & Post-Webinar Qualification**

- **The Opportunity:** Maximize the impact of your webinars and events by immediately engaging attendees with a personalized, insightful follow-up.
- **How We Do It:**
    - **Pre-Processing:** We leverage **marketoContactId**, **Webinar/Event Attended status**, and any **questions asked during the webinar** (if integrated). (Crucial Note: The availability of the Marketo Contact ID or email via your web session, cookie, or local storage is a prerequisite for this personalized experience. Without it, the user is treated as anonymous).
    - From Marketo:
        - GET /leads.json
        - GET /leads/{leadId}/programs.json or custom field like Last_Webinar_Attended__c
    - **1mind Superhuman in Action:** "Thanks for attending our recent webinar on [Webinar Topic], [Prospect Name]! I hope you found it insightful. Do you have any further questions about [Specific Webinar Point] or how our solutions can help you with [Problem Addressed in Webinar]?" The 1mind Superhuman clarifies doubts and initiates qualification based on their engagement during the event, and can re-present key slides or sections of the webinar content for deeper understanding.
- **Marketo Outcome (Post-Processing):** We update the Marketo Person record and/or Custom Objects with rich, derived insights:
    - **1mind_Webinar_Key_Takeaways__c:** Specific points from the webinar the prospect resonated with.
    - **1mind_Follow_Up_Content_Interest__c:** Other content topics suggested or requested by the prospect after the webinar.
    - **1mind_Summary__c:** A concise summary of the entire conversation.
    - **1mind_Top_Topics__c:** A list of the most prominent topics discussed during the engagement.
    - **Full_Transcript__c:** The complete conversation transcript (typically a long text with a minimum size of 30K characters)

## 

## **Part 2: Marketo Technical Integration Guide**

This section details the precise technical collaboration required to bring the 1mind Superhuman to life within your Marketo environment.

### **I. Marketo Access & Authentication: Our Secure Approach**

To ensure robust and secure data exchange, 1mind Superhuman requires API access to your Marketo instance.

- **Recommended Authentication:** We strongly advocate for a **Marketo Custom Service with OAuth 2.0 (Client Credentials Grant)**.
    - From Admin > LaunchPoint
    - Token endpoint: /identity/oauth/token
    - Include client_id and client_secret
- **Required Permissions (Minimum Scope):** We adhere to a principle of least privilege, requesting only the necessary permissions:
    - **For Pre-Processing (Read):** Access to Read Activities (for recent engagement), Read Leads (for contact details and scores), and Read Programs (for membership context).
    - **For Post-Processing (Write):** Permissions to Create/Update Leads (for custom field updates) and Create/Update Custom Objects (for detailed derived insights).

### **II. Integration Methods & Data Flow: Precision & Speed**

### **A. Pre-Processing: Fueling the Superhuman's Intelligence**

- **User Identification (Critical Requirement):**
    - **Core Prerequisite:** It is a fundamental requirement that your existing web infrastructure (e.g., JavaScript on your website) identifies known Marketo contacts by extracting their **marketoContactId** or **email address** from a cookie, local storage, or other secure web session variable. This critical data point must be passed to the 1mind Superhuman launcher code as it serves as inputs to the Marketo Lead API.
    - **User Identification Consideration:** If this core data point isn't available, the 1mind Superhuman will assume the user is anonymous and will engage in a generic, non-personalized qualification conversation.
    - **Intelligent Fallback (if marketoContactId not present but email is):** If the user is de-anonymized by a third-party vendor (e.g., ZoomInfo, 6sense) and their email is available in the web session, we can attempt a quick Marketo Get Lead by Email API call.
- **Marketo API Call to load superhuman:**
    - Once marketoContactId (or email for fallback) is obtained, your launcher, or a dedicated backend service initiated by the launcher, will execute a fast, lightweight API call to Marketo.
    - **Efficiency is Key:** We focus on retrieving only the most critical and recent data (e.g., last 1-2 email clicks, recent web page visits, essential person fields like company, title, leadScore). This ensures a minimal payload and rapid response time, crucial for a seamless user experience with the live 1mind Superhuman.
- **Real-time Data Ingestion:** The retrieved Marketo data is immediately injected into the 1mind Superhuman's session, enabling it to greet, understand, and engage the prospect with a personalized experience.

### **B. Post-Processing: Enriching Marketo with Superhuman Insights**

The 1mind Superhuman isn't just about conversation; it's about delivering actionable data back to your systems, primarily through direct field updates and dedicated Custom Objects.

- **Marketo Person Custom Fields:**
    - **Deepening Prospect Profiles:** We will update relevant custom fields directly on the Marketo Person record, enriching your prospect data.
    - **Key Fields for Qualification & Insights (Example Fields):**
        - **1mind_Qualification_Status__c:** Qualification status.
        - **1mind_Budget_Identified__c:** Budget identified (Text/Currency).
        - **1mind_Authority_Identified__c:** Authority identified (Text).
        - **1mind_Need_Pain_Points__c:** A concise summary of all pain points (Long Text).
        - **1mind_Timeline_Identified__c:** Timeline identified (Text).
        - **1mind_Impact_Discussed__c:** Impact discussed (Long Text).
        - **1mind_Decision_Criteria__c:** Decision criteria (Long Text).
        - **1mind_Champion_Identified__c:** Champion identified (Text).
        - **1mind_Competition_Discussed__c:** Competition discussed (Text).
        - **1mind_Product_Interest__c:** Product interest (Text).
        - **1mind_Next_Steps_Proposed__c:** Next steps proposed (Text).
        - **1mind_Engagement_Duration_Seconds__c:** Engagement duration in seconds (Number).
        - **1mind_Conversation_Topics__c:** Conversation topics (e.g., "Pricing," "Features," "Integration," "Support").
        - **1mind_Explicit_Opt_in_Preferences__c:** Explicit opt-in preferences (Checkbox/Text).
- **Marketo Custom Objects (for Detailed Derived Insights):**
    - **Granular Intelligence:** For a richer, more detailed record of Superhuman interactions and derived insights, we can create or update records in a dedicated Marketo Custom Object (e.g., "**1mind_Superhuman_Interaction__c**"). This allows for a structured storage of complex information without cluttering the Person record.
    - **Derived Fields from Post-Processing (5-10 New Fields):** 1mind's sophisticated analysis of conversations can generate invaluable fields for marketing and sales:
        - **Derived_Urgency_Indicator__c:** Assessed urgency based on language cues around timelines and immediate needs (e.g., High, Medium, Low, None).
        - **Derived_Key_Themes_Discussed__c:** Top 3-5 high-level themes (e.g., "Scalability Needs," "Integration Challenges," "Cost Concerns").
        - **Derived_Specific_Objections_Raised__c:** A summary of any explicit objections or hesitations detected and their context (Long Text).
        - **Derived_Competitive_Mentions__c:** Specific competitors named by the prospect during the conversation.
        - **Derived_Ideal_Customer_Profile_Fit__c:** 1mind's assessment of how well the prospect aligns with your ideal customer profile based on conversation context (Score/Rating).
        - **Derived_Opportunity_Expansion_Signals__c:** Any indications of potential for upsell, cross-sell, or additional projects (Long Text).
        - **Derived_Follow_Up_Call_Guidance__c:** AI-generated suggestions for topics, questions, or areas to focus on for the next human sales interaction (Long Text).
        - **Derived_Resources_Presented_Detail__c:** Specific slides, PDFs, or external links presented by the Superhuman, noting which sections were highlighted (Long Text).
        - **Derived_Action_Proposed_By_Agent__c:** The specific next step the 1mind Superhuman proposed and confirmed with the prospect (e.g., "Schedule Demo," "Connect with AE," "Provide Custom Quote").
        - **1mind_Summary__c:** A concise summary of the entire conversation.
        - **1mind_Top_Topics__c:** A list of the most prominent topics discussed during the engagement.
        - **Full_Transcript__c:** The entire conversation which is typically a Long Text and minimum 30K.
- **Lead Scoring Insights:** Based on the depth and quality of the Superhuman's engagement and derived insights, we provide comprehensive data that customers can use to adjust their own Lead Scores, ensuring scores accurately reflect true prospect intent and qualification. The customer takes ownership of using these insights to make changes to their lead scoring model.
- **Triggering Marketo Flow Steps/Alerts:** By updating custom fields and Custom Objects, 1mind Superhuman actions can implicitly trigger existing Marketo Flow Steps, such as:
    - Sending an internal alert email to the assigned Sales Rep.
    - Adding the lead to a specific nurturing stream.
    - Creating a task in CRM for a Sales Development Representative (SDR) to follow up on a specific query via Marketo workflow to CRM

### **III. Data Objects and Fields**

- **A. Key Marketo Objects:**
    - **Person (Core):** This is our primary focus for all lead and contact data, serving as the central hub for interaction and qualification insights.
    - **Activity:** Crucial for historical engagement.
    - **Program:** Essential for tracking campaign attribution, lead source, and progress through qualification stages.
    - **Custom Object (Optional for 1mind Insights):** This will be a key destination for the rich,derived data that provides deeper context beyond standard Person fields.
- **B. Essential Fields for Pre-processing (Read from Marketo):** We prioritize the most impactful fields for immediate context: **id, firstName, lastName, email, company, title, industry, leadScore, lastActivityDate, CRM sync IDs**, and recent Marketo Activities (**Web Page Visits, Email Clicks, Form Fillouts, Content Downloads**) to understand recent intent.
- **C. Essential Fields for Post-processing (Write to Marketo):** We strategically populate custom fields on the Marketo Person record and within new Custom Objects to provide comprehensive sales and marketing intelligence:
    - **Marketo Person Custom Fields:** (See Section II.B.1 for detailed list, e.g., **1mind_Qualification_Status__c, 1mind_Product_Interest__c, 1mind_Key_Takeaways__c**).
    - **Marketo Custom Object (e.g., 1mind_Superhuman_Interaction__c):** Captures **Conversation_ID, Qualification_Status, Summary, Full_Transcript_URL, Lead_Score_Impact, Web_Session_ID, Referral_Source**, and all the new derived fields detailed in Section II.B.2.

### 

### **IV. Streamlined Workflow and Accelerated Routing**

- **Bypassing Bottlenecks:** The 1mind Superhuman is designed to qualify leads so thoroughly that they can often bypass traditional SDR/MDR routing and be routed directly to Account Executives.
- **Seamless Marketo Flow Integration:** When **1mind_Qualification_Status__c** is set to **"1QL"** in Marketo (or a specific derived field indicates high intent), your existing Marketo Flow Steps will be triggered. This can include:
    - Automatic sales owner assignment within Marketo (syncing to your CRM).
    - Creation of a new task for the assigned AE/BDR, clearly summarizing the qualification and next steps based on the derived insights.
    - Sending an immediate alert email to the AE/BDR with a link to the enriched Marketo Person record and associated Custom Object data.
- **CRM Sync Criticality:** We rely on your existing Marketo-CRM sync (e.g., Salesforce Sync) to push all **1mind_ custom fields** from the Marketo Person record, and ideally, relevant Custom Object data, to your CRM, ensuring your sales team has complete visibility and actionable intelligence.

### **V. Data Ingestion & Reporting**

We ensure that the rich insights from every Superhuman interaction are captured and reportable.

- **Data Capture:** Concise AI-generated summaries and derived fields will enrich Marketo Person fields and Custom Objects. For deep analysis, raw conversation data (JSON/CSV) can be deposited in a file repository for pickup or posted to an endpoint with a JSON payload in your preferred data warehouse (e.g., S3 for Snowflake/Databricks ingestion). The full conversation transcripts will be stored externally.
- **Actionable Reporting & Analytics:**
    - **Within Marketo:** Leverage standard and custom reports on Person fields and Custom Object data to track 1mind Superhuman's direct impact. Track **1mind_Qualification_Status__c** conversions and analyze Lead Score changes attributed to 1mind. The new derived fields will enable incredibly granular segmentation and analysis.
    - **CRM (via Sync):** Track the true business impact: conversion rates from "1mind Qualified" to Opportunity and beyond, utilizing the enriched data for existing sales reporting.
    - **Data Warehouse:** For unparalleled custom analysis, the raw 1mind data and structured Custom Object data will allow for bespoke dashboards, advanced attribution models, and deep insights into: number of engagements, conversion rates, average engagement time, most popular topics, granular objections, competitive mentions, and quantifiable time savings for your BDR/SDR teams.

### **VII. Technical Environment & Collaborative Development**

Our integration approach is built on collaboration and proven best practices.

- **Dedicated Environments:** We request access to your Marketo Sandbox/Production environment for thorough testing, ensuring a smooth and risk-free deployment to production.
- **Clear Testing Protocols:** We will define precise testing scenarios covering all use cases, from known to anonymous contacts and qualified to unqualified conversations.
- **Phased Deployment:** We'll work closely with your team to align with your standard Marketo and 1mind superhuman integration module deployment processes.
- **Key Stakeholder Collaboration:** We'll partner with your Marketo, Web, CRM, and Data Engineering teams, respecting your internal lead times for resource allocation.