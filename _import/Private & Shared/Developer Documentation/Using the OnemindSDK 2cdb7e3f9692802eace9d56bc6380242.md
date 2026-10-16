# Using the OnemindSDK

*Last updated April 16, 2026*

The OnemindSDK is automatically embedded into your site’s global `window` object.
That means you can access the SDK methods by:
`window.onemind.v1.[methodName]` 
or directly:
`onemind.v1.[methodname]`

## Available Methods

### `sendSessionContextEvent`

Used to send context events to the discourse widget.

**syntax**

```jsx
await onemind.v1.sendSessionContextEvent({
	event: "event name",
	payload: {
		...any payload object...
	}
})
```

**parameters**

**options**: An object containing the event name and payload.

Payload can be any valid object.
Both the payload and event name will be forwarded as-is to our `v1/session-events` endpoint

**Response**

On success

```jsx
{
  "success": true,
  "message": "Event processed successfully",
  "logId": "[log id]"
} 
```

On error

```jsx
Error: An error occured while executing the function
```

**Examples**

```jsx
try {
	const response = await onemind.v1.sendSessionContextEvent({
		event: "user-form",
		payload: {
			username: "jane doe",
			age: 25,
			address: "float street"
		}
	})
} catch (error) {
	...handle error...
}
```

you can also send events periodically

```jsx
// Set up periodic call (e.g., every 5 seconds)
const intervalId = setInterval(async () => {
  try {
    const response = await onemind.v1.sendSessionContextEvent({
      event: "user-form",
      payload: {
        username: "jane doe",
        age: 25,
        address: "float street"
      }
    });
  } catch (error) {
    // ...handle error...
  }
}, 5000);

// To stop the periodic calls later:
clearInterval(intervalId);
```

### `setWidgetZIndex`

Used to set the z-index of the discourse widget.

**syntax**

```jsx
onemind.v1.setWidgetZIndex({
	zIndex: 9999
})
```

**parameters**

`zIndex` must be a valid integer.
The value is applied directly to the widget container.

**Response**

On success

```jsx
void
```

On error

```jsx
Error: onemind: widget is not loaded yet
```

**Examples**

```jsx
try {
	const response = onemind.v1.setWidgetZIndex({
		zIndex: 9999
	})
} catch (error) {
	...handle error...
}
```

you can also update it based on UI changes

```jsx
// Example: raise above a modal
function openModal() {
	onemind.v1.setWidgetZIndex({ zIndex: 99999 })
	// ...open modal...
}

// Example: reset when modal closes
function closeModal() {
	onemind.v1.setWidgetZIndex({ zIndex: 9999 })
	// ...close modal...
}
```

## `startConversation`

Used to programmatically start a conversation with the discourse widget.

**syntax**

```
onemind.v1.startConversation()
```

**parameters**

This method does not take any parameters.

It triggers the widget to start a conversation flow directly -.

**Response**

On success

```jsx
void
```

On error

```jsx
Error: onemind: widget is not loaded yet
```

**Examples**

```jsx
<button
onClick={() => {
try {
onemind.v1.startConversation()
		} catch (error) {
// ...handle error...
		}
	}}
>
	Start Conversation
</button>
```

---

## Events

We provide the following lifecycle events that you can attach callback functions to.

All of the events take a callback function as a parameter. It will be called whenever the event fires.

An object containing data relevant to the event is passed into the callback function.

`onConversationStarted` Fired when a chat room is created with our superhuman and the user

```jsx
event data: {timestamp: [ISO date string]}
```

`onConversationEnded` Fired when the user session ends

```jsx
event data: {
	timestamp: [ISO date string],
	conversationStartTimestamp: [ISO date string],
	conversationEndTimestamp: [ISO date string],
	conversationId: string,
	userMessagesCount: number,
	userVoiceMessagesCount: number,
	agentRepliesCount: number,
}
```

`onChatMessageSent` Fired when user sends a message to the superhuman (voice or text)

```jsx
event data: {
	timestamp: [ISO date string],
	conversationStartTimestamp: [ISO date string],
	conversationId: string,
	userMessagesCount: number,
	userVoiceMessagesCount: number,
	agentRepliesCount: number,
}
```

`onChatMessageReceived` Fired when a user receives a message from the superhuman

```jsx
event data: {timestamp: [ISO date string]}
```

`onUrlClicked` Fired when a user clicks a URL in the chat

**Syntax**

```jsx
onemind.v1.eventName((event) => {
	...any action...
})
```

**Examples**

```jsx
// async function
await onemind.v1.onConversationStarted(async (event) => {
	const response = await api.post('www.api.com/post')
	if (response.success) {
		...do something...
	} else {
		...do something else...
	}
})
```

```jsx
// periodic funcition / polling
let intervalId = undefined;
await onemind.v1.onConversationStarted(async (event) => {
	intervalId = setInterval(() => {
		...do something...
	}, 5000) // every 5 seconds 
})

//stop polling whenever you want to
if (intervalId) {
	clearInterval(intervalId)
}
```