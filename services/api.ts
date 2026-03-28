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
export const fetchTrendingMovies = async (page: number) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}danh-sach/phim-moi-cap-nhat?page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Error fetching trending movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.items || [];
}
export const fetchTopRatedMovies = async (page: number) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}danh-sach/phim-moi-cap-nhat-v3?page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Error fetching top rated movies: ${response.statusText}`);
  }
  const data = await response.json();
  const items: Movie[] = data?.items || [];
  // Sort by TMDB vote average in descending order (highest first)
  const sortedItems = items.sort((a, b) => {
    const voteA = a.tmdb?.vote_average || 0;
    const voteB = b.tmdb?.vote_average || 0;
    return voteB - voteA;
  });
  return sortedItems;
}
export const fetchMostSearchedMovies = async(page: number) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}danh-sach/phim-moi-cap-nhat?page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Error fetching most searched movies: ${response.statusText}`);
  }
  const data = await response.json();
  const items: Movie[] = data?.items || [];
  // Sort by weighted TMDB score (vote_count * vote_average)
  // This prioritizes movies that are both popular (highly searched) and well-rated
  const sortedItems = items.sort((a, b) => {
    const weightA = (a.tmdb?.vote_count || 0) * (a.tmdb?.vote_average || 0);
    const weightB = (b.tmdb?.vote_count || 0) * (b.tmdb?.vote_average || 0);
    return weightB - weightA;
  });
  return sortedItems;
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
export const fetchGenres = async () => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/the-loai`
  const response = await fetch(endpoint, {
    method: "GET"
  })
  if(!response.ok){
    throw new Error(
      `Error fetching movie details: ${response.statusText}`
    )
  }
  const data = await response.json()
  return data || []
}
export const fetchMoviesByGenre = async (genre: string) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}/v1/api/the-loai/${genre}?page=1`
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
export const fetchLatestMovies = async () => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}v1/api/danh-sach/phim-bo?page=1&sort_field=modified.time`
  const response = await fetch(endpoint, {
    method: "GET"
  })
  if(!response.ok){
      throw new Error(
        `Error fetching latest movies: ${response.statusText}`
      )
  }
  const data = await response.json()
  return data.data.items || [];
}
export const fetchPopularMovies = async (page: number, sort_field: string, sort_type: string) => {
  const endpoint = `${KKPHIM_CONFIG.baseURL}v1/api/danh-sach/phim-bo?page=${page}&sort_field=${sort_field}&sort_type=${sort_type}`
  const response = await fetch(endpoint, {
    method: "GET"
  })
  const data = await response.json()
  return data.data.items || []
}
