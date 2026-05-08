# Backend Connection

v0.5 backend connection UX includes:
- connection card
- runtime settings panel
- live-mode guide
- capability discovery panel

States:
- Mock workspace
- API connected
- API fallback

Backend is optional. Fallback behavior remains visible and safe.

## v0.9 clarity

- topbar keeps only core runtime/backend/model/language indicators
- backend summary stays compact in right context panel
- backend capabilities are collapsed by default (expand on demand)
- runtime settings are collapsed by default to reduce first-screen noise
- backend unavailability always shows explicit fallback-safe copy

## v1.0 candidate

- backend card focuses on three clear user states: connected, fallback, unavailable
- capability list remains compact and secondary (collapsible)
- live backend guide stays available but does not dominate first-screen UX
