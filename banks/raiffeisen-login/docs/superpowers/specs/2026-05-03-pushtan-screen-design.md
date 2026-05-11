# pushTAN screen + success screen — design

Educational frontend project. Adds a second step to the existing Raiffeisen-style login: a pushTAN confirmation screen with countdown timer and Vergleichswert, followed by a success screen.

## Flow

1. User fills login (`/`), clicks `Weiter`.
2. App navigates to `/pushtan?user=<verfueger>`. Login form values are persisted to `sessionStorage` so they survive a back navigation.
3. `/pushtan` shows: header (back arrow + avatar + entered Verfügernummer), yellow countdown ring (5:00), instruction text, hardcoded Vergleichswert `LRQ2`, input (4–6 chars), `Bestätigen` button.
4. Timer ticks down. At `0:00`: ring is replaced by a `Code erneut senden` button; input + `Bestätigen` are disabled. Resend resets timer to 5:00 and re-enables the form.
5. `Bestätigen` (enabled when input length ∈ [4, 6]) → `POST /api/pushtan/confirm` (placeholder, TODO comment for real backend) → `router.push('/success')`.
6. `/success`: green checkmark, `Sie wurden erfolgreich angemeldet.`, link `Zurück zum Login` → `/`.
7. Back arrow on `/pushtan` → `router.push('/')`. Login restores fields from `sessionStorage`.

## Files

```
src/app/pushtan/page.tsx        — async server component; awaits searchParams; redirects to / if user missing; renders <PushTanCard user={user} />
src/app/success/page.tsx        — server component, static success UI
src/components/PushTanCard.tsx  — client; timer + form + submit
src/components/CountdownRing.tsx — client; encapsulates 5:00 countdown + resend swap
src/components/PushTanHeader.tsx — back arrow, avatar circle, displayed username, language switch
src/app/globals.css             — add .raf-countdown-ring, .raf-back-btn
src/components/LoginCard.tsx    — extend: hydrate from sessionStorage, persist on change, navigate to /pushtan on submit
```

## Architecture decisions

- **Routing.** Separate routes (`/pushtan`, `/success`) instead of state on `/`. URL reflects step; aligns with App Router idioms.
- **Param transport.** `user` (Verfügernummer) is passed as URL search param to `/pushtan`. Server-side reading via `await searchParams` avoids the Suspense-boundary requirement that `useSearchParams` imposes on prerendered routes.
- **Login state preservation.** `sessionStorage` key `raf-login-state` (JSON: `{ bundesland, verfueger, pin, saveVerfueger }`). LoginCard hydrates on mount inside `useEffect`, persists on every state change. Cleared on real submit success (out of scope here).
- **Timer.** `useEffect` + `setInterval(..., 1000)` decrements seconds; cleanup on unmount/resend. Display `mm:ss` via `Math.floor(s/60)` and `s%60`. At 0, render swap is conditional on `seconds === 0`.
- **Submit stub.** Single `fetch('/api/pushtan/confirm', { method: 'POST', body: JSON.stringify({ user, code, vergleichswert: 'LRQ2' }) })` with `// TODO: connect real backend endpoint` comment. Errors are swallowed for now (still navigates to /success) — explicit choice for the educational scope.

## Edge cases

- Direct visit to `/pushtan` without `user` param → `redirect('/')` from server component.
- Timer reaches 0 → input + button disabled, ring replaced by resend button.
- Resend during countdown is impossible (button only renders at 0).
- Input is constrained: `maxLength=6`, `pattern="[A-Za-z0-9]+"`, `Bestätigen` disabled until `length >= 4`.
- Direct visit to `/success` is allowed (no guard) — reachable bookmark in educational context.

## Out of scope

- Real backend / real authentication.
- Internationalization (DE/EN switch is UI only, as in current code).
- Form validation beyond length + non-empty.
- `/api/pushtan/confirm` route handler — only client-side fetch stub.
