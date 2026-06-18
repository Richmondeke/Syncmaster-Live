// ─── Types ────────────────────────────────────────────────────────────────────

export type SyncMedia = {
  id: string
  title: string
  type: 'film' | 'tv' | 'game' | 'ad' | 'documentary'
  year: number
  posterUrl: string
  description: string
  genre: string[]
  totalSongs: number
}

export type SyncPlacement = {
  id: string
  mediaId: string
  artistName: string
  songTitle: string
  isAfricanArtist: boolean
  artistCountry: string | null
  genre: string
  sceneDescription: string | null
  spotifyUrl: string | null
  season: number | null
  episode: number | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const poster = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=fff&bold=true&size=300`

// ─── Media Catalogue ──────────────────────────────────────────────────────────

export const syncMedia: SyncMedia[] = [
  // ── Films ───────────────────────────────────────────────────────────────────
  {
    id: 'black-panther-wakanda-forever',
    title: 'Black Panther: Wakanda Forever',
    type: 'film',
    year: 2022,
    posterUrl: poster('Black Panther Wakanda Forever'),
    description: 'Marvel sequel featuring a soundtrack steeped in African and diasporic sounds, with major Afrobeats placements.',
    genre: ['Action', 'Sci-Fi', 'Drama'],
    totalSongs: 8,
  },
  {
    id: 'queen-and-slim',
    title: 'Queen & Slim',
    type: 'film',
    year: 2019,
    posterUrl: poster('Queen and Slim'),
    description: 'A modern Bonnie and Clyde story with a critically acclaimed soundtrack blending hip-hop, R&B, and Afrobeats.',
    genre: ['Drama', 'Romance', 'Thriller'],
    totalSongs: 8,
  },
  {
    id: 'spider-man-across-the-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'film',
    year: 2023,
    posterUrl: poster('Spider-Man Across the Spider-Verse'),
    description: 'Animated sequel with a Metro Boomin–curated soundtrack featuring top-tier hip-hop and global artists.',
    genre: ['Animation', 'Action', 'Sci-Fi'],
    totalSongs: 10,
  },
  {
    id: 'coming-2-america',
    title: 'Coming 2 America',
    type: 'film',
    year: 2021,
    posterUrl: poster('Coming 2 America'),
    description: 'Eddie Murphy sequel celebrating African culture with a soundtrack bridging Afrobeats, R&B, and hip-hop.',
    genre: ['Comedy', 'Drama'],
    totalSongs: 7,
  },
  {
    id: 'the-woman-king',
    title: 'The Woman King',
    type: 'film',
    year: 2022,
    posterUrl: poster('The Woman King'),
    description: 'Epic historical action film about the Agojie warriors of Dahomey, scored with powerful African and diasporic music.',
    genre: ['Action', 'Drama', 'Historical'],
    totalSongs: 5,
  },
  {
    id: 'f1-2025',
    title: 'F1',
    type: 'film',
    year: 2025,
    posterUrl: poster('F1'),
    description: 'Brad Pitt stars as a former driver returning to Formula One, with an adrenaline-fueled global soundtrack.',
    genre: ['Action', 'Drama', 'Sports'],
    totalSongs: 4,
  },
  {
    id: 'beasts-of-no-nation',
    title: 'Beasts of No Nation',
    type: 'film',
    year: 2015,
    posterUrl: poster('Beasts of No Nation'),
    description: 'Cary Fukunaga\'s harrowing war drama set in West Africa, scored with Fela Kuti\'s Afrobeat and original compositions.',
    genre: ['Drama', 'War'],
    totalSongs: 3,
  },
  {
    id: 'pacific-rim-uprising',
    title: 'Pacific Rim: Uprising',
    type: 'film',
    year: 2018,
    posterUrl: poster('Pacific Rim Uprising'),
    description: 'Sci-fi action sequel with a soundtrack blending orchestral score and contemporary global pop.',
    genre: ['Action', 'Sci-Fi'],
    totalSongs: 2,
  },

  // ── TV Shows ────────────────────────────────────────────────────────────────
  {
    id: 'insecure',
    title: 'Insecure',
    type: 'tv',
    year: 2016,
    posterUrl: poster('Insecure'),
    description: 'Issa Rae\'s groundbreaking HBO series, renowned for breaking emerging R&B, hip-hop, and Afrobeats talent.',
    genre: ['Comedy', 'Drama'],
    totalSongs: 12,
  },
  {
    id: 'queen-sono',
    title: 'Queen Sono',
    type: 'tv',
    year: 2020,
    posterUrl: poster('Queen Sono'),
    description: 'Netflix\'s first African original series — a South African spy thriller with a pan-African soundtrack.',
    genre: ['Action', 'Thriller', 'Drama'],
    totalSongs: 8,
  },
  {
    id: 'everything-now',
    title: 'Everything Now',
    type: 'tv',
    year: 2023,
    posterUrl: poster('Everything Now'),
    description: 'Netflix coming-of-age drama set in London with a Gen-Z curated pop, electronic, and Afrobeats soundtrack.',
    genre: ['Drama', 'Comedy', 'Coming-of-Age'],
    totalSongs: 6,
  },
  {
    id: 'euphoria',
    title: 'Euphoria',
    type: 'tv',
    year: 2019,
    posterUrl: poster('Euphoria'),
    description: 'HBO\'s visually stunning teen drama with an iconic Labrinth-led score and eclectic needle-drops.',
    genre: ['Drama', 'Teen'],
    totalSongs: 10,
  },
  {
    id: 'blood-and-water',
    title: 'Blood & Water',
    type: 'tv',
    year: 2020,
    posterUrl: poster('Blood and Water'),
    description: 'Netflix South African teen mystery series featuring the country\'s top amapiano, hip-hop, and R&B talent.',
    genre: ['Drama', 'Mystery', 'Teen'],
    totalSongs: 8,
  },

  // ── Games ───────────────────────────────────────────────────────────────────
  {
    id: 'ea-fc-25',
    title: 'EA FC 25',
    type: 'game',
    year: 2024,
    posterUrl: poster('EA FC 25'),
    description: 'The latest EA football title, continuing the franchise\'s legacy of diverse, globally curated soundtracks.',
    genre: ['Sports', 'Simulation'],
    totalSongs: 22,
  },
  {
    id: 'nba-2k25',
    title: 'NBA 2K25',
    type: 'game',
    year: 2024,
    posterUrl: poster('NBA 2K25'),
    description: '2K\'s premier basketball sim with a hip-hop-heavy soundtrack curated with major label partnerships.',
    genre: ['Sports', 'Simulation'],
    totalSongs: 12,
  },
  {
    id: 'fifa-23',
    title: 'FIFA 23',
    type: 'game',
    year: 2022,
    posterUrl: poster('FIFA 23'),
    description: 'The final FIFA-branded EA football game, featuring breakout Afrobeats tracks alongside global indie and pop.',
    genre: ['Sports', 'Simulation'],
    totalSongs: 10,
  },
  {
    id: 'gta-v',
    title: 'Grand Theft Auto V',
    type: 'game',
    year: 2013,
    posterUrl: poster('Grand Theft Auto V'),
    description: 'Rockstar\'s open-world masterpiece featuring a massive in-game radio system with hundreds of licensed tracks.',
    genre: ['Action', 'Open World'],
    totalSongs: 12,
  },

  // ── Ads ─────────────────────────────────────────────────────────────────────
  {
    id: 'apple-airpods-pro-2023',
    title: 'Apple AirPods Pro',
    type: 'ad',
    year: 2023,
    posterUrl: poster('Apple AirPods Pro'),
    description: 'Apple\'s spatial audio campaign showcasing immersive sound through Afrobeats and global pop.',
    genre: ['Technology', 'Audio'],
    totalSongs: 2,
  },
  {
    id: 'pepsi-super-bowl-2022',
    title: 'Pepsi Super Bowl Halftime Show',
    type: 'ad',
    year: 2022,
    posterUrl: poster('Pepsi Super Bowl Halftime'),
    description: 'The iconic Super Bowl LVI halftime show featuring hip-hop legends, backed by Pepsi.',
    genre: ['Beverage', 'Entertainment'],
    totalSongs: 5,
  },
]

// ─── Placements ───────────────────────────────────────────────────────────────

export const syncPlacements: SyncPlacement[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Black Panther: Wakanda Forever (8)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bp-001', mediaId: 'black-panther-wakanda-forever', artistName: 'Tems', songTitle: 'No Woman, No Cry',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro-Soul', sceneDescription: 'Opening funeral tribute sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-002', mediaId: 'black-panther-wakanda-forever', artistName: 'Burna Boy', songTitle: 'Alone',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Underwater Talokan kingdom reveal', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-003', mediaId: 'black-panther-wakanda-forever', artistName: 'Rihanna ft. Tems', songTitle: 'Lift Me Up',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop Ballad', sceneDescription: 'Closing emotional climax and end credits', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-004', mediaId: 'black-panther-wakanda-forever', artistName: 'Tobe Nwigwe', songTitle: 'They Want It, But No',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Wakandan training montage', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-005', mediaId: 'black-panther-wakanda-forever', artistName: 'Snow Tha Product & E-40', songTitle: 'Coming for You',
    isAfricanArtist: false, artistCountry: null, genre: 'Latin Hip-Hop', sceneDescription: 'Namor backstory flashback', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-006', mediaId: 'black-panther-wakanda-forever', artistName: 'Stormzy', songTitle: 'Closure',
    isAfricanArtist: false, artistCountry: null, genre: 'Grime', sceneDescription: 'Shuri lab sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-007', mediaId: 'black-panther-wakanda-forever', artistName: 'Fireboy DML', songTitle: 'Coming Back for You',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afropop', sceneDescription: 'Mid-credits scene', spotifyUrl: null, season: null, episode: null },
  { id: 'bp-008', mediaId: 'black-panther-wakanda-forever', artistName: 'Future ft. Tems', songTitle: 'All My Life',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Afro-R&B', sceneDescription: 'End credits playlist', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Queen & Slim (8)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'qs-001', mediaId: 'queen-and-slim', artistName: 'Burna Boy', songTitle: 'My Money My Baby',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Gas station road scene', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-002', mediaId: 'queen-and-slim', artistName: 'Lauryn Hill', songTitle: 'Ex-Factor',
    isAfricanArtist: false, artistCountry: null, genre: 'Neo-Soul', sceneDescription: 'Diner first-date opening', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-003', mediaId: 'queen-and-slim', artistName: 'Megan Thee Stallion', songTitle: 'Realer',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Juke-joint dance scene', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-004', mediaId: 'queen-and-slim', artistName: 'Lil Baby', songTitle: 'Catch the Sun',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Highway driving montage', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-005', mediaId: 'queen-and-slim', artistName: '6LACK', songTitle: 'ATL Freestyle',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B / Hip-Hop', sceneDescription: 'Atlanta underground scene', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-006', mediaId: 'queen-and-slim', artistName: 'Vince Staples', songTitle: 'Yo Love',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Motel hideout sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-007', mediaId: 'queen-and-slim', artistName: 'Blood Orange', songTitle: 'Hope',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie R&B', sceneDescription: 'Reflective car ride', spotifyUrl: null, season: null, episode: null },
  { id: 'qs-008', mediaId: 'queen-and-slim', artistName: 'Tiana Major9 & EarthGang', songTitle: 'Collide',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B / Hip-Hop', sceneDescription: 'Climactic escape scene', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Spider-Man: Across the Spider-Verse (10)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'sv-001', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Metro Boomin ft. Swae Lee, NAV & A Boogie Wit da Hoodie', songTitle: 'Calling',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Miles Morales Brooklyn intro', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-002', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Metro Boomin & Future', songTitle: 'Across the Spider-Verse',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Multiverse portal sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-003', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Metro Boomin ft. A$AP Rocky & Roisee', songTitle: 'Am I Dreaming',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Dream Pop', sceneDescription: 'Gwen Stacy emotional climax', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-004', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Metro Boomin & Don Toliver', songTitle: 'Superhero (Heroes & Villains)',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Spider-Man 2099 chase', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-005', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Coi Leray', songTitle: 'Self',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop Rap', sceneDescription: 'Spider-Gwen dimension transition', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-006', mediaId: 'spider-man-across-the-spider-verse', artistName: '21 Savage & Metro Boomin', songTitle: 'Annihilate',
    isAfricanArtist: false, artistCountry: null, genre: 'Trap', sceneDescription: 'Vulture fight sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-007', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Metro Boomin ft. Offset & JID', songTitle: 'Danger',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Spider Society reveal', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-008', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Metro Boomin ft. Lil Uzi Vert', songTitle: 'All the Way Live',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Mumbattan dimension sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-009', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Wizkid', songTitle: 'Link Up',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'End credits international segment', spotifyUrl: null, season: null, episode: null },
  { id: 'sv-010', mediaId: 'spider-man-across-the-spider-verse', artistName: 'Daniel Caesar & Metro Boomin', songTitle: 'Cellar Door',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Miles and Gwen rooftop scene', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Coming 2 America (7)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'c2a-001', mediaId: 'coming-2-america', artistName: 'John Legend & Burna Boy', songTitle: 'Coming 2 America',
    isAfricanArtist: false, artistCountry: null, genre: 'Afrobeats / Soul', sceneDescription: 'Opening Zamunda celebration', spotifyUrl: null, season: null, episode: null },
  { id: 'c2a-002', mediaId: 'coming-2-america', artistName: 'Davido', songTitle: 'Assurance',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afropop', sceneDescription: 'Royal palace party scene', spotifyUrl: null, season: null, episode: null },
  { id: 'c2a-003', mediaId: 'coming-2-america', artistName: 'Bobby Sessions ft. Megan Thee Stallion', songTitle: 'I\'m a King',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Lavelle proving-himself montage', spotifyUrl: null, season: null, episode: null },
  { id: 'c2a-004', mediaId: 'coming-2-america', artistName: 'Tiwa Savage', songTitle: 'Keys to the Kingdom',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afropop', sceneDescription: 'Zamunda market scene', spotifyUrl: null, season: null, episode: null },
  { id: 'c2a-005', mediaId: 'coming-2-america', artistName: 'Teyana Taylor', songTitle: 'Gonna Love Me',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Queens barbershop sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'c2a-006', mediaId: 'coming-2-america', artistName: 'Salt-N-Pepa', songTitle: 'Push It',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Throwback New York montage', spotifyUrl: null, season: null, episode: null },
  { id: 'c2a-007', mediaId: 'coming-2-america', artistName: 'Burna Boy', songTitle: 'City Boys',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'End credits', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: The Woman King (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'twk-001', mediaId: 'the-woman-king', artistName: 'Angélique Kidjo', songTitle: 'Agolo',
    isAfricanArtist: true, artistCountry: 'Benin', genre: 'World / Afropop', sceneDescription: 'Dahomey opening ceremony', spotifyUrl: null, season: null, episode: null },
  { id: 'twk-002', mediaId: 'the-woman-king', artistName: 'Lila Iké', songTitle: 'Where I\'m Coming From',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae / Soul', sceneDescription: 'Nawi\'s village departure', spotifyUrl: null, season: null, episode: null },
  { id: 'twk-003', mediaId: 'the-woman-king', artistName: 'Moonchild Sanelly', songTitle: 'Yebo Teacher',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Gqom', sceneDescription: 'Warrior training sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'twk-004', mediaId: 'the-woman-king', artistName: 'Jessy Wilson', songTitle: 'Keep Rising',
    isAfricanArtist: false, artistCountry: null, genre: 'Soul / Pop', sceneDescription: 'End credits anthem', spotifyUrl: null, season: null, episode: null },
  { id: 'twk-005', mediaId: 'the-woman-king', artistName: 'Fatoumata Diawara', songTitle: 'Sowa',
    isAfricanArtist: true, artistCountry: 'Mali', genre: 'Afro-Folk', sceneDescription: 'River crossing ceremony', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: F1 (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'f1-001', mediaId: 'f1-2025', artistName: 'Burna Boy', songTitle: 'Champion',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Race-day montage', spotifyUrl: null, season: null, episode: null },
  { id: 'f1-002', mediaId: 'f1-2025', artistName: 'The Prodigy', songTitle: 'Firestarter',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic', sceneDescription: 'Pit-stop intensity sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'f1-003', mediaId: 'f1-2025', artistName: 'Flume', songTitle: 'Say Nothing',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic', sceneDescription: 'Pre-race preparation', spotifyUrl: null, season: null, episode: null },
  { id: 'f1-004', mediaId: 'f1-2025', artistName: 'Lana Del Rey', songTitle: 'Say Yes to Heaven',
    isAfricanArtist: false, artistCountry: null, genre: 'Dream Pop', sceneDescription: 'Monaco Grand Prix establishing shot', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Beasts of No Nation (3)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bon-001', mediaId: 'beasts-of-no-nation', artistName: 'Fela Kuti', songTitle: 'Water No Get Enemy',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeat', sceneDescription: 'Opening village scene establishing West Africa', spotifyUrl: null, season: null, episode: null },
  { id: 'bon-002', mediaId: 'beasts-of-no-nation', artistName: 'Fela Kuti', songTitle: 'Zombie',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeat', sceneDescription: 'Commandant\'s rebel army march', spotifyUrl: null, season: null, episode: null },
  { id: 'bon-003', mediaId: 'beasts-of-no-nation', artistName: 'Fela Kuti', songTitle: 'Sorrow Tears and Blood',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeat', sceneDescription: 'Aftermath destruction montage', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Pacific Rim: Uprising (2)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'pru-001', mediaId: 'pacific-rim-uprising', artistName: 'Wizkid', songTitle: 'Daddy Yo',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Jake Pentecost party scene', spotifyUrl: null, season: null, episode: null },
  { id: 'pru-002', mediaId: 'pacific-rim-uprising', artistName: 'Tupac', songTitle: 'Untouchable',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Jaeger pilot training montage', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Insecure (12)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'ins-001', mediaId: 'insecure', artistName: 'Asa', songTitle: 'Jailer',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro-Soul', sceneDescription: 'Mirror rap opening', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'ins-002', mediaId: 'insecure', artistName: 'SZA', songTitle: 'The Weekend',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Issa and Lawrence argument', spotifyUrl: null, season: 2, episode: 3 },
  { id: 'ins-003', mediaId: 'insecure', artistName: 'Kali Uchis', songTitle: 'After the Storm',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B / Soul', sceneDescription: 'Girls brunch scene', spotifyUrl: null, season: 2, episode: 5 },
  { id: 'ins-004', mediaId: 'insecure', artistName: 'Daniel Caesar', songTitle: 'Best Part',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Date night sequence', spotifyUrl: null, season: 2, episode: 7 },
  { id: 'ins-005', mediaId: 'insecure', artistName: 'Thundercat', songTitle: 'Them Changes',
    isAfricanArtist: false, artistCountry: null, genre: 'Neo-Soul / Funk', sceneDescription: 'Block party scene', spotifyUrl: null, season: 1, episode: 8 },
  { id: 'ins-006', mediaId: 'insecure', artistName: 'Noname', songTitle: 'Diddy Bop',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Issa at the salon', spotifyUrl: null, season: 1, episode: 4 },
  { id: 'ins-007', mediaId: 'insecure', artistName: 'Bryson Tiller', songTitle: 'Exchange',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Breakup aftermath', spotifyUrl: null, season: 1, episode: 6 },
  { id: 'ins-008', mediaId: 'insecure', artistName: 'Frank Ocean', songTitle: 'Self Control',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Late night reflection', spotifyUrl: null, season: 2, episode: 8 },
  { id: 'ins-009', mediaId: 'insecure', artistName: 'GoldLink', songTitle: 'Crew',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'House party dance floor', spotifyUrl: null, season: 2, episode: 2 },
  { id: 'ins-010', mediaId: 'insecure', artistName: 'Smino', songTitle: 'Anita',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / R&B', sceneDescription: 'Pregame getting-ready montage', spotifyUrl: null, season: 3, episode: 1 },
  { id: 'ins-011', mediaId: 'insecure', artistName: 'Ravyn Lenae', songTitle: 'Closer',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'Molly\'s therapy scene', spotifyUrl: null, season: 3, episode: 4 },
  { id: 'ins-012', mediaId: 'insecure', artistName: 'Tems', songTitle: 'Free Mind',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro-R&B', sceneDescription: 'Season finale closing montage', spotifyUrl: null, season: 5, episode: 10 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Queen Sono (8)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'qso-001', mediaId: 'queen-sono', artistName: 'Yemi Alade', songTitle: 'Johnny',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afropop', sceneDescription: 'Johannesburg club infiltration', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'qso-002', mediaId: 'queen-sono', artistName: 'Sauti Sol', songTitle: 'Suzanna',
    isAfricanArtist: true, artistCountry: 'Kenya', genre: 'Afro-Soul', sceneDescription: 'Nairobi safe-house scene', spotifyUrl: null, season: 1, episode: 3 },
  { id: 'qso-003', mediaId: 'queen-sono', artistName: 'Nasty C', songTitle: 'SMA',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'SA Hip-Hop', sceneDescription: 'Car chase through Soweto', spotifyUrl: null, season: 1, episode: 2 },
  { id: 'qso-004', mediaId: 'queen-sono', artistName: 'Sho Madjozi', songTitle: 'John Cena',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Gqom / Hip-Hop', sceneDescription: 'Queen\'s training montage', spotifyUrl: null, season: 1, episode: 4 },
  { id: 'qso-005', mediaId: 'queen-sono', artistName: 'Cassper Nyovest', songTitle: 'Tito Mboweni',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'SA Hip-Hop', sceneDescription: 'Underground fight scene', spotifyUrl: null, season: 1, episode: 5 },
  { id: 'qso-006', mediaId: 'queen-sono', artistName: 'Black Coffee ft. David Guetta', songTitle: 'Drive',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Afro House', sceneDescription: 'Nightclub surveillance operation', spotifyUrl: null, season: 1, episode: 2 },
  { id: 'qso-007', mediaId: 'queen-sono', artistName: 'AKA', songTitle: 'Fela in Versace',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'SA Hip-Hop', sceneDescription: 'Lavish villain party', spotifyUrl: null, season: 1, episode: 6 },
  { id: 'qso-008', mediaId: 'queen-sono', artistName: 'Sjava', songTitle: 'Umama',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Maskandi / R&B', sceneDescription: 'Emotional flashback to Queen\'s mother', spotifyUrl: null, season: 1, episode: 6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Everything Now (6)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'en-001', mediaId: 'everything-now', artistName: 'Omah Lay', songTitle: 'i\'m a mess',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro-Fusion', sceneDescription: 'House party scene', spotifyUrl: null, season: 1, episode: 3 },
  { id: 'en-002', mediaId: 'everything-now', artistName: 'PinkPantheress', songTitle: 'Boy\'s a liar Pt. 2',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Garage / Pop', sceneDescription: 'School hallway montage', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'en-003', mediaId: 'everything-now', artistName: 'Raye', songTitle: 'Escapism',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop / Dance', sceneDescription: 'Night out in London', spotifyUrl: null, season: 1, episode: 4 },
  { id: 'en-004', mediaId: 'everything-now', artistName: 'Central Cee', songTitle: 'Doja',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Drill', sceneDescription: 'Pre-party getting ready', spotifyUrl: null, season: 1, episode: 2 },
  { id: 'en-005', mediaId: 'everything-now', artistName: 'Wet Leg', songTitle: 'Chaise Longue',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Rock', sceneDescription: 'School talent show', spotifyUrl: null, season: 1, episode: 5 },
  { id: 'en-006', mediaId: 'everything-now', artistName: 'Arlo Parks', songTitle: 'Softly',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Pop', sceneDescription: 'Closing reflection', spotifyUrl: null, season: 1, episode: 7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Euphoria (10)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'eup-001', mediaId: 'euphoria', artistName: 'Labrinth', songTitle: 'All for Us',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt-Pop / Soul', sceneDescription: 'Rue\'s season 1 finale dance', spotifyUrl: null, season: 1, episode: 8 },
  { id: 'eup-002', mediaId: 'euphoria', artistName: 'Labrinth', songTitle: 'Still Don\'t Know My Name',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt-Pop', sceneDescription: 'Nate\'s identity crisis', spotifyUrl: null, season: 1, episode: 2 },
  { id: 'eup-003', mediaId: 'euphoria', artistName: 'Labrinth', songTitle: 'Forever',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic Soul', sceneDescription: 'Jules on the train', spotifyUrl: null, season: 1, episode: 4 },
  { id: 'eup-004', mediaId: 'euphoria', artistName: 'Labrinth', songTitle: 'Mount Everest',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic Soul', sceneDescription: 'Rue\'s euphoric high', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'eup-005', mediaId: 'euphoria', artistName: 'Zendaya & Labrinth', songTitle: 'I\'m Tired',
    isAfricanArtist: false, artistCountry: null, genre: 'Soul Ballad', sceneDescription: 'Church play performance', spotifyUrl: null, season: 2, episode: 4 },
  { id: 'eup-006', mediaId: 'euphoria', artistName: 'Labrinth', songTitle: 'Formula',
    isAfricanArtist: false, artistCountry: null, genre: 'Experimental Pop', sceneDescription: 'New Year\'s Eve party', spotifyUrl: null, season: 2, episode: 1 },
  { id: 'eup-007', mediaId: 'euphoria', artistName: 'Dominic Fike', songTitle: 'Elliot\'s Song',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Pop', sceneDescription: 'Elliot\'s guitar serenade to Rue', spotifyUrl: null, season: 2, episode: 8 },
  { id: 'eup-008', mediaId: 'euphoria', artistName: 'Billie Eilish', songTitle: 'you should see me in a crown',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt-Pop', sceneDescription: 'Maddy\'s Halloween entrance', spotifyUrl: null, season: 1, episode: 6 },
  { id: 'eup-009', mediaId: 'euphoria', artistName: 'Orville Peck', songTitle: 'Dead of Night',
    isAfricanArtist: false, artistCountry: null, genre: 'Country / Alt', sceneDescription: 'Fez and Ashtray cold open', spotifyUrl: null, season: 2, episode: 1 },
  { id: 'eup-010', mediaId: 'euphoria', artistName: 'BJ the Chicago Kid', songTitle: 'Falling',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B', sceneDescription: 'McKay\'s emotional breakdown', spotifyUrl: null, season: 1, episode: 5 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Blood & Water (8)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'baw-001', mediaId: 'blood-and-water', artistName: 'Nasty C', songTitle: 'There They Go',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'SA Hip-Hop', sceneDescription: 'Parkhurst College party', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'baw-002', mediaId: 'blood-and-water', artistName: 'Tellaman', songTitle: 'Whipped',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'R&B', sceneDescription: 'Puleng and KB first encounter', spotifyUrl: null, season: 1, episode: 2 },
  { id: 'baw-003', mediaId: 'blood-and-water', artistName: 'Sha Sha', songTitle: 'Tender Love',
    isAfricanArtist: true, artistCountry: 'Zimbabwe', genre: 'Amapiano / R&B', sceneDescription: 'Pool party scene', spotifyUrl: null, season: 1, episode: 3 },
  { id: 'baw-004', mediaId: 'blood-and-water', artistName: 'DJ Maphorisa & Kabza De Small', songTitle: 'Midnight Starring',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Amapiano', sceneDescription: 'Late-night house party', spotifyUrl: null, season: 2, episode: 1 },
  { id: 'baw-005', mediaId: 'blood-and-water', artistName: 'Sho Madjozi', songTitle: 'Huku',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Gqom / Pop', sceneDescription: 'School dance routine', spotifyUrl: null, season: 1, episode: 5 },
  { id: 'baw-006', mediaId: 'blood-and-water', artistName: 'Ami Faku', songTitle: 'Into Ingawe',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Afro-Soul', sceneDescription: 'Emotional revelation scene', spotifyUrl: null, season: 1, episode: 6 },
  { id: 'baw-007', mediaId: 'blood-and-water', artistName: 'Sun-El Musician', songTitle: 'Akanamali',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Afro House', sceneDescription: 'Season finale montage', spotifyUrl: null, season: 1, episode: 6 },
  { id: 'baw-008', mediaId: 'blood-and-water', artistName: 'A-Reece', songTitle: 'Meanwhile in Honeydew',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'SA Hip-Hop', sceneDescription: 'Wade\'s backstory reveal', spotifyUrl: null, season: 2, episode: 3 },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: EA FC 25 (22)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'eafc-001', mediaId: 'ea-fc-25', artistName: 'Billie Eilish', songTitle: 'CHIHIRO',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt-Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-002', mediaId: 'ea-fc-25', artistName: 'Charli xcx', songTitle: 'Sympathy is a knife',
    isAfricanArtist: false, artistCountry: null, genre: 'Hyperpop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-003', mediaId: 'ea-fc-25', artistName: 'Fred again..', songTitle: 'places to be',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-004', mediaId: 'ea-fc-25', artistName: 'Rema', songTitle: 'Yayo',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-005', mediaId: 'ea-fc-25', artistName: 'Shallipopi', songTitle: 'Cast',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Street-Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-006', mediaId: 'ea-fc-25', artistName: 'Moonchild Sanelly', songTitle: 'Cute',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Gqom / Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-007', mediaId: 'ea-fc-25', artistName: 'Disclosure', songTitle: 'She\'s Gone, Dance On',
    isAfricanArtist: false, artistCountry: null, genre: 'UK House', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-008', mediaId: 'ea-fc-25', artistName: 'Glass Animals', songTitle: 'Creatures in Heaven',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-009', mediaId: 'ea-fc-25', artistName: 'Fontaines D.C.', songTitle: 'Starburster',
    isAfricanArtist: false, artistCountry: null, genre: 'Post-Punk', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-010', mediaId: 'ea-fc-25', artistName: 'Justice & Tame Impala', songTitle: 'Neverender',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic / Psych', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-011', mediaId: 'ea-fc-25', artistName: 'Kasabian', songTitle: 'Coming Back to Me Good',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Rock', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-012', mediaId: 'ea-fc-25', artistName: 'Coldplay', songTitle: 'We Pray',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop Rock', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-013', mediaId: 'ea-fc-25', artistName: 'Ezra Collective', songTitle: 'Ego Killah',
    isAfricanArtist: false, artistCountry: null, genre: 'Jazz Fusion', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-014', mediaId: 'ea-fc-25', artistName: 'ODESZA', songTitle: 'Behind the Sun',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-015', mediaId: 'ea-fc-25', artistName: 'Confidence Man', songTitle: 'I Can\'t Lose You',
    isAfricanArtist: false, artistCountry: null, genre: 'Electro-Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-016', mediaId: 'ea-fc-25', artistName: 'Artemas', songTitle: 'I Like the Way You Kiss Me',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt-Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-017', mediaId: 'ea-fc-25', artistName: 'Bob Vylan', songTitle: 'Wicked and Bad',
    isAfricanArtist: false, artistCountry: null, genre: 'Punk / Grime', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-018', mediaId: 'ea-fc-25', artistName: 'Nathy Peluso', songTitle: 'Aprender a Amar',
    isAfricanArtist: false, artistCountry: null, genre: 'Latin Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-019', mediaId: 'ea-fc-25', artistName: 'Hinds', songTitle: 'Boom Boom Back',
    isAfricanArtist: false, artistCountry: null, genre: 'Garage Rock', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-020', mediaId: 'ea-fc-25', artistName: 'Amaarae', songTitle: 'Angels in Tibet',
    isAfricanArtist: true, artistCountry: 'Ghana', genre: 'Alté', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-021', mediaId: 'ea-fc-25', artistName: 'PinkPantheress', songTitle: 'Capable of Love',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Pop / Jungle', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'eafc-022', mediaId: 'ea-fc-25', artistName: 'Central Cee', songTitle: 'Band4Band',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Rap', sceneDescription: null, spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: NBA 2K25 (12)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'nba-001', mediaId: 'nba-2k25', artistName: 'Eminem', songTitle: 'Houdini',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-002', mediaId: 'nba-2k25', artistName: 'Ice Spice', songTitle: 'Think U the Shit (Fart)',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-003', mediaId: 'nba-2k25', artistName: 'Travis Scott', songTitle: 'FE!N',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Trap', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-004', mediaId: 'nba-2k25', artistName: 'Key Glock', songTitle: 'Ambition for Cash',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-005', mediaId: 'nba-2k25', artistName: 'Don Toliver', songTitle: 'BANDIT',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / R&B', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-006', mediaId: 'nba-2k25', artistName: 'Tommy Richman', songTitle: 'Million Dollar Baby',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop Rap', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-007', mediaId: 'nba-2k25', artistName: 'Doechii', songTitle: 'What It Is',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-008', mediaId: 'nba-2k25', artistName: 'Lil Baby', songTitle: 'Forever',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-009', mediaId: 'nba-2k25', artistName: 'ScHoolboy Q', songTitle: 'THank god 4 Me',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-010', mediaId: 'nba-2k25', artistName: 'GloRilla', songTitle: 'Yeah Glo!',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-011', mediaId: 'nba-2k25', artistName: 'Sexyy Red', songTitle: 'Get It Sexyy',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'nba-012', mediaId: 'nba-2k25', artistName: 'Gunna', songTitle: 'fukumean',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Trap', sceneDescription: null, spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: FIFA 23 (10)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'fifa-001', mediaId: 'fifa-23', artistName: 'Fireboy DML', songTitle: 'Peru',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afropop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-002', mediaId: 'fifa-23', artistName: 'Rema', songTitle: 'Calm Down',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-003', mediaId: 'fifa-23', artistName: 'Bad Bunny', songTitle: 'Tití Me Preguntó',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggaeton', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-004', mediaId: 'fifa-23', artistName: 'Rosalía', songTitle: 'DESPECHÁ',
    isAfricanArtist: false, artistCountry: null, genre: 'Latin Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-005', mediaId: 'fifa-23', artistName: 'Yeah Yeah Yeahs', songTitle: 'Spitting Off the Edge of the World',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Rock', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-006', mediaId: 'fifa-23', artistName: 'Flume ft. Toro y Moi', songTitle: 'Palaces',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-007', mediaId: 'fifa-23', artistName: 'Denzel Curry', songTitle: 'Walkin',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-008', mediaId: 'fifa-23', artistName: 'FKA twigs', songTitle: 'Jealousy',
    isAfricanArtist: false, artistCountry: null, genre: 'Art Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-009', mediaId: 'fifa-23', artistName: 'Phoenix', songTitle: 'Tonight',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Pop', sceneDescription: null, spotifyUrl: null, season: null, episode: null },
  { id: 'fifa-010', mediaId: 'fifa-23', artistName: 'ODESZA ft. MARO', songTitle: 'Love Letter',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic', sceneDescription: null, spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: Grand Theft Auto V (12)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'gta-001', mediaId: 'gta-v', artistName: 'Tyler, the Creator', songTitle: 'Garbage',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Radio Los Santos', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-002', mediaId: 'gta-v', artistName: 'A$AP Rocky', songTitle: 'R-Cali',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Radio Los Santos', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-003', mediaId: 'gta-v', artistName: 'Wavves', songTitle: 'Nine Is God',
    isAfricanArtist: false, artistCountry: null, genre: 'Surf Punk', sceneDescription: 'Vinewood Boulevard Radio', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-004', mediaId: 'gta-v', artistName: 'Flying Lotus', songTitle: 'Getting There',
    isAfricanArtist: false, artistCountry: null, genre: 'Electronic / Beat', sceneDescription: 'FlyLo FM', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-005', mediaId: 'gta-v', artistName: 'Kendrick Lamar', songTitle: 'Swimming Pools (Drank)',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Radio Los Santos', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-006', mediaId: 'gta-v', artistName: 'Tame Impala', songTitle: 'Elephant',
    isAfricanArtist: false, artistCountry: null, genre: 'Psych Rock', sceneDescription: 'Radio Mirror Park', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-007', mediaId: 'gta-v', artistName: 'ScHoolboy Q', songTitle: 'Hands on the Wheel',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Radio Los Santos', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-008', mediaId: 'gta-v', artistName: 'Twin Shadow', songTitle: 'Shooting Holes',
    isAfricanArtist: false, artistCountry: null, genre: 'Synth Pop', sceneDescription: 'Radio Mirror Park', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-009', mediaId: 'gta-v', artistName: 'Yeasayer', songTitle: 'Don\'t Come Close',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Electronic', sceneDescription: 'Radio Mirror Park', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-010', mediaId: 'gta-v', artistName: 'Bootsy Collins', songTitle: 'I\'d Rather Be with You',
    isAfricanArtist: false, artistCountry: null, genre: 'Funk', sceneDescription: 'Space 103.2', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-011', mediaId: 'gta-v', artistName: 'Stevie Wonder', songTitle: 'Skeletons',
    isAfricanArtist: false, artistCountry: null, genre: 'Soul / Funk', sceneDescription: 'Space 103.2', spotifyUrl: null, season: null, episode: null },
  { id: 'gta-012', mediaId: 'gta-v', artistName: 'Eddie Murphy', songTitle: 'Party All the Time',
    isAfricanArtist: false, artistCountry: null, genre: 'Synth Pop', sceneDescription: 'Non-Stop-Pop FM', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // AD: Apple AirPods Pro (2)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'aap-001', mediaId: 'apple-airpods-pro-2023', artistName: 'Burna Boy', songTitle: 'City Boys',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Spatial audio immersion demo with adaptive noise cancellation', spotifyUrl: null, season: null, episode: null },
  { id: 'aap-002', mediaId: 'apple-airpods-pro-2023', artistName: 'Tyla', songTitle: 'Water',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Amapiano Pop', sceneDescription: 'Personalized spatial audio showcase', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // AD: Pepsi Super Bowl Halftime Show 2022 (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'psb-001', mediaId: 'pepsi-super-bowl-2022', artistName: 'Eminem', songTitle: 'Lose Yourself',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Halftime show performance — kneeling moment', spotifyUrl: null, season: null, episode: null },
  { id: 'psb-002', mediaId: 'pepsi-super-bowl-2022', artistName: 'Dr. Dre & Snoop Dogg', songTitle: 'Still D.R.E.',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Opening halftime set', spotifyUrl: null, season: null, episode: null },
  { id: 'psb-003', mediaId: 'pepsi-super-bowl-2022', artistName: 'Mary J. Blige', songTitle: 'Family Affair',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B / Hip-Hop', sceneDescription: 'Center stage dance performance', spotifyUrl: null, season: null, episode: null },
  { id: 'psb-004', mediaId: 'pepsi-super-bowl-2022', artistName: 'Kendrick Lamar', songTitle: 'Alright',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Rooftop dancers segment', spotifyUrl: null, season: null, episode: null },
  { id: 'psb-005', mediaId: 'pepsi-super-bowl-2022', artistName: '50 Cent', songTitle: 'In Da Club',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Surprise upside-down entrance', spotifyUrl: null, season: null, episode: null },
]
