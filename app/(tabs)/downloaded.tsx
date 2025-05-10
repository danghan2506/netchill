import { View, Text } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const DownloadScreen = () => {
  return (
   <View className="flex-row items-center justify-between mb-4">
          <Text className="text-red-600 font-bold text-base">Video đã tải xuống</Text>
          <MaterialIcons name="video-library" size={20} color="#dc2626" />
    </View>
  )
}

export default DownloadScreen