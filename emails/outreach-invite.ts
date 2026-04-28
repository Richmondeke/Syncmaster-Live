export function outreachInviteEmail(composerName: string, briefTitle: string, dashboardUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You've been invited — SyncMaster</title>
</head>
<body style="margin:0;padding:0;background:#fafafa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 24px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;padding:40px 40px 32px;">
          <tr>
            <td>
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">SyncMaster</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#111827;">You've been invited to a brief</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">Hi ${composerName},</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#374151;">
                Our team thinks you'd be a great fit for the following brief:
              </p>
              <div style="margin:0 0 24px;padding:16px 20px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb;">
                <p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${briefTitle}</p>
              </div>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:#374151;">
                Log in to review the brief details and let us know if you'd like to submit tracks. You can submit up to 3 tracks with a creative note.
              </p>
              <a href="${dashboardUrl}" style="display:inline-block;padding:12px 24px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
                View brief
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
