import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  BackHandler,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchMoviesEpisodes } from "@/services/api";
import { Icon } from "@/components/ui/icon";
import { X } from "lucide-react-native";
import EpisodeModal from "@/components/modal/episode-modal";
import CustomVideoPlayer from "@/components/movies/video-player";
import MovieInfo from "@/components/movies/movie-info";
import MovieSummary from "@/components/movies/movie-summary";
import MovieTrailer from "@/components/movies/movie-trailer";
import MovieGenres from "@/components/movies/movie-genres";
import LinearGradient from "expo-linear-gradient"
import { ScrollView } from "react-native";
import MovieMetaData from "@/components/movies/movie-metada";
import { Ionicons } from "@expo/vector-icons";

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
  }
  
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const [episode, setEpisode] = useState<Episode[]>([]);
  const videoRef = useRef(null);

  // Fetch movie details and episodes
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(Array.isArray(slug) ? slug[0] : slug)
  );

  // Fetch episodes
  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const data = await fetchMoviesEpisodes(
          Array.isArray(slug) ? slug[0] : slug
        );
        if (data && data.length > 0) {
          setEpisode(data);
        }
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };
    fetchEpisode();
  }, [slug]);

  // Handle fullscreen changes
  const onFullScreenChange = useCallback((fullscreen: boolean | ((prevState: boolean) => boolean)) => {
    try {
      setIsFullScreen(typeof fullscreen === 'function' ? fullscreen(isFullScreen) : fullscreen);
      ScreenOrientation.lockAsync(
        typeof fullscreen === 'function' ? 
          (fullscreen(isFullScreen) ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT_UP) :
          (fullscreen ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT_UP)
      ).catch(err => console.error("Orientation change error:", err));
    } catch (err) {
      console.error("Error in fullscreen change:", err);
    }
  }, [isFullScreen]);

  // Handle back button for fullscreen
  useEffect(() => {
    const backAction = () => {
      if (isFullScreen) {
        try {
          handleCloseEpisodePlayer();
          return true;
        } catch (err) {
          console.error("Error handling back button:", err);
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isFullScreen]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      setShowEpisodePlayer(false);
      setSelectedEpisode(null);
      
      try {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
          .catch(err => console.error("Error resetting orientation:", err));
      } catch (err) {
        console.error("Error in cleanup:", err);
      }
    };
  }, []);

  // Handle opening and closing modal
  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false);

  // Handle episode selection
  const handleEpisodeSelect = (item: Episode) => {
    // Close modal first
    setIsModalVisible(false);
    
    // Wait for modal to fully close before proceeding
    setTimeout(() => {
      try {
        if (item && item.link_m3u8) {
          console.log("Selected episode:", item.name, item.link_m3u8);
          setSelectedEpisode(item);
          setShowEpisodePlayer(true);
          
          // Try to change orientation
          ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
            .then(() => setIsFullScreen(true))
            .catch(err => console.error("Orientation error:", err));
        } else {
          console.error("Invalid episode or missing link:", item);
        }
      } catch (err) {
        console.error("Screen orientation error:", err);
      }
    }, 500); // Wait 500ms for modal animation to complete
  };

  // Handle closing episode player
  const handleCloseEpisodePlayer = () => {
    try {
      setShowEpisodePlayer(false);
      setIsFullScreen(false);
      
      // Reset orientation first
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        .then(() => {
          // Then clear selected episode after orientation change completes
          setTimeout(() => {
            setSelectedEpisode(null);
          }, 100);
        })
        .catch(err => console.error("Error resetting orientation:", err));
    } catch (err) {
      console.error("Error closing episode player:", err);
    }
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
  if (showEpisodePlayer && selectedEpisode && selectedEpisode.link_m3u8) {
    console.log("Rendering video player with source:", selectedEpisode.link_m3u8);
    return (
      <CustomVideoPlayer
        source={selectedEpisode.link_m3u8}
        onBack={handleCloseEpisodePlayer}
      />
    );
  }
  
  // Main UI
  return (
    <ScrollView className="bg-primary flex-1">
        <MovieTrailer trailer_url={movie?.trailer_url} />
        <Text className="text-white text-2xl font-bold px-4 mt-4">
          {movie?.name ?? "Tên phim không xác định"}
        </Text>
        <View className="px-4">
          <MovieInfo year={movie?.year} quality={movie?.quality} time={movie?.time} lang={movie?.lang} />
          <Text className="text-white text-lg font-bold mt-3 mb-2">Thể loại</Text>
          <MovieGenres genres={movie?.category} />
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#EE1520] rounded-md py-3 mt-6 items-center shadow-md shadow-red-500/50"
            onPress={handleOpenModal}
          >
            <View className="flex-row items-center space-x-5">
    <Ionicons name="play" size={20} color="white" />
    <Text className="text-white font-bold text-base">Xem phim</Text>
  </View>
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold mt-6 mb-2">Nội dung</Text>
          <MovieSummary content={movie?.content} />
          <MovieMetaData countries={movie?.country} categories={movie?.category} directors={movie?.director} actors={movie?.actor} />
         
        </View>
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
    </ScrollView>
  );
};

export default Details;