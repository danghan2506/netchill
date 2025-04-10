import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { icons } from "@/constants/icons";
const getImageUrl = (poster_url: string | null | undefined, created: string): string => {
  if (!poster_url) {
    return "https://placehold.co/600x400/1a1a1a/ffffff.png";
  }
  // Nếu poster_url đã là một URL đầy đủ (bắt đầu bằng http), trả về luôn
  if (poster_url.startsWith("http")) {
    return poster_url;
  }
  // Nếu chỉ là tên file → gắn prefix ngày upload
  const createdDate = new Date(created);
  const date = `${createdDate.getFullYear()}${String(
    createdDate.getMonth() + 1
  ).padStart(2, "0")}${String(createdDate.getDate()).padStart(2, "0")}-1`;

  return `https://phimimg.com/upload/vod/20250410-1/0744944a5ef1c5fa8e7db227515e0603.jpg`
};


const MoviesCard = ({
  tmdb: Tmdb,
  imdb: Imdb,
  created: Created,
  modified: Modified,
  _id: id, // Đổi tên alias
  name,
  slug,
  poster_url,
  thumb_url,
}: Movie) => {
  return (
    <Link href={`/movies/${slug}`} asChild>
      <TouchableOpacity className="w-[31%] mb-5">
      <Image
  source={{
    uri: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee",
  }}
  className="w-full h-48 rounded-lg"
  resizeMode="cover"
/>

      </TouchableOpacity>
    </Link>
  );
};

export default MoviesCard;
