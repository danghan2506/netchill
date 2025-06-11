import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { DownloadTask } from "@/types/download";

interface DownloadingMovieProps {
  movie: DownloadTask;
  onCancel: (movie: DownloadTask) => void;
}

const DownloadingMovie: React.FC<DownloadingMovieProps> = ({ 
  movie, 
  onCancel 
}) => {
  const movieTitle = movie.episodeData?.episodeName || movie.title.split(" - ")[1] || movie.title;
  const serverName = movie.episodeData?.episodeServerName;
  
  // Calculate progress percentage if available
  const progress = movie.progress ? `${Math.round(movie.progress * 100)}%` : "";
  
  return (
    <View className="bg-white/95 rounded-xl mx-4 mb-4 overflow-hidden shadow-sm border border-slate-100">
      <View className="flex-row items-center p-2">
        {/* Thumbnail */}
        <View className="w-28 h-20 bg-slate-200 rounded-lg overflow-hidden mr-3">
          {movie.thumbUrl ? (
            <Image
              source={{ uri: movie.thumbUrl }}
              contentFit="cover"
              className="w-full h-full"
              transition={300}
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="film-outline" size={24} color="#94a3b8" />
            </View>
          )}
        </View>
        
        {/* Content */}
        <View className="flex-1 mr-2 py-1">
          <Text className="text-slate-800 font-medium text-base" numberOfLines={1}>
            {movieTitle}
          </Text>
          
          {serverName && (
            <View className="mt-1 flex-row items-center">
              <View className="bg-slate-100 rounded-full px-2 py-0.5">
                <Text className="text-slate-500 text-xs">
                  {serverName}
                </Text>
              </View>
            </View>
          )}
          
          {/* Download Status */}
          <View className="mt-2">
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="#3F5EFB" className="mr-2" />
              <Text className="text-slate-500 text-xs">
                {progress ? `Đang tải xuống... ${progress}` : "Đang tải xuống..."}
              </Text>
            </View>
            
            {/* Progress bar */}
           <View className="mt-1.5 h-1 bg-slate-200 rounded-full w-full overflow-hidden">
              <View 
                className="h-full bg-indigo-500 rounded-full" 
                style={{ width: movie.progress ? `${Math.round(movie.progress * 100)}%` : '5%' }} 
              />
            </View>
          </View>
        </View>
        
        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => onCancel(movie)}
          className="p-2"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DownloadingMovie;