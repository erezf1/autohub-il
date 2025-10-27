# Chat Flow Documentation

## Overview

The Auto-Hub chat system enables dealers to communicate about specific entities (vehicles, auctions, or ISO requests). The system ensures one unique conversation per entity-user pair and provides smart UI interactions based on conversation state.

## Key Concepts

### 1. Entity-Based Conversations

Each conversation is linked to exactly one entity:
- **Vehicle**: Communication about a specific vehicle listing
- **Auction**: Communication about a specific auction
- **ISO Request**: Communication about an ISO (I'm Searching For) request

### 2. Conversation Uniqueness Rule

**One conversation per (user pair + entity)**: 
- Users A and B can have only one conversation about Vehicle X
- Users A and B can have a different conversation about Auction Y
- Same users, same entity = same conversation (reuse existing)

### 3. Backend Client Consistency

All chat-related operations use `dealerClient` from `@/integrations/supabase/dealerClient`:
- Conversation creation
- Message sending/receiving
- Conversation queries
- This ensures RLS (Row Level Security) policies work correctly with consistent auth session

## Core APIs

### Helper Functions (`src/utils/mobile/chatHelpers.ts`)

#### `openOrCreateChat(params)`
Creates a new conversation or returns existing conversation ID.

```typescript
interface OpenChatParams {
  otherUserId: string;
  entityType: 'vehicle' | 'auction' | 'iso_request';
  entityId: string;
}

// Usage
const conversationId = await openOrCreateChat({
  otherUserId: vehicle.owner_id,
  entityType: 'vehicle',
  entityId: vehicleId
});
navigate(`/mobile/chat/${conversationId}`);
```

**Behavior:**
1. Checks if conversation exists for (currentUser, otherUser, entity)
2. Returns existing conversation ID if found
3. Creates new conversation if not found
4. Returns conversation ID for navigation

#### `findConversationIdForEntity(params)`
Checks if a conversation exists without creating one.

```typescript
// Usage
const conversationId = await findConversationIdForEntity({
  otherUserId: auction.creator_id,
  entityType: 'auction',
  entityId: auctionId
});

if (conversationId) {
  // Conversation exists
  navigate(`/mobile/chat/${conversationId}`);
} else {
  // No conversation yet
  // Show "Send Message" button
}
```

**Returns:** `string | null`

### React Hooks

#### `useConversationForEntity(params)`
React Query hook to check if conversation exists.

```typescript
// Usage in component
const { data: existingConversationId } = useConversationForEntity({
  otherUserId: vehicle?.owner_id,
  entityType: 'vehicle',
  entityId: id
});

// Use in button logic
const buttonLabel = existingConversationId ? 'חזרה לצ׳אט' : 'שלח הודעה';
```

**Returns:** `string | null`  
**Enabled when:** All params are truthy

#### `useConversations()`
Fetches all conversations for the current user.

```typescript
// Usage for list optimization
const { data: conversations = [] } = useConversations();

// Build Set for O(1) lookups
const conversationKeys = new Set(
  conversations.map(conv => `${conv.entity.type}|${conv.entity.id}|${conv.otherParty.id}`)
);

// Check existence instantly
const exists = conversationKeys.has(`vehicle|${vehicleId}|${ownerId}`);
```

## UI Behavior Patterns

### Single Entity Detail Screens

**Screens:** VehicleDetailScreen, AuctionDetailScreen, ISORequestDetailScreen

**Pattern:**
1. Use `useConversationForEntity()` to check if conversation exists
2. Set button label dynamically:
   - **Existing conversation:** "חזרה לצ׳אט" (Return to chat)
   - **No conversation:** "שלח הודעה" (Send message)
3. On button click:
   - If `existingConversationId`: navigate directly
   - Else: call `openOrCreateChat()` then navigate

**Example:**
```typescript
const { data: existingConversationId } = useConversationForEntity({
  otherUserId: vehicle?.owner_id,
  entityType: 'vehicle',
  entityId: id
});

const handleContactSeller = async () => {
  if (existingConversationId) {
    navigate(`/mobile/chat/${existingConversationId}`);
    return;
  }

  const conversationId = await openOrCreateChat({
    otherUserId: vehicle.owner_id,
    entityType: 'vehicle',
    entityId: id
  });
  navigate(`/mobile/chat/${conversationId}`);
};

// In JSX
<DealerCard
  chatButtonLabel={existingConversationId ? 'חזרה לצ׳אט' : 'שלח הודעה'}
  onChatClick={handleContactSeller}
/>
```

### List Screens (Multiple Items)

**Screens:** CarSearchScreen, HotCarsScreen, BidsScreen

**Pattern:**
1. Fetch all conversations once using `useConversations()`
2. Build a `Set<string>` of conversation keys for O(1) lookup
3. For each item in the list, compute the key and check Set
4. Set button label accordingly
5. On button click: navigate to existing or create then navigate

**Example:**
```typescript
const { data: conversations = [] } = useConversations();

// Build Set once
const conversationKeys = new Set(
  conversations.map(conv => `${conv.entity.type}|${conv.entity.id}|${conv.otherParty.id}`)
);

// Helper functions
const hasConversation = (entityType, entityId, otherUserId) => {
  return conversationKeys.has(`${entityType}|${entityId}|${otherUserId}`);
};

const getConversationId = (entityType, entityId, otherUserId) => {
  const conv = conversations.find(
    c => c.entity.type === entityType && 
        c.entity.id === entityId && 
        c.otherParty.id === otherUserId
  );
  return conv?.id || null;
};

// In render
vehicles.map(vehicle => (
  <VehicleCard
    chatButtonLabel={hasConversation('vehicle', vehicle.id, vehicle.owner_id) ? 'חזרה לצ׳אט' : 'שלח הודעה'}
    onChatClick={() => handleChat(vehicle.id, vehicle.owner_id)}
  />
))
```

**Performance:** This approach avoids N queries for N items. All lookups are O(1) from the pre-built Set.

## Anonymous Dealer Naming

When details are not revealed, dealers are shown with anonymous identifiers to maintain privacy:

**Format**: `סוחר #XXXXX` where XXXXX is a 5-digit number

**Key Features**:
- **Unique per conversation**: The same dealer will have different numbers in different conversations (e.g., "סוחר #12345" for one vehicle chat, "סוחר #67890" for another)
- **Consistent within conversation**: The number remains the same throughout a specific chat
- **Deterministic generation**: Uses a hash of `conversationId + userId` to ensure the same number appears for a given conversation-dealer pair
- **Implementation**: Simple character code hash modulo to 5-digit range (10000-99999)

This ensures:
- Privacy protection until details are revealed
- Ability to distinguish between different anonymous conversations
- No database storage needed (pure client-side logic)

## Last Message Display Format

In the chat list, the last message includes a sender prefix to help users quickly identify who sent it:

| Sender | Prefix | Example |
|--------|--------|---------|
| Current user | אתה: | אתה: היי, מעוניין ברכב |
| Other party | סוחר: | סוחר: בטח, בוא נדבר |
| No messages | (empty) | אין הודעות |

**Implementation Notes**:
- Prefix is added in `useConversations` hook when fetching conversations
- Uses `sender_id` from `chat_messages` to determine sender
- RTL-appropriate (prefix before message content in Hebrew)

## Chat List Refresh Behavior

The conversation list automatically refreshes to reflect the latest state when users navigate back from viewing a conversation:

**Auto-refresh triggers**:
- Returning from chat detail screen to chat list
- After sending a new message
- After marking messages as read

**What updates**:
- Unread message counts (badges)
- Last message content and sender
- Timestamp of last message
- Read/unread status

**Implementation**:
- React Query cache invalidation on screen navigation
- `useEffect` cleanup function in `ChatDetailScreen` invalidates `['conversations']` query
- `useSendMessage` mutation invalidates queries on success
- `useChatMessages` marks messages as read when conversation is viewed

This ensures users always see current information without manual refresh.

## RTL (Hebrew) Labels

All chat-related UI uses right-to-left Hebrew text:

| State | Label (Hebrew) | Label (English) |
|-------|----------------|-----------------|
| Conversation exists | חזרה לצ'אט | Return to chat |
| No conversation | שלח הודעה | Send message |
| Generic message | הודעה | Message |

**Icon Placement (RTL):**
- Icons should appear on the **LEFT** side of text (opposite of LTR)
- Example: `<MessageCircle className="h-4 w-4" />` then text

## Database Schema

### `chat_conversations` Table

Key fields:
- `id`: UUID (primary key)
- `participant_1_id`: UUID (first participant)
- `participant_2_id`: UUID (second participant)
- `vehicle_id`: UUID (nullable, links to vehicle)
- `auction_id`: UUID (nullable, links to auction)
- `iso_request_id`: UUID (nullable, links to ISO request)
- Exactly one of vehicle_id, auction_id, iso_request_id must be non-null

**Uniqueness Query Pattern:**
```sql
SELECT id FROM chat_conversations
WHERE (vehicle_id = ? OR auction_id = ? OR iso_request_id = ?)
  AND (
    (participant_1_id = currentUser AND participant_2_id = otherUser) OR
    (participant_1_id = otherUser AND participant_2_id = currentUser)
  )
```

### `chat_messages` Table

Key fields:
- `id`: UUID (primary key)
- `conversation_id`: UUID (foreign key to chat_conversations)
- `sender_id`: UUID (sender)
- `message_content`: TEXT
- `message_type`: 'text' | 'image' | 'voice' | 'system'
- `is_read`: BOOLEAN
- `created_at`: TIMESTAMP

## Last Message Retrieval

The chat list displays the most recent message for each conversation.

**Implementation Details**:
- Latest message is fetched separately per conversation using:
  - Order by `created_at DESC`
  - Limit to 1 message
  - Includes `sender_id` for prefix determination
- Conversations are sorted by `last_message_at` timestamp
- Database trigger ensures `last_message_at` updates on new messages
- All queries are parallelized using `Promise.all()` for optimal performance

**Caching Strategy**:
- Conversations list is cached with React Query
- Cache invalidates when:
  - User sends a message (immediate update)
  - User views a chat (marks messages as read, triggers update)
  - User navigates back from chat detail (cleanup effect)
- Real-time subscription updates messages within open chat

## Real-time Updates

Conversations use Supabase real-time subscriptions to automatically update:

```typescript
const channel = dealerClient
  .channel(`chat-messages-${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'chat_messages',
    filter: `conversation_id=eq.${conversationId}`
  }, () => {
    queryClient.invalidateQueries(['chat-messages', conversationId]);
  })
  .subscribe();
