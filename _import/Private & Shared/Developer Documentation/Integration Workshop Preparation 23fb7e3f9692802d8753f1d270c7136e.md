# Integration Workshop Preparation

*Last updated July 29, 2025*

## **Objective**

The objective of this session is to align on the technical and integration requirements necessary for our superhuman platform to seamlessly interact with your CRM and Marketing Automation Platform (MAP), alongside your existing Web infrastructure. While the CS and GENAI teams manage the core superhuman conversational flow, our team is specifically responsible for the pre-processing of data into the superhuman session and the post-processing of conversation outcomes. This integration will enable personalized customer interactions, track engagement, and provide valuable insights back into your business systems, primarily focusing on optimizing sales qualification, demand generation, and marketing nurture campaigns through superhuman qualified leads.

## **Key Objectives of the Session**

- **Pre-Processing - Understanding Data Flow (CRM & MAP):** Define precisely how existing customer and lead data from your CRM and MAP can be pre-loaded into superhuman conversations to inform and personalize the interaction.
- **Pre-Processing - User Identification & De-anonymization:** Map web visitors to their CRM Contact/Lead IDs or MAP Person IDs through web sessions (cookies, local storage, web variables) and explore capabilities for de-anonymizing data from third-party vendors (ZoomInfo, Demandbase, 6sense) into the superhuman session for enriched pre-processing.
- **Integration Methods (CRM & MAP):** Review available API endpoints, webhook configurations, and authentication mechanisms for both your CRM and MAP.
- **Post-Processing - Qualification Determination:** Critically define your Sales Qualified Lead (SQL) criteria. Our team will determine if the superhuman conversation has met these criteria.
- **Post-Processing - Transcript & Insights Delivery:** Define how conversation transcripts, summaries, and key topics (especially qualification signals) can be posted back into your CRM, MAP, or exported as flat files for BI ingestion based on post-processing outcomes.
- **CRM & MAP Object Understanding:** Gather a comprehensive understanding of all relevant CRM (Leads, Contacts, Accounts, Opportunities, Custom Objects) and MAP (Persons, Programs, Custom Objects) objects, their fields, and data structures for both pre-processing data extraction and post-processing data write-back.
- **Technical Feasibility & Next Steps:** Identify potential roadblocks, confirm required development efforts for pre- and post-processing, and set up a timeline for implementation.
- **Customer's Testing and Deployment Process:** Understand your internal testing and deployment procedures for CRM/MAP changes and new integrations.
- **Workflow and Routing:** 1mind wants to adapt to the current lead routing workflow process that exists in the customer's current process and not disrupt the workflow. We want to accelerate the deal by bypassing any routing to MDR/SDR and directly to Account Executives since the superhuman has qualified the lead in depth more than a human. We want to ensure we understand the current routing, whether it originates in a custom object, API form, MAP contact record, or CRM lead record.

## **Preparation Questions for Your Team**

To maximize the effectiveness of our upcoming session, please review and prepare responses to the following questions. Your detailed input will be crucial for a successful integration.

## **I. Current Systems & Data Landscape:**

### **CRM**

- What are the primary objects/entities in your CRM that store lead, contact, account, and opportunity data that our superhuman should be aware of for pre-processing? (e.g., Lead, Contact, Account, Opportunity, Custom Objects).
- For each primary object, please list the key fields that are critical for:
    - Pre-processing: Personalizing the superhuman conversation (e.g., existing product ownership, recent activity, company size, industry).
    - Post-processing / Sales Qualification: Determining lead qualification (e.g., BANT criteria fields, specific picklists for status/sub-status, budget, timeline, authority, need).
    - Demand generation tracking.
    - Sales ownership/assignment.
- Are there any custom objects or fields that are essential for our integration to understand and interact with, particularly for qualification or contextual data during pre-processing? If so, please describe their purpose and data types.
- What is your current process for lead creation and assignment in your CRM?
- What are the CRM API limits and your current usage?
- What authentication methods are supported for CRM API access (e.g., OAuth 2.0, Connected Apps, traditional username/password)?

### **Marketing Automation Platform (MAP)**

- What are the key objects/entities in your MAP that store prospect/lead data, campaign membership, and engagement history that our superhuman should leverage for pre-processing? (e.g., Persons, Programs, Activities).How do leads typically flow from your MAP into your CRM? Is this automated (e.g., MAP Sync) or manual?
- What data points from your MAP are most critical for pre-processing and personalizing conversations within the superhuman? (e.g., recent website activity, email opens/clicks, content downloads, MAP Program membership). Is there a summarized version of key activities?
- How do you segment audiences for your marketing nurture campaigns in your MAP?
- What are the API limits and current usage for your MAP?
- What authentication methods are supported for MAP API access?

### **Data Warehouse (Snowflake, Databricks, etc.)**

- Which data warehouse system(s) are you currently using?
- What types of historical customer and engagement data are stored here that could potentially enrich superhuman conversations via pre-processing or be the ultimate destination for superhuman data via post-processing?
- What is your preferred method for ingesting new data into your data warehouse (e.g., flat files, streaming APIs, specific connectors) for data generated by our post-processing?
- What are the security protocols and access mechanisms for your data warehouse?

## **II. Web Session & User Identification (Pre-Processing Focus)**

### **Website Infrastructure**

- What platform is your primary website built on (e.g., WordPress, custom CMS, Shopify, etc.)?
- How are cookies, local storage, or web variables currently used on your website to capture and store user information (e.g., user ID, email address, previous visits, form submissions)? This is critical for pre-processing to identify known users.
- Are there any specific data layers or JavaScript variables on your website that contain identifiable user information (e.g., CRM Lead/Contact ID, MAP Person ID) that could be accessed by our pre-processing layer to link the web session to CRM/MAP records?

