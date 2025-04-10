import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import SearchBar from "@/components/movies/SearchBar";
import useFetch from "@/services/useFetch";
import { fetchMovies } from "@/services/api";
import MoviesCard from "@/components/movies/MoviesCard";

import TrendingCard from "@/components/movies/TrendingCard";

const Index = () => {
  const router = useRouter();
  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(() => fetchMovies(2));
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies(1));
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
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
            <View>
              <Text className="text-white text-2xl font-bold mb-5">
                Trending Movies
              </Text>
              <FlatList
                data={trendingMovies}
                renderItem={({ item }) => <TrendingCard {...item} />}
                keyExtractor={(item) => item._id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: 10,
                  paddingRight: 20,
                  gap: 16,
                }}
                className="mb-4 mt-3"
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

export default Index;
