export type Agency = {
  id: string
  name: string
  specialization: string[]
  description: string
  location: string
  logo: string
  verified: boolean
  recentSyncs: string[]
}

export const agencies: Agency[] = [
  {
    id: 'agency_1',
    name: 'Lionsgate Music',
    specialization: ['Film', 'TV', 'Franchise Soundtracks'],
    description: 'The music division of Lionsgate Entertainment, overseeing soundtrack curation and sync licensing across their vast film and television slate including major franchises.',
    location: 'Santa Monica, CA',
    logo: 'https://ui-avatars.com/api/?name=Lionsgate+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['John Wick: Chapter 4', 'The Hunger Games: Sunrise on the Reaping', 'Power']
  },
  {
    id: 'agency_2',
    name: 'PEN Music Group',
    specialization: ['TV', 'Film', 'Publishing'],
    description: 'A full-service independent music publishing company and sync agency known for placing music across premium TV and film productions. Their catalog spans multiple genres with a focus on emerging talent.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=PEN+Music+Group&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Grey\'s Anatomy', 'Riverdale', 'Love Island']
  },
  {
    id: 'agency_3',
    name: 'Position Music',
    specialization: ['Trailers', 'Ads', 'Gaming', 'TV'],
    description: 'An industry powerhouse in trailer music and advertising sync, Position Music delivers high-impact compositions for the world\'s biggest blockbusters, game launches, and brand campaigns.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Position+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Avengers: Secret Wars Trailer', 'Call of Duty', 'Monday Night Football']
  },
  {
    id: 'agency_4',
    name: 'Terrorbird Media',
    specialization: ['Indie', 'TV', 'Streaming'],
    description: 'A Portland-based indie music sync agency championing independent and emerging artists, with a strong track record of placing undiscovered talent in hit TV shows and streaming content.',
    location: 'Portland, OR',
    logo: 'https://ui-avatars.com/api/?name=Terrorbird+Media&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['Euphoria', 'The Summer I Turned Pretty', 'Heartstopper']
  },
  {
    id: 'agency_5',
    name: 'Music Dealers',
    specialization: ['Ads', 'Brands', 'Digital Campaigns'],
    description: 'A technology-driven music licensing company connecting brands with independent artists for advertising and marketing campaigns. Pioneers in scalable music licensing solutions for global brands.',
    location: 'Chicago, IL',
    logo: 'https://ui-avatars.com/api/?name=Music+Dealers&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Coca-Cola', 'Under Armour', 'Microsoft Surface']
  },
  {
    id: 'agency_6',
    name: 'Lip Sync Music',
    specialization: ['Ads', 'Film', 'Luxury Brands'],
    description: 'A London-based music supervision and sync licensing agency known for their work on high-profile advertising campaigns and feature films, with deep relationships across the UK and European music industries.',
    location: 'London, UK',
    logo: 'https://ui-avatars.com/api/?name=Lip+Sync+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Burberry', 'BBC Dracula', 'John Lewis Christmas Ad']
  },
  {
    id: 'agency_7',
    name: 'Sentric Music',
    specialization: ['Publishing', 'Sync', 'Rights Management'],
    description: 'A next-generation music publisher offering transparent royalty collection and sync licensing services to independent songwriters and artists worldwide, with a catalog of over 400,000 songs.',
    location: 'Liverpool, UK',
    logo: 'https://ui-avatars.com/api/?name=Sentric+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['FIFA 25', 'Peaky Blinders', 'Love Actually Live']
  },
  {
    id: 'agency_8',
    name: 'Marmoset Music',
    specialization: ['Ads', 'Film', 'Branded Content'],
    description: 'A creative music agency connecting filmmakers, brands, and agencies with handpicked artists and composers. Known for their curated, quality-over-quantity approach to music licensing.',
    location: 'Portland, OR',
    logo: 'https://ui-avatars.com/api/?name=Marmoset+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Google Pixel', 'Patagonia', 'REI Co-op']
  },
  {
    id: 'agency_9',
    name: 'Musicbed',
    specialization: ['Film', 'Ads', 'Weddings', 'Content Creation'],
    description: 'A premium music licensing platform offering a highly curated catalog of songs from independent artists for filmmakers, brands, and content creators seeking cinematic-quality music.',
    location: 'Fort Worth, TX',
    logo: 'https://ui-avatars.com/api/?name=Musicbed&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Canon EOS Campaign', 'Southwest Airlines', 'Squarespace']
  },
  {
    id: 'agency_10',
    name: 'Artlist',
    specialization: ['Content Creation', 'Social Media', 'Ads', 'Film'],
    description: 'A global creative technology company providing unlimited music and sound effect licensing for content creators, filmmakers, and brands through a subscription-based model.',
    location: 'Tel Aviv, Israel',
    logo: 'https://ui-avatars.com/api/?name=Artlist&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['YouTube Originals', 'Samsung Galaxy', 'National Geographic']
  },
  {
    id: 'agency_11',
    name: 'Extreme Music',
    specialization: ['TV', 'Film', 'Ads', 'Production Music'],
    description: 'A Sony Music Publishing company and one of the world\'s leading production music libraries, providing premium music for television, film, advertising, and digital media across the globe.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Extreme+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['The Walking Dead', 'ESPN SportsCenter', 'HBO Max Promos']
  },
  {
    id: 'agency_12',
    name: 'APM Music',
    specialization: ['Production Music', 'TV', 'Film', 'Podcasts'],
    description: 'One of the largest and most historic production music libraries in the world, offering over 800,000 tracks spanning every genre. A go-to resource for broadcast networks and production houses.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=APM+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['SpongeBob SquarePants', 'The Daily Show', 'CNN']
  },
  {
    id: 'agency_13',
    name: 'Jingle Punks',
    specialization: ['TV', 'Film', 'Advertising', 'Sports'],
    description: 'A Grammy-nominated music licensing and production company creating custom and catalog music for television, film, and brands. Known for their fast turnaround and genre-spanning roster.',
    location: 'New York, NY',
    logo: 'https://ui-avatars.com/api/?name=Jingle+Punks&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Anthony Bourdain: Parts Unknown', 'Vice News', 'MLB Network']
  },
  {
    id: 'agency_14',
    name: 'Big Sync Music',
    specialization: ['Sync', 'Artist Representation', 'Brands'],
    description: 'A specialist sync licensing agency based in London representing an eclectic roster of artists and songwriters, with a focus on securing premium sync placements in advertising and entertainment.',
    location: 'London, UK',
    logo: 'https://ui-avatars.com/api/?name=Big+Sync+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Peloton', 'Sky Atlantic', 'Jaguar Land Rover']
  },
  {
    id: 'agency_15',
    name: 'Songs For Film',
    specialization: ['Film', 'TV', 'Music Supervision'],
    description: 'A boutique music supervision and sync company specializing in curating soundtracks for independent and studio films, with a deep passion for pairing the perfect song to every scene.',
    location: 'New York, NY',
    logo: 'https://ui-avatars.com/api/?name=Songs+For+Film&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['A24 Films', 'Sundance Selections', 'The Marvelous Mrs. Maisel']
  },
  {
    id: 'agency_16',
    name: 'Nettwerk Music Group',
    specialization: ['Sync', 'Artist Management', 'Publishing'],
    description: 'One of the world\'s leading independent music companies combining artist management, publishing, and sync licensing. Their roster includes globally recognized acts with decades of sync success.',
    location: 'Vancouver, Canada',
    logo: 'https://ui-avatars.com/api/?name=Nettwerk+Music+Group&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Ted Lasso', 'This Is Us', 'Apple AirPods']
  },
  {
    id: 'agency_17',
    name: 'Better Noise Music',
    specialization: ['Rock', 'Metal', 'Sync', 'Film'],
    description: 'A rock and metal-focused record label and music company with an aggressive sync strategy, placing hard-hitting tracks in sports broadcasts, action films, and video game trailers.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Better+Noise+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['WWE SmackDown', 'Madden NFL', 'The Expendables 4']
  },
  {
    id: 'agency_18',
    name: 'Secret Road',
    specialization: ['Boutique Sync', 'Artist Development', 'TV'],
    description: 'A boutique music company founded by industry veterans, offering highly personalized sync representation and artist development with a focus on building lasting careers through strategic placements.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Secret+Road&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['Yellowstone', 'Virgin River', 'The Wilds']
  },
  {
    id: 'agency_19',
    name: 'Bank Robber Music',
    specialization: ['Sync', 'Licensing', 'TV', 'Film'],
    description: 'A LA-based sync licensing agency with a reputation for breaking new artists through high-profile television and film placements, representing a diverse roster across indie, pop, and electronic genres.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Bank+Robber+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['Shameless', 'The Vampire Diaries', 'Lucifer']
  },
  {
    id: 'agency_20',
    name: 'Mophonics',
    specialization: ['Custom Music', 'Ads', 'Sonic Branding'],
    description: 'A NYC-based music production house and creative studio crafting bespoke compositions, sonic logos, and custom scores for advertising agencies and global brands.',
    location: 'New York, NY',
    logo: 'https://ui-avatars.com/api/?name=Mophonics&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['Target', 'Verizon', 'HBO Brand Spots']
  },
  {
    id: 'agency_21',
    name: 'Heavy Duty Projects',
    specialization: ['Boutique Sync', 'Music Supervision', 'Ads'],
    description: 'A boutique music supervision and sync agency in NYC providing highly curated, tastemaker-driven music selections for premium advertising campaigns and independent film projects.',
    location: 'New York, NY',
    logo: 'https://ui-avatars.com/api/?name=Heavy+Duty+Projects&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['Nike Running', 'Converse', 'Tribeca Film Festival']
  },
  {
    id: 'agency_22',
    name: 'Warner Chappell Production Music',
    specialization: ['Production Music', 'TV', 'Film', 'Gaming'],
    description: 'The production music division of Warner Music Group, offering one of the world\'s most comprehensive libraries of pre-cleared music for broadcast, film, gaming, and digital content.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Warner+Chappell+PM&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['NBC Nightly News', 'Discovery Channel', 'EA Sports FC']
  },
  {
    id: 'agency_23',
    name: 'Universal Production Music',
    specialization: ['Production Music', 'TV', 'Ads', 'Digital'],
    description: 'Universal Music Group\'s dedicated production music arm, providing an unrivaled catalog of high-quality music and sound design for content creators, broadcasters, and advertisers worldwide.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Universal+Production+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['ABC World News Tonight', 'Netflix Originals', 'Amazon Prime Promos']
  },
  {
    id: 'agency_24',
    name: 'Sony Music Publishing',
    specialization: ['Publishing', 'Sync', 'Catalog Licensing'],
    description: 'One of the world\'s largest music publishers, representing legendary songwriters and catalogs. Their sync team actively pitches across film, TV, ads, and gaming with unmatched catalog depth.',
    location: 'Nashville, TN',
    logo: 'https://ui-avatars.com/api/?name=Sony+Music+Publishing&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Stranger Things', 'Top Gun: Maverick', 'Super Bowl LVIII']
  },
  {
    id: 'agency_25',
    name: 'BMG Production Music',
    specialization: ['Production Music', 'TV', 'Sports Broadcasting'],
    description: 'BMG\'s dedicated production music division offering a vast library of pre-cleared tracks tailored for broadcast networks, sports programming, news, and digital content producers.',
    location: 'Nashville, TN',
    logo: 'https://ui-avatars.com/api/?name=BMG+Production+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Fox Sports', 'CBS Sunday Morning', 'Premier League Broadcasts']
  },
  {
    id: 'agency_26',
    name: 'Crucial Music',
    specialization: ['Sync', 'Licensing', 'TV', 'Film'],
    description: 'An independent sync licensing company offering artists a non-exclusive, no-fee model to get their music placed in TV shows, films, and commercials across major networks.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Crucial+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['NCIS', 'Chicago Fire', 'The Blacklist']
  },
  {
    id: 'agency_27',
    name: 'Angry Mob Music',
    specialization: ['Sync', 'Publishing', 'Indie', 'Pop'],
    description: 'A creative independent music publisher and sync agency with a carefully curated roster of songwriters and producers, placing music across TV, film, trailers, and advertising.',
    location: 'Los Angeles, CA',
    logo: 'https://ui-avatars.com/api/?name=Angry+Mob+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: false,
    recentSyncs: ['13 Reasons Why', 'Pretty Little Liars', 'Toyota Camry']
  },
  {
    id: 'agency_28',
    name: 'Downtown Music Publishing',
    specialization: ['Publishing', 'Sync', 'Rights Management'],
    description: 'A major independent music publisher managing a catalog of over 145,000 copyrights, with a global sync team proactively placing songs across all media verticals.',
    location: 'New York, NY',
    logo: 'https://ui-avatars.com/api/?name=Downtown+Music+Publishing&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Bridgerton', 'Emily in Paris', 'Beats by Dre']
  },
  {
    id: 'agency_29',
    name: 'Warp Records',
    specialization: ['Electronic', 'Sync', 'Experimental'],
    description: 'The iconic UK electronic label whose groundbreaking roster of artists provides a unique sonic palette for sync placements in film, fashion, and avant-garde advertising.',
    location: 'London, UK',
    logo: 'https://ui-avatars.com/api/?name=Warp+Records&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Ex Machina', 'Gucci', 'Black Mirror']
  },
  {
    id: 'agency_30',
    name: 'Sub Pop Records',
    specialization: ['Indie', 'Sync', 'Alternative'],
    description: 'The legendary Seattle indie label behind Nirvana and many others, whose sync department actively places catalog and new releases in film, TV, and brand campaigns with cultural cachet.',
    location: 'Seattle, WA',
    logo: 'https://ui-avatars.com/api/?name=Sub+Pop+Records&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['The Last of Us', 'Juno', 'Starbucks']
  },
  {
    id: 'agency_31',
    name: 'Domino Recording Company',
    specialization: ['Indie', 'Sync', 'Alt-Rock'],
    description: 'A prestigious UK indie label home to Arctic Monkeys, Animal Collective, and more, with an active sync licensing operation placing their critically acclaimed catalog in premium TV and film.',
    location: 'London, UK',
    logo: 'https://ui-avatars.com/api/?name=Domino+Recording&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Peaky Blinders', 'Normal People', 'Apple TV+ Originals']
  },
  {
    id: 'agency_32',
    name: 'Beggars Group',
    specialization: ['Indie', 'Sync', 'Electronic', 'Alternative'],
    description: 'The family of labels including 4AD, Matador, Rough Trade, and XL Recordings, collectively offering one of the most respected indie catalogs for sync licensing in the world.',
    location: 'London, UK',
    logo: 'https://ui-avatars.com/api/?name=Beggars+Group&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['Succession', 'The White Lotus', 'Adidas Originals']
  },
  {
    id: 'agency_33',
    name: 'ABKCO Music & Records',
    specialization: ['Catalog Sync', 'Classic Rock', 'Film'],
    description: 'The custodian of legendary catalogs from The Rolling Stones, Sam Cooke, and Bobby Womack, ABKCO specializes in placing iconic classic tracks in film, TV, and major advertising campaigns.',
    location: 'New York, NY',
    logo: 'https://ui-avatars.com/api/?name=ABKCO+Music&background=4b4bc0&color=fff&bold=true&size=100',
    verified: true,
    recentSyncs: ['The Departed', 'Goodfellas', 'Apple Music Campaign']
  }
]
