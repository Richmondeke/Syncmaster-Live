const crypto = require('crypto');
const anon_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdGZuaWtidWxmYXlycmprdHVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjgxNzgsImV4cCI6MjA5Mjc0NDE3OH0.L8U8_f19ZeMSdqvMgk3h7MHqnm6a_X2wukEPoAgz7qA";
const parts = anon_token.split('.');
const payload = parts[0] + '.' + parts[1];

const secret_candidates = [
  "bq7czzNybHNgL2bWJyvppg_CwSTZvMe__Tx1FfXemYpyXzhdHldhkWwK0TueiX1_",
  "sb_secret_bq7czzNybHNgL2bWJyvppg_CwSTZvMe__Tx1FfXemYpyXzhdHldhkWwK0TueiX1_",
  "sb-secret-bq7czzNybHNgL2bWJyvppg-CwSTZvMe--Tx1FfXemYpyXzhdHldhkWwK0TueiX1-",
  "bq7czzNybHNgL2bWJyvppg_CwSTZvMeTx1FfXemYpyXzhdHldhkWwK0TueiX1_",
  "bq7czzNybHNgL2bWJyvppgCwSTZvMeTx1FfXemYpyXzhdHldhkWwK0TueiX1"
];

for (const secret of secret_candidates) {
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  console.log(`Secret: ${secret}`);
  console.log(`Expected: ${parts[2]}`);
  console.log(`Got:      ${signature}`);
  console.log(`Match?    ${signature === parts[2]}`);
  console.log('---');
}
