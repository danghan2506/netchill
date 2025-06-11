import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import * as DownloadService from '@/services/download-service';
import * as StorageService from '@/services/storage-service';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { DownloadTask } from '@/types/download';
import { useAuth } from './auth-context';
import { User } from '@/interfaces/user';
type DownloadContextType = {
    userId: string
    isDownloading: boolean;
    downloads: DownloadTask[];
    userDownloads: DownloadTask[];
    refreshDownloads: () => Promise<void>
}
const DownloadContext = createContext<DownloadContextType>({
    userId: '',
    isDownloading: false,
    downloads: [],
    userDownloads: [],
    refreshDownloads: async () => {},
});
export const useDownload = () => useContext(DownloadContext)
type DownloadProviderProps = {
    children: ReactNode
}
export const DownloadProvider: React.FC<DownloadProviderProps> = ({children}) => {
    const { user } = useAuth();
    const userId = user?.uid || '';
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloads, setDownloads] = useState<DownloadTask[]>([]);
    const [userDownloads, setUserDownloads] = useState<DownloadTask[]>([]);
    const router = useRouter();

    const refreshDownloads = useCallback(async () => {
        try {
            const allTasks = StorageService.getAllDownloadTasks();
            setDownloads(allTasks);
            
            if (userId) {
                const userTasks = allTasks.filter(task => task.userId === userId);
                setUserDownloads(userTasks);
            }

            setIsDownloading(true);
        } catch (error) {
            console.error('Error refreshing downloads:', error);
            setIsDownloading(false);
        }
    }, [userId]);    // Initialize download service and notifications
    useEffect(() => {
        const initializeDownloads = async () => {
            await DownloadService.initializeDownloadService();
            await refreshDownloads();
        };

        initializeDownloads();
    }, []);

    // Handle notifications
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async (notification) => {
                return {
                    shouldShowAlert: true,
                    shouldPlaySound: notification.request.content.data?.type === 'completion',
                    shouldSetBadge: false,
                }
            }
        });

        const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;

            if (data?.type === 'completion' && data?.success === true) {
                router.push('/(tabs)/downloaded');
            }
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationResponseListener);
        };
    }, [router]);

    // Subscribe to download changes
    useEffect(() => {
        const unsubscribe = StorageService.subscribeToDownloadChanges(refreshDownloads);
        return () => unsubscribe();
    }, [refreshDownloads]);

    return (
        <DownloadContext.Provider value={{
            userId,
            isDownloading,
            downloads,
            userDownloads,
            refreshDownloads
        }}>
            {children}
        </DownloadContext.Provider>
    );
};