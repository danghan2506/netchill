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
import MoviesCard from "@/components/movies/MoviesCard";
import TrendingCard from "@/components/movies/TrendingCard";
import Animated, { scrollTo, useAnimatedRef, useAnimatedScrollHandler, useDerivedValue, useSharedValue } from "react-native-reanimated";
import * as ScreenOrientation from 'expo-screen-orientation';

const Index = () => {
  const router = useRouter();
  
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
  } = useFetch(() => fetchTrendingMovies("hanh-dong", 1, "modified.time"));
  const scrollX = useSharedValue(0)
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const ref = useAnimatedRef<Animated.FlatList<any>>()
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const interval = useRef<NodeJS.Timeout>()
  const offset = useSharedValue(0)
  const { width } = Dimensions.get("window");
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
    // onMomentumEnd: (event) => {
    //   scrollX.value = event.contentOffset.x
    // }
  });
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies(1));
  // useEffect(() => {
  //   if(isAutoPlay == true){
  //     interval.current = setInterval(() => {
  //       offset.value = offset.value + width
  //     }, 5000)
  //   }
  //   else{
  //     clearInterval(interval.current)
  //   }
  // }, [isAutoPlay, offset, width])
  // useDerivedValue(() => {
  //   scrollTo(ref, offset.value, 0, true)
  // })
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
              />
            </View>
            <Text className="text-white text-2xl font-bold mb-5 mt-5">
                Trending Movies
              </Text>
              <View style={styles.carouselContainer}>
                <Animated.FlatList
                data={trendingMovies}
                renderItem={({ item , index}) => <TrendingCard {...item} scrollX = {scrollX} index={index}/>}
                keyExtractor={(item) => item._id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                contentContainerStyle={{
                  alignItems: "center"
                }}
                removeClippedSubviews={false}
                onScroll={onScrollHandler}
                scrollEventThrottle={16}
                // onScrollBeginDrag={() => {
                //   setIsAutoPlay(false)
                // }}
                // onScrollEndDrag={() => {
                //   setIsAutoPlay(true)
                // }}
              />
              </View>
            <Text className="text-white text-2xl font-bold mb-5">
              Latest Movies
            </Text>
            <FlatList
              data={movies}
              renderItem={({ item }) => <MoviesCard {...item} />}
              keyExtractor={(item) => item._id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 10,
                marginBottom: 0,
              }}
              scrollEnabled={false}
              className="mt-2 pb-32"
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
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default Index;