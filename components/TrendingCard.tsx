import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";

const TrendingCard = ({ id, poster_path, title}: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className="w-32 relative">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
          }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />
        <Text
          className="text-white mt-2 text-sm font-bold"
          numberOfLines={1}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;