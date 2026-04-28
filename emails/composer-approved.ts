export function composerApprovedEmail(composerName: string, dashboardUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application approved — SyncMaster</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;padding:40px 40px 32px;">
          <tr>
            <td>
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">SyncMaster</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;">You're in.</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">Hi ${composerName},</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">
                Your SyncMaster application has been approved. Welcome to the network.
              </p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#374151;">
                When we have a brief that matches your style, we'll send you an invite. Keep an eye on your inbox.
              </p>
              <a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
                Go to your dashboard
              </a>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 24px;" />
              <p style="margin:0;font-size:13px;color:#9ca3af;">SyncMaster &mdash; African composers, global briefs.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
