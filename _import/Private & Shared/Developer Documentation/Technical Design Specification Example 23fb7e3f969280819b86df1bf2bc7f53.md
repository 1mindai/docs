# Technical Design Specification Example

*Last updated July 29, 2025*

# **AcmeCorp / 1mind Superman BDR – Website Inbound Workflow**

## **Executive Summary**

This specification outlines the automated inbound lead qualification system using 1mind's Superhuman, integrated with Marketo and 6sense for lead enrichment and routing. The solution enables intelligent visitor identification, personalized AI conversations, and seamless lead handoff to sales teams through automated Marketo task creation.

### **Business Objectives**

- **Qualify inbound leads** through intelligent AI-powered conversations
- **Personalize visitor experience** using real-time data enrichment
- **Automate sales handoff** with contextual lead information
- **Increase conversion rates** through targeted engagement

---

## **System Architecture Overview**

### **High-Level Data Flow**

```html
Visitor → Website → Identity Resolution → 6sense Data (Local Storage) → Superhuman → Conversation → Lead Processing → Marketo
```

### **Core Components**

1. **Identity Resolution Engine** - Visitor identification and session tracking
2. **6sense Data Layer** - Account intelligence stored in local storage
3. **Superhuman Conversation Engine** - 1mind Superhuman interaction with enriched context
4. **Lead Processing Pipeline** - Post-conversation data handling and Marketo sync

---

## **1. PRE-CONVERSATION PROCESSING**

### **1.1 Visitor Identity Resolution**

### **Primary Identity Sources**

- **Marketo Munchkin Cookie** (_mkto_trk) - Returning visitor identification
- **URL Parameters** - Email, campaign attribution (UTM)
- **Form Data** - Previously captured visitor information and passed as web session variables to 1mind launcher
- **Session Storage** - Cross-page visitor tracking

### **Data Collection Points**

| **Source** | **Data Type** | **Usage** |
| --- | --- | --- |
| Munchkin Cookie | Lead ID, tracking token | Primary visitor identification |
| UTM Parameters | Campaign attribution | Source tracking and attribution |
| IP Address | Geographic location | Account matching for 6sense |

### **1.2 Marketo Lead Enrichment**

### **API Integration Specifications**

- **Endpoint**: /rest/v1/leads.json
- **Method**: GET (lead lookup)
- **Authentication**: OAuth 2.0 Bearer token
- **Rate Limits**: 100 calls per 20 seconds
- **Timeout**: 5 seconds with retry logic

### **Cookie-Based Lead Lookup**

**Primary API Call**

```html
GET

/rest/v1/leads.json?filterType=cookies&filterValues=id:217-LXS-149&token:_mch-AcmeCorp.com-781ac0bdee8a28ff5f0d834cad583119&fields=email,company,createdAt,id&batchSize=10
```

*Note: The launcher code can read cookies or local storage and performs backend lead lookup. Additional visitor data can be gathered from query string parameters and HTTP headers, but this is handled server-side and not passed to the 1mind script.*

### **Retrieved Marketo Contact Data Fields**

**Core Identity**

- Lead ID, Email, First Name, Last Name
- Company, Job Title, Phone Number

**Firmographic Data**

- Industry, Company Size, Annual Revenue
- Geographic Location (Country, State, City)

### **Fallback Strategies**

1. **Cookie-based lookup** (primary method)
2. **Email-based lookup** (if email parameter available)
3. **Anonymous visitor handling** (create temporary session record)

### **1.3 6sense Account Intelligence**

### **Available 6sense Data Points (from Local Storage)**

- Account name and domain
- Industry classification
- Employee count range
- Annual revenue range
- Intent score (0-100)
- Intent topics and keywords
- Buying stage (Early, Middle, Late)
- Technology stack information
- Geographic location data
- Engagement timeline
- Competitive intelligence
- Firmographic details

### **1mind Superhuman Integration Script**

The 1mind Superhuman is initialized with 6sense enrichment data passed through data attributes:

```html
<script
defer
src="https://launcher.1mind.com/12345"
data-accountName="Acme Corporation"
data-domain="acme.com"
data-industry="Technology"
data-employeeCount="500-1000"
data-annualRevenue="50M-100M"
data-intentScore="85"
data-intentTopics="AI automation, workflow optimization"
data-buyingStage="Decison"
data-location="San Francisco, CA">
</script>
```

*Note: Marketo lead data is retrieved server-side via cookie lookup and automatically enriches the AI context. Query string parameters and HTTP headers are also processed server-side for additional visitor attribution.*

---

## **2. POST-CONVERSATION PROCESSING**

### **2.1 Conversation Data Capture**

The Superhuman captures and processes the following conversation metadata:

### **Core Conversation Data**

- **Full Transcript**: Complete conversation log
- **Summary**: AI-generated conversation overview
- **Top Topics**: Key discussion themes and areas of interest

### **Data Concatenation for Marketo**

All conversation data will be concatenated into a single formatted string for the Marketo Contact record in the field tempText .

```
*CONVERSATION SUMMARY:**

[AI-generated summary of the conversation]

- *KEY TOPICS DISCUSSED:**
- Topic 1
- Topic 2
- Topic 3
- *FULL TRANSCRIPT:**

[Complete conversation transcript with timestamps]
```

### **2.2 Marketo REST API Integration**

### **Required Marketo REST API Endpoints**

**1. Lead Lookup by Cookie (Pre-conversation)**

```
GET 

/rest/v1/leads.json?filterType=cookies&filterValues=id:217-LXS-149&token:_mch-AcmeCorp.com-781ac0bdee8a28ff5f0d834cad583119&fields=email,company,createdAt,id&batchSize=10
```

