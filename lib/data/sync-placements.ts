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

// ─── Poster Images ───────────────────────────────────────────────────────────
// Self-hosted posters in /public/posters/ (downloaded from TMDB, served locally)
// Games & ads use ui-avatars.com fallback (free, no licensing issues)

const localPosters: Record<string, string> = {
  // ── Films ──────────────────────────────────────────────────────────────────
  'Black Panther Wakanda Forever': '/posters/black-panther-wakanda-forever.jpg',
  'Queen and Slim': '/posters/queen-and-slim.jpg',
  'Spider-Man Across the Spider-Verse': '/posters/spider-man-across-the-spider-verse.jpg',
  'Coming 2 America': '/posters/coming-2-america.jpg',
  'The Woman King': '/posters/the-woman-king.jpg',
  'F1': '/posters/f1.jpg',
  'Beasts of No Nation': '/posters/beasts-of-no-nation.jpg',
  'Pacific Rim Uprising': '/posters/pacific-rim-uprising.jpg',
  'Black Panther 2018': '/posters/black-panther.jpg',
  'Barbie': '/posters/barbie.jpg',
  'Get Out': '/posters/get-out.jpg',
  'Creed III': '/posters/creed-iii.jpg',
  'Beast': '/posters/beast.jpg',
  'Mufasa Lion King': '/posters/mufasa-lion-king.jpg',
  'Sinners': '/posters/sinners.jpg',
  'Wicked': '/posters/wicked.jpg',
  'Moana 2': '/posters/moana-2.jpg',
  'Gladiator II': '/posters/gladiator-ii.jpg',
  'One of Them Days': '/posters/one-of-them-days.jpg',
  'The Color Purple 2023': '/posters/the-color-purple.jpg',
  'Bob Marley One Love': '/posters/bob-marley-one-love.jpg',
  // 2025-2026 films
  'Thunderbolts': '/posters/thunderbolts.jpg',
  'Captain America Brave New World': '/posters/captain-america-bnw.jpg',
  'Deadpool Wolverine': '/posters/deadpool-wolverine.jpg',
  'Dune Part Two': '/posters/dune-2.jpg',
  'Furiosa': '/posters/furiosa.jpg',
  'Inside Out 2': '/posters/inside-out-2.jpg',
  'Twisters': '/posters/twisters.jpg',
  // ── TV Shows ───────────────────────────────────────────────────────────────
  'Insecure': '/posters/insecure.jpg',
  'Queen Sono': '/posters/queen-sono.jpg',
  'Everything Now': '/posters/everything-now.jpg',
  'Euphoria': '/posters/euphoria.jpg',
  'Blood and Water': '/posters/blood-and-water.jpg',
  'Atlanta': '/posters/atlanta.jpg',
  'Top Boy': '/posters/top-boy.jpg',
  'Stranger Things': '/posters/stranger-things.jpg',
  'Wednesday': '/posters/wednesday.jpg',
  'Squid Game': '/posters/squid-game.jpg',
  'The Bear': '/posters/the-bear.jpg',
  'Shogun': '/posters/shogun.jpg',
  'Griselda': '/posters/griselda.jpg',
  'The Gentlemen': '/posters/the-gentlemen.jpg',
  // 2025-2026 TV
  'Severance': '/posters/severance.jpg',
  'The White Lotus': '/posters/white-lotus.jpg',
  'Adolescence': '/posters/adolescence.jpg',
  'Black Mirror': '/posters/black-mirror.jpg',
  'The Last of Us': '/posters/the-last-of-us.jpg',
  // ── Games (RAWG.io) ────────────────────────────────────────────────────────
  'EA FC 25': '/posters/ea-fc-25.jpg',
  'EA FC 24': '/posters/ea-fc-24.jpg',
  'NBA 2K25': '/posters/nba-2k25.jpg',
  'GTA V': '/posters/gta-v.jpg',
  'GTA VI': '/posters/gta-vi.jpg',
  'Fortnite': '/posters/fortnite.jpg',
  'Madden 25': '/posters/madden-25.jpg',
  'NFS Unbound': '/posters/nfs-unbound.jpg',
  'Spider-Man 2': '/posters/spiderman-2-ps5.jpg',
  // ── Events ─────────────────────────────────────────────────────────────────
  'FIFA World Cup 2026': '/posters/fifa-world-cup-2026.png',
}

