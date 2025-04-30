import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/movies/SearchBar";
import useFetch from "@/services/useFetch";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import MoviesCard from "@/components/movies/movie-card";
import TrendingCard from "@/components/movies/trending-card";
import Animated, {
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import Genrebox from "@/components/Genrebox";
const Index = () => {
  const router = useRouter();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const flatListRef = useRef<FlatList<any>>(null);
  useEffect(() => {
    // Khóa màn hình ở chế độ dọc khi component được mount
    const lockPortrait = async () => {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT
      );
    };

    lockPortrait();

    // Clean up khi component unmount
    return () => {
      // Bỏ khóa nếu cần
      const unlockAll = async () => {
        await ScreenOrientation.unlockAsync();
      };
      unlockAll();
    };
  }, []);

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(() => fetchTrendingMovies("tinh-cam", 1, "modified.time"));
  const scrollX = useSharedValue(0);
  const { width } = Dimensions.get("window");
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies(4));
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlay && trendingMovies?.length > 0) {
      interval = setInterval(() => {
        const nextIndex = Math.floor(scrollX.value / width) + 1;
        const offsetX = nextIndex * width;

        if (offsetX >= width * trendingMovies.length) {
          // Reset về đầu nếu đã đến cuối
          flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: true,
          });
        } else {
          flatListRef.current?.scrollToOffset({
            offset: offsetX,
            animated: true,
          });
        }
      }, 3000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isAutoPlay, scrollX, trendingMovies]);

  const getItemLayout = (data: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {moviesLoading ? (
          <ActivityIndicator size="large" color="#000" className="mt-20" />
        ) : moviesError ? (
          <Text className="text-white text-center mt-20">{moviesError}</Text>
        ) : (
          <>
            <View className="flex-1 mt-5">
              {/* push to different URL */}
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Search for a movie you like!"
                value=""
                onChangeText={() => {}}
              />
            </View>
            <Text className="text-white text-2xl font-bold mb-5 mt-5 mx-5">
              Đề xuất cho bạn
            </Text>
            <View style={styles.carouselContainer}>
              <Animated.FlatList
                data={trendingMovies}
                ref={flatListRef}
                renderItem={({ item, index }) => (
                  <TrendingCard {...item} scrollX={scrollX} index={index} />
                )}
                keyExtractor={(item) => item._id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                getItemLayout={getItemLayout}
                contentContainerStyle={{
                  alignItems: "center",
                }}
                removeClippedSubviews={false}
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                  const offsetX = event.nativeEvent.contentOffset.x;
                  const lastIndex = trendingMovies.length - 1;

                  if (offsetX >= width * lastIndex) {
                    // Nếu scroll tới phần tử cuối, reset về đầu
                    flatListRef.current?.scrollToOffset({
                      offset: 0,
                      animated: false,
                    });
                  }
                }}
                onScrollBeginDrag={() => {
                  setIsAutoPlay(false);
                }}
                onScrollEndDrag={() => {
                  setIsAutoPlay(true);
                }}
              />
            </View>
            <Text className="text-white text-2xl font-bold mb-5 mt-5 mx-5">
              Thịnh hành
            </Text>
            <FlatList
              data={movies}
              renderItem={({ item }) => <MoviesCard {...item} />}
              keyExtractor={(item) => item._id.toString()}
              numColumns={2}
              columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
              scrollEnabled={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  carouselContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  genreBoxContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default Index;
