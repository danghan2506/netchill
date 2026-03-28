import { Link } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Bookmark, Star } from "lucide-react-native";
import { Icon } from "../ui/icon";
import { Movie } from "@/interfaces/interfaces";

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
const CARD_WIDTH = width - 60; // 30px padding each side
const CARD_HEIGHT = CARD_WIDTH * 1.38;

const NewUpdatedCard = ({
  poster_url,
  name,
  tmdb,
  slug,
  year,
  quality,
  lang,
  category,
}: Movie & { index: number; scrollX: any }) => {
  const imageUrl = getImageUrl(poster_url);
  const rating = tmdb?.vote_average ? tmdb.vote_average.toFixed(1) : null;
  const categoryName = Array.isArray(category)
    ? category[0]?.name
    : (category as any)?.name ?? null;

  return (
    <View style={styles.itemContainer}>
      <Link href={`/movies/${slug}`} asChild>
        <TouchableOpacity activeOpacity={0.92} style={styles.cardContainer}>
          {/* Poster — plain Image, no parallax trick */}
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />

          {/* Bottom gradient */}
          <LinearGradient
            colors={["transparent", "rgba(6,4,2,0.93)", "rgba(6,4,2,1)"]}
            locations={[0, 0.55, 1]}
            style={styles.bottomGradient}
          />

          {/* TMDB rating badge — top right */}
          {rating && (
            <View style={styles.ratingBadge}>
              <Icon as={Star} color="#fbbf24" size="xs" />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          )}

          {/* Category badge — top left */}
          {categoryName && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{categoryName}</Text>
            </View>
          )}

          {/* Bottom overlay content */}
          <View style={styles.overlayContent}>
            <Text style={styles.title} numberOfLines={2}>
              {name}
            </Text>
            {/* Meta chips */}
            <View style={styles.metaRow}>
              {year ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{year}</Text>
                </View>
              ) : null}
              {quality ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{quality}</Text>
                </View>
              ) : null}
              {lang ? (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{lang}</Text>
                </View>
              ) : null}
            </View>

            {/* Action buttons */}
            <View style={styles.buttonRow}>
              <View style={styles.primaryButton}>
                <Icon as={Play} color="#fff" size="sm" />
                <Text style={styles.primaryButtonText}>Xem ngay</Text>
              </View>
              <View style={styles.secondaryButton}>
                <Icon as={Bookmark} color="#e5e7eb" size="sm" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#0a0a0a",
    shadowColor: "#EE1520",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 14,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    position: "absolute",
    top: 0,
    left: 0,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: CARD_HEIGHT * 0.6,
  },
  ratingBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.35)",
  },
  ratingText: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "700",
  },
  categoryBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "#EE1520",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  overlayContent: {
    position: "absolute",
    left: 18,
    right: 18,
    bottom: 22,
    gap: 8,
  },
  title: {
    color: "#f9fafb",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.2,
    lineHeight: 28,
  },
  subtitle: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "500",
    marginTop: -2,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  chipText: {
    color: "#e5e7eb",
    fontSize: 11,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EE1520",
    borderRadius: 999,
    paddingVertical: 13,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    width: 46,
    height: 46,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NewUpdatedCard;
