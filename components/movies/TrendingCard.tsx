import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Dot, Heart, Info, Play } from "lucide-react-native";
import { Icon } from "../ui/icon";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { Movie } from "@/interfaces/interfaces";
import { Button, ButtonIcon, ButtonText } from "../ui/button";

const getImageUrl = (poster_url: string | null | undefined): string => {
  if (!poster_url) {
    return "https://placehold.co/600x400/1a1a1a/ffffff.png";
  }
  // Nếu đã có http thì trả nguyên
  if (poster_url.startsWith("http")) {
    return poster_url;
  }
  // Trường hợp path từ API không có domain
  return `https://phimimg.com/${poster_url.replace(/^\/+/, "")}`;
};

const { width } = Dimensions.get("window"); // Use window instead of screen for consistency

const TrendingCard = ({ _id, poster_url, name, created, slug, year, quality, lang, index, scrollX }: Movie & { index: number, scrollX: any }) => {
  const rnAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index -1 ) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP
          )
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  const imageUrl = getImageUrl(poster_url);

  return (
    <Animated.View style={[styles.itemContainer, rnAnimatedStyle]}>
      <Link href={`/movies/${slug}`} asChild>
        <View style={styles.contentContainer}>
          <TouchableOpacity>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.background} />
          </TouchableOpacity>
          <Text className="text-white font-bold">{name}</Text>
          <View className="flex-row items-center space-x-1 mb-2">
            <Text className="text-white text-sm">{year}</Text>
            <Icon as={Dot} color="white"></Icon>
            <Text className="text-white text-sm">{lang}</Text>
          </View>
          <View className="flex-row items-center justify-between space-x-6">
        {/* Yêu thích */}
        <TouchableOpacity className="p-2">
          <Icon as={Heart} size="xl" color="white" />
        </TouchableOpacity>
        <Button size="md" variant="solid" action="primary">
          <ButtonText className="text-white">Hi guys</ButtonText>
          <ButtonIcon as={Play} size="lg" color="white" />
        </Button>

        {/* Thông tin */}
        <TouchableOpacity className="p-2">
          <Icon as={Info} size="xl" color="white" />
        </TouchableOpacity>
      </View>
        </View>
        
      </Link>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20
    // Remove paddingLeft and paddingRight
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