**2. Lead Upsert (Post-conversation)**

```
POST 

/rest/v1/leads.json
```

**3. Add Lead to Program**

```
POST 

/rest/v1/leads/programs/{programId}/status.json
```

**4. OAuth Token Management**

```
POST 

/identity/oauth/token
```

### **Program Membership API Details**

**Add Contact to Program Endpoint**

```
POST 

/rest/v1/leads/programs/{programId}/status.json
```

**Request Payload Example**

```json
{
  "input": [
    {
      "email": "jane@acme.com",
      "status": "Responded",
      "membershipDate": "2025-06-17T10:30:00Z",
      "acquisitionProgram": true
    }
  ]
}
```

**Response Example**

```json
{
  "requestId": "abc123",
  "success": true,
  "result": [
    {
      "id": 123456,
      "status": "added",
      "membershipDate": "2025-06-17T10:30:00Z",
      "progressionStatus": "Responded"
    }
  ]
}

```

### **2.3 Lead Processing Workflow**

### **Field Mapping by Implementation Phase**

| **Field Category** | **Field Name** | **Marketo Field** | **Phase 1** | **Later Phases** | **Data Source** |
| --- | --- | --- | --- | --- | --- |
| **Core Identity** | Email | email | ✅ Required | ✅ | Marketo Lookup |
|  | First Name | firstName | ✅ | ✅ | Marketo Lookup |
|  | Last Name | lastName | ✅ | ✅ | Marketo Lookup |
|  | Company | company | ✅ | ✅ | Marketo Lookup |
|  | Job Title | title | ⚪ Optional | ✅ | Marketo Lookup |
| **Lead Source** | Lead Source | leadSource | ✅ Required | ✅ | System Generated |
| **Conversation Data** | Full Context | tempText | ✅ Required | ✅ | AI Conversation |
| **Attribution** | UTM Campaign | utmCampaign | ⚪ Optional | ✅ | Session Data |
|  | UTM Source | utmSource | ⚪ Optional | ✅ | Session Data |
|  | UTM Medium | utmMedium | ⚪ Optional | ✅ | Session Data |
|  | Current Page | currentPage | ⚪ Optional | ✅ | Session Data |
|  | Referrer | referrerURL | ⚪ Optional | ✅ | Session Data |
| **6sense Enrichment** | Intent Score | sixsenseIntentScore | ⚪ Optional | ✅ | 6sense Data |
|  | Intent Topics | sixsenseIntentTopics | ⚪ Optional | ✅ | 6sense Data |
|  | Buying Stage | sixsenseBuyingStage | ⚪ Optional | ✅ | 6sense Data |
|  | Account Name | sixsenseAccountName | ⚪ Optional | ✅ | 6sense Data |
| **AI Metadata** | Qualification Status | aiQualificationStatus | ⚪ Optional | ✅ | AI Analysis |
|  | Qualification Score | aiQualificationScore | ⚪ Optional | ✅ | AI Analysis |
|  | Conversation Duration | aiConversationDuration | ⚪ Optional | ✅ | AI Analysis |
|  | Engagement Level | aiEngagementLevel | ⚪ Optional | ✅ | AI Analysis |

### **Phase 1: Core Data Sync**

**Primary Fields (Required)**

- **lookupField**: email
- **leadSource**: "Superhuman"
- **tempText**: Concatenated conversation data (summary + topics + transcript)

**Optional Fields (Best Effort)**

- Basic identity fields (firstName, lastName, company, title)
- Session attribution data (if available)

### **Marketo Lead Upsert Payload (Phase 1)**

```json
{
  "action": "createOrUpdate",
  "lookupField": "email",
  "input": [
    {
      "email": "jane@acme.com",
      "firstName": "Jane",
      "lastName": "Smith", 
      "company": "Acme Inc",
      "leadSource": "Superhuman",
      "tempText": "**CONVERSATION SUMMARY:**\nJane is evaluating AI automation tools for workflow optimization. Expressed strong interest in integration capabilities and pricing options.\n\n**KEY TOPICS DISCUSSED:**\n- Pricing and ROI\n- Integration requirements\n- Implementation timeline\n\n**FULL TRANSCRIPT:**\n[Timestamp] Avatar: Hi Jane! I see you're from Acme Inc...\n[Full conversation continues...]"
    }
  ]
}
```

### **2.4 Program Membership & Smart Campaign Triggers**

### **Available Programs**

**Note: These are example program names for development/testing purposes only**

1. **"Superhuman_Demo_Request"** - For visitors requesting product demonstrations
2. **"Superhuman_Conversation_Meeting"** - For visitors requesting calls, meetings, or other direct engagement

### **Program Membership Assignment**

Based on conversation outcomes, leads are assigned to appropriate programs:

```json
{
  "input": [
    {
      "email": "jane@acme.com",
      "status": "Responded"
    }
  ]
}
```

### **Smart Campaign Configuration**

**Trigger**: Program Status Change

- Program: [Superhuman_Demo_Request OR Superhuman_Conversation_Meeting]
- New Status: "Responded"

**Flow Step**: Create Task

- Task Type: "Follow Up"
- Subject: "Superhuman Qualified Lead - [Company Name]"
- Description: Pull from Lead.tempText field
- Assigned To: Account Owner or Lead Owner

*Note: Marketo Tasks are automatically synchronized with connected CRM systems through standard Marketo sync processes.*

This technical specification focuses on the core pre-processing and post-processing workflows for the 1mind AI BDR system. The Phase 1 implementation prioritizes essential functionality:

- **Pre-processing**: Visitor identification, Marketo lead lookup, and 6sense data enrichment
- **Post-processing**: Conversation data capture, Marketo lead sync, and automated task creation