import Constants from 'expo-constants';
const {EXPO_PUBLIC_TMDB_API_KEY} = Constants.expoConfig?.extra || {};
if (!EXPO_PUBLIC_TMDB_API_KEY) {
  throw new Error("Missing TMDB API key in environment variables");
}
export const KKPHIM_COFIG = {
  baseURL: "https://phimapi.com/",
};
// export const fetchMovies = async ({ query }: { query: string }) => {
//   const endpoint = query
//   ? `${TMDB_CONFIG.baseURL}/search/movie?query=${encodeURIComponent(query)}`
//   : `${TMDB_CONFIG.baseURL}/discover/movie?sort_by=popularity.desc`;
//   const response = await fetch(endpoint, {
//     method: "GET",
//     headers: TMDB_CONFIG.headers,
//   });
//   if (!response.ok) {
//     throw new Error(`Error fetching movies: ${response.statusText}`);
//   }
//   const data = await response.json();
//   return data.results;
// };
export const fetchMovies = async (page: number = 1) => {
  const endpoint = `${KKPHIM_COFIG.baseURL}/danh-sach/phim-moi-cap-nhat?page=${page}`
  const response = await fetch(endpoint, {
    method: "GET",
  })
  if (!response.ok){
    throw new Error(
    `Error fetching trending movies: ${response.statusText}`
    )
  }
  const data = await response.json()
  return data.results
}
export const fetchMoviesDetails = async(slug: string) => {
  const endpoint = `${KKPHIM_COFIG.baseURL}/phim/${slug}`
  const response = await fetch(endpoint , {
    method: "GET",
  })
  if(!response.ok){
    throw new Error(
      `Error fetching movie details: ${response.statusText}`
    )
  }
  const data = await response.json()
  return data.results
}

