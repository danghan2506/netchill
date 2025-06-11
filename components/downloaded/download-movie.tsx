import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { DownloadTask } from '@/types/download'
import { Image } from "expo-image"
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
type downloadMovieProps = {
    movie: DownloadTask
    onPlay: (task: DownloadTask) => void
    onDelete: (task: DownloadTask) => void
}
// Get screen width to calculate responsive dimensions
const { width } = Dimensions.get("window");
const itemWidth = width / 2 - 24; // Two items per row with padding
const DownloadedMovies: React.FC<downloadMovieProps> = ({movie, onPlay, onDelete}) => {
  const movieTitle= movie.episodeData?.episodeName || movie.title.split("-")[1] || movie.title  
  const serverName = movie.episodeData?.episodeServerName || "Offline"
  return (
    <View 
      className="bg-white rounded-xl overflow-hidden shadow-md mb-4 mx-2"
      style={{ width: itemWidth }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPlay(movie)}
        className="flex-1"
      >
        <View className="w-full relative" style={{ height: itemWidth * 0.56 }}>
          <Image
            source={{ uri: movie.thumbUrl }}
            className="w-full h-full rounded-t-xl"
            contentFit="cover"
            transition={400}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            className="absolute inset-0 items-center justify-center rounded-t-xl"
          >
            <View className="bg-indigo-600/90 rounded-full w-11 h-11 items-center justify-center">
              <Ionicons name="play" size={22} color="#fff" />
            </View>
          </LinearGradient>
        </View>
        
        <View className="p-3">
          <Text className="text-slate-800 font-semibold text-base mb-1.5" numberOfLines={1}>
            {movieTitle}
          </Text>
          <View className="flex-row justify-between items-center mt-1">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={12} color="#64748b" />
              <Text className="text-slate-500 text-xs ml-1">
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            
            <TouchableOpacity
              onPress={() => onDelete(movie)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="p-1"
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default DownloadedMovies