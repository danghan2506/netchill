import { View, Text } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const EmptyDownloaded = () => {
  return (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <MaterialIcons name="video-library" size={64} color="#4b5563" />
      <Text className="text-gray-500 text-base mt-2">
        Chưa có video nào được tải xuống
      </Text>
      <Text className="text-gray-500 text-sm mt-2 text-center">
        Các video bạn tải xuống sẽ xuất hiện ở đây để xem offline
      </Text>
    </View>
  );
};

export default EmptyDownloaded;
