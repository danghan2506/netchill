import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import YoutubePlayer from "react-native-youtube-iframe";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ScreenOrientation from "expo-screen-orientation";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchMoviesEpisodes } from "@/services/api";
import MovieModal from "@/modal/EpisodeModal";
import { Icon } from "@/components/ui/icon";
import { X } from "lucide-react-native";
import EpisodeModal from "@/modal/EpisodeModal";
import CustomVideoPlayer from "./VideoPlayer";

const { width } = Dimensions.get("window");

const Details = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  // State
  const [isFullScreen, setIsFullScreen] = useState(false);
  interface Episode {
    id: string;
    link_m3u8: string;
    name: string,
    // Add other properties of an episode if needed
  }
  
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const [episode, setEpisode] = useState([]);
  const videoRef = useRef(null);

  // Fetch movie details and episodes
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(Array.isArray(slug) ? slug[0] : slug)
  );
  const trailerUrl = movie?.trailer_url ?? "";

  const player = useVideoPlayer(selectedEpisode?.link_m3u8 ?? "");

  // Fetch episodes
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const data = await fetchMoviesEpisodes(
          Array.isArray(slug) ? slug[0] : slug
        );
        setEpisode(data);
        if (data && data.length > 0) {
          setEpisode(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEpisode();
  }, [slug]);

  // Handle fullscreen changes
  const onFullScreenChange = useCallback((fullscreen: boolean | ((prevState: boolean) => boolean)) => {
    setIsFullScreen(fullscreen);
    ScreenOrientation.lockAsync(
      fullscreen
        ? ScreenOrientation.OrientationLock.LANDSCAPE
        : ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }, []);

  // Handle back button for fullscreen
  useEffect(() => {
    const backAction = () => {
      if (isFullScreen) {
        setIsFullScreen(false);
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFullScreen]);

  // Handle opening and closing modal
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // Handle episode selection
  const handleEpisodeSelect = (item: Episode) => {
    setSelectedEpisode(item);
    setShowEpisodePlayer(true);
    setIsModalVisible(false);
    setIsFullScreen(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };

  // Handle closing episode player
  const handleCloseEpisodePlayer = () => {
    try {
      player?.pause?.();
    } catch (err) {
      console.error("Error stopping player:", err);
    }
    setShowEpisodePlayer(false);
    setIsFullScreen(false);
    setSelectedEpisode(null);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  // Extract trailer ID from URL
  const getTrailerId = (url: string) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // Fullscreen player
  if (showEpisodePlayer && selectedEpisode) {
    if (!selectedEpisode?.link_m3u8) {
      console.error("Invalid video URL");
      return null;
    }

    return (
      <CustomVideoPlayer
        uri={selectedEpisode?.link_m3u8 ?? ""}
        onClose={handleCloseEpisodePlayer}
      />
    );
  }

  // Main UI
  return (
    <SafeAreaView className="bg-primary flex-1">
      
        <View className="w-full flex justify-center items-center py-4">
              <YoutubePlayer
                height={250}
                width={width}
                play={false}
                videoId={getTrailerId(trailerUrl)}
                onFullScreenChange={onFullScreenChange}
              />
      </View>
           
      <Text className="text-white text-xl font-Roboto font-bold">
  {movie?.name ?? "Tên phim không xác định"}
</Text>
<View className="flex-row flex-wrap mt-2 gap-2">
  <View className="border border-gray-900 rounded-full px-2 py-0.5">
    <Text className="text-gray-200 text-xs">{movie?.year ?? "N/A"}</Text>
  </View>
  <View className="border border-gray-900 rounded-full px-2 py-0.5">
    <Text className="text-gray-200 text-xs">{movie?.time ?? "N/A"}</Text>
  </View>
  <View className="border border-gray-900 rounded-full px-2 py-0.5">
    <Text className="text-gray-200 text-xs">{movie?.quality ?? "N/A"}</Text>
  </View>
  <View className="border border-gray-900 rounded-full px-2 py-0.5">
    <Text className="text-gray-200 text-xs">{movie?.lang ?? "N/A"}</Text>
  </View>
</View>
<Text className="text-white font-semibold text-[20px] font-[Roboto]">
  Nội dung
</Text>
<Text className="text-white text-xs font-light">
  {movie?.content ?? "Không có nội dung"}
</Text>
            <TouchableOpacity
              style={styles.watchButton}
              onPress={handleOpenModal}
            >
              <Text style={styles.watchButtonText}>Xem phim</Text>
            </TouchableOpacity>
            <View className="absolute top-12 right-5 z-10">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-black/60 p-2 rounded-full"
              >
                <Icon as={X} size="md" color="white" />
              </TouchableOpacity>
            </View>
            <EpisodeModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        episodes={episode}
        onEpisodeSelect={handleEpisodeSelect}
      />

      {/* Movie Modal */}
     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 50,
    zIndex: 10,
  },
  watchButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    margin: 20,
  },
  watchButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Details;