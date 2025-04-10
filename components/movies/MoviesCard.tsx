import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

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
  const createdDate = new Date(created);
  const date = `${createdDate.getFullYear()}${String(
    createdDate.getMonth() + 1
  ).padStart(2, "0")}${String(createdDate.getDate()).padStart(2, "0")}-1`;
  console.log(date)
  return `https://phimimg.com/upload/vod/${date}/${poster_url}`;
};

const MoviesCard = ({
  created,
  name,
  slug,
  poster_url,
}: Movie) => {
  const imageUrl = getImageUrl(poster_url, created?.time ?? "");
  return (
    <Link href={`/movies/${slug}`} asChild>
      <TouchableOpacity style={{ width: "31%", marginBottom: 20 }}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: "100%", height: 180, borderRadius: 10 }}
          resizeMode="cover"
        />
        <Text
          style={{
            color: "white",
            marginTop: 6,
            fontSize: 14,
            fontWeight: "bold",
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};


export default MoviesCard;
