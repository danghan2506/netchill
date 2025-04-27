import { Link, router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dot, Heart, Info, Play } from "lucide-react-native";
import { Icon } from "../ui/icon";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Movie } from "@/interfaces/interfaces";
import { push } from "expo-router/build/global-state/routing";

const getImageUrl = (poster_url: string | null | undefined): string => {
  if (!poster_url) {
    return "https://placehold.co/600x400/1a1a1a/ffffff.png";
  }
  if (poster_url.startsWith("http")) {
    return poster_url;
  }
  return `https://phimimg.com/${poster_url.replace(/^\/+/, "")}`;
};

const { width } = Dimensions.get("window");

const TrendingCard = ({
  _id,
  poster_url,
  name,
  created,
  slug,
  year,
  quality,
  lang,
  index,
  scrollX,
  totalLength
}: Movie & { index: number; scrollX: any; totalLength: number }) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * width,
      (index - 1) * width,
      index * width,
      (index + 1) * width,
      (index + 2) * width,
    ];

    const outputRange = [-width * 0.25, 0, width * 0.25];
    
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-width * 0.25, -width * 0.25, 0, width * 0.25, width * 0.25],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 0.9, 1, 0.9, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX },
        { scale }
      ],
    };
  });

  const imageUrl = getImageUrl(poster_url);

  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <Link href={`/movies/${slug}`} asChild>
        <TouchableOpacity>
          <View style={styles.contentContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.background}
            />
            <View className="flex-row items-center space-x-1 mb-2 mt-2">
              <Text className="text-white text-sm">{year}</Text>
              <Icon as={Dot} color="white" />
              <Text className="text-white text-sm">{lang}</Text>
            </View>
            
          </View>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  background: {
    position: "absolute",
    height: 500,
    width: 300,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },
  image: {
    width: 300,
    height: 500,
    borderRadius: 20,
  },
});

export default TrendingCard;
