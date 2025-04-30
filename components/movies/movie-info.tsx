import { View, Text } from "react-native";
import React from "react";
interface MovieInfoProps {
  year: string;
  quality: string;
  time: string;
  lang: string;
}
const MovieInfo: React.FC<MovieInfoProps> = ({
  year,
  quality,
  time,
  lang,
}) => {
  return (
    <View className="flex-row flex-wrap mt-2 gap-2">
      <View className="bg-white/10 px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-semibold">{year ?? "N/A"}</Text>
      </View>
      <View className="bg-white/10 px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-semibold">{time ?? "N/A"}</Text>
      </View>
      <View className="bg-white/10 px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-semibold">{quality ?? "N/A"}</Text>
      </View>
      <View className="bg-white/10 px-3 py-1 rounded-full">
        <Text className="text-white text-xs font-semibold">{lang ?? "N/A"}</Text>
      </View>
    </View>
  );
};

export default MovieInfo;
