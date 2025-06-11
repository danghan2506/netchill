import { View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView, ActivityIndicator, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as StorageService from '@/services/storage-service';
import { DownloadTask } from '@/types/download';
import CustomVideoPlayer from '@/components/movies/video-player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DownloadScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedVideo, setSelectedVideo] = useState<DownloadTask | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloads] = useState<DownloadTask[]>([]);

  useEffect(() => {
    loadDownloads();
  }, []);

  const loadDownloads = async () => {
    try {
      setLoading(true);
      const allDownloads = StorageService.getAllDownloadTasks();
      setDownloads(allDownloads);
    } catch (error) {
      console.error('Error loading downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = async (task: DownloadTask) => {
    const exists = await StorageService.checkFileExists(task.filePath);
    if (exists) {
      setSelectedVideo(task);
    } else {
      Alert.alert(
        'Không tìm thấy file',
        'File video đã bị xóa hoặc di chuyển',
        [{ text: 'Đóng', style: 'cancel' }]
      );
    }
  };

  // Handle back from video player
  const handleBackFromVideo = () => {
    setSelectedVideo(null);  
  };

  // If a video is selected, show the video player
  if (selectedVideo) {
    return (      <CustomVideoPlayer 
        source={{
          url: selectedVideo.filePath,
          title: selectedVideo.title,
          type: 'local'
        }}
        onBack={handleBackFromVideo}
      />
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { marginTop: insets.top }]}>
        <ActivityIndicator size="large" color="#EE1520" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Video đã tải xuống</Text>
        <MaterialIcons name="video-library" size={20} color="#dc2626" />
      </View>
      
      <ScrollView>
        {downloads.map((task, index) => (
          <TouchableOpacity
            key={task.id}
            style={styles.videoItem}
            onPress={() => handlePlayVideo(task)}
          >
            <Text style={styles.videoTitle}>{task.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
  }
});

export default DownloadScreen;