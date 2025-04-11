export const KKPHIM_COFIG = {
  baseURL: "https://phimapi.com/",
};
export const fetchMovies = async (page: number) => {
  const endpoint = `${KKPHIM_COFIG.baseURL}/danh-sach/phim-moi-cap-nhat?page=${page}`;
  const response = await fetch(endpoint, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error(`Error fetching movies: ${response.statusText}`);
  }
  const data = await response.json();
  return data?.items || [];
};
export const searchMovies = async (keyword: string) :Promise<Movie[]> => {
  const endpoint = `${KKPHIM_COFIG.baseURL}v1/api/tim-kiem?keyword=${keyword}`;
  const response = await fetch(endpoint, {
    method: "GET"});
  if(!response.ok){
    throw new Error(`Error while searching movies` + response.statusText)
  }
  const data = await response.json()
  const filmImages = data.data.APP_DOMAIN_CDN_IMAGE ?? ""
  return data.data.items ?? []
}
export const fetchMovieDetails = async(slug: string) => {
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
  return data.movie || data
}

