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
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchMoviesEpisodes } from "@/services/api";
import { Icon } from "@/components/ui/icon";
import { X, Play } from "lucide-react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ScreenOrientation from "expo-screen-orientation";
import { useState, useCallback, useEffect, useRef } from "react";

const { width, height } = Dimensions.get("window");

const Details = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [showEpisodePlayer, setShowEpisodePlayer] = useState(false);
  const [episode, setEpisode] = useState([]);
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const videoRef = useRef(null);

  const { data: movie, loading } = useFetch(() => fetchMovieDetails(Array.isArray(slug) ? slug[0] : slug));

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const data = await fetchMoviesEpisodes(Array.isArray(slug) ? slug[0] : slug);
        setEpisode(data);
        if (data && data.length > 0) {
          setSelectedEpisode(data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchEpisode();
  }, [slug]);

  const videoUrl = selectedEpisode?.link_m3u8 ?? "";
  const player = useVideoPlayer(videoUrl);
  // Khi mở player mới play
useEffect(() => {
  if (showEpisodePlayer && player) {
    player.play?.();
  }
}, [showEpisodePlayer, player]);

  // Cleanup player khi unmount
  useEffect(() => {
    return () => {
      try {
        player?.stop?.(); 
      } catch (err) {
        console.log("Cleanup error:", err);
      }
    };
  }, []);
  useEffect(() => {
    const backAction = () => {
      if (isFullScreen) {
        setIsFullScreen(false);
        ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
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
  const onFullScreenChange = useCallback((fullscreen) => {
    setIsFullScreen(fullscreen);
    ScreenOrientation.lockAsync(
      fullscreen
        ? ScreenOrientation.OrientationLock.LANDSCAPE
        : ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  }, []);
  const handleEpisodeSelect = (item) => {
    setSelectedEpisode(item);
    setShowEpisodePlayer(true);
    setIsFullScreen(true);
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
  };
  const handleCloseEpisodePlayer = () => {
    try {
      player?.stop?.(); 
    } catch (err) {
      console.log("Lỗi khi stop player:", err);
    }
    setShowEpisodePlayer(false);
    setIsFullScreen(false);
    setSelectedEpisode(null); 
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  };

  const trailerUrl = movie?.trailer_url ?? "";
  const getTrailerId = (url: string) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );

  if (showEpisodePlayer && selectedEpisode) {
    return (
      <View style={styles.fullscreenContainer}>
        <VideoView
          key={selectedEpisode?.id} // Quan trọng!
          ref={videoRef}
          style={styles.fullscreenVideo}
          player={player}
        />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleCloseEpisodePlayer}
        >
          <Icon as={X} size="md" color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <FlatList
        data={episode}
        keyExtractor={(item, index) => String(index)}
        numColumns={4}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View className="w-full flex justify-center items-center py-4">
              <YoutubePlayer
                height={250}
                width={width}
                play={false}
                videoId={getTrailerId(trailerUrl)}
                onFullScreenChange={onFullScreenChange}
              />
            </View>

            <View className="absolute top-12 right-5 z-10">
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-black/60 p-2 rounded-full"
              >
                <Icon as={X} size="md" color="white" />
              </TouchableOpacity>
            </View>

            <View className="px-5 mt-2">
              <Text className="text-white text-2xl font-bold">
                {movie?.name}
              </Text>
              <View className="flex-row gap-5 mt-2 flex-wrap">
                <Text className="text-gray-400 text-xs">
                  Năm: {movie?.year ?? "?"}
                </Text>
                <Text className="text-gray-400 text-xs">
                  Thời lượng: {movie?.time ?? "?"}
                </Text>
                <Text className="text-gray-400 text-xs">
                  Chất lượng: {movie?.quality}
                </Text>
                <Text className="text-gray-400 text-xs">
                  Ngôn ngữ: {movie?.lang}
                </Text>
              </View>
            </View>

            <View className="px-5 mt-6 mb-4">
              <View className="flex-row items-center">
                <Icon as={Play} size="sm" color="#fff" />
                <Text className="text-white text-xl font-bold ml-2">
                  Danh sách tập phim
                </Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item.id || index}
            className="bg-zinc-800 rounded-xl px-4 py-3 w-[22%]"
            onPress={() => handleEpisodeSelect(item)}
            style={[
              selectedEpisode === item && {
                borderColor: "#fff",
                borderWidth: 1,
              },
            ]}
          >
            <Text className="text-white font-medium text-center">
              {item.name || `Tập ${index + 1}`}
            </Text>
          </TouchableOpacity>
        )}
      />
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
});

export default Details;
