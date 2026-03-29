# e-Certificate Verification

## Current State
Admin page requires `#admin` role to create/update/list certificates. The authorization system requires users to call `_initializeAccessControlWithSecret` with a secret token to become admin. This token is never surfaced in the UI, so logged-in users can never gain admin access -- all save/list calls fail with authorization errors.

## Requested Changes (Diff)

### Add
- Auto-registration: when any authenticated user calls a backend function, register them if not already registered
- Admin page: after login, call `_initializeAccessControlWithSecret` with empty string to auto-register and attempt to become admin
- Show clear error in admin page if user is not admin

### Modify
- Backend: simplify authorization -- any authenticated (non-anonymous) caller can create/update/list certificates (remove the admin-role gate since this is a single-admin portal and the token mechanism blocks access)
- Backend `getCertificate` stays public (no auth)

### Remove
- Admin role requirement for certificate CRUD operations

## Implementation Plan
1. Modify `main.mo` to check only that caller is not anonymous for certificate operations
2. Keep `listCertificates`, `createCertificate`, `updateCertificate` gated on non-anonymous (not admin role)
3. No frontend changes needed -- the existing form and save logic works once auth is unblocked
