import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { DownloadTask } from "@/types/download";

interface CancelledMovieProps {
  movie: DownloadTask;
  onDelete: (movie: DownloadTask) => void;
  onRetry: (movie: DownloadTask) => void;
}

const CancelledMovie: React.FC<CancelledMovieProps> = ({ 
  movie, 
  onDelete, 
  onRetry 
}) => {
  const movieTitle = movie.episodeData?.episodeName || movie.title.split(" - ")[1] || movie.title;
  const serverName = movie.episodeData?.episodeServerName;
  
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
          
          {/* Error Status */}
          <View className="mt-2 flex-row items-center">
            <Ionicons name="alert-circle" size={14} color="#f43f5e" />
            <Text className="text-rose-500 text-xs ml-1 font-medium">
              Tải xuống thất bại
            </Text>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => onDelete(movie)}
            className="p-2"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onRetry(movie)}
            className="p-2 ml-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="refresh" size={22} color="#3F5EFB" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CancelledMovie;