import { Movie } from "@/interfaces/interfaces";

export const KKPHIM_CONFIG = {
  baseURL: "https://phimapi.com/",
};
export const fetchMovies = async (page: number) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/danh-sach/phim-moi-cap-nhat-v2?page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Error fetching movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.items || [];
};
export const fetchTrendingMovies = async (type_list: string,page: number, sort_field: string) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/v1/api/the-loai/${type_list}?page=${page}&sort_field=${sort_field}`;
  const response = await fetch(endpoint, {
    method: "GET",
  })
  if (!response.ok) {
    throw new Error(`Error fetching trending movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data.data.items || [];
}
export const searchMovies = async (keyword: string) :Promise<Movie[]> => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/v1/api/tim-kiem?keyword=${keyword}`;
  const response = await fetch(endpoint, {
    method: "GET"});
  if(!response.ok){
    throw new Error(`Error while searching movies` + response.statusText)
  }
  const data = await response.json()
  const filmImages = data.data.APP_DOMAIN_CDN_IMAGE ?? ""
  return data.data.items ?? []
}
export const fetchMoviesEpisodes = async (slug: string) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/phim/${slug}`
  const response = await fetch(endpoint, {
    method: "GET",
  })
  if(!response.ok){
    throw new Error(`Error fetching movie details: ${response.statusText}`)
  }
  const data = await response.json();
  return data?.episodes?.[0]?.server_data || [];
}
export const fetchMovieDetails = async(slug: string) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/phim/${slug}`
  const response = await fetch(endpoint , {
    method: "GET",
  })
  if(!response.ok){
    throw new Error(
      `Error fetching movie details: ${response.statusText}`
    )
  }
  const data = await response.json()
  return data.movie || data
}

export const fetchMoviesByGenre = async (genre: string) => {
  const endpoint = `${KKPHIM_CONFIG}/v1/api/danh-sach/${genre}?page=1?`
  const response = await fetch(endpoint, {
    method: "GET"
  })
  if(!response.ok){
    throw new Error(
      `Error fetching movie details: ${response.statusText}`
    )
  }
  const data = await response.json()
  return data.data.items || []
}