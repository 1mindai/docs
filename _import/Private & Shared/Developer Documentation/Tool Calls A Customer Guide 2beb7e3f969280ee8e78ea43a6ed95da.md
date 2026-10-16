# Tool Calls: A Customer Guide

*Last updated January 12, 2026*

## **Overview**

Tool calls let your AI assistant interact with external systems and APIs during conversations. The system supports multiple types, from simple local operations to complex async workflows.

## **Types of Tool Calls**

**1. Local Tool Handlers**

Local handlers run in the interaction service and return results immediately.

**Characteristics:**

- Fast execution (no network calls)
- Synchronous responses
- Built-in functions like present_content, set_goal, end_conversation
- Direct access to session data and conversation context

**Common Use Cases:**

- UI controls (showing content, changing modes)
- Session management (setting variables, ending conversations)
- Knowledge base searches
- Internal state management

**Example Tools:**

- present_content - Display images, videos, or embedded content
- set_goal - Change conversation goals
- search_knowledge_embeddings - Search your knowledge base
- set_session_variable - Store data in the session

**2. External Tool Server Calls**

When a tool isn’t handled locally, the system forwards it to your external tool server (customer-connector-service) via a JSON-RPC API.

**How It Works:**

1. AI requests a tool call
2. System checks for a local handler
3. If none, sends a JSON-RPC request to your tool server
4. Tool server executes the method and returns the result
5. Result is passed back to the AI for response generation

**Request Format (JSON-RPC 2.0):**

```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "method": "tools/call",
  "params": {
    "tool": "tool_name",
    "arguments": {
      "param1": "value1",
      "param2": "value2"
    }
  }
}
```

**Response Format:**

```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "result": {
    "data": "returned value"
  }
}
```

**Endpoint:** POST {tools-url}/call?session={sessionId}

**Authentication:** API key via x-api-key header

**3. Processor-Based Tool Calls**

Processors are customer-specific implementations that handle tool calls for your account. They enable custom business logic and external API integrations.

**How Processors Work:**

1. Tool call arrives at customer-connector-service
2. System identifies your processor from account configuration
3. Processor executes the requested method with session context
4. Method can call external APIs, query databases, or run business logic
5. Result is returned to the AI

**Processor Configuration:**

- Configured per account/flow via launcher settings
- Each processor exposes methods that can be called as tools
- Processors have access to session data, conversation context, and integration configs

**Example Processor Methods:**

- getMeetingLink - Retrieve scheduling links from CRM systems
- createLead - Create records in external systems
- lookupAccount - Search customer databases
- Custom methods for your business needs

**Benefits:**

- Custom business logic per customer
- Secure credential management
- Access to customer-specific integrations
- Session-aware operations

## **External APIs as Tool Calls**

**Architecture**

External API calls are handled through the processor system:

1. Define the tool in your AI model configuration
2. Configure the processor in account settings
3. Implement a processor method that calls your API
4. The AI can now invoke the tool during conversations

**Implementation Flow**

AI Conversation

↓

Tool Call Request

↓

Customer Connector Service

↓

Processor (Your Custom Logic)

↓

External API Call

↓

Result Processing

↓

Response to AI

**Example: Salesforce Integration**

A processor method might:

1. Authenticate with Salesforce using stored credentials
2. Search for accounts and contacts
3. Create or update records
4. Return relevant data to the AI

The AI can then use this data to personalize its responses.

**Security & Configuration**

- Credentials stored securely in account settings
- Per-account processor configuration
- Session-based authorization
- API keys and OAuth tokens managed by the system

## **Async Tool Calls via Temporal Workflows**

For long-running or complex operations, the system supports async execution through Temporal workflows.

**When to Use Async Tool Calls**

- Operations taking more than a few seconds
- Multi-step workflows
- Operations requiring retries or error recovery
- Background processing that shouldn't block the conversation

**How Async Tool Calls Work**

1. A tool call triggers a Temporal workflow
2. The workflow orchestrates activities (API calls, data processing, etc.)
3. The conversation continues while the workflow runs
4. Results are stored and can be accessed later
5. Workflow status can be checked and results retrieved

**Temporal Workflow Architecture**

**Workflow Types:**

- **Integration Workflows** — Execute complex multi-step integrations
- **Conversation Extraction Workflows** — Process and extract structured data from conversations
- **Pre-processing Workflows** — Enrich context before conversations
- **Post-processing Workflows** — Process data after conversations complete

**Workflow Features:**

- Automatic retries with configurable policies
- Timeout handling
- Activity orchestration
- State management
- Error recovery

**Example: Async Lead Creation**

1. AI calls the create_lead tool
2. Processor starts a Temporal workflow
3. Workflow:
    - Validates lead data
    - Enriches with external data
    - Creates lead in CRM
    - Sends notification email
    - Updates session context
4. AI receives acknowledgment immediately
5. Workflow completes in the background
6. Results available for follow-up

**Workflow Configuration**

Workflows are defined in your account settings:

- Workflow definitions stored in database
- Versioned for safe updates
- Dry-run mode for testing
- Per-flow configuration support

## **Best Practices**

### **Tool Design**

- Keep tool names descriptive and consistent
- Provide clear parameter descriptions
- Handle errors gracefully
- Return structured, predictable results

### **Performance**

- Use local handlers for fast operations
- Use async workflows for long-running tasks
- Cache external API responses when appropriate
- Implement timeouts for external calls

### **Security**

- Never expose credentials in tool responses
- Validate all input parameters
- Use session-based authorization
- Log tool calls for audit purposes

### **Error Handling**

- Return meaningful error messages
- Implement retry logic for transient failures
- Handle rate limiting from external APIs
- Provide fallback behavior when possible

## **Configuration Examples**

**Adding a Tool to AI Model**

Add to your AI model's functions JSON field:

```json
[
  {
    "type": "function",
    "function": {
      "name": "get_meeting_link",
      "description": "Retrieve a personalized meeting scheduling link",
      "parameters": {
        "type": "object",
        "properties": {
          "companyName": {
            "type": "string",
            "description": "The company name"
          },
          "email": {
            "type": "string",
            "description": "Contact email address"
          }
        },
        "required": ["companyName", "email"]
      }
    }
  }
]
```

**Processor Configuration**

Configure in your account launcher settings:

```json
{
  "toolCallProcessor": "phenom",
  "flow": "default"
}
```

## **Summary**

The tool call system supports:

- **Local handlers** for fast, synchronous operations
- **External tool servers** for custom integrations via JSON-RPC
- **Processors** for customer-specific business logic
- **Temporal workflows** for async, complex operations

This architecture enables real-time interactions, custom integrations, and reliable background processing—all seamlessly integrated into your AI conversations.

For implementation details or support, contact your technical representative.