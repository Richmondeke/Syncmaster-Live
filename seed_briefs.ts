import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const accessToken = "eyJhbGciOiJFUzI1NiIsImtpZCI6IjY4MDUxN2QwLTJkN2UtNDQ0Yi04MGQ3LWZmMGUxMWJlMDk3YSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2ZmdGZuaWtidWxmYXlycmprdHVvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJmNGJmY2MwYy01ZDE0LTRlZTctYWYwYi02Njg5MGZmNjUyNTYiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc5MTQ4MTkxLCJpYXQiOjE3NzkxNDQ1OTEsImVtYWlsIjoic29waGlhMkBzeW5jbWFzdGVyLmlvIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJlbWFpbCI6InNvcGhpYTJAc3luY21hc3Rlci5pbyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmdWxsX25hbWUiOiJTb3BoaWEiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInJvbGUiOiJwcm9kdWNlciIsInN1YiI6ImY0YmZjYzBjLTVkMTQtNGVlNy1hZjBiLTY2ODkwZmY2NTI1NiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzc5MTQ0NTkxfV0sInNlc3Npb25faWQiOiJjOTY0M2UxNC1hOWY4LTQ1ZTEtODQ5NC0yNTFhNmJmNTNjYzEiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.A05VNsIuovpc7YMtVWmmP3KanrPO4jD2nDtFsA5DGOq47dJPhRmpuO-mooiVYlgX6A5-bC7e5h0b7dotbRDhPg";

// Create client with the access token injected so it bypasses RLS
const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  },
});

async function main() {
  const producer_id = "f4bfcc0c-5d14-4ee7-af0b-66890ff65256";
  const now = new Date();
  
  const briefs = [
    {
      producer_id,
      title: "Energetic Afrobeat for Global Sports Brand",
      description: "Looking for high-energy Afrobeat tracks with heavy percussion, driving basslines, and brass stabs for a new sports commercial. Think Burna Boy meets intense athletic visuals. The mood should be victorious, fast-paced, and motivational.",
      genres: ["Afrobeat", "Afropop", "Dance"],
      budget_min: 8000,
      budget_max: 20000,
      deadline: new Date(now.getTime() + 14 * 86400000).toISOString(),
      status: "active"
    },
    {
      producer_id,
      title: "Chill Afro-Fusion for Luxury Lifestyle Ad",
      description: "We need smooth, mid-tempo Afro-fusion tracks featuring mellow saxophone, soft synths, and laid-back percussion. The mood is sophisticated, relaxing, and affluent, suitable for a luxury resort campaign.",
      genres: ["Afro-Fusion", "R&B", "Chillwave"],
      budget_min: 5000,
      budget_max: 12000,
      deadline: new Date(now.getTime() + 21 * 86400000).toISOString(),
      status: "active"
    },
    {
      producer_id,
      title: "Dark Amapiano for Urban Thriller Film",
      description: "Seeking gritty, suspenseful Amapiano tracks with heavy log drums, minimal vocals, and dark atmospheric synths. This is for a chase sequence in an upcoming urban thriller. Mood: tense, urgent, underground.",
      genres: ["Amapiano", "Electronic", "Cinematic"],
      budget_min: 10000,
      budget_max: 25000,
      deadline: new Date(now.getTime() + 7 * 86400000).toISOString(),
      status: "active"
    }
  ];

  const { data, error } = await supabase.from('briefs').insert(briefs).select();
  
  if (error) {
    console.error("Error inserting briefs:", error);
  } else {
    console.log("Successfully inserted briefs:", data);
  }
}

main();
