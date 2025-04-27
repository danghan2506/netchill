import { SharedValue } from "react-native-reanimated"

interface Root {
  status: boolean
  msg: string
  movie: Movie
  episodes: Episode[]
}
interface Movie {
  tmdb: Tmdb
  imdb: Imdb
  created: Created
  modified: Modified
  _id: string
  name: string
  slug: string
  origin_name: string
  content: string
  type: string
  status: string
  poster_url: string
  thumb_url: string
  is_copyright: boolean
  sub_docquyen: boolean
  chieurap: boolean
  trailer_url: string
  time: string
  episode_current: string
  episode_total: string
  quality: string
  lang: string
  notify: string
  showtimes: string
  year: number
  view: number
  actor: string[]
  director: string[]
  category: Category
  country: Country[]
  APP_DOMAIN_CDN_IMAGE: string
  scrollX: SharedValue<number>
}
interface TrendingMovie {
  keyword: string,
  page: number,
  sort_field: string,
  sort_lang: string,
  category: string,
  country: string,
  year: number,
  limit: number,
}
interface Tmdb {
  type: string
  id: string
  season: number
  vote_average: number
  vote_count: number
}

interface Imdb {
  id: any
}

interface Created {
  time: string
}

interface Modified {
  time: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Country {
  id: string
  name: string
  slug: string
}

interface Episode {
  server_name: string
  server_data: ServerDaum[]
}

interface ServerDaum {
  name: string
  slug: string
  filename: string
  link_embed: string
  link_m3u8: string
}

