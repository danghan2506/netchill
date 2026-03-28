import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchLatestMovies, fetchMoviesByGenre, fetchPopularMovies, fetchTopRatedMovies } from "@/services/api";
import MoviesCard from "@/components/movies/movie-card";
import DiscoverModal from "@/components/modal/genre-modal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TRENDING_CATEGORIES = [
  { id: "new", name: "Mới cập nhật", icon: "film-outline" as const, fetchFunction:() =>  fetchLatestMovies() },
  { id: "popular", name: "Phổ biến", icon: "trending-up" as const, fetchFunction: () => fetchPopularMovies(1, "year", "desc") },
  { id: "top_rated", name: "Đánh giá cao", icon: "star" as const, fetchFunction: () => fetchTopRatedMovies(1) },
];
type genreModalProps = {
  id: string,
  name: string,
  type: string,
  slug?: string
}

const Discover = () => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("new");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<genreModalProps | null>(null);
  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/đ/g, "d") // xử lý riêng chữ đ
      .normalize("NFD") // tách các dấu ra khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // loại bỏ dấu
      .replace(/[^a-z0-9\s-]/g, "") // loại bỏ ký tự không hợp lệ
      .replace(/\s+/g, "-") // thay khoảng trắng bằng dấu -
      .replace(/-+/g, "-") // loại bỏ dấu - trùng
      .replace(/^-+|-+$/g, ""); // loại bỏ dấu - đầu/cuối
  
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      let data = [];
      if(selectedFilter){
        const genreSlug = slugify(selectedFilter.name);
        console.log(genreSlug)
        data = await fetchMoviesByGenre(genreSlug);
      }
      else{
        const fetchFunction = TRENDING_CATEGORIES.find(cat => cat.id === activeCategory)?.fetchFunction;
        data = await fetchFunction?.() || [];
      }
      setMovies(data || []);
      
    } catch (err) {
      setError("Không thể tải danh sách phim.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMovies();
  }, [activeCategory, selectedFilter]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId); // useEffect sẽ tự gọi lại API
  };

  return (
    <SafeAreaView className="flex-1 bg-primary" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-white">Khám phá</Text>
        <TouchableOpacity className="flex-row items-center bg-zinc-600/50 px-4 py-2 rounded-full" onPress={() => setFilterModalVisible(true)}>
          <Ionicons name="filter" size={18} color="#fff" />
          <Text className="text-white ml-1.5 font-medium">Bộ lọc</Text>
        </TouchableOpacity>
        <DiscoverModal
        visible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        hasActiveFilter={!!selectedFilter}
        onSelect={(id, name, type) => {
          setSelectedFilter({ id, name, type });
          setFilterModalVisible(false);
        }}
        onUnselect={() => {
          setSelectedFilter(null);
          setFilterModalVisible(false);
        }}
      />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-between px-4 py-2">
        {TRENDING_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.id}
            className={`flex-row items-center px-4 py-2 rounded-full mr-2.5 ${
              activeCategory === category.id ? "bg-[#EE1520]" : "bg-zinc-800/80"
            }`}
            onPress={() => handleCategoryChange(category.id)}
          >
            <Ionicons name={category.icon} size={16} color={activeCategory === category.id ? "#fff" : "#a1a1aa"}/>
            <Text
              className={`ml-1.5 text-sm ${
                activeCategory === category.id ? "text-white" : "text-zinc-400"
              }`}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedFilter?.name && (
  <View className="flex-row items-center justify-between px-4 mt-1">
    <Text className="text-sm text-zinc-400">
      Lọc phim theo thể loại <Text className="text-white font-semibold">{selectedFilter.name}</Text>
    </Text>
    <TouchableOpacity
      className="bg-zinc-700 px-3 py-1 rounded-full ml-2"
      onPress={() => {
        setSelectedFilter(null);
        setActiveCategory("new");
      }}
    >
      <Text className="text-white text-xs">Xóa lọc</Text>
    </TouchableOpacity>
  </View>
)}


      {/* Movie List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#EE1520" />
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-[#FF5F6D] text-base">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={({ item }) => <MoviesCard {...item} />}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
              scrollEnabled={true}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
        />
      )}
    </SafeAreaView>
  );
};

export default Discover;
