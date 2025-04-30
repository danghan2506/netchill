import { View, Text, Dimensions } from 'react-native'
import YoutubePlayer from 'react-native-youtube-iframe'
import { useEffect, useState } from 'react'
import React from 'react'
type MovieTrailerProps = {
    trailer_url?: string;
}
const getTrailerId = (url?: string) => {
    if (!url) return "";
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : "";
  };
const { width } = Dimensions.get("window");

const MovieTrailer : React.FC<MovieTrailerProps>= ({trailer_url}) => {
const [playing, setPlaying] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
  return (
    <View className="w-full flex justify-center items-center py-4">
    <YoutubePlayer
      height={250}
      width={width}
      play={false}
      videoId={getTrailerId(trailer_url)}
      onError={(e) => {
        setError('Không thể phát trailer. Vui lòng thử lại sau.');
        setPlaying(false);
        setLoading(false);
        console.error('YouTube player error:', e);
      }}
    />
  </View>
  )
}

export default MovieTrailer