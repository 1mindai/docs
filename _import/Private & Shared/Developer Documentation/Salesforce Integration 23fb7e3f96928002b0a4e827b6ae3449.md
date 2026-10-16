# Salesforce Integration

*Last updated July 30, 2026*

## **Introduction:**

At 1mind, we recognize the dynamic nature of B2B sales and marketing. Organizations consistently seek innovative approaches to expedite lead qualification, personalize buyer journeys, and accelerate revenue generation. The 1mind Superhuman is designed to fulfill these objectives by functioning as an always-on, intelligent online Business Development Representative and Sales Engineer, engaging prospects with sophisticated understanding and adhering to methodologies such as MEDDPICC, BANT, and SPICED.

This document details the integration of the 1mind Superhuman with your Salesforce instance, which is designed to transform lead qualification and nurturing processes. By utilizing Salesforce's rich data across Leads, Contacts, and Opportunities, the Superhuman can deliver a truly personalized experience, identify high-intent prospects, and promptly direct them to your sales team (Account Executives, Directors, or SDR/MDR) with automatically created Tasks containing summarized and detailed insights from the Superhuman.

## **Our Integration Approach:**

Our integration strategy is designed for maximum impact and minimal disruption:

### **Intelligent Pre-Processing (Read):**

We rapidly access relevant Salesforce Lead/Contact data and activity history. This allows the 1mind Superhuman to understand context instantly, ensuring every conversation is informed and highly personalized from the first interaction. We've optimized this for speed, recognizing the critical few seconds available for a smooth user experience.

**Salesforce APIs Used in Pre-Processing:** We retrieve core fields from Lead and Contact records along with summarized activity data. To avoid performance bottlenecks and excessive API calls:

**Lead/Contact Information:**

- REST API: /services/data/v58.0/sobjects/Lead/{Id}
- REST API: /services/data/v58.0/sobjects/Contact/{Id}
- SOQL Query: SELECT Id, FirstName, LastName, Email, Company, Title, Industry, LeadScore__c, LeadSource, Status, Rating FROM Lead WHERE Email = '{email}'

**Fields extracted:**

- First name, last name, email
- Job title, company, industry
- Lead score, lead source, rating/status
- Custom scoring fields (e.g., Aggregated_Content_Engagement_Score__c)

**Activity Insights (with summarization):** Instead of querying thousands of raw activity records (e.g., Email, Tasks, Events), we recommend using custom aggregated fields, populated via:

- Process Builder/Flow
- Apex triggers
- Scheduled batch jobs

These fields may include:

- Recent_Web_Activity__c
- Aggregated_Email_Engagement_Score__c
- Last_Content_Topic__c
- Recent_Campaign_Responses__c
- Intent_Activity_Score__c

**Campaign Membership:**

- REST API: /services/data/v58.0/sobjects/CampaignMember
- SOQL: SELECT CampaignId, Campaign.Name, Status, FirstRespondedDate FROM CampaignMember WHERE LeadId = '{leadId}' OR ContactId = '{contactId}’ AND CreatedDate = LAST_N_DAYS:30

Used to detect:

- Content engagement
- Event attendance
- Webinar registrations

### 

### **Actionable Post-Processing (Write):**

We precisely update Salesforce Lead/Contact records with critical qualification details and valuable engagement signals, while creating actionable Tasks for sales teams. This granular, LLM-derived data empowers your teams to execute hyper-targeted segmentation, follow-up campaigns, and robust reporting.

**Salesforce Updated with:**

- LLM-derived insights on Lead/Contact records
- Qualification metadata
- Conversation summaries
- Automatically created Tasks for sales team follow-up

**APIs Used:**

- PATCH /services/data/v58.0/sobjects/Lead/{Id} (for Lead updates)
- PATCH /services/data/v58.0/sobjects/Contact/{Id} (for Contact updates)
- POST /services/data/v58.0/sobjects/Task (for Task creation)

**Optional:**

- Custom Objects for detailed conversation storage
- Full conversation attachments
- Structured summaries

### **Accelerated Workflow Enhancement:**

We seamlessly integrate with your existing Salesforce processes, Assignment Rules, and sales workflows, amplifying their effectiveness. Our goal is to dramatically accelerate the flow of truly qualified leads directly to your sales team through intelligent Task creation and record enrichment.

## 

## **Part 1: Use Cases with 1mind Superhuman & Salesforce**

Let's explore key B2B sales scenarios where the 1mind Superhuman and Salesforce integration delivers tangible results, prioritizing direct prospect engagement:

### **Use Case 1: On-Demand Product Exploration & Feature Deep Dive**

