import {
  StyleSheet,
  View,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useRef } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Ionicons } from "@expo/vector-icons";
import { VideoSource } from "@/interfaces/interfaces";
export type VideoPlayerProps = {
  source: VideoSource;
  onBack?: () => void;
};
const { width, height } = Dimensions.get("window");
const CustomVideoPlayer = ({ source, onBack }: VideoPlayerProps) => {
  const videoSource = source.url;
  if (!videoSource) {
    console.error("Video source URL is missing");
    return null;
  }
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  return (
    <View style={styles.contentContainer}>
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="contain"
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
  width: '100%',
  backgroundColor: 'black',
  },
  video: {
  width: '100%',
  height: '100%',
  }, 
  controlsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
export default CustomVideoPlayer;