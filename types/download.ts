import { MovieType } from "./movie-type";

export enum DownloadStatus {
  DOWNLOADING = 'downloading',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface DownloadTask {
  movieData: any;
  episodeNumber: number;
  id: string;
  m3u8Url?: string;
  mp4Url?: string;
  title: string;
  thumbUrl?: string;
  filePath: string;
  status: DownloadStatus;
  ffmpegSessionId?: number;
  downloadResumable?: any; 
  progress?: number;
  error?: string;
  createdAt: number;
  userId: string;
  
  episodeData?: {
    movieId?: string;
    episodeName?: string;
    episodeId?: string;
    episodeServerId?: string;
    episodeServerFileName?: string;
    episodeServerName?: string;
  };
}