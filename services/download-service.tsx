import * as FileSystem from "expo-file-system";
import NetInfo, {
    NetInfoState,
    NetInfoSubscription,
} from "@react-native-community/netinfo";
import { FFmpegKit, ReturnCode } from "ffmpeg-kit-react-native";
import { DownloadStatus, DownloadTask } from "@/types/download";
import * as StorageService from "./storage-service";
import * as NotificationService from "./noti-sertice";

// Constants
const MAX_CONCURRENT_DOWNLOADS = 2;
let downloadVideoCount = 0;
let isDownloading = false;
let netInfoSubscription: NetInfoSubscription | null = null;
let isConnected = true;

// handle connection changes
const handleConnectionChange = (state: NetInfoState) => {
    const previousState = isConnected;
    isConnected = state.isConnected ?? false;
    if (previousState && !isConnected) {
        const activeDownloads = StorageService.getAllDownloadTasks().filter(
            (task) =>
                task.status === DownloadStatus.PENDING &&
                (task.ffmpegSessionId || task.downloadResumable)
        );
        activeDownloads.forEach(async (task) => {
            if (task.ffmpegSessionId) {
                await FFmpegKit.cancel(task.ffmpegSessionId);
                StorageService.updateDownloadTask(task.id, {
                    status: DownloadStatus.CANCELLED,
                    error: "Download cancelled due to internet connection loss",
                    ffmpegSessionId: undefined,
                });
            } else if (task.downloadResumable) {
                await task.downloadResumable.pauseAsync();
                StorageService.updateDownloadTask(task.id, {
                    status: DownloadStatus.CANCELLED,
                    error: "Download cancelled due to internet connection loss",
                    downloadResumable: undefined,
                });
            }
            const updatedTask = StorageService.getDownloadTask(task.id);
            if (updatedTask) {
                await NotificationService.sendCancelledNotification(updatedTask);
            }
        });
    }
};

// process next download
const processNextDownload = () => {
    if (downloadVideoCount >= MAX_CONCURRENT_DOWNLOADS || !isConnected) {
        return;
    }

    const waitingTasks = StorageService.getAllDownloadTasks().filter(
        (task) =>
            task.status === DownloadStatus.PENDING &&
            !task.ffmpegSessionId &&
            !task.downloadResumable
    );

    if (waitingTasks.length > 0) {
        const task = waitingTasks[0];
        if (task.m3u8Url) {
            startFFmpegDownload(task.id);
        } else if (task.mp4Url) {
            startDirectDownload(task.id);
        }
    }
};

// mp4 download 
const startDirectDownload = async (taskId: string) => {
    const task = StorageService.getDownloadTask(taskId);
    if (!task || task.status !== DownloadStatus.PENDING || !task.mp4Url) {
        console.warn(`Task ${taskId} not valid for direct download.`);
        processNextDownload();
        return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
        console.warn(`Cannot start download for task ${taskId}: No internet connection.`);
        StorageService.updateDownloadTask(taskId, {
            status: DownloadStatus.CANCELLED,
            error: "No internet connection available",
        });

        const cancelledTask = StorageService.getDownloadTask(taskId);
        if (cancelledTask) {
            await NotificationService.sendCancelledNotification(cancelledTask);
        }
        return;
    }

    downloadVideoCount++;
    await NotificationService.sendStateNotification(task);

    try {
        const downloadResumable = FileSystem.createDownloadResumable(
            task.mp4Url,
            task.filePath,
            {},
            (downloadProgress) => {
                const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
                StorageService.updateDownloadTask(taskId, { progress });
            }
        );

        StorageService.updateDownloadTask(taskId, { downloadResumable });
        const result = await downloadResumable.downloadAsync();
        
        if (result) {
            StorageService.updateDownloadTask(taskId, {
                status: DownloadStatus.COMPLETED,
                downloadResumable: undefined,
            });
            
            const completedTask = StorageService.getDownloadTask(taskId);
            if (completedTask) {
                await NotificationService.sendCompletionNotification(completedTask, true);
            }
        } else {
            StorageService.updateDownloadTask(taskId, {
                status: DownloadStatus.CANCELLED,
                error: "Download failed",
                downloadResumable: undefined,
            });
            
            const cancelledTask = StorageService.getDownloadTask(taskId);
            if (cancelledTask) {
                await NotificationService.sendCancelledNotification(cancelledTask);
            }
        }
    } catch (error) {
        console.error(`Error downloading MP4 for task ${taskId}:`, error);
        
        StorageService.updateDownloadTask(taskId, {
            status: DownloadStatus.CANCELLED,
            error: `Download failed: ${error}`,
            downloadResumable: undefined,
        });
        
        const cancelledTask = StorageService.getDownloadTask(taskId);
        if (cancelledTask) {
            await NotificationService.sendCancelledNotification(cancelledTask);
        }
    } finally {
        downloadVideoCount--;
        processNextDownload();
    }
};