### **De-anonymization & Third-Party Data (Pre-Processing Focus)**

- Do you currently use third-party data vendors like ZoomInfo, Demandbase, 6sense, Clearbit, or similar for de-anonymization and lead enrichment?
- If so, which vendors do you use?
- How is this data currently integrated into your website’s data collection or used in your sales/marketing processes?
- Are there existing API keys or integration points for these vendors that we could leverage during pre-processing to pull de-anonymized data into the superhuman session in real-time, enriching the superhuman's context or is the data stored in the web session?

## **III. Sales Qualification Process & superhuman Integration (Post-Processing Focus)**

### **Current Lead Qualification Process**

- Please describe your current lead qualification process from initial inquiry to sales acceptance in your CRM.
- What are your precise Sales Qualified Lead (SQL) criteria? Please be as specific as possible. This is crucial for our post-processing determination (e.g., specific BANT criteria fields in your CRM, specific picklist values, required budget/timeline range, identified decision-maker, specific pain points captured).
- Who is responsible for qualifying leads (e.g., SDRs, BDRs, sales reps, marketing)?
- What information is typically captured during a lead qualification conversation that our superhuman would ideally gather?
- How do you currently track the qualification status of a lead in your CRM (e.g., Lead Status field, custom checkboxes)?

### **Superhuman Role in Sales Qualification (Post-Processing Actions)**

- Upon a conversation being determined as "qualified" by our post-processing based on your SQL criteria, what specific actions should be taken when the conversation is posted in your MAP / CRM?
- What derived fields from the superhuman conversation transcript is essential to be pushed back into your system for sales follow-up (e.g., captured BANT info, key pain points, specific questions asked by the prospect)? Our post-processing will extract and map this data.

## **IV. Demand Generation & Marketing Nurture Campaigns (Pre & Post-Processing)**

### **Current Demand Generation Strategy**

- Briefly describe your current demand generation channels and strategies (e.g., paid ads, content marketing, webinars, events).
- How are leads captured from these channels and ingested into your MAP/CRM?

### **Superhuman Role in Demand Generation (Pre & Post-Processing)**

- How can the superhuman support your demand generation efforts? (e.g., collecting lead information on landing pages and pushing to MAP, engaging with website visitors to capture interest, facilitating sign-ups for content). Our post-processing will handle the data push.
- What information captured by the superhuman is critical for attributing leads to specific demand generation campaigns in your MAP/CRM? (e.g., Campaign IDs, Source fields).

### **Marketing Nurture Campaigns (Pre & Post-Processing)**

- Describe how you currently segment and enroll leads/contacts into marketing nurture campaigns in your MAP.
- What are the key triggers or criteria for entering/exiting a nurture sequence in your MAP?
- How do you envision the superhuman contributing to or influencing your marketing nurture campaigns? (e.g.,
    - Post-processing: Identifying specific topics of interest during a conversation to segment a lead into a relevant nurture track in your MAP.
    - Pre-processing: Providing real-time content recommendations based on conversation context and existing MAP engagement data.
    - Post-processing: Capturing explicit opt-ins or preferences for communication channels and updating your MAP.
    - Post-processing: Triggering a change in nurture track based on lead engagement with the superhuman.
- What specific data points should our post-processing push back to your MAP to inform or trigger nurture campaign changes (e.g., "superhuman Engaged," "Expressed Interest in Product X," "Presented Whitepaper Y via Superhuman," "Superhuman Qualification Status")?

## **V. Data Ingestion & Reporting (Post-Processing Focus)**

### **Transcript & Summary Data**

- What is the desired format for superhuman conversation transcripts and summaries to be pushed into your CRM (e.g., long text area field on Lead/Contact) or MAP (e.g., Custom Activity, Custom Fields)?
- Which system(s) should receive the full transcript, and which should receive summaries or specific data points extracted by our post-processing?
- Are there any specific keywords or phrases that should be extracted from conversations and mapped to fields in your CRM/MAP for reporting or segmentation purposes based on post-processing analysis?

### **Reporting & Analytics**

- What key metrics related to superhuman performance and its impact on sales/marketing would you want to track? (e.g., leads qualified by superhuman in your CRM, conversion rate from superhuman conversation to opportunity, engagement time with superhuman, popular topics discussed).
- How do you currently perform reporting and analytics on your sales and marketing data?
- Would you prefer raw superhuman data (from our post-processing) as flat files to be generated and deposited on a file repository for your data warehouse for custom reporting, or are CRM/MAP fields sufficient?

## **VI. Security, Compliance & Governance**

### **Authentication & Authorization**

- What are your preferred methods for authenticating and authorizing API access for third-party applications like ours for both your CRM and MAP? (e.g., CRM Connected Apps with OAuth, MAP Custom Services with API keys, dedicated integration users).
- What minimum level of access (read-only, read/write) will be required for our pre-processing reads and post-processing writes in your CRM (Leads, Contacts, Accounts, Opportunities, Custom Objects) and MAP (Persons, Programs, Custom Activities)?

## **VII. Technical Environment & Development Process**

### **Development & Sandbox Environments**

- Do you have dedicated sandbox or staging environments for your CRM, MAP, and website for testing integrations?
- What is your typical process for promoting changes from development/staging to production in your CRM and MAP?

### **Team & Resources**

- Who are the key technical stakeholders on your team who will be involved in this integration project? (e.g., CRM Admins, MAP Admins, Web Developers, Data Engineers).
- What is your typical lead time for allocating internal development resources for integration projects, particularly for configuration changes in your CRM/MAP?