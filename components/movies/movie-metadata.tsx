import { View, Text } from 'react-native'
import React from 'react'
import { Category, Country } from '@/interfaces/interfaces'

type metaDataProps = {
    countries: Country[]
    categories: Category[]
    directors: string[]
    actors: string[]
}

const MovieMetaData: React.FC<metaDataProps> = ({countries, categories, directors, actors}) => {
    return (
        <View className="bg-black rounded-lg pt-3">
          <Text className="text-white font-semibold mb-2">Thông tin chi tiết</Text>
      
          {/* Quốc gia */}
          {countries.length > 0 && (
            <View className="flex-row mb-1">
              <Text className="text-white font-medium w-24">Quốc gia:</Text>
              <Text className="text-white/80 flex-1">
                {countries.map(c => c.name).join(', ')}
              </Text>
            </View>
          )}
      
          {/* Thể loại */}
          {categories.length > 0 && (
            <View className="flex-row mb-1">
              <Text className="text-white font-medium w-24">Thể loại:</Text>
              <Text className="text-white/80 flex-1">
                {categories.map(c => c.name).join(', ')}
              </Text>
            </View>
          )}
      
          {/* Đạo diễn */}
          {directors.length > 0 && (
            <View className="flex-row mb-1">
              <Text className="text-white font-medium w-24">Đạo diễn:</Text>
              <Text className="text-white/80 flex-1">{directors.join(', ')}</Text>
            </View>
          )}
      
          {/* Diễn viên */}
          {actors.length > 0 && (
            <View className="flex-row mb-1 items-start">
              <Text className="text-white font-medium w-24">Diễn viên:</Text>
              <Text className="text-white/80 flex-1">{actors.join(', ')}</Text>
            </View>
          )}
        </View>
      );
}

export default MovieMetaData