const startFFmpegDownload = async (taskId: string) => {
    const task = StorageService.getDownloadTask(taskId);
    if (!task || task.status !== DownloadStatus.PENDING || !task.m3u8Url) {
        console.warn(`Task ${taskId} not valid for FFmpeg download.`);
        processNextDownload();
        return;
    }

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
        console.warn(`Cannot start download for task ${taskId}: No internet connection.`);
        StorageService.updateDownloadTask(taskId, {
            status: DownloadStatus.CANCELLED,
            error: "No internet connection available",
        });

        const cancelledTask = StorageService.getDownloadTask(taskId);
        if (cancelledTask) {
            await NotificationService.sendCancelledNotification(cancelledTask);
        }
        return;
    }

    downloadVideoCount++;
    await NotificationService.sendStateNotification(task);

    const command = `-i "${task.m3u8Url}" -c copy -bsf:a aac_adtstoasc "${task.filePath}"`;

    try {
        const session = await FFmpegKit.executeAsync(
            command,
            async (session) => {
                const returnCode = await session.getReturnCode();
                const sessionId = session.getSessionId();
                const completedTask = StorageService.getDownloadTask(taskId);

                downloadVideoCount--;

                if (!completedTask) {
                    console.error(`Task ${taskId} not found after completion.`);
                    processNextDownload();
                    return;
                }

                if (ReturnCode.isSuccess(returnCode)) {
                    StorageService.updateDownloadTask(taskId, {
                        status: DownloadStatus.COMPLETED,
                        ffmpegSessionId: undefined,
                    });
                    await NotificationService.sendCompletionNotification(completedTask, true);
                } else if (ReturnCode.isCancel(returnCode)) {
                    StorageService.updateDownloadTask(taskId, {
                        status: DownloadStatus.CANCELLED,
                        ffmpegSessionId: undefined,
                    });
                    await NotificationService.sendCancelledNotification(completedTask);
                } else {
                    const errorLogs = await session.getLogsAsString();
                    console.error(
                        `FFmpeg task ${taskId} (Session ${sessionId}) failed. Return code: ${returnCode}`
                    );
                    const errorMsg = `FFmpeg failed with code ${returnCode}.`;

                    StorageService.updateDownloadTask(taskId, {
                        status: DownloadStatus.CANCELLED,
                        error: errorMsg,
                        ffmpegSessionId: undefined,
                    });

                    await NotificationService.sendCancelledNotification(completedTask);
                }
                processNextDownload();
            },
            (log) => {},
            (statistics) => {}
        );

        StorageService.updateDownloadTask(taskId, {
            ffmpegSessionId: session.getSessionId(),
        });
    } catch (error) {
        downloadVideoCount--;
        console.error(`Error starting FFmpeg task ${taskId}:`, error);

        StorageService.updateDownloadTask(taskId, {
            status: DownloadStatus.CANCELLED,
            error: "Failed to start FFmpeg process.",
            ffmpegSessionId: undefined,
        });

        const cancelledTask = StorageService.getDownloadTask(taskId);
        if (cancelledTask) {
            await NotificationService.sendCancelledNotification(cancelledTask);
        }

        processNextDownload();
    }
};

