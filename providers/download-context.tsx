import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import * as DownloadService from '@/services/download-service';
import * as StorageService from '@/services/storage-service';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { DownloadTask } from '@/types/download';
import { useAuth } from './auth-context';
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
    const { firebaseUser } = useAuth()
    const userId = firebaseUser?.uid || ''
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloads, setDownloads] = useState<DownloadTask[]>([])
    const [userDownloads, setUserDownloads] = useState<DownloadTask[]>([])
    const router = useRouter()
    const refreshDownloads = useCallback(async () => {
        if(!isDownloading){
            return
        }
        else{
            try {
                const downloadedVideos = await DownloadService.getDownloadedVideos();
            } catch (error) {
                
            }
        }
    })
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async (notification) => {
                return {
                    shouldShowAlert: true,
                    shouldPlaySound: notification.request.content.data?.type === 'completion',
                    shouldSetBadge: false,
                }
            }
        })
        const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;

      if (data?.type === 'completion' && data?.success === true) {
        router.push('/(tabs)/downloaded');
      }
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationResponseListener);
    };
    }, [router])
}