**The Opportunity:** A prospect lands on your site, often via web search, actively exploring a specific product or solution. The 1mind Superhuman proactively engages or is launched by the prospect, providing expert, real-time guidance.

**How We Do It:**

**Pre-Processing:** We identify the Salesforce Lead or Contact ID, their Historical Product Interest, and their Existing Customer Status from custom fields. This contextual understanding allows the Superhuman to tailor its approach. (Crucial Note: The availability of the Salesforce Lead/Contact ID or email via your web session, cookie, or local storage is a prerequisite for this personalized experience. Without it, the user is treated as anonymous).

**Salesforce APIs used:**

- GET /services/data/v58.0/sobjects/Lead or Contact
- Custom fields like Previous_Product_Interest__c, Is_Existing_Customer__c
- Optionally: Query Tasks/Events for recent activity

**1mind Superhuman in Action:** "I see you're interested in [Product Name]! Can I answer any questions about its features, pricing, or how it compares to other solutions?" Acting as a true Sales Engineer, the 1mind Superhuman provides detailed product information, answers technical queries, offers relevant use cases, and gathers specific requirements for a tailored demo. Crucially, it can directly present product slides, feature comparisons, or technical specification PDFs to address specific queries on-demand.

**Salesforce Outcome (Post-Processing):** We enrich the Lead/Contact record with granular, LLM-derived insights and create a Task for immediate sales follow-up:

**Lead/Contact Custom Fields:**

- 1mind_Product_Interest_Detail__c: Specific features discussed, modules explored
- 1mind_Technical_Questions_Asked__c: Key technical inquiries raised
- 1mind_Pricing_Discussion_Level__c: Detailed notes on pricing discussions
- 1mind_Proposed_Use_Cases__c: Use cases the prospect directly related to
- 1mind_Summary__c: Concise LLM-generated conversation summary
- 1mind_Top_Topics__c: Most prominent topics discussed
- 1mind_Engagement_Score__c: Calculated engagement level (1-10)

**Task Created:**

- **Subject:** "1mind Superhuman Product Interest Follow-up - [Product Name]"
- **Description:** LLM-generated summary with key talking points, technical questions asked, and recommended next steps
- **Priority:** High (if high engagement score)
- **Due Date:** Within 24 hours
- **Assigned To:** Territory owner or round-robin assignment
- **Type:** "1mind Follow-up"

### 

### **Use Case 2: On-Demand Content Presentation & Instant Qualification**

**The Opportunity:** Instead of relying on prospects to download content, the 1mind Superhuman can directly present valuable whitepapers, ebooks, or case studies in an interactive format, fostering immediate engagement and qualification.

**How We Do It:**

**Pre-Processing:** We identify the Lead/Contact ID, name, job title, company, industry data, lead score, recent content engagement, and relevant campaign responses. (Crucial Note: Salesforce Lead/Contact ID or email availability via web session is required for personalization).

**Extract via:**

- GET /services/data/v58.0/sobjects/Lead or Contact
- Custom fields like Recent_Content_Topic__c, Content_Engagement_Score__c
- CampaignMember queries for content-related campaigns

**1mind Superhuman in Action:** "Thanks for showing interest in [Content Topic], [Prospect Name]! I'd be happy to walk you through our latest guide on [Whitepaper Topic] right now." The Superhuman presents content directly, navigates through sections, highlights key points, and answers questions in real-time, creating a dynamic and personalized learning experience.

**Salesforce Outcome (Post-Processing):**

**Lead/Contact Updates:**

- 1mind_Content_Consumed_Via_Agent__c: Specific content presented
- 1mind_Content_Areas_of_Interest__c: Sections/themes of focus
- 1mind_Content_Related_Pains__c: Pain points expressed
- 1mind_Summary__c: LLM-generated conversation summary
- 1mind_Qualification_Stage__c: Updated based on engagement

**Task Created:**

- **Subject:** "1mind Content Engagement Follow-up - [Content Topic]"
- **Description:** Detailed summary of content areas explored, pain points identified, and qualification insights
- **Priority:** Based on engagement depth
- **Type:** "Content Follow-up"
- **Related To:** Relevant Campaign (if applicable)

### 

### **Use Case 3: Hyper-Personalized Engagements from Email Campaigns**

**The Opportunity:** When a prospect clicks on your email campaigns, they're greeted by a live, interactive 1mind Superhuman that already knows their context and engagement history.

**How We Do It:**

**Pre-Processing:** Pull Lead/Contact data including Lead Score, recent campaign responses, company details, and email engagement history.

**Salesforce APIs:**