export const initializeDownloadService = async () => {
    if (isDownloading) return;

    await StorageService.initializeDownloadDirectory();
    await StorageService.loadDownloadData();

    // Mark any interrupted downloads as cancelled
    const interruptedTasks = StorageService.getAllDownloadTasks().filter(
        task => task.status === DownloadStatus.PENDING
    );

    for (const task of interruptedTasks) {
        StorageService.updateDownloadTask(task.id, {
            status: DownloadStatus.CANCELLED,
            error: "Download cancelled due to app closure",
            ffmpegSessionId: undefined,
            downloadResumable: undefined,
        });
        
        // Clean up any partial files
        try {
            await StorageService.deleteDownloadedFile(task.filePath);
        } catch (error) {
            console.warn(`Could not delete partial file for ${task.id}:`, error);
        }
    }

    await NotificationService.initializeNotifications();
    netInfoSubscription = NetInfo.addEventListener(handleConnectionChange);

    const netState = await NetInfo.fetch();
    isConnected = netState.isConnected ?? false;
    isDownloading = true;
};

export const startDownload = async (
    id: string,
    m3u8Url: string | undefined,
    mp4Url: string | undefined,
    title: string,
    thumbUrl: string | undefined,
    userId: string,
    movieData: any,
    episodeNumber: number,
    episodeData?: {
        movieId?: string;
        episodeName?: string;
        episodeId?: string;
        episodeServerId?: string;
        episodeServerFileName?: string;
        episodeServerName?: string;
    }
): Promise<string | null> => {
    if (!isDownloading) {
        console.error("Download service not initialized.");
        return null;
    }

    if (!userId) {
        console.error("Cannot start download: No user ID provided");
        return null;
    }

    if (!m3u8Url && !mp4Url) {
        console.error("Cannot start download: No valid URL provided");
        return null;
    }

    const taskId = episodeData?.episodeServerId || id;
    let existingTask = null;

    if (episodeData?.episodeServerId) {
        const tasks = StorageService.getAllDownloadTasks();
        existingTask = tasks.find(
            task => task.episodeData?.episodeServerId === episodeData.episodeServerId 
                && task.userId === userId
        );
    }

    if (existingTask) {
        return existingTask.id;
    }

    const filename = StorageService.generateMovieFilename(title);
    const filePath = `${StorageService.DOWNLOAD_DIR}/${filename}`;

    const fileExists = await StorageService.checkFileExists(filePath);
    if (fileExists) {
        const completedTask: DownloadTask = {
            id: taskId,
            m3u8Url,
            mp4Url,
            title,
            thumbUrl,
            filePath,
            status: DownloadStatus.COMPLETED,
            createdAt: Date.now(),
            userId,
            movieData,
            episodeNumber,
            episodeData: {
                movieId: episodeData?.movieId,
                episodeName: episodeData?.episodeName,
                episodeServerId: episodeData?.episodeServerId,
                episodeServerFileName: episodeData?.episodeServerFileName,
                episodeId: id,
                episodeServerName: episodeData?.episodeServerName,
            },
        };
        
        await StorageService.saveDownloadTask(completedTask);
        return taskId;
    }

    if (!isConnected) {
        console.error("Cannot start download: No internet connection");
        return null;
    }

    const newTask: DownloadTask = {
        id: taskId,
        m3u8Url,
        mp4Url,
        title,
        thumbUrl,
        filePath,
        status: DownloadStatus.PENDING,
        createdAt: Date.now(),
        userId,
        movieData,
        episodeNumber,
        episodeData: {
            movieId: episodeData?.movieId,
            episodeName: episodeData?.episodeName,
            episodeServerId: episodeData?.episodeServerId,
            episodeServerFileName: episodeData?.episodeServerFileName,
            episodeServerName: episodeData?.episodeServerName,
        },
    };

    await StorageService.saveDownloadTask(newTask);
    await NotificationService.sendStateNotification(newTask);
    processNextDownload();

    return taskId;
};