import { View, Text } from 'react-native';
import React from 'react';

type Genre = {
  id: string;
  name: string;
  slug: string;
};

type MovieGenreProps = {
  genres: Genre[];
};

const MovieGenres: React.FC<MovieGenreProps> = ({ genres }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2">
  {genres.map((genre) => (
    <View
      key={genre.id}
      className="bg-white/10 px-3 py-1 rounded-full"
    >
      <Text className="text-white text-xs font-semibold">{genre.name}</Text>
    </View>
  ))}
</View>
  );
};

export default MovieGenres;
