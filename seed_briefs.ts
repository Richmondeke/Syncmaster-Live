import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create client with the service_role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const producer_id = "f44d1e7d-07e8-43e1-944b-6dcd6b41a2e9";
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
