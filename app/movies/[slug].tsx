import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const getImageUrl = (
  poster_url: string | null | undefined,
  created: string
): string => {
  if (!poster_url) return "https://placehold.co/600x400/1a1a1a/ffffff.png";
  if (poster_url.startsWith("http")) return poster_url;

  const createdDate = new Date(created);
  const date = `${createdDate.getFullYear()}${String(
    createdDate.getMonth() + 1
  ).padStart(2, "0")}${String(createdDate.getDate()).padStart(2, "0")}-1`;

  return `https://phimimg.com/upload/vod/${date}/${poster_url}`;
};

const Details = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(slug as string)
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );

  const imageUrl = getImageUrl(movie?.poster_url, movie?.created?.time ?? "");

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header image with back button */}
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="mt-5 w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-12 left-5 bg-black/60 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Movie Info */}
        <View className="px-5 mt-4">
          <Text className="text-white text-2xl font-bold">{movie?.name}</Text>

          <View className="flex-row gap-3 mt-2 flex-wrap">
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
          
          {/* Nội dung mô tả */}
          <Text className="text-gray-300 text-base mt-4 leading-relaxed">
            {movie?.content ?? "Chưa có mô tả..."}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;
