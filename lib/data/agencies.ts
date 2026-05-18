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
    name: 'Ghostwriter Music',
    specialization: ['Trailers', 'Ads', 'Film'],
    description: 'Leading production music and sound design company specializing in high-end trailers and cinematic advertising.',
    location: 'Los Angeles, CA',
    logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=100&h=100',
    verified: true,
    recentSyncs: ['Dune: Part Two', 'Oppenheimer', 'Nike: Winning Isn\'t For Everyone']
  },
  {
    id: 'agency_2',
    name: 'Zync Music',
    specialization: ['TV', 'Streaming', 'Indie Artists'],
    description: 'A music licensing and brand building agency representing a highly curated roster of independent artists.',
    location: 'New York, NY',
    logo: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=100&h=100',
    verified: true,
    recentSyncs: ['Stranger Things', 'The Bear', 'Apple iPhone 15 Pro']
  },
  {
    id: 'agency_3',
    name: 'Ninja Tune Production Music',
    specialization: ['Electronic', 'Avant-Garde', 'Experimental'],
    description: 'The production music arm of the legendary independent label Ninja Tune, offering unique and cutting-edge sounds.',
    location: 'London, UK',
    logo: 'https://images.unsplash.com/photo-1614850523598-911181848b3f?auto=format&fit=crop&q=80&w=100&h=100',
    verified: true,
    recentSyncs: ['Cyberpunk 2077', 'Adidas Originals', 'Formula 1']
  },
  {
    id: 'agency_4',
    name: 'Soundtree Music',
    specialization: ['High Fashion', 'Luxury Ads', 'Art Films'],
    description: 'Award-winning music production and supervision company known for their artistic approach to commercial scores.',
    location: 'London, UK',
    logo: 'https://images.unsplash.com/photo-1614850523048-c2d1c699c52b?auto=format&fit=crop&q=80&w=100&h=100',
    verified: false,
    recentSyncs: ['Chanel No. 5', 'Mercedes Benz Vision', 'Vogue World']
  },
  {
    id: 'agency_5',
    name: 'Elias Music',
    specialization: ['Broadcast', 'Branding', 'Sonic Identity'],
    description: 'Global sonic branding agency that has defined the sound of the world\'s most iconic brands for decades.',
    location: 'Santa Monica, CA',
    logo: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=100&h=100',
    verified: true,
    recentSyncs: ['NBC Olympics', 'Coca-Cola Summer', 'Toyota Global']
  }
]