```

**What updates automatically**:
- New messages appear immediately in open conversations
- Message read status updates
- Chat list reflects latest messages and unread counts without manual refresh
- Unread counts update immediately when opening a conversation

## Common Patterns & Best Practices

### ✅ DO

1. **Always use `dealerClient`** for all chat operations
2. **Check for existing conversations** before creating new ones
3. **Use the Set-based approach** for list screens with multiple items
4. **Set dynamic button labels** based on conversation state
5. **Navigate directly** when conversation exists
6. **Use Hebrew RTL labels** with icons on the left

### ❌ DON'T

1. **Don't mix `supabase` and `dealerClient`** - causes RLS issues
2. **Don't create duplicate conversations** - always check first
3. **Don't make N queries for N items** - use Set-based O(1) lookups
4. **Don't hardcode button labels** - make them dynamic
5. **Don't use LTR patterns** - this is an RTL application

## Troubleshooting

### "Conversation not found" error
**Cause:** Mismatch between client used to create vs. read conversation  
**Fix:** Ensure all hooks use `dealerClient` (not `supabase`)

### Duplicate conversations created
**Cause:** Not checking for existing conversation before creating  
**Fix:** Use `findConversationIdForEntity()` or `useConversationForEntity()` first

### Performance issues in lists
**Cause:** Making a separate query for each list item  
**Fix:** Use `useConversations()` + Set-based lookups (O(1) per item)

### Wrong button label displayed
**Cause:** Not checking conversation state or hardcoding label  
**Fix:** Use the conversation detection patterns documented above

## Testing Checklist

- [ ] VehicleDetailScreen: Label changes correctly; navigation works for both states
- [ ] AuctionDetailScreen: Same as above
- [ ] BidsScreen: Labels correct for all auction cards; no performance lag
- [ ] CarSearchScreen: Labels correct for all vehicle cards; no performance lag
- [ ] HotCarsScreen: Labels correct for all boosted vehicle cards
- [ ] ChatDetailScreen: Route param works; messages load; send/receive works
- [ ] Real-time updates: New messages appear without refresh
- [ ] No duplicate conversations: Clicking multiple times doesn't create duplicates
- [ ] Unread badge: Updates correctly in header
