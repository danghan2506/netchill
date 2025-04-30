import { View, Text } from 'react-native'
import React from 'react'
type MovieSummaryProps = {
    content: string;
}
const MovieSummary: React.FC<MovieSummaryProps> = ({content}) => {
  return (
     <Text className="text-white/80 text-sm leading-relaxed">
            {content ?? "Không có nội dung"}
    </Text>
  )
}

export default MovieSummary