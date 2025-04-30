import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchTrendingMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { LOADING } from "@/constants/ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TRENDING_CATEGORIES = [
  { id: "new", name: "Mới cập nhật", icon: "new-releases" },
  { id: "popular", name: "Phổ biến", icon: "trending-up" },
  { id: "top_rated", name: "Đánh giá cao", icon: "star" },
];

// Component hiển thị card phim
const MovieCard = ({ item }) => {
  return (
    <TouchableOpacity className="w-[160px] h-[240px] rounded-xl overflow-hidden mb-4 mr-2 bg-zinc-800">
      <Image
        source={{ uri: item.poster || 'https://via.placeholder.com/160x240' }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        className="absolute bottom-0 left-0 right-0 h-16 justify-end px-2 pb-2"
      >
        <Text className="text-white font-semibold text-sm" numberOfLines={1}>
          {item.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const Discover = () => {
  const insets = useSafeAreaInsets();
  const [activeTrendingCategory, setActiveTrendingCategory] = useState("new");
  
  // Gọi API để lấy dữ liệu phim trending
  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(() => fetchTrendingMovies("tinh-cam", 1, "modified.time"));

  // Dữ liệu giả để demo
  const demoMovies = [
    { _id: "1", title: "Phim hành động 1", poster: "https://via.placeholder.com/160x240" },
    { _id: "2", title: "Phim tình cảm 2", poster: "https://via.placeholder.com/160x240" },
    { _id: "3", title: "Phim hồi hộp 3", poster: "https://via.placeholder.com/160x240" },
    { _id: "4", title: "Phim hài hước 4", poster: "https://via.placeholder.com/160x240" },
    { _id: "5", title: "Phim kinh dị 5", poster: "https://via.placeholder.com/160x240" },
    { _id: "6", title: "Phim viễn tưởng 6", poster: "https://via.placeholder.com/160x240" },
  ];

  // Sử dụng dữ liệu API hoặc dữ liệu demo nếu API chưa sẵn sàng
  const moviesData = trendingMovies && trendingMovies.length > 0 ? trendingMovies : demoMovies;

  const handleTrendingCategoryChange = (categoryId) => {
    if (categoryId !== activeTrendingCategory) {
      setActiveTrendingCategory(categoryId);
      // Đây là nơi lý tưởng để gọi API với category mới
    }
  };

  // Render item cho FlatList
  const renderItem = ({ item }) => <MovieCard item={item} />;

  return (
    <SafeAreaView className="flex-1 bg-[#121218]" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-white">Khám phá</Text>
        <TouchableOpacity className="flex-row items-center bg-zinc-600/50 px-4 py-2 rounded-full">
          <Ionicons name="filter" size={18} color="#fff" />
          <Text className="text-white ml-1.5 font-medium">Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Trending Section */}
        <View className="pt-3 pb-6">
          <Text className="text-lg font-semibold text-white mx-4 mb-3">Xu hướng</Text>

          {/* Trending Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4 pb-3"
          >
            {TRENDING_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={`flex-row items-center px-4 py-2 rounded-full mr-2.5 ${
                  activeTrendingCategory === category.id
                    ? "bg-[#FF5F6D]"
                    : "bg-zinc-800/80"
                }`}
                onPress={() => handleTrendingCategoryChange(category.id)}
              >
                <MaterialIcons
                  name={category.icon}
                  size={16}
                  color={activeTrendingCategory === category.id ? "#fff" : "#a1a1aa"}
                />
                <Text
                  className={`ml-1.5 text-sm ${
                    activeTrendingCategory === category.id
                      ? "text-white"
                      : "text-zinc-400"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Khu vực hiển thị phim */}
          {trendingMoviesLoading ? (
            <View className="h-60 justify-center items-center">
              <ActivityIndicator size="large" color={LOADING.INDICATOR_COLOR || "#FF5F6D"} />
            </View>
          ) : trendingMoviesError ? (
            <View className="h-60 justify-center items-center">
              <Text className="text-[#FF5F6D] text-base">Không thể tải phim. Vui lòng thử lại sau.</Text>
            </View>
          ) : (
            <View className="mt-2">
              {/* Grid danh sách phim */}
              <FlatList
                data={moviesData}
                renderItem={renderItem}
                keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-evenly' }}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                scrollEnabled={false} // Không scroll vì đã nằm trong ScrollView
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Discover;