- Lead/Contact retrieval by email
- CampaignMember history
- Custom fields: Last_Email_Click_Topic__c, Campaign_Engagement_Score__c

**1mind Superhuman in Action:** The Superhuman greets prospects by name, references recent campaign engagement, and leverages MEDDPICC/BANT/SPICED methodologies for dynamic qualification. It proactively offers detailed product information and presents relevant materials directly within the conversation.

**Salesforce Outcome (Post-Processing):**

**Lead/Contact Updates:**

- 1mind_Campaign_Engagement_Depth__c: Engagement level assessment
- 1mind_Email_Follow_Up_Interest__c: Follow-up preferences
- 1mind_Campaign_Source__c: Originating campaign reference
- 1mind_Next_Best_Action__c: LLM-recommended next step

**Task Created:**

- **Subject:** "1mind Campaign Response Follow-up"
- **Description:** Campaign context, engagement insights, and recommended approach
- **Related To:** Originating Campaign
- **Follow-up Type:** Based on qualification outcome

### 

### **Use Case 4: Re-engaging Stalled Opportunities & Warming Up Cold Leads**

**The Opportunity:** Re-engage stalled opportunities and cold leads with intelligent, contextual outreach through the Superhuman.

**How We Do It:**

**Pre-Processing:** Pull Lead/Contact data including associated Opportunity information, last activity dates, current sales stages, and historical engagement patterns.

**From Salesforce:**

- Lead/Contact records with Opportunity relationships
- Task/Event history for last activity
- Custom fields: Current_Sales_Stage__c, Prior_Objections__c, Stall_Reason__c

**1mind Superhuman in Action:** "Hi [Prospect Name], I noticed we haven't connected recently regarding [Opportunity/Product]. Is there anything new on your end or questions I can answer to help move things forward?" The Superhuman acts as a persistent, knowledgeable BDR, uncovering new requirements and addressing concerns.

**Salesforce Outcome (Post-Processing):**

**Lead/Contact Updates:**

- 1mind_Re_Engagement_Reason__c: Reason for renewed interest
- 1mind_Previous_Objections_Addressed__c: How objections were handled
- 1mind_New_Requirements_Identified__c: Newly discovered needs
- 1mind_Competitive_Intelligence__c: Competitor information revealed

**Task Created:**

- **Subject:** "1mind Re-engagement Success - [Opportunity/Lead Name]"
- **Description:** Re-engagement context, new information gathered, and recommended next steps
- **Priority:** High (for successful re-engagements)
- **Type:** "Re-engagement Follow-up"

### 

### **Use Case 5: Intelligent Event Follow-up & Post-Webinar Qualification**

**The Opportunity:** Maximize webinar and event impact by immediately engaging attendees with personalized, insightful follow-up conversations.

**How We Do It:**

**Pre-Processing:** Leverage Lead/Contact data including event attendance status, campaign membership, and any captured webinar questions or engagement data.

**From Salesforce:**

- Lead/Contact records
- CampaignMember status for events/webinars
- Custom fields: Last_Event_Attended__c, Webinar_Engagement_Score__c

**1mind Superhuman in Action:** "Thanks for attending our recent webinar on [Topic], [Name]! I hope you found it insightful. Do you have questions about [Specific Point] or how our solutions can help with [Problem Addressed]?" The Superhuman clarifies doubts, initiates qualification, and can re-present key webinar content.

**Salesforce Outcome (Post-Processing):**

**Lead/Contact Updates:**

- 1mind_Event_Key_Takeaways__c: Resonant webinar points
- 1mind_Follow_Up_Content_Interest__c: Additional content requests
- 1mind_Event_Qualification_Score__c: Post-event qualification assessment

**Task Created:**

- **Subject:** "1mind Event Follow-up - [Event Name]"
- **Description:** Event context, key interests identified, and follow-up recommendations
- **Related To:** Event Campaign
- **Due Date:** Within 48 hours of event

## 

## **Part 2: Salesforce Technical Integration Guide**

This section details the precise technical collaboration required to bring the 1mind Superhuman to life within your Salesforce environment.

### I. Salesforce Access and Authentication

To support secure API-based data exchange, 1mind Superhuman requires authorized access to your Salesforce org.

Authentication Model

1mind uses **OAuth 2.0** to authenticate to Salesforce. The **Connected App is managed by 1mind**, so no customer-side Connected App configuration is required.

To establish the connection, 1mind will provide an OAuth authorization URL for the appropriate Salesforce environment:

- **Sandbox**
- **Production**

A Salesforce administrator should complete the authorization flow by signing in with the designated **integration user** for the target org.

### Integration User Requirements

