import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import {  searchMovies, fetchMostSearchedMovies } from '@/services/api'
import { images } from '@/constants/images'
import MoviesCard from '@/components/movies/movie-card'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/movies/SearchBar'
const search = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const {
      data: movies,
      loading: moviesLoading,
      error: moviesError,
      refetch: loadMovies,
      reset,
  } = useFetch(() => searchMovies(searchQuery), false)

  const {
    data: defaultMovies,
    loading: defaultMoviesLoading,
  } = useFetch(() => fetchMostSearchedMovies(1))
  // Debounced search effect
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if(searchQuery.trim()){
        await loadMovies();
      }
      else{
        reset();
      }
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchQuery]);
return (
  <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover'></Image>
      <FlatList 
      data={searchQuery.trim() ? movies : defaultMovies}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({item}) => <MoviesCard {...item}/>} 
      numColumns={2} 
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      ListHeaderComponent={
        <>
          <View className='w-full justify-center flex-row mt-20'>
            <Image source={icons.logo} className='w-12 h-10' resizeMode='contain'></Image>
          </View>
          <View className='my-5'>
              <SearchBar placeholder='Tìm kiếm những bộ phim mà bạn muốn!' value={searchQuery} onChangeText={(text: string) => setSearchQuery(text)} onPress={() => {}}/>
          </View>
          {(moviesLoading || defaultMoviesLoading) && (
            <ActivityIndicator
                size="large"
                color="#EE1520"
                className="my-3"
              />
          )}
          {moviesError && (
            <Text className='text-red-500 text-center px-5 my-5'>Error: {moviesError}</Text>
          )}
          
          {/* Title for Search Results */}
          {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
            <Text className='text-xl text-white font-bold ml-5 mb-4'>Tìm kiếm cho {' '}
             <Text className='text-[#EE1520]'>{searchQuery}</Text>
            </Text>
          )}

          {/* Title for Default Movies (Most Searched) when not searching */}
          {!searchQuery.trim() && defaultMovies?.length > 0 && (
            <Text className='text-xl text-white font-bold ml-5 mb-4'>
              Phim tìm kiếm nhiều nhất
            </Text>
          )}
        </>
      }
      ListEmptyComponent={
        !moviesLoading && !moviesError && searchQuery.trim() ? (
          <View className="mt-10 px-5">
            <Text className="text-center text-gray-500">
              Không tìm thấy phim nào với từ khóa "{searchQuery}"
            </Text>
          </View>
        ) : null
      }
    />
  </View>
)
}

export default search