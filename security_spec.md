# Security Specification - Lore & Leo Wedding RSVP

## Data Invariants
- An RSVP must have a valid `eventId` and `clientId`.
- The `infantName`, `responsibleAdult`, and `phone` fields must be non-empty strings.
- `guests` must be a non-negative number.
- `createdAt` must be a valid server timestamp.

## The "Dirty Dozen" Payloads (Deny List)
1. **Empty Name**: `{ "infantName": "", ... }` -> Should be rejected (size check).
2. **Missing Required Field**: Missing `clientId`.
3. **Invalid Data Type**: `guests` as a string.
4. **Huge String**: `comments` exceeding 1000 characters.
5. **Malicious ID**: `eventId` containing path traversal or script tags.
6. **Self-Assigned Admin**: Attempting to write to a collection that doesn't exist or is restricted.
7. **Identity Spoofing**: Trying to delete someone else's RSVP (if we had auth, but here it's public submission).
8. **Resource Poisoning**: Document ID exceeding limits.
9. **Future Timestamp**: `createdAt` set to a future date by client.
10. **State Shortcut**: Not applicable for this simple creation.
11. **PII Leak**: Unauthorized read of all RSVPs.
12. **Ghost Field**: Adding `isVerified: true` to the payload.

## Test Runner
The `firestore.rules.test.ts` will verify these denials.
