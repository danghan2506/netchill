// quan ly tac vu tai xuong 
// theo doi trang thai tai xuong (hoan thanh, dang tai, loi)
// luu tru thong tin cac tac vu tai xuong
import { DownloadStatus, DownloadTask } from "@/types/download";
import * as FileSystem from "expo-file-system";
import { MovieType } from "@/types/movie-type";

// Define constants for file paths
export const DOWNLOAD_DIR = FileSystem.documentDirectory + "movies/";
const DOWNLOAD_DATA_FILE = FileSystem.documentDirectory + "movie-downloads.json";

// In-memory storage for download tasks
let downloadQueue: { [id: string]: DownloadTask } = {};
let dataLoaded = false;

// Event listener management
type Listener = () => void;
const changeListeners: Listener[] = [];
// 1. Quản lý sự kiện tải xuống 
// cho phép các component đăng ký lắng nghe sự thay đổi trạng thái tải xuống.
export const subscribeToDownloadChanges = (listener: Listener): (() => void) => {
    changeListeners.push(listener);
    return () => {
        const index = changeListeners.indexOf(listener);
        if (index > -1) {
            changeListeners.splice(index, 1);
        }
    };
};

// thông báo cho tất cả các listener về sự thay đổi trạng thái tải xuống.
const notifyDownloadChanges = () => {
    setTimeout(() => {
        changeListeners.forEach((listener) => listener());
    }, 0);
};

// 2.Quản lý thư mục và file tải xuống
// Đảm bảo thư mục tải xuống tồn tại
export const initializeDownloadDirectory = async (): Promise<void> => {
    const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, {
            intermediates: true,
        });
    }
};
// kiểm tra xem file có tồn tại hay không
export const checkFileExists = async (filePath: string): Promise<boolean> => {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists;
};

// xóa 1 fle cụ thể
export const deleteDownloadedFile = async (filePath: string): Promise<boolean> => {
    try {
        await FileSystem.deleteAsync(filePath, { idempotent: true });
        return true;
    } catch (error) {
        console.error(`Lỗi khi xóa file: ${filePath}`, error);
        return false;
    }
};
// 3.Quản lý tác vụ tải xuống 

// Lưu một tác vụ tải xuống mới vào bộ nhớ và lưu trữ.
export const saveDownloadTask = (task: DownloadTask): void => {
    downloadQueue[task.id] = task;
    saveDownloadData();
};

// lấy thông tin một tác vụ tải xuống cụ thể theo ID.
export const getDownloadTask = (taskId: string): DownloadTask | null => {
    return downloadQueue[taskId] || null;
};

// Lấy tất cả các tác vụ tải xuống.
export const getAllDownloadTasks = (): DownloadTask[] => {
    return Object.values(downloadQueue);
};
// Xóa 1 tác vụ tải xuống cụ thể theo id 
export const removeDownloadTask = (taskId: string): void => {
    if (downloadQueue[taskId]) {
        delete downloadQueue[taskId];
        saveDownloadData();
    }
};
// 4.Quản lý trạng thái tải xuống

// Cập nhật trạng thái của một tác vụ tải xuống.
export const updateDownloadTask = (
    taskId: string,
    updates: Partial<DownloadTask>
) => {
    if (downloadQueue[taskId]) {
        downloadQueue[taskId] = { ...downloadQueue[taskId], ...updates };
        saveDownloadData();
    }
};

// Xóa tất cả các tác vụ tải xuống.
export const clearAllDownloads = (): void => {
    downloadQueue = {};
    saveDownloadData();
};

// 5.Lưu trữ dữ liệu 

// tải dữ liệu tải xuống đã lưu từ bộ nhớ 
export const loadDownloadData = async (): Promise<void> => {
    if (dataLoaded) return;
    try {
        const fileInfo = await FileSystem.getInfoAsync(DOWNLOAD_DATA_FILE);

        if (fileInfo.exists) {
            const jsonData = await FileSystem.readAsStringAsync(DOWNLOAD_DATA_FILE);
            const storedTasks = JSON.parse(jsonData);

            for (const [taskId, task] of Object.entries(storedTasks)) {
                const downloadTask = task as DownloadTask;

                // Verify if completed downloads still exist
                if (downloadTask.status === DownloadStatus.COMPLETED) {
                    const fileExists = await checkFileExists(downloadTask.filePath);
                    if (!fileExists) {
                        downloadTask.status = DownloadStatus.FAILED;
                        downloadTask.error = "File không còn tồn tại";
                    }
                }

                downloadQueue[taskId] = downloadTask;
            }
        } else {
            await saveDownloadData();
        }

        dataLoaded = true;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu tải xuống:", error);
        await saveDownloadData();
        dataLoaded = true;
    }
};
// lưu trạng thía hiện tại của downloadQueue vào bộ nhớ
const saveDownloadData = async (): Promise<void> => {
    try {
        const jsonData = JSON.stringify(downloadQueue);
        await FileSystem.writeAsStringAsync(DOWNLOAD_DATA_FILE, jsonData);
        notifyDownloadChanges();
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu tải xuống:", error);
    }
};

// 6.Quản lý theo người dùng riêng biệt

// lấy tất cả các video đã tải xuống của người dùng 
export const getUserDownloads = (userId: string): DownloadTask[] => {
    return Object.values(downloadQueue).filter(task => task.userId === userId);
};

// tìm 1 phim cụ thể của người dùng đã tải xuống
export const findEpisodeDownload = (
    movieId: string,
    episodeNumber: number,
    userId: string
): DownloadTask | null => {
    return Object.values(downloadQueue).find(
        task => task.movieData?.id === movieId && 
               task.episodeNumber === episodeNumber && 
               task.userId === userId
    ) || null;
};

// kiểm tra xem 1 phim có đang tải xuống hay không
export const isMovieDownloading = (movieId: string, userId: string): boolean => {
    return Object.values(downloadQueue).some(
        task => task.movieData?.id === movieId && 
               task.userId === userId && 
               task.status === DownloadStatus.IN_PROGRESS
    );
};

// 7.Các hàm tiện ích

// Tạo tên file cho phim 
export const generateMovieFilename = (movieTitle: string, episodeNumber?: number): string => {
    const safeName = movieTitle.replace(/[^a-zA-Z0-9-_.]/g, "_");
    return episodeNumber ? `${safeName}_ep${episodeNumber}.mp4` : `${safeName}.mp4`;
};
//  Lấy tiến trình của một tác vụ tải xuống cụ thể.
export const getDownloadProgress = (taskId: string): number => {
    const task = downloadQueue[taskId];
    return task ? task.progress || 0 : 0;
};

// Tính toán tổng dung lượng lưu trữ đã sử dụng bởi các file đã tải xuống.
export const getDownloadStorageUsage = async (): Promise<number> => {
    let totalSize = 0;
    for (const task of Object.values(downloadQueue)) {
        if (task.status === DownloadStatus.COMPLETED && task.filePath) {
            const fileInfo = await FileSystem.getInfoAsync(task.filePath);
            if (fileInfo.exists && fileInfo.size) {
                totalSize += fileInfo.size;
            }
        }
    }
    return totalSize;
};
