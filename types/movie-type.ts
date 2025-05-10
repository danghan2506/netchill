export interface MovieType {
    id: string;
    name: string;
    slug: string;
}
export interface DownloadedVideo {
    id: string;
    episodeId: string;
    movieId: string;
    title: string;
    thumbnail: string;
    uri: string;
    size: number;
    downloadedAt: string;
  }
export interface MovieGenre {
    id: string;
    name: string;
    slug: string;
}