1mind recommends using a **dedicated Salesforce integration user** rather than an individual employee account.

The integration user should be:

- Created specifically for the 1mind integration
- Managed as a service account or system account
- Governed by least-privilege access controls
- Excluded from dependency on a specific employee for continuity and audit purposes

This setup improves operational stability, provides clearer audit trails, and reduces risk associated with user turnover or role changes.

### Recommended Configuration

Configure the integration user as follows:

1. **Create a dedicated user account** in Salesforce for the integration, for example: `1mind Integration User`
2. **Assign only the required Profile and/or Permission Sets**
3. **Restrict object permissions, field-level security, and record access** to the minimum required scope
4. Use this account to complete the OAuth authorization flow provided by 1mind

### Minimum Required Object Permissions

The integration user should have access only to the objects required by the integration.

**Read access required for pre-processing:**

- Lead
- Contact
- Task
- Event
- Campaign
- CampaignMember

**Create/Update access required for post-processing:**

- Lead
- Contact
- Task

### Security Scope

Access should be limited according to the principle of least privilege.

At a minimum:

- **Object permissions** should be restricted to the objects listed above
- **Field-level security** should expose only the specific fields used by 1mind
- **Record-level access** should be limited as appropriate for the integration use case
- **Administrative permissions** are not required unless explicitly identified during implementation

No broader Salesforce administrative access or unrestricted data access is needed for standard deployment.

### **II. Integration Methods & Data Flow: Precision & Speed**

### **A. Pre-Processing: Fueling the Superhuman's Intelligence**

**User Identification (Critical Requirement):**

- **Core Prerequisite:** Your web infrastructure must identify known Salesforce Leads/Contacts by extracting their Salesforce ID or hashed email from cookies, local storage, or web session variables
- **User Identification Consideration:** Without this data, the Superhuman assumes anonymous engagement with generic qualification

**Intelligent Fallback:** If Salesforce ID isn't available but email is (via third-party identification), we attempt Lead/Contact lookup by email.

**Salesforce API Calls:**

- - Lead Lookup

SELECT Id, FirstName, LastName, Email, Company, Title, Industry,

LeadScore__c, LeadSource, Status, Rating,

Recent_Web_Activity__c, Intent_Activity_Score__c

FROM Lead

WHERE Email = '{email}' OR Id = '{salesforceId}'

- - Contact Lookup

SELECT Id, FirstName, LastName, Email, Account.Name, Title,

Department, LeadScore__c, Contact_Rating__c,

Recent_Web_Activity__c, Intent_Activity_Score__c

FROM Contact

WHERE Email = '{email}' OR Id = '{salesforceId}'

- - Recent Campaign Activity

SELECT CampaignId, Campaign.Name, Campaign.Type, Status,

FirstRespondedDate, CreatedDate

FROM CampaignMember

WHERE (LeadId = '{leadId}' OR ContactId = '{contactId}')

AND CreatedDate = LAST_N_DAYS:30

ORDER BY CreatedDate DESC

**Real-time Data Ingestion:** Retrieved Salesforce data is immediately injected into the Superhuman's session for personalized engagement.

### **B. Post-Processing: Enriching Salesforce with Superhuman Insights**

**Lead/Contact Custom Fields:** We update relevant custom fields directly on Lead/Contact records, enriching prospect profiles.

**Key Fields for Qualification & Insights:**

- 1mind_Qualification_Status__c: Current qualification status
- 1mind_Budget_Identified__c: Budget information captured
- 1mind_Authority_Identified__c: Decision-maker identification
- 1mind_Need_Pain_Points__c: Summarized pain points
- 1mind_Timeline_Identified__c: Implementation timeline
- 1mind_Decision_Criteria__c: Key decision factors
- 1mind_Champion_Identified__c: Internal champion details
- 1mind_Competition_Mentioned__c: Competitive landscape
- 1mind_Product_Interest__c: Specific product interests
- 1mind_Engagement_Duration__c: Conversation length (seconds)
- 1mind_Engagement_Quality_Score__c: LLM-assessed engagement quality (1-10)

**Task Creation for Sales Follow-up:** Every qualified Superhuman interaction generates an actionable Task:

**Standard Task Fields:**

- **Subject:** Dynamic based on interaction type and key topics
- **Description:** LLM-generated summary with key insights and next steps
- **WhoId:** Lead or Contact ID
- **WhatId:** Related Opportunity ID (if applicable)
- **OwnerId:** Assigned based on territory rules or round-robin
- **Priority:** Calculated based on engagement score and qualification level
- **Status:** "Not Started"
- **Type:** "1mind Follow-up"
- **CallType:** Based on interaction outcome (Demo, Discovery, etc.)