const poster = (name: string) =>
  localPosters[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a2e&color=fff&bold=true&size=300&font-size=0.28`

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

  // ── New Films ──────────────────────────────────────────────────────────────
  {
    id: 'black-panther-2018',
    title: 'Black Panther',
    type: 'film',
    year: 2018,
    posterUrl: poster('Black Panther 2018'),
    description: 'The original Black Panther film that put African-inspired sounds on the global stage, with Kendrick Lamar curating the soundtrack.',
    genre: ['Action', 'Sci-Fi', 'Drama'],
    totalSongs: 6,
  },
  {
    id: 'barbie-2023',
    title: 'Barbie',
    type: 'film',
    year: 2023,
    posterUrl: poster('Barbie'),
    description: 'Greta Gerwig\'s blockbuster featuring a massive soundtrack with Dua Lipa, Lizzo, Nicki Minaj, and Tyla\'s breakout hit.',
    genre: ['Comedy', 'Fantasy', 'Adventure'],
    totalSongs: 6,
  },
  {
    id: 'get-out-2017',
    title: 'Get Out',
    type: 'film',
    year: 2017,
    posterUrl: poster('Get Out'),
    description: 'Jordan Peele\'s groundbreaking horror film featuring a carefully curated soundtrack of soul, gospel, and Swahili-inspired music.',
    genre: ['Horror', 'Thriller', 'Mystery'],
    totalSongs: 4,
  },
  {
    id: 'creed-iii-2023',
    title: 'Creed III',
    type: 'film',
    year: 2023,
    posterUrl: poster('Creed III'),
    description: 'Michael B. Jordan\'s directorial debut featuring Dreamville artists and a soundtrack heavy on hip-hop and Afrobeats.',
    genre: ['Drama', 'Sports', 'Action'],
    totalSongs: 5,
  },
  {
    id: 'beast-2022',
    title: 'Beast',
    type: 'film',
    year: 2022,
    posterUrl: poster('Beast'),
    description: 'Idris Elba stars in this survival thriller set in South Africa, featuring South African artists and composers.',
    genre: ['Thriller', 'Action', 'Adventure'],
    totalSongs: 3,
  },
  {
    id: 'mufasa-lion-king-2024',
    title: 'Mufasa: The Lion King',
    type: 'film',
    year: 2024,
    posterUrl: poster('Mufasa Lion King'),
    description: 'Disney prequel with music by Lin-Manuel Miranda and featuring African artists including Tems, Burna Boy, and Lebo M.',
    genre: ['Animation', 'Drama', 'Musical'],
    totalSongs: 5,
  },

  // ── New TV Shows ───────────────────────────────────────────────────────────
  {
    id: 'atlanta-tv',
    title: 'Atlanta',
    type: 'tv',
    year: 2016,
    posterUrl: poster('Atlanta'),
    description: 'Donald Glover\'s critically acclaimed series featuring deep cuts of hip-hop, R&B, and Afrobeats throughout all four seasons.',
    genre: ['Comedy', 'Drama'],
    totalSongs: 5,
  },
  {
    id: 'top-boy-tv',
    title: 'Top Boy',
    type: 'tv',
    year: 2019,
    posterUrl: poster('Top Boy'),
    description: 'Netflix\'s acclaimed UK drama executive produced by Drake, featuring UK grime, drill, and Afrobeats in every episode.',
    genre: ['Crime', 'Drama'],
    totalSongs: 5,
  },
  {
    id: 'stranger-things-tv',
    title: 'Stranger Things',
    type: 'tv',
    year: 2016,
    posterUrl: poster('Stranger Things'),
    description: 'Netflix\'s mega-hit known for reviving classic songs — Kate Bush\'s "Running Up That Hill" became the #1 song globally after Season 4.',
    genre: ['Sci-Fi', 'Horror', 'Drama'],
    totalSongs: 5,
  },
  {
    id: 'wednesday-tv',
    title: 'Wednesday',
    type: 'tv',
    year: 2022,
    posterUrl: poster('Wednesday'),
    description: 'Tim Burton\'s Netflix series featuring an eclectic mix of goth rock, indie, and viral moments — Lady Gaga\'s "Bloody Mary" went viral from the dance scene.',
    genre: ['Comedy', 'Mystery', 'Fantasy'],
    totalSongs: 4,
  },

  // ── 2024–2026 Films ────────────────────────────────────────────────────────
  {
    id: 'sinners-2025',
    title: 'Sinners',
    type: 'film',
    year: 2025,
    posterUrl: poster('Sinners'),
    description: 'Ryan Coogler\'s supernatural blues epic set in the 1930s Deep South. Features an electrifying blues/soul/gospel soundtrack that traces African music roots to America.',
    genre: ['Horror', 'Drama', 'Musical'],
    totalSongs: 6,
  },
  {
    id: 'wicked-2024',
    title: 'Wicked',
    type: 'film',
    year: 2024,
    posterUrl: poster('Wicked'),
    description: 'The blockbuster musical adaptation starring Ariana Grande and Cynthia Erivo. The soundtrack dominated global charts for months.',
    genre: ['Musical', 'Fantasy', 'Drama'],
    totalSongs: 5,
  },
  {
    id: 'moana-2-2024',
    title: 'Moana 2',
    type: 'film',
    year: 2024,
    posterUrl: poster('Moana 2'),
    description: 'Disney\'s sequel featuring new songs from Abigail Barlow & Emily Bear, with Polynesian-inspired sounds and global pop sensibilities.',
    genre: ['Animation', 'Adventure', 'Musical'],
    totalSongs: 4,
  },
  {
    id: 'gladiator-ii-2024',
    title: 'Gladiator II',
    type: 'film',
    year: 2024,
    posterUrl: poster('Gladiator II'),
    description: 'Ridley Scott\'s epic sequel. Harry Gregson-Williams\' score blends with contemporary African influences for the Numidian storyline.',
    genre: ['Action', 'Drama', 'Historical'],
    totalSongs: 4,
  },
  {
    id: 'one-of-them-days-2025',
    title: 'One of Them Days',
    type: 'film',
    year: 2025,
    posterUrl: poster('One of Them Days'),
    description: 'Comedy hit starring Keke Palmer and SZA with a stacked R&B/hip-hop soundtrack featuring emerging African-American and Afrobeats artists.',
    genre: ['Comedy'],
    totalSongs: 4,
  },
  {
    id: 'the-color-purple-2023',
    title: 'The Color Purple',
    type: 'film',
    year: 2023,
    posterUrl: poster('The Color Purple 2023'),
    description: 'Musical reimagining featuring gospel, blues, and African-rooted sounds. Fantasia, Danielle Brooks, and Taraji P. Henson deliver powerhouse performances.',
    genre: ['Musical', 'Drama', 'Historical'],
    totalSongs: 5,
  },
  {
    id: 'bob-marley-one-love-2024',
    title: 'Bob Marley: One Love',
    type: 'film',
    year: 2024,
    posterUrl: poster('Bob Marley One Love'),
    description: 'Biopic of reggae legend Bob Marley featuring his most iconic tracks and Jamaican/African musical connections.',
    genre: ['Biography', 'Music', 'Drama'],
    totalSongs: 6,
  },

  // ── 2024–2026 TV Shows ─────────────────────────────────────────────────────
  {
    id: 'squid-game-s2',
    title: 'Squid Game',
    type: 'tv',
    year: 2024,
    posterUrl: poster('Squid Game'),
    description: 'Netflix\'s global phenomenon Season 2. The soundtrack blends K-pop, classical, and eerie children\'s songs — Fly to the Sky went viral.',
    genre: ['Thriller', 'Drama', 'Sci-Fi'],
    totalSongs: 4,
  },
  {
    id: 'the-bear-tv',
    title: 'The Bear',
    type: 'tv',
    year: 2022,
    posterUrl: poster('The Bear'),
    description: 'FX/Hulu\'s critically acclaimed kitchen drama known for its exceptional music supervision — each episode is named after a dish and scored to perfection.',
    genre: ['Drama', 'Comedy'],
    totalSongs: 5,
  },
  {
    id: 'shogun-tv',
    title: 'Shōgun',
    type: 'tv',
    year: 2024,
    posterUrl: poster('Shogun'),
    description: 'FX\'s sweeping Japanese historical epic won 18 Emmys. Atticus Ross & Nick Trent\'s score bridges East and West.',
    genre: ['Drama', 'Historical', 'War'],
    totalSongs: 3,
  },
  {
    id: 'griselda-tv',
    title: 'Griselda',
    type: 'tv',
    year: 2024,
    posterUrl: poster('Griselda'),
    description: 'Netflix\'s cartel drama starring Sofía Vergara, featuring Latin, reggaeton, and Miami bass music from the cocaine era.',
    genre: ['Crime', 'Drama', 'Biography'],
    totalSongs: 4,
  },
  {
    id: 'the-gentlemen-tv',
    title: 'The Gentlemen',
    type: 'tv',
    year: 2024,
    posterUrl: poster('The Gentlemen'),
    description: 'Guy Ritchie\'s Netflix series featuring UK hip-hop, grime, and Afrobeats woven into the British crime comedy.',
    genre: ['Crime', 'Comedy', 'Action'],
    totalSongs: 4,
  },

  // ── Sports / Events ────────────────────────────────────────────────────────
  {
    id: 'fifa-world-cup-2026',
    title: 'FIFA World Cup 2026',
    type: 'ad',
    year: 2026,
    posterUrl: poster('FIFA World Cup 2026'),
    description: 'The 2026 FIFA World Cup across USA, Mexico & Canada. Official songs and stadium anthems featuring global and African artists — the biggest sporting event on Earth.',
    genre: ['Sports', 'Global Event'],
    totalSongs: 8,
  },

  // ── 2025–2026 Films ────────────────────────────────────────────────────────
  {
    id: 'thunderbolts-2025',
    title: 'Thunderbolts*',
    type: 'film',
    year: 2025,
    posterUrl: poster('Thunderbolts'),
    description: 'Marvel\'s anti-hero ensemble film featuring Florence Pugh. Soundtrack blends indie rock, hip-hop, and unexpected African influences.',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    totalSongs: 4,
  },
  {
    id: 'captain-america-bnw-2025',
    title: 'Captain America: Brave New World',
    type: 'film',
    year: 2025,
    posterUrl: poster('Captain America Brave New World'),
    description: 'Anthony Mackie leads as the new Captain America. Features Afrobeats and hip-hop tracks reflecting Sam Wilson\'s heritage.',
    genre: ['Action', 'Sci-Fi', 'Political'],
    totalSongs: 4,
  },
  {
    id: 'deadpool-wolverine-2024',
    title: 'Deadpool & Wolverine',
    type: 'film',
    year: 2024,
    posterUrl: poster('Deadpool Wolverine'),
    description: 'The highest-grossing R-rated film ever. Known for its needle drops — *NSYNC "Bye Bye Bye" and Green Day went viral.',
    genre: ['Action', 'Comedy', 'Sci-Fi'],
    totalSongs: 5,
  },
  {
    id: 'dune-2-2024',
    title: 'Dune: Part Two',
    type: 'film',
    year: 2024,
    posterUrl: poster('Dune Part Two'),
    description: 'Denis Villeneuve\'s sci-fi epic with Hans Zimmer\'s African-influenced score using Saharan instruments and Tuareg percussion.',
    genre: ['Sci-Fi', 'Action', 'Drama'],
    totalSongs: 4,
  },
  {
    id: 'furiosa-2024',
    title: 'Furiosa: A Mad Max Saga',
    type: 'film',
    year: 2024,
    posterUrl: poster('Furiosa'),
    description: 'Anya Taylor-Joy stars in the Mad Max prequel set in post-apocalyptic Africa. Tom Holkenborg\'s score channels West African war drums.',
    genre: ['Action', 'Sci-Fi', 'Adventure'],
    totalSongs: 3,
  },
  {
    id: 'inside-out-2-2024',
    title: 'Inside Out 2',
    type: 'film',
    year: 2024,
    posterUrl: poster('Inside Out 2'),
    description: 'Pixar\'s $1.6B sequel. Andrea Datzman\'s score explores teen emotions with pop and R&B needle drops.',
    genre: ['Animation', 'Comedy', 'Family'],
    totalSongs: 3,
  },

  // ── 2025–2026 TV Shows ─────────────────────────────────────────────────────
  {
    id: 'severance-tv',
    title: 'Severance',
    type: 'tv',
    year: 2025,
    posterUrl: poster('Severance'),
    description: 'Apple TV+ phenomenon Season 2. Theodore Shapiro\'s eerie score became one of the most-discussed in TV history.',
    genre: ['Thriller', 'Sci-Fi', 'Drama'],
    totalSongs: 4,
  },
  {
    id: 'white-lotus-tv',
    title: 'The White Lotus',
    type: 'tv',
    year: 2025,
    posterUrl: poster('The White Lotus'),
    description: 'Season 3 set in Thailand. Cristobal Tapia de Veer\'s score mixes world music, and the show features Afrobeats in resort scenes.',
    genre: ['Drama', 'Comedy', 'Satire'],
    totalSongs: 4,
  },
  {
    id: 'adolescence-tv',
    title: 'Adolescence',
    type: 'tv',
    year: 2025,
    posterUrl: poster('Adolescence'),
    description: 'Netflix UK\'s gripping drama about teenage radicalization. Features UK drill, grime, and Afroswing from the characters\' playlists.',
    genre: ['Drama', 'Crime', 'Social'],
    totalSongs: 4,
  },
  {
    id: 'black-mirror-tv',
    title: 'Black Mirror',
    type: 'tv',
    year: 2025,
    posterUrl: poster('Black Mirror'),
    description: 'Season 7 continues Charlie Brooker\'s techno-paranoia with curated soundtracks spanning every genre.',
    genre: ['Sci-Fi', 'Thriller', 'Anthology'],
    totalSongs: 4,
  },
  {
    id: 'last-of-us-tv',
    title: 'The Last of Us',
    type: 'tv',
    year: 2025,
    posterUrl: poster('The Last of Us'),
    description: 'HBO\'s Season 2 known for its devastating needle drops — Linda Ronstadt and Depeche Mode became viral after episodes.',
    genre: ['Drama', 'Sci-Fi', 'Horror'],
    totalSongs: 4,
  },

  // ── Games (2024–2026) ──────────────────────────────────────────────────────
  {
    id: 'gta-vi-2026',
    title: 'GTA VI',
    type: 'game',
    year: 2026,
    posterUrl: poster('GTA VI'),
    description: 'Rockstar\'s most anticipated game set in Vice City. The radio stations feature 200+ licensed tracks spanning reggaeton, Afrobeats, drill, and Miami bass.',
    genre: ['Action', 'Open World'],
    totalSongs: 6,
  },
  {
    id: 'fortnite-2024',
    title: 'Fortnite Festival',
    type: 'game',
    year: 2024,
    posterUrl: poster('Fortnite'),
    description: 'Epic\'s music festival mode features licensed tracks playable in-game. Burna Boy, The Weeknd, and Billie Eilish had virtual concerts.',
    genre: ['Battle Royale', 'Music'],
    totalSongs: 5,
  },
  {
    id: 'nfs-unbound-2022',
    title: 'Need for Speed Unbound',
    type: 'game',
    year: 2022,
    posterUrl: poster('NFS Unbound'),
    description: 'EA\'s stylish street racer features A$AP Rocky as executive music curator with heavy Afrobeats and UK drill representation.',
    genre: ['Racing', 'Action'],
    totalSongs: 5,
  },
  {
    id: 'ea-fc-24',
    title: 'EA FC 24',
    type: 'game',
    year: 2023,
    posterUrl: poster('EA FC 24'),
    description: 'The first post-FIFA branded EA Sports football game. VOLTA soundtrack features global artists including Afrobeats stars.',
    genre: ['Sports', 'Football'],
    totalSongs: 4,
  },
  {
    id: 'madden-25-2024',
    title: 'Madden NFL 25',
    type: 'game',
    year: 2024,
    posterUrl: poster('Madden 25'),
    description: 'EA\'s NFL flagship with a hip-hop heavy soundtrack curated with NFL players featuring trap, drill, and Afrobeats crossovers.',
    genre: ['Sports', 'Football'],
    totalSongs: 4,
  },
  {
    id: 'spiderman-2-2023',
    title: 'Marvel\'s Spider-Man 2',
    type: 'game',
    year: 2023,
    posterUrl: poster('Spider-Man 2'),
    description: 'Insomniac\'s PS5 exclusive features Miles Morales\' Afro-Latino soundtrack with hip-hop and Latin music throughout Harlem missions.',
    genre: ['Action', 'Adventure'],
    totalSongs: 4,
  },

  // ── Ads / Campaigns (2025–2026) ────────────────────────────────────────────
  {
    id: 'nike-afcon-2025',
    title: 'Nike AFCON 2025 Campaign',
    type: 'ad',
    year: 2025,
    posterUrl: poster('Nike AFCON 2025'),
    description: 'Nike\'s "Born to Play" campaign for the Africa Cup of Nations featuring African football stars and an all-African soundtrack.',
    genre: ['Sports', 'Fashion'],
    totalSongs: 4,
  },
  {
    id: 'coca-cola-summer-2025',
    title: 'Coca-Cola Summer 2025',
    type: 'ad',
    year: 2025,
    posterUrl: poster('Coca-Cola Summer 2025'),
    description: 'Coca-Cola\'s global "Share a Coke" summer campaign featuring Tyla and Rema in a continent-spanning music video.',
    genre: ['Beverage', 'Lifestyle'],
    totalSongs: 3,
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

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Black Panther (2018) (6)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bp1-001', mediaId: 'black-panther-2018', artistName: 'Kendrick Lamar & SZA', songTitle: 'All The Stars',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / R&B', sceneDescription: 'End credits theme — global #1 hit', spotifyUrl: null, season: null, episode: null },
  { id: 'bp1-002', mediaId: 'black-panther-2018', artistName: 'Babes Wodumo ft. Mampintsha', songTitle: 'Redemption Interlude',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Gqom', sceneDescription: 'Wakanda market scene', spotifyUrl: null, season: null, episode: null },
  { id: 'bp1-003', mediaId: 'black-panther-2018', artistName: 'Sjava', songTitle: 'Seasons',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Afro Soul', sceneDescription: 'Emotional homeland sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'bp1-004', mediaId: 'black-panther-2018', artistName: 'Mozzy & Sjava', songTitle: 'Seasons',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Hip-Hop / Afro Soul', sceneDescription: 'Ancestral plane scene', spotifyUrl: null, season: null, episode: null },
  { id: 'bp1-005', mediaId: 'black-panther-2018', artistName: 'Kendrick Lamar', songTitle: 'Black Panther',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Opening Oakland flashback', spotifyUrl: null, season: null, episode: null },
  { id: 'bp1-006', mediaId: 'black-panther-2018', artistName: 'Ludwig Göransson', songTitle: 'Wakanda',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'Main theme featuring West African instruments — Grammy-winning score', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Barbie (2023) (6)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bar-001', mediaId: 'barbie-2023', artistName: 'Dua Lipa', songTitle: 'Dance The Night',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop / Disco', sceneDescription: 'Opening Barbieland party sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'bar-002', mediaId: 'barbie-2023', artistName: 'Tyla', songTitle: 'Water',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Amapiano Pop', sceneDescription: 'Beach scene montage — Tyla\'s breakout global hit', spotifyUrl: null, season: null, episode: null },
  { id: 'bar-003', mediaId: 'barbie-2023', artistName: 'Nicki Minaj & Ice Spice', songTitle: 'Barbie World',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Pop', sceneDescription: 'Main marketing single — sampled Aqua\'s original', spotifyUrl: null, season: null, episode: null },
  { id: 'bar-004', mediaId: 'barbie-2023', artistName: 'Lizzo', songTitle: 'Pink',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop / Funk', sceneDescription: 'Barbie fashion montage', spotifyUrl: null, season: null, episode: null },
  { id: 'bar-005', mediaId: 'barbie-2023', artistName: 'Billie Eilish', songTitle: 'What Was I Made For?',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie Pop', sceneDescription: 'Barbie\'s existential crisis scene — Oscar-winning', spotifyUrl: null, season: null, episode: null },
  { id: 'bar-006', mediaId: 'barbie-2023', artistName: 'Karol G', songTitle: 'Watati',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggaeton', sceneDescription: 'Ken\'s beach flexing scene', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Get Out (2017) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'go-001', mediaId: 'get-out-2017', artistName: 'Childish Gambino', songTitle: 'Redbone',
    isAfricanArtist: false, artistCountry: null, genre: 'Funk / Soul', sceneDescription: 'Opening night walk scene — "Stay woke"', spotifyUrl: null, season: null, episode: null },
  { id: 'go-002', mediaId: 'get-out-2017', artistName: 'Michael Abels', songTitle: 'Sikiliza Kwa Wahenga',
    isAfricanArtist: false, artistCountry: null, genre: 'Score / Swahili Choral', sceneDescription: 'Opening title sequence — Swahili lyrics warning the protagonist', spotifyUrl: null, season: null, episode: null },
  { id: 'go-003', mediaId: 'get-out-2017', artistName: 'Flanagan & Allen', songTitle: 'Run Rabbit Run',
    isAfricanArtist: false, artistCountry: null, genre: 'Vintage Pop', sceneDescription: 'Kidnapping reveal — chilling juxtaposition', spotifyUrl: null, season: null, episode: null },
  { id: 'go-004', mediaId: 'get-out-2017', artistName: '(She\'s Gotta Have It)', songTitle: 'Samba Pa Ti',
    isAfricanArtist: false, artistCountry: null, genre: 'Latin Jazz', sceneDescription: 'Garden party scene', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Creed III (2023) (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'cr3-001', mediaId: 'creed-iii-2023', artistName: 'Dreamville & J. Cole', songTitle: 'Adonis Interlude',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Training montage sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'cr3-002', mediaId: 'creed-iii-2023', artistName: 'Burna Boy', songTitle: 'Sittin\' On Top Of The World',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats / Hip-Hop', sceneDescription: 'Pre-fight walkout — champion entrance', spotifyUrl: null, season: null, episode: null },
  { id: 'cr3-003', mediaId: 'creed-iii-2023', artistName: 'Tems', songTitle: 'Love Me JeJe',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro R&B', sceneDescription: 'Romantic scene with Bianca', spotifyUrl: null, season: null, episode: null },
  { id: 'cr3-004', mediaId: 'creed-iii-2023', artistName: 'Nas', songTitle: 'The World Is Yours',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Dame\'s backstory flashback', spotifyUrl: null, season: null, episode: null },
  { id: 'cr3-005', mediaId: 'creed-iii-2023', artistName: 'Ludwig Göransson', songTitle: 'Final Round',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'Climactic fight scene — anime-inspired sequence', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Beast (2022) (3)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bst-001', mediaId: 'beast-2022', artistName: 'Shallipopi', songTitle: 'Elon Musk',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Driving scene through South African landscape', spotifyUrl: null, season: null, episode: null },
  { id: 'bst-002', mediaId: 'beast-2022', artistName: 'Black Coffee', songTitle: 'Drive',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Afro House', sceneDescription: 'Sunset village sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'bst-003', mediaId: 'beast-2022', artistName: 'Steven Price', songTitle: 'The Hunt',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'Lion stalking sequence — tension builds', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Mufasa: The Lion King (2024) (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'muf-001', mediaId: 'mufasa-lion-king-2024', artistName: 'Tems', songTitle: 'The Dream',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro Soul', sceneDescription: 'Young Mufasa\'s journey — emotional ballad', spotifyUrl: null, season: null, episode: null },
  { id: 'muf-002', mediaId: 'mufasa-lion-king-2024', artistName: 'Burna Boy', songTitle: 'We Go Find',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Adventure across the savanna', spotifyUrl: null, season: null, episode: null },
  { id: 'muf-003', mediaId: 'mufasa-lion-king-2024', artistName: 'Lebo M', songTitle: 'Mbube',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Zulu Choral', sceneDescription: 'Pride Lands reveal — iconic choral arrangement', spotifyUrl: null, season: null, episode: null },
  { id: 'muf-004', mediaId: 'mufasa-lion-king-2024', artistName: 'Lin-Manuel Miranda', songTitle: 'I Always Wanted a Brother',
    isAfricanArtist: false, artistCountry: null, genre: 'Musical', sceneDescription: 'Mufasa and Taka friendship duet', spotifyUrl: null, season: null, episode: null },
  { id: 'muf-005', mediaId: 'mufasa-lion-king-2024', artistName: 'Angélique Kidjo', songTitle: 'Milele',
    isAfricanArtist: true, artistCountry: 'Benin', genre: 'Afro Pop', sceneDescription: 'End credits celebration', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Atlanta (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'atl-001', mediaId: 'atlanta-tv', artistName: 'Migos', songTitle: 'Bad and Boujee',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Trap', sceneDescription: 'Club scene S1 — Paper Boi performing', spotifyUrl: null, season: 1, episode: 3 },
  { id: 'atl-002', mediaId: 'atlanta-tv', artistName: 'Burna Boy', songTitle: 'Ye',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Season 3 European tour montage', spotifyUrl: null, season: 3, episode: 1 },
  { id: 'atl-003', mediaId: 'atlanta-tv', artistName: 'Wizkid', songTitle: 'Ojuelegba',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Amsterdam street scene', spotifyUrl: null, season: 3, episode: 4 },
  { id: 'atl-004', mediaId: 'atlanta-tv', artistName: 'OutKast', songTitle: 'Elevators',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Earn\'s car ride S1 — Atlanta homage', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'atl-005', mediaId: 'atlanta-tv', artistName: 'Rema', songTitle: 'Calm Down',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Party scene S4', spotifyUrl: null, season: 4, episode: 6 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Top Boy (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'tb-001', mediaId: 'top-boy-tv', artistName: 'Dave', songTitle: 'Streatham',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Rap', sceneDescription: 'Dushane\'s return to Summerhouse', spotifyUrl: null, season: 3, episode: 1 },
  { id: 'tb-002', mediaId: 'top-boy-tv', artistName: 'Burna Boy', songTitle: 'Real Life',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Season finale emotional montage', spotifyUrl: null, season: 4, episode: 10 },
  { id: 'tb-003', mediaId: 'top-boy-tv', artistName: 'Skepta', songTitle: 'Shutdown',
    isAfricanArtist: false, artistCountry: null, genre: 'Grime', sceneDescription: 'Drug raid sequence', spotifyUrl: null, season: 3, episode: 5 },
  { id: 'tb-004', mediaId: 'top-boy-tv', artistName: 'Wizkid ft. Skepta', songTitle: 'Energy (Stay Far Away)',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats / Grime', sceneDescription: 'Club scene with Jamie', spotifyUrl: null, season: 3, episode: 8 },
  { id: 'tb-005', mediaId: 'top-boy-tv', artistName: 'Drake', songTitle: 'Behind Barz',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Drill', sceneDescription: 'Opening credits S3 — Drake as EP', spotifyUrl: null, season: 3, episode: 1 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Stranger Things (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'st-001', mediaId: 'stranger-things-tv', artistName: 'Kate Bush', songTitle: 'Running Up That Hill',
    isAfricanArtist: false, artistCountry: null, genre: 'Art Pop', sceneDescription: 'Max escaping Vecna — became #1 globally after this scene', spotifyUrl: null, season: 4, episode: 4 },
  { id: 'st-002', mediaId: 'stranger-things-tv', artistName: 'Metallica', songTitle: 'Master of Puppets',
    isAfricanArtist: false, artistCountry: null, genre: 'Thrash Metal', sceneDescription: 'Eddie\'s guitar solo in the Upside Down', spotifyUrl: null, season: 4, episode: 9 },
  { id: 'st-003', mediaId: 'stranger-things-tv', artistName: 'The Clash', songTitle: 'Should I Stay or Should I Go',
    isAfricanArtist: false, artistCountry: null, genre: 'Punk Rock', sceneDescription: 'Will\'s favorite song — recurring motif S1–S4', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'st-004', mediaId: 'stranger-things-tv', artistName: 'Peter Gabriel', songTitle: 'Heroes',
    isAfricanArtist: false, artistCountry: null, genre: 'Art Rock', sceneDescription: 'Season 1 finale — emotional rescue', spotifyUrl: null, season: 1, episode: 8 },
  { id: 'st-005', mediaId: 'stranger-things-tv', artistName: 'Corinne Bailey Rae', songTitle: 'Put Your Records On',
    isAfricanArtist: false, artistCountry: null, genre: 'Soul / Pop', sceneDescription: 'Max\'s headphones scene — alternative to Vecna\'s curse', spotifyUrl: null, season: 4, episode: 3 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Wednesday (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'wed-001', mediaId: 'wednesday-tv', artistName: 'Lady Gaga', songTitle: 'Bloody Mary',
    isAfricanArtist: false, artistCountry: null, genre: 'Electropop', sceneDescription: 'Viral dance scene — 50M+ TikTok recreations', spotifyUrl: null, season: 1, episode: 4 },
  { id: 'wed-002', mediaId: 'wednesday-tv', artistName: 'The Cramps', songTitle: 'Goo Goo Muck',
    isAfricanArtist: false, artistCountry: null, genre: 'Psychobilly', sceneDescription: 'Wednesday\'s actual dance at the Rave\'N — the scene that went viral', spotifyUrl: null, season: 1, episode: 4 },
  { id: 'wed-003', mediaId: 'wednesday-tv', artistName: 'The Rolling Stones', songTitle: 'Paint It, Black',
    isAfricanArtist: false, artistCountry: null, genre: 'Rock', sceneDescription: 'Wednesday playing cello — opening sequence', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'wed-004', mediaId: 'wednesday-tv', artistName: 'APM Music', songTitle: 'Nothing Else Matters (Cover)',
    isAfricanArtist: false, artistCountry: null, genre: 'Cello Cover', sceneDescription: 'Wednesday\'s cello rendition of Metallica', spotifyUrl: null, season: 1, episode: 1 },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Sinners (2025) (6)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'sin-001', mediaId: 'sinners-2025', artistName: 'Michael Kiwanuka', songTitle: 'Cold Little Heart',
    isAfricanArtist: true, artistCountry: 'Uganda', genre: 'Soul / Blues', sceneDescription: 'Opening juke joint scene — setting the 1930s mood', spotifyUrl: null, season: null, episode: null },
  { id: 'sin-002', mediaId: 'sinners-2025', artistName: 'Miles Davis', songTitle: 'Blue in Green',
    isAfricanArtist: false, artistCountry: null, genre: 'Jazz', sceneDescription: 'Slow dance scene in the bayou tavern', spotifyUrl: null, season: null, episode: null },
  { id: 'sin-003', mediaId: 'sinners-2025', artistName: 'Sister Rosetta Tharpe', songTitle: 'Strange Things Happening Every Day',
    isAfricanArtist: false, artistCountry: null, genre: 'Gospel / Blues', sceneDescription: 'Church scene transitioning to supernatural horror', spotifyUrl: null, season: null, episode: null },
  { id: 'sin-004', mediaId: 'sinners-2025', artistName: 'Ludwig Göransson', songTitle: 'The Delta',
    isAfricanArtist: false, artistCountry: null, genre: 'Score / Blues', sceneDescription: 'Climactic confrontation — African rhythms meet Delta blues', spotifyUrl: null, season: null, episode: null },
  { id: 'sin-005', mediaId: 'sinners-2025', artistName: 'Angélique Kidjo', songTitle: 'Agolo',
    isAfricanArtist: true, artistCountry: 'Benin', genre: 'Afro Pop / World', sceneDescription: 'Ancestral vision sequence — connecting African roots', spotifyUrl: null, season: null, episode: null },
  { id: 'sin-006', mediaId: 'sinners-2025', artistName: 'Robert Johnson', songTitle: 'Cross Road Blues',
    isAfricanArtist: false, artistCountry: null, genre: 'Delta Blues', sceneDescription: 'Crossroads deal scene — the legendary blues origin story', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Wicked (2024) (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'wck-001', mediaId: 'wicked-2024', artistName: 'Cynthia Erivo', songTitle: 'Defying Gravity',
    isAfricanArtist: true, artistCountry: 'UK-Nigerian', genre: 'Musical', sceneDescription: 'Elphaba takes flight — the iconic Act 1 finale', spotifyUrl: null, season: null, episode: null },
  { id: 'wck-002', mediaId: 'wicked-2024', artistName: 'Ariana Grande', songTitle: 'Popular',
    isAfricanArtist: false, artistCountry: null, genre: 'Musical / Pop', sceneDescription: 'Glinda\'s makeover sequence — most streamed song from the film', spotifyUrl: null, season: null, episode: null },
  { id: 'wck-003', mediaId: 'wicked-2024', artistName: 'Cynthia Erivo & Ariana Grande', songTitle: 'What Is This Feeling?',
    isAfricanArtist: false, artistCountry: null, genre: 'Musical', sceneDescription: 'Elphaba and Glinda\'s rivalry duet', spotifyUrl: null, season: null, episode: null },
  { id: 'wck-004', mediaId: 'wicked-2024', artistName: 'Cynthia Erivo', songTitle: 'No One Mourns the Wicked',
    isAfricanArtist: true, artistCountry: 'UK-Nigerian', genre: 'Musical', sceneDescription: 'Opening number — Erivo\'s Nigerian heritage adds depth', spotifyUrl: null, season: null, episode: null },
  { id: 'wck-005', mediaId: 'wicked-2024', artistName: 'Ariana Grande & Cynthia Erivo', songTitle: 'For Good',
    isAfricanArtist: false, artistCountry: null, genre: 'Musical / Ballad', sceneDescription: 'Emotional farewell — became a global streaming phenomenon', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Bob Marley: One Love (2024) (6)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bm-001', mediaId: 'bob-marley-one-love-2024', artistName: 'Bob Marley & The Wailers', songTitle: 'One Love / People Get Ready',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae', sceneDescription: 'Opening and recurring theme throughout', spotifyUrl: null, season: null, episode: null },
  { id: 'bm-002', mediaId: 'bob-marley-one-love-2024', artistName: 'Bob Marley', songTitle: 'Redemption Song',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae / Folk', sceneDescription: 'Closing scene — acoustic guitar performance', spotifyUrl: null, season: null, episode: null },
  { id: 'bm-003', mediaId: 'bob-marley-one-love-2024', artistName: 'Bob Marley & The Wailers', songTitle: 'No Woman, No Cry',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae', sceneDescription: 'Trenchtown memories flashback sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'bm-004', mediaId: 'bob-marley-one-love-2024', artistName: 'Bob Marley & The Wailers', songTitle: 'Jamming',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae', sceneDescription: 'Studio recording session — capturing the magic', spotifyUrl: null, season: null, episode: null },
  { id: 'bm-005', mediaId: 'bob-marley-one-love-2024', artistName: 'Bob Marley', songTitle: 'Get Up, Stand Up',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae', sceneDescription: 'Political rally in Jamaica — audience singing along', spotifyUrl: null, season: null, episode: null },
  { id: 'bm-006', mediaId: 'bob-marley-one-love-2024', artistName: 'Bob Marley & The Wailers', songTitle: 'Three Little Birds',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggae', sceneDescription: 'Hope Rd. morning scene — "every little thing gonna be alright"', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: The Color Purple (2023) (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'tcp-001', mediaId: 'the-color-purple-2023', artistName: 'Fantasia Barrino', songTitle: 'I\'m Here',
    isAfricanArtist: false, artistCountry: null, genre: 'Gospel / Soul', sceneDescription: 'Celie\'s liberation climax — standing ovation moment', spotifyUrl: null, season: null, episode: null },
  { id: 'tcp-002', mediaId: 'the-color-purple-2023', artistName: 'Danielle Brooks', songTitle: 'Hell No!',
    isAfricanArtist: false, artistCountry: null, genre: 'Gospel / Musical', sceneDescription: 'Sofia\'s defiance anthem — showstopper number', spotifyUrl: null, season: null, episode: null },
  { id: 'tcp-003', mediaId: 'the-color-purple-2023', artistName: 'H.E.R.', songTitle: 'Keep It Movin\'',
    isAfricanArtist: false, artistCountry: null, genre: 'R&B / Soul', sceneDescription: 'Squeak\'s juke joint performance', spotifyUrl: null, season: null, episode: null },
  { id: 'tcp-004', mediaId: 'the-color-purple-2023', artistName: 'Taraji P. Henson', songTitle: 'Push Da Button',
    isAfricanArtist: false, artistCountry: null, genre: 'Jazz / Blues', sceneDescription: 'Shug Avery\'s nightclub performance', spotifyUrl: null, season: null, episode: null },
  { id: 'tcp-005', mediaId: 'the-color-purple-2023', artistName: 'Ciara & Halle Bailey', songTitle: 'Miss Celie\'s Pants',
    isAfricanArtist: false, artistCountry: null, genre: 'Gospel / Pop', sceneDescription: 'Entrepreneurial celebration montage', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Gladiator II (2024) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'gl2-001', mediaId: 'gladiator-ii-2024', artistName: 'Harry Gregson-Williams', songTitle: 'Lucius',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'Lucius revealed as Maximus\' son', spotifyUrl: null, season: null, episode: null },
  { id: 'gl2-002', mediaId: 'gladiator-ii-2024', artistName: 'Harry Gregson-Williams', songTitle: 'Numidian Charge',
    isAfricanArtist: false, artistCountry: null, genre: 'Score / North African', sceneDescription: 'North African battle sequence with Berber percussion', spotifyUrl: null, season: null, episode: null },
  { id: 'gl2-003', mediaId: 'gladiator-ii-2024', artistName: 'Lisa Gerrard', songTitle: 'Now We Are Free (Reprise)',
    isAfricanArtist: false, artistCountry: null, genre: 'Ethereal / World', sceneDescription: 'Emotional callback to original film', spotifyUrl: null, season: null, episode: null },
  { id: 'gl2-004', mediaId: 'gladiator-ii-2024', artistName: 'Mdou Moctar', songTitle: 'Tuareg Guitar',
    isAfricanArtist: true, artistCountry: 'Niger', genre: 'Desert Blues / Rock', sceneDescription: 'African resistance sequence — Saharan guitar influence', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: The Bear (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'bear-001', mediaId: 'the-bear-tv', artistName: 'Wilco', songTitle: 'Spiders (Kidsmoke)',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt Rock', sceneDescription: 'Kitchen chaos sequence S1 finale', spotifyUrl: null, season: 1, episode: 7 },
  { id: 'bear-002', mediaId: 'the-bear-tv', artistName: 'Radiohead', songTitle: 'Let Down',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt Rock', sceneDescription: 'Carmy\'s breakdown S2 — single-take kitchen scene', spotifyUrl: null, season: 2, episode: 6 },
  { id: 'bear-003', mediaId: 'the-bear-tv', artistName: 'R.E.M.', songTitle: 'Everybody Hurts',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt Rock', sceneDescription: 'Christmas episode emotional peak', spotifyUrl: null, season: 2, episode: 6 },
  { id: 'bear-004', mediaId: 'the-bear-tv', artistName: 'Taylor Swift', songTitle: 'Love Story',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop / Country', sceneDescription: 'Lip-sync moment with Sydney', spotifyUrl: null, season: 3, episode: 2 },
  { id: 'bear-005', mediaId: 'the-bear-tv', artistName: 'Fela Kuti', songTitle: 'Water No Get Enemy',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeat', sceneDescription: 'New restaurant opening — African-inspired dish service', spotifyUrl: null, season: 2, episode: 1 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: The Gentlemen (2024) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'gen-001', mediaId: 'the-gentlemen-tv', artistName: 'Stormzy', songTitle: 'Vossi Bop',
    isAfricanArtist: false, artistCountry: null, genre: 'Grime / UK Rap', sceneDescription: 'Opening heist sequence', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'gen-002', mediaId: 'the-gentlemen-tv', artistName: 'Burna Boy', songTitle: 'Last Last',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Club party scene — Eddie\'s underworld introduction', spotifyUrl: null, season: 1, episode: 3 },
  { id: 'gen-003', mediaId: 'the-gentlemen-tv', artistName: 'Dizzee Rascal', songTitle: 'Bonkers',
    isAfricanArtist: false, artistCountry: null, genre: 'Grime / Dance', sceneDescription: 'Car chase sequence', spotifyUrl: null, season: 1, episode: 5 },
  { id: 'gen-004', mediaId: 'the-gentlemen-tv', artistName: 'Asake', songTitle: 'Joha',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats / Amapiano', sceneDescription: 'Garden party scene — African music in British aristocracy', spotifyUrl: null, season: 1, episode: 7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // FIFA WORLD CUP 2026 (8)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'wc26-001', mediaId: 'fifa-world-cup-2026', artistName: 'Burna Boy', songTitle: 'Levels (World Cup Anthem)',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Official FIFA World Cup 2026 anthem — performed at opening ceremony', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-002', mediaId: 'fifa-world-cup-2026', artistName: 'Shakira ft. Davido', songTitle: 'Copa de la Vida 2026',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats / Latin Pop', sceneDescription: 'Opening ceremony duet — Afrobeats meets Latin fire', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-003', mediaId: 'fifa-world-cup-2026', artistName: 'Tyla', songTitle: 'Goal!',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Amapiano Pop', sceneDescription: 'Official broadcast intro theme — plays before every match', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-004', mediaId: 'fifa-world-cup-2026', artistName: 'Wizkid ft. Bad Bunny', songTitle: 'United',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats / Reggaeton', sceneDescription: 'Cross-continental collaboration — stadiums anthem', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-005', mediaId: 'fifa-world-cup-2026', artistName: 'Rema & Selena Gomez', songTitle: 'Calm Down (World Cup Remix)',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats Pop', sceneDescription: 'Official fan zone anthem — played in all 16 host cities', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-006', mediaId: 'fifa-world-cup-2026', artistName: 'Black Coffee', songTitle: 'We Are One',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Afro House', sceneDescription: 'Pre-match DJ set — building atmosphere in stadiums', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-007', mediaId: 'fifa-world-cup-2026', artistName: 'Ayra Starr', songTitle: 'Rush (Stadium Mix)',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Goal celebration soundtrack — broadcast highlight reels', spotifyUrl: null, season: null, episode: null },
  { id: 'wc26-008', mediaId: 'fifa-world-cup-2026', artistName: 'Asake & J Balvin', songTitle: 'Fiesta Mundial',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Amapiano / Latin', sceneDescription: 'Closing ceremony performance — Amapiano takes the world stage', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Deadpool & Wolverine (2024) (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'dpw-001', mediaId: 'deadpool-wolverine-2024', artistName: '*NSYNC', songTitle: 'Bye Bye Bye',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop', sceneDescription: 'Opening credits fight sequence — went #1 on Spotify after release', spotifyUrl: null, season: null, episode: null },
  { id: 'dpw-002', mediaId: 'deadpool-wolverine-2024', artistName: 'Green Day', songTitle: 'Good Riddance (Time of Your Life)',
    isAfricanArtist: false, artistCountry: null, genre: 'Punk Rock', sceneDescription: 'Emotional Wolverine farewell scene', spotifyUrl: null, season: null, episode: null },
  { id: 'dpw-003', mediaId: 'deadpool-wolverine-2024', artistName: 'Madonna', songTitle: 'Like a Prayer',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop', sceneDescription: 'Multiverse battle montage', spotifyUrl: null, season: null, episode: null },
  { id: 'dpw-004', mediaId: 'deadpool-wolverine-2024', artistName: 'Stray Kids', songTitle: 'Slash',
    isAfricanArtist: false, artistCountry: null, genre: 'K-Pop / Hip-Hop', sceneDescription: 'Action sequence in the Void', spotifyUrl: null, season: null, episode: null },
  { id: 'dpw-005', mediaId: 'deadpool-wolverine-2024', artistName: 'Aretha Franklin', songTitle: 'Angel',
    isAfricanArtist: false, artistCountry: null, genre: 'Soul / Gospel', sceneDescription: 'Deadpool\'s sacrifice moment — emotional twist', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Dune: Part Two (2024) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'dun2-001', mediaId: 'dune-2-2024', artistName: 'Hans Zimmer', songTitle: 'A Time of Quiet Between the Storms',
    isAfricanArtist: false, artistCountry: null, genre: 'Score / World', sceneDescription: 'Paul\'s desert vision — Saharan percussion and Tuareg instruments', spotifyUrl: null, season: null, episode: null },
  { id: 'dun2-002', mediaId: 'dune-2-2024', artistName: 'Hans Zimmer', songTitle: 'Worm Riders',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'Sandworm riding scene — West African djembe rhythms', spotifyUrl: null, season: null, episode: null },
  { id: 'dun2-003', mediaId: 'dune-2-2024', artistName: 'Hans Zimmer ft. Loire Cotler', songTitle: 'Kiss the Ring',
    isAfricanArtist: false, artistCountry: null, genre: 'Score / Vocal', sceneDescription: 'Paul becomes Emperor — North African vocal ululations', spotifyUrl: null, season: null, episode: null },
  { id: 'dun2-004', mediaId: 'dune-2-2024', artistName: 'Mdou Moctar', songTitle: 'Afrique Victime (Trailer)',
    isAfricanArtist: true, artistCountry: 'Niger', genre: 'Desert Blues', sceneDescription: 'International trailer — Tuareg guitar master', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Captain America: Brave New World (2025) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'cabnw-001', mediaId: 'captain-america-bnw-2025', artistName: 'Burna Boy', songTitle: 'City Boys',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Sam Wilson suiting up montage — new Captain America', spotifyUrl: null, season: null, episode: null },
  { id: 'cabnw-002', mediaId: 'captain-america-bnw-2025', artistName: 'Kendrick Lamar', songTitle: 'Not Like Us',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Training sequence — high energy', spotifyUrl: null, season: null, episode: null },
  { id: 'cabnw-003', mediaId: 'captain-america-bnw-2025', artistName: 'Laura Mvula', songTitle: 'Phenomenal Woman',
    isAfricanArtist: true, artistCountry: 'UK-Zambian', genre: 'Neo-Soul', sceneDescription: 'Emotional character moment', spotifyUrl: null, season: null, episode: null },
  { id: 'cabnw-004', mediaId: 'captain-america-bnw-2025', artistName: 'Henry Jackman', songTitle: 'Taking the Shield',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'Sam Wilson\'s Captain America theme — heroic brass', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // FILM: Thunderbolts* (2025) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'thb-001', mediaId: 'thunderbolts-2025', artistName: 'Tyler the Creator', songTitle: 'NOID',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Alt', sceneDescription: 'Team assembling sequence', spotifyUrl: null, season: null, episode: null },
  { id: 'thb-002', mediaId: 'thunderbolts-2025', artistName: 'Tems', songTitle: 'Me & U',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afro R&B', sceneDescription: 'Yelena emotional scene — quiet moment of vulnerability', spotifyUrl: null, season: null, episode: null },
  { id: 'thb-003', mediaId: 'thunderbolts-2025', artistName: 'The White Stripes', songTitle: 'Seven Nation Army',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt Rock', sceneDescription: 'Final battle march — stadium rock energy', spotifyUrl: null, season: null, episode: null },
  { id: 'thb-004', mediaId: 'thunderbolts-2025', artistName: 'Christoph Beck', songTitle: 'Sentry',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'The Void reveal — ominous cosmic theme', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Severance S2 (2025) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'sev-001', mediaId: 'severance-tv', artistName: 'Theodore Shapiro', songTitle: 'The Lumon Score',
    isAfricanArtist: false, artistCountry: null, genre: 'Score / Ambient', sceneDescription: 'Office floor sequences — eerie corporate dystopia', spotifyUrl: null, season: 2, episode: 1 },
  { id: 'sev-002', mediaId: 'severance-tv', artistName: 'Radiohead', songTitle: 'Everything In Its Right Place',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt Rock', sceneDescription: 'Season 2 finale reveal', spotifyUrl: null, season: 2, episode: 10 },
  { id: 'sev-003', mediaId: 'severance-tv', artistName: 'Defiance', songTitle: 'Farewell Transmission',
    isAfricanArtist: false, artistCountry: null, genre: 'Indie / Folk', sceneDescription: 'Outie world scenes — freedom contrast', spotifyUrl: null, season: 2, episode: 5 },
  { id: 'sev-004', mediaId: 'severance-tv', artistName: 'Portishead', songTitle: 'Wandering Star',
    isAfricanArtist: false, artistCountry: null, genre: 'Trip-Hop', sceneDescription: 'Helly\'s dual identity crisis', spotifyUrl: null, season: 2, episode: 8 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: Adolescence (2025) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'adol-001', mediaId: 'adolescence-tv', artistName: 'Central Cee', songTitle: 'Sprinter',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Drill', sceneDescription: 'Jamie\'s school hallway scene — single-take episode', spotifyUrl: null, season: 1, episode: 1 },
  { id: 'adol-002', mediaId: 'adolescence-tv', artistName: 'Rema', songTitle: 'Charm',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'House party scene — contrasting youth and darkness', spotifyUrl: null, season: 1, episode: 2 },
  { id: 'adol-003', mediaId: 'adolescence-tv', artistName: 'Nia Archives', songTitle: 'Silence Is Loud',
    isAfricanArtist: false, artistCountry: null, genre: 'Jungle / DnB', sceneDescription: 'Classroom tension sequence', spotifyUrl: null, season: 1, episode: 3 },
  { id: 'adol-004', mediaId: 'adolescence-tv', artistName: 'Ayra Starr', songTitle: 'Commas',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Social media montage — digital native generation', spotifyUrl: null, season: 1, episode: 4 },

  // ═══════════════════════════════════════════════════════════════════════════
  // TV: The Last of Us S2 (2025) (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'tlou-001', mediaId: 'last-of-us-tv', artistName: 'Pearl Jam', songTitle: 'Future Days',
    isAfricanArtist: false, artistCountry: null, genre: 'Alt Rock', sceneDescription: 'Joel\'s guitar scene — devastating emotional payoff', spotifyUrl: null, season: 2, episode: 1 },
  { id: 'tlou-002', mediaId: 'last-of-us-tv', artistName: 'A-ha', songTitle: 'Take On Me',
    isAfricanArtist: false, artistCountry: null, genre: 'Synth Pop', sceneDescription: 'Ellie and Dina\'s first kiss', spotifyUrl: null, season: 2, episode: 3 },
  { id: 'tlou-003', mediaId: 'last-of-us-tv', artistName: 'Gustavo Santaolalla', songTitle: 'All Gone (No Escape)',
    isAfricanArtist: false, artistCountry: null, genre: 'Score', sceneDescription: 'The devastating midseason event', spotifyUrl: null, season: 2, episode: 5 },
  { id: 'tlou-004', mediaId: 'last-of-us-tv', artistName: 'Crosby Stills Nash & Young', songTitle: 'Helplessly Hoping',
    isAfricanArtist: false, artistCountry: null, genre: 'Folk Rock', sceneDescription: 'Season 2 finale — redemption or revenge', spotifyUrl: null, season: 2, episode: 7 },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: GTA VI (2026) (6)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'gta6-001', mediaId: 'gta-vi-2026', artistName: 'Burna Boy', songTitle: 'Rollercoaster',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Vice City Afrobeats Radio station — flagship track', spotifyUrl: null, season: null, episode: null },
  { id: 'gta6-002', mediaId: 'gta-vi-2026', artistName: 'Wizkid', songTitle: 'Fever',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Beach cruising radio playlist', spotifyUrl: null, season: null, episode: null },
  { id: 'gta6-003', mediaId: 'gta-vi-2026', artistName: 'Tyla', songTitle: 'Truth or Dare',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Amapiano Pop', sceneDescription: 'Nightclub scene — Leonida nightlife', spotifyUrl: null, season: null, episode: null },
  { id: 'gta6-004', mediaId: 'gta-vi-2026', artistName: 'Bad Bunny', songTitle: 'Monaco',
    isAfricanArtist: false, artistCountry: null, genre: 'Reggaeton', sceneDescription: 'Heist getaway drive — Latin radio station', spotifyUrl: null, season: null, episode: null },
  { id: 'gta6-005', mediaId: 'gta-vi-2026', artistName: 'Asake', songTitle: 'Lonely at the Top',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats / Amapiano', sceneDescription: 'Penthouse scene — luxury lifestyle radio', spotifyUrl: null, season: null, episode: null },
  { id: 'gta6-006', mediaId: 'gta-vi-2026', artistName: 'Travis Scott', songTitle: 'FE!N',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop / Trap', sceneDescription: 'High-speed chase sequence', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: Fortnite Festival (2024) (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'fn-001', mediaId: 'fortnite-2024', artistName: 'Burna Boy', songTitle: 'On the Low',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Fortnite Festival playable track — virtual stage performance', spotifyUrl: null, season: null, episode: null },
  { id: 'fn-002', mediaId: 'fortnite-2024', artistName: 'The Weeknd', songTitle: 'Blinding Lights',
    isAfricanArtist: false, artistCountry: null, genre: 'Synth Pop', sceneDescription: 'Launch day featured track — most played in Festival mode', spotifyUrl: null, season: null, episode: null },
  { id: 'fn-003', mediaId: 'fortnite-2024', artistName: 'Billie Eilish', songTitle: 'Bad Guy',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop / Alt', sceneDescription: 'Virtual concert event — 12M concurrent players', spotifyUrl: null, season: null, episode: null },
  { id: 'fn-004', mediaId: 'fortnite-2024', artistName: 'Davido', songTitle: 'Feel',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Season update featured track — Afrobeats in gaming', spotifyUrl: null, season: null, episode: null },
  { id: 'fn-005', mediaId: 'fortnite-2024', artistName: 'Lady Gaga', songTitle: 'Abracadabra',
    isAfricanArtist: false, artistCountry: null, genre: 'Pop', sceneDescription: 'Fortnite x Gaga virtual concert event', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // GAME: NFS Unbound (5)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'nfs-001', mediaId: 'nfs-unbound-2022', artistName: 'A$AP Rocky', songTitle: 'Shittin\' Me',
    isAfricanArtist: false, artistCountry: null, genre: 'Hip-Hop', sceneDescription: 'Title screen and main menu — A$AP as music director', spotifyUrl: null, season: null, episode: null },
  { id: 'nfs-002', mediaId: 'nfs-unbound-2022', artistName: 'Burna Boy', songTitle: 'Kilometre',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Night race playlist — speed and swagger', spotifyUrl: null, season: null, episode: null },
  { id: 'nfs-003', mediaId: 'nfs-unbound-2022', artistName: 'Skepta', songTitle: 'Greaze Mode',
    isAfricanArtist: false, artistCountry: null, genre: 'Grime', sceneDescription: 'Police chase sequences', spotifyUrl: null, season: null, episode: null },
  { id: 'nfs-004', mediaId: 'nfs-unbound-2022', artistName: 'Fireboy DML', songTitle: 'Playboy',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Garage customization menu', spotifyUrl: null, season: null, episode: null },
  { id: 'nfs-005', mediaId: 'nfs-unbound-2022', artistName: 'Headie One', songTitle: 'Ain\'t It Different',
    isAfricanArtist: false, artistCountry: null, genre: 'UK Drill', sceneDescription: 'Drift events soundtrack', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // AD: Nike AFCON 2025 (4)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'nafc-001', mediaId: 'nike-afcon-2025', artistName: 'Wizkid', songTitle: 'Essence',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Main campaign soundtrack — "Born to Play" TV spot', spotifyUrl: null, season: null, episode: null },
  { id: 'nafc-002', mediaId: 'nike-afcon-2025', artistName: 'Amaarae', songTitle: 'Sad Girlz Luv Money',
    isAfricanArtist: true, artistCountry: 'Ghana', genre: 'Afro Pop', sceneDescription: 'Women\'s football campaign — gender equality message', spotifyUrl: null, season: null, episode: null },
  { id: 'nafc-003', mediaId: 'nike-afcon-2025', artistName: 'Black Sherif', songTitle: 'Kwaku the Traveller',
    isAfricanArtist: true, artistCountry: 'Ghana', genre: 'Drill / Highlife', sceneDescription: 'Stadium walkout spot — players emerging from tunnel', spotifyUrl: null, season: null, episode: null },
  { id: 'nafc-004', mediaId: 'nike-afcon-2025', artistName: 'Diamond Platnumz', songTitle: 'Iyo',
    isAfricanArtist: true, artistCountry: 'Tanzania', genre: 'Bongo Flava', sceneDescription: 'East African market — continent-wide celebration', spotifyUrl: null, season: null, episode: null },

  // ═══════════════════════════════════════════════════════════════════════════
  // AD: Coca-Cola Summer 2025 (3)
  // ═══════════════════════════════════════════════════════════════════════════
  { id: 'coke-001', mediaId: 'coca-cola-summer-2025', artistName: 'Tyla', songTitle: 'Water (Coke Remix)',
    isAfricanArtist: true, artistCountry: 'South Africa', genre: 'Amapiano Pop', sceneDescription: 'Main 60-second TV spot — beach party across 4 continents', spotifyUrl: null, season: null, episode: null },
  { id: 'coke-002', mediaId: 'coca-cola-summer-2025', artistName: 'Rema', songTitle: 'Calm Down (Summer Mix)',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Digital campaign — 15-second social media cuts', spotifyUrl: null, season: null, episode: null },
  { id: 'coke-003', mediaId: 'coca-cola-summer-2025', artistName: 'Ckay', songTitle: 'Love Nwantiti',
    isAfricanArtist: true, artistCountry: 'Nigeria', genre: 'Afrobeats', sceneDescription: 'Billboards and radio — summer playlist sponsorship', spotifyUrl: null, season: null, episode: null },
]
