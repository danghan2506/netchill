import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/movies/SearchBar";
import useFetch from "@/services/useFetch";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import MoviesCard from "@/components/movies/movie-card";
import UpdatedCard from "@/components/movies/new-updated-card";
import * as ScreenOrientation from "expo-screen-orientation";
// ── Pagination Dots ──────────────────────────────────────────────────────────
const PaginationDots = ({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) => (
  <View style={styles.dotsRow}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          i === activeIndex ? styles.dotActive : styles.dotInactive,
        ]}
      />
    ))}
  </View>
);
// ─────────────────────────────────────────────────────────────────────────────

const Index = () => {
  const router = useRouter();
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);
  const currentIndexRef = useRef(0);
  const { width } = Dimensions.get("window");

  // Fires as soon as 50% of a card is visible — works for fast swipes too
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 });
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: any) => {
      if (viewableItems.length > 0) {
        const idx = viewableItems[0].index ?? 0;
        currentIndexRef.current = idx;
        setActiveIndex(idx);
      }
    },
    []
  );

  useEffect(() => {
    const lockPortrait = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        );
      } catch (_) {
        // Device does not support orientation locking — ignore
      }
    };
    lockPortrait();
    return () => {
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

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies(4));

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isAutoPlay && trendingMovies?.length > 0) {
      interval = setInterval(() => {
        const nextIndex = currentIndexRef.current + 1;
        const resolvedIndex =
          nextIndex >= trendingMovies.length ? 0 : nextIndex;
        flatListRef.current?.scrollToIndex({
          index: resolvedIndex,
          animated: true,
        });
        currentIndexRef.current = resolvedIndex;
        setActiveIndex(resolvedIndex);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoPlay, trendingMovies]);

  const getItemLayout = (_data: any, index: number) => ({
    length: width,
    offset: width * index,
    index,
  });

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image
          source={icons.logo}
          className="w-12 h-10 mt-20 mb-5 mx-auto"
        />
        {moviesLoading ? (
          <ActivityIndicator
            size="large"
            color="#EE1520"
            className="mt-20"
          />
        ) : moviesError ? (
          <Text className="text-white text-center mt-20">
            {moviesError}
          </Text>
        ) : (
          <>
            <View className="flex-1 mt-5">
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Tìm kiếm những bộ phim mà bạn muốn!"
                value=""
                onChangeText={() => {}}
              />
            </View>
            <Text className="text-white text-xl font-bold mb-5 mt-5 mx-5">
              Phim mới cập nhật
            </Text>
            <View style={styles.carouselContainer}>
              <FlatList
                data={trendingMovies}
                ref={flatListRef}
                renderItem={({ item, index }) => (
                  <UpdatedCard
                    {...item}
                    scrollX={null}
                    index={index}
                  />
                )}
                keyExtractor={(item) => item._id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                getItemLayout={getItemLayout}
                removeClippedSubviews={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig.current}
                onScrollBeginDrag={() => setIsAutoPlay(false)}
                onScrollEndDrag={() => setIsAutoPlay(true)}
              />
            </View>

            {/* Dot pagination */}
            {trendingMovies?.length > 0 && (
              <PaginationDots
                total={trendingMovies.length}
                activeIndex={activeIndex}
              />
            )}

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
              contentContainerStyle={{ paddingBottom: 20 }}
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
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#EE1520",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});

export default Index;
