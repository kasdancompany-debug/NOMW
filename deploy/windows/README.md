# Windows kiosk scripts

Used with [DEPLOYMENT.md](../../DEPLOYMENT.md).

Typical floor layout after copy:

```text
C:\Museum\nomow\          ← standalone Node app (server.js)
C:\Museum\scripts\        ← this folder’s contents
  Start-NomowServer.cmd
  stations\launch-*.cmd
  …
```

Set `STAFF_PIN`, `HOSTNAME`, `PORT`, and (Option B displays) `NOMOW_BASE_URL` in Scheduled Task environment or System Environment Variables.
