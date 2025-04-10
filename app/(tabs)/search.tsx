import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovies } from '@/services/api'
import { images } from '@/constants/images'
import MoviesCard from '@/components/MoviesCard'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { updateSearchCount } from '@/services/appwrite'

const search = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const {
      data: movies,
      loading: moviesLoading,
      error: moviesError,
      refetch: loadMovies,
      resetData: reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false)
  // Debounced search effect
  useEffect(() => {
    
    const timeOutId = setTimeout(async () => {
      if(searchQuery.trim()){
        await loadMovies();
        if(movies?.length > 0){
          await updateSearchCount(searchQuery, movies[0]);
        }
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
      <FlatList data={movies} 
      keyExtractor={(item) => item.id.toString()}
      renderItem={({item}) => <MoviesCard {...item}/>} numColumns={3} columnWrapperStyle={{
        justifyContent: "flex-start",
        gap: 5,
        paddingRight: 5,
        marginBottom: 10,
      }}
      className='px-5'
      contentContainerStyle={{ paddingBottom: 10 }}
      ListHeaderComponent={
        <>
          <View className='w-full justify-center flex-row mt-20'>
            <Image source={icons.logo} className='w-12 h-10' resizeMode='contain'></Image>
          </View>
          <View className='my-5'>
              <SearchBar placeholder='Search for a movie you like!' value={searchQuery} onChangeText={(text: string) => setSearchQuery(text)}/>
          </View>
          {moviesLoading && (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
          {moviesError && (
            <Text className='text-red-500 text-center px-5 my-5'>Error: {moviesError}</Text>
          )}
          {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (
            <Text className='text-xl text-white font-bold'>Search results for {''}
             <Text className='text-accent'>{searchQuery}</Text>
            </Text>
          )}

        
        </>
      }
      ListEmptyComponent={
        !moviesLoading && !moviesError ? (
          <View className="mt-10 px-5">
            <Text className="text-center text-gray-500">
              {searchQuery.trim()
                ? "No movies found"
                : "Start typing to search for movies"}
            </Text>
          </View>
        ) : null
      }
    />
  </View>
)
}

export default search