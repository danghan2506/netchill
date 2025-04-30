import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Movie } from "@/interfaces/interfaces";
import { LinearGradient } from "expo-linear-gradient";

const getImageUrl = (
  poster_url: string | null | undefined,
  created: string
): string => {
  if (!poster_url) {
    return "https://placehold.co/600x400/1a1a1a/ffffff.png";
  }
  if (poster_url.startsWith("http")) {
    return poster_url;
  }
  else if(!poster_url.startsWith("http")){
    return `https://phimimg.com/${poster_url}`
  }
  const createdDate = new Date(created);
  const date = `${createdDate.getFullYear()}${String(
    createdDate.getMonth() + 1
  ).padStart(2, "0")}${String(createdDate.getDate()).padStart(2, "0")}-1`;
  return `https://phimimg.com/upload/vod/${date}/${poster_url}`;
};

const MoviesCard = ({
  created,
  name,
  slug,
  poster_url,
  year,
}: Movie) => {
  const imageUrl = getImageUrl(poster_url, created?.time ?? "");
  
  return (
    <Link href={`/movies/${slug}`} asChild>
      <TouchableOpacity className="w-[48%] mb-5">
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-[130px] rounded-xl"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            className="absolute bottom-0 left-0 right-0 h-20 rounded-b-xl"
          />
          <View className="absolute bottom-2 left-2 right-2">
            <Text
              className="text-white font-semibold text-xs"
              numberOfLines={2}
            >
              {name}
            </Text>
            <Text className="text-gray-300 text-xs mt-1">
              {year || "N/A"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};


export default MoviesCard;