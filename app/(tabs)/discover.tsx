// import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, FlatList, Dimensions } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import GenreScreen from '../movies/GenreScreen'
// import useFetch from '@/services/useFetch'
// import { fetchMovies, fetchTrendingMovies } from '@/services/api'
// import MoviesCard from '@/components/movies/MoviesCard'
// import TrendingCard from '@/components/movies/TrendingCard'
// import Animated, { useSharedValue, useAnimatedScrollHandler, useDerivedValue } from 'react-native-reanimated'
// import { useInfiniteScroll } from '@/services/useInfiniteScroll'
// import { Movie } from '@/interfaces/interfaces'

// const { width } = Dimensions.get('window')

// const Discover = () => {
//   const scrollX = useSharedValue(0)
//   const [isAutoPlay, setIsAutoPlay] = useState(true)
  
//   const {
//     data: trendingMovies,
//     loading: trendingLoading,
//     error: trendingError
//   } = useFetch(() => fetchTrendingMovies("hanh-dong", 1, "modified.time"))

//   const {
//     data: recentMovies,
//     loading: recentLoading,
//     error: recentError
//   } = useFetch(() => fetchMovies(1))

//   const {
//     data: topRatedMovies,
//     loading: topLoading,
//     error: topError
//   } = useFetch(() => fetchTrendingMovies("phim-chieu-rap", 1, "view_total"))

//   const {
//     data: augmentedData,
//     flatListRef
//   } = useInfiniteScroll<Movie>(trendingMovies || [], scrollX, width)

//   const onScroll = useAnimatedScrollHandler({
//     onScroll: (event) => {
//       scrollX.value = event.contentOffset.x
//     }
//   })

//   useEffect(() => {
//     if (augmentedData.length > 0) {
//       flatListRef.current?.scrollToOffset({
//         offset: width,
//         animated: false
//       })
//     }
//   }, [augmentedData])

//   // Auto scroll using worklet
//   useDerivedValue(() => {
//     if (isAutoPlay && augmentedData?.length > 0) {
//       const currentIndex = Math.round(scrollX.value / width);
//       const nextOffset = (currentIndex + 1) * width;
      
//       setTimeout(() => {
//         flatListRef.current?.scrollToOffset({
//           offset: nextOffset,
//           animated: true
//         });
//       }, 3000);
//     }
//   }, [isAutoPlay, scrollX.value]);

//   return (
//     <SafeAreaView className="flex-1 bg-primary">
//       <ScrollView>
//         {/* Header Section */}
//         <View className="px-4 py-6">
//           <Text className="text-white text-2xl font-bold">Khám phá</Text>
//           <Text className="text-gray-400 mt-1">Tìm kiếm phim theo thể loại yêu thích</Text>
//         </View>

//         {/* Trending Section */}
//         <View className="mb-6">
//           <Text className="text-white text-xl font-semibold mb-4 px-4">Xu hướng</Text>
//           {trendingLoading ? (
//             <ActivityIndicator size="large" color="#fff" />
//           ) : trendingError ? (
//             <Text className="text-red-500 px-4">{trendingError}</Text>
//           ) : (
//             <Animated.FlatList
//               ref={flatListRef}
//               data={augmentedData}
//               keyExtractor={(item, index) => `${item._id}-${index}`}
//               horizontal
//               pagingEnabled
//               showsHorizontalScrollIndicator={false}
//               onScroll={onScroll}
//               onMomentumScrollEnd={handleScroll}
//               scrollEventThrottle={16}
//               getItemLayout={(_, index) => ({
//                 length: width,
//                 offset: width * index,
//                 index,
//               })}
//               renderItem={({ item, index }) => (
//                 <TrendingCard 
//                   {...item} 
//                   scrollX={scrollX} 
//                   index={index} 
//                   totalLength={augmentedData.length}
//                 />
//               )}
//             />
//           )}
//         </View>

//         {/* Genres Grid */}
//         <View className="px-4 mb-6">
//           <Text className="text-white text-xl font-semibold mb-4">Thể loại</Text>
//           <GenreScreen />
//         </View>

//         {/* Recent Releases */}
//         <View className="px-4 mb-6">
//           <Text className="text-white text-xl font-semibold mb-4">Mới phát hành</Text>
//           {recentLoading ? (
//             <ActivityIndicator size="large" color="#fff" />
//           ) : recentError ? (
//             <Text className="text-red-500">{recentError}</Text>
//           ) : (
//             <FlatList
//               data={recentMovies}
//               keyExtractor={(item) => item._id}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               renderItem={({ item }) => (
//                 <View className="mr-4" style={{ width: width * 0.4 }}>
//                   <MoviesCard {...item} />
//                 </View>
//               )}
//             />
//           )}
//         </View>

//         {/* Top Rated */}
//         <View className="px-4 mb-6">
//           <Text className="text-white text-xl font-semibold mb-4">Đánh giá cao</Text>
//           {topLoading ? (
//             <ActivityIndicator size="large" color="#fff" />
//           ) : topError ? (
//             <Text className="text-red-500">{topError}</Text>
//           ) : (
//             <FlatList
//               data={topRatedMovies}
//               keyExtractor={(item) => item._id}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               renderItem={({ item }) => (
//                 <View className="mr-4" style={{ width: width * 0.4 }}>
//                   <MoviesCard {...item} />
//                 </View>
//               )}
//             />
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   )
// }

// export default Discover