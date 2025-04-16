import { useEffect, useState } from "react";
// fetchFunction: fetchMovies, fetchMovieDetails
// <T> là một generic type đại diện cho kiểu dữ liệu mà fetchFunction sẽ trả về.
// Ví dụ: nếu fetchFunction trả về một mảng các đối tượng phim, thì T sẽ là kiểu mảng đó.
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  const [data, setData] = useState<T>([] as T); // default = array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData([] as T); // reset về mảng rỗng
    setLoading(false);
    setError(null);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData, reset };
};


export default useFetch;