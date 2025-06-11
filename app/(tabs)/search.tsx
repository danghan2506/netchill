import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovies, searchMovies } from '@/services/api'
import { images } from '@/constants/images'
import MoviesCard from '@/components/movies/movie-card'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/movies/SearchBar'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Icon } from '@/components/ui/icon/index.web'
const search = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const {
      data: movies,
      loading: moviesLoading,
      error: moviesError,
      refetch: loadMovies,
      resetData: reset,
  } = useFetch(() => searchMovies(searchQuery), false)
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
      <FlatList data={searchQuery.trim() ? movies : []}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({item}) => <MoviesCard {...item}/>} numColumns={2} columnWrapperStyle={{
                justifyContent: "space-between",
                paddingHorizontal: 20,
              }}
              scrollEnabled={false}
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
          {moviesLoading && (
            <ActivityIndicator
                size="large"
                color="#FF5F6D"
                className="my-3"
              />
          )}
          {moviesError && (
            <Text className='text-red-500 text-center px-5 my-5'>Error: {moviesError}</Text>
          )}
          {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
            <Text className='text-xl text-white font-bold'>Tìm kiếm cho {''}
             <Text className='text-[#FF5F6D]'>{searchQuery}</Text>
            </Text>
          )}
        </>
      }
      ListEmptyComponent={
        !moviesLoading && !moviesError ? (
          <View className="mt-10 px-5">
            <Text className="text-center text-gray-500">
              {searchQuery.trim()
                ? "Không tìm thấy phim nào với từ khóa này"
                : "Hãy nhập từ khóa để tìm kiếm phim"}
            </Text>
          </View>
        ) : null
      }
    />
  </View>
)
}

export default search