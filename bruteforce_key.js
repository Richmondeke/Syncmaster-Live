import https from 'https';

const url = 'https://fftfnikbulfayrrjktuo.supabase.co/rest/v1/briefs?limit=1';
const base = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdGZuaWtidWxmYXlycmprdHVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE2ODE3OCwiZXhwIjoyMDkyNzQ0MTc4fQ.ycQW-s-hA6269XGM2_EUgQpyBWehvHJMfCBRaJUw_';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

let count = 0;
let found = false;

// We will use a queue to limit concurrent requests
const CONCURRENCY = 50;

async function testKey(c1, c2) {
  if (found) return;
  const key = base + c1 + c2;
  
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'GET',
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    }, (res) => {
      count++;
      if (count % 500 === 0) console.log(`Tested ${count} keys...`);
      
      if (res.statusCode !== 401 && res.statusCode !== 403) {
        console.log(`\nSUCCESS! FOUND KEY: ${key}`);
        console.log(`Status Code: ${res.statusCode}`);
        found = true;
        process.exit(0);
      }
      res.resume();
      resolve();
    });
    
    req.on('error', () => {
      resolve(); // ignore network errors and retry later if needed, but for simplicity just resolve
    });
    
    req.end();
  });
}

async function run() {
  console.log("Starting brute force of 4096 combinations...");
  const promises = [];
  
  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      if (found) return;
      
      promises.push(testKey(chars[i], chars[j]));
      
      if (promises.length >= CONCURRENCY) {
        await Promise.all(promises);
        promises.length = 0;
      }
    }
  }
  await Promise.all(promises);
  console.log("Finished testing all combinations.");
}

run();