**Custom Task Fields:**

- 1mind_Conversation_ID__c: Unique identifier linking to full transcript
- 1mind_Qualification_Score__c: Numeric qualification assessment
- 1mind_Key_Topics_Discussed__c: Primary conversation themes
- 1mind_Recommended_Next_Action__c: LLM-suggested next step
- 1mind_Objections_Identified__c: Any concerns or objections raised
- 1mind_Resources_Shared__c: Materials presented during conversation

**Advanced LLM-Derived Insights:** The LLM's sophisticated conversation analysis generates these valuable insights:

- Derived_Urgency_Indicator__c: Assessed urgency (High, Medium, Low, None)
- Derived_Budget_Range__c: Implied budget range from conversation context
- Derived_Decision_Timeline__c: LLM-assessed timeline for decision
- Derived_Buying_Stage__c: Current position in buying journey
- Derived_Competitive_Pressure__c: Level of competitive evaluation
- Derived_Technical_Complexity__c: Solution complexity requirements
- Derived_Stakeholder_Map__c: Identified decision-making participants
- Derived_Risk_Factors__c: Potential implementation or adoption risks
- Derived_Expansion_Opportunity__c: Upsell/cross-sell potential indicators

### **III. Data Objects and Field Structure**

### **A. Key Salesforce Objects:**

- **Lead:** Primary object for net-new prospects
- **Contact:** For existing customer contacts and converted leads
- **Task:** Core object for sales follow-up activities
- **Campaign/CampaignMember:** Attribution and source tracking
- **Opportunity:** Associated deal context where applicable

### **B. Essential Fields for Pre-processing (Read from Salesforce):**

**Lead/Contact Core Fields:** Id, FirstName, LastName, Email, Company/Account.Name, Title, Industry, LeadSource, Status, Rating, LeadScore__c, CreatedDate, LastModifiedDate

**Engagement History:** Recent Tasks, Events, CampaignMember records, and custom engagement scoring fields

### **C. Essential Fields for Post-processing (Write to Salesforce):**

**Lead/Contact Updates:** All 1mind_ prefixed custom fields detailed in Section II.B

**Task Creation:** Comprehensive Task record with custom fields for conversation context and follow-up guidance

### **IV. Workflow Integration & Sales Process Enhancement**

**Bypassing Bottlenecks:** Highly qualified Superhuman interactions can trigger direct assignment to Account Executives, bypassing traditional SDR qualification.

**Salesforce Automation Integration:**

- **Process Builder/Flow:** Trigger on 1mind custom field updates
- **Assignment Rules:** Route based on qualification status and territory
- **Email Alerts:** Immediate notifications to sales team members
- **Lead/Contact Conversion:** Accelerated conversion for qualified prospects

**Task-Driven Sales Process:**

- Automatically created Tasks serve as the primary handoff mechanism
- Tasks include comprehensive context, eliminating information loss
- Priority and due date assignment based on qualification level
- Integration with sales team calendars and CRM workflows

### 

### **V. Reporting & Analytics**

**Salesforce Native Reporting:**

- Lead/Contact reports with 1mind custom fields for performance tracking
- Task reports showing Superhuman-generated follow-up activities
- Campaign reports measuring Superhuman engagement impact
- Dashboard components for real-time qualification metrics

**Key Performance Indicators:**

- Superhuman engagement rates by lead source
- Qualification conversion rates from Superhuman interactions
- Average time from Superhuman engagement to opportunity creation
- Revenue attribution from Superhuman-qualified leads

**Data Export Capabilities:**

- Full conversation transcripts stored externally with Salesforce ID linkage
- Raw conversation data available for advanced analytics platforms
- Custom object integration for detailed conversation storage (optional)

### 

### **VI. Technical Implementation & Testing**

**Environment Requirements:**

- Salesforce Sandbox access for development and testing
- Production deployment following your org's change management process
- Custom field creation and page layout updates

**Testing Protocols:**

- Known vs. anonymous user scenarios
- Lead vs. Contact record handling
- Task creation and assignment verification
- Integration with existing sales processes

**Deployment Approach:**

- Phased rollout starting with pilot sales teams
- A/B testing capabilities for optimization
- Performance monitoring and API usage tracking
- Collaboration with Salesforce Admin and Sales Operations teams

This integration transforms the traditional lead qualification process by combining the power of AI-driven conversations with Salesforce's robust CRM capabilities, ensuring no qualified prospect falls through the cracks while providing sales teams with unprecedented context and intelligence for their follow-up activities.