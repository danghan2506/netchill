import React, { useRef, useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Animated } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { Icon } from "@/components/ui/icon";
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

const CustomVideoPlayer = ({ uri, onClose }: { uri: string; onClose: () => void }) => {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackStatus, setPlaybackStatus] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const controlFade = useRef(new Animated.Value(1)).current;

  const togglePlayPause = () => setPaused((prev) => !prev);
  const toggleMute = () => setIsMuted((prev) => !prev);

  const handleToggleControls = () => {
    setShowControls((prev) => !prev);
    Animated.timing(controlFade, {
      toValue: showControls ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (showControls) {
      const timeout = setTimeout(() => {
        Animated.timing(controlFade, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => setShowControls(false));
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showControls]);

  const seek = (seconds: number) => {
    if (videoRef.current && playbackStatus?.positionMillis != null) {
      (videoRef.current as any).setPositionAsync(
        playbackStatus.positionMillis + seconds * 1000
      );
    }
  };

  const handleSeek = (value: number) => {
    if (videoRef.current && playbackStatus?.durationMillis != null) {
      (videoRef.current as any).setPositionAsync(value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video */}
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={handleToggleControls}
      >
        <Video
          ref={videoRef}
          source={{ uri }}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          isMuted={isMuted}
          shouldPlay={!paused}
          onPlaybackStatusUpdate={(status) => setPlaybackStatus(status)}
        />
      </TouchableOpacity>

      {/* Điều khiển */}
      {showControls && (
        <Animated.View style={[styles.controlsContainer, { opacity: controlFade }]}>
          {/* Nút thoát */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon as={X} size="lg" color="white" />
          </TouchableOpacity>

          {/* Điều khiển chính */}
          <View style={styles.mainControls}>
            <TouchableOpacity onPress={() => seek(-10)} style={styles.sideButton}>
              <Icon as={RotateCcw} size="xl" color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
              <Icon as={paused ? Play : Pause} size="xl" color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => seek(10)} style={styles.sideButton}>
              <Icon as={RotateCw} size="xl" color="white" />
            </TouchableOpacity>
          </View>

          {/* Thanh tiến trình */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: playbackStatus?.positionMillis
                    ? `${(playbackStatus.positionMillis / playbackStatus.durationMillis) * 100}%`
                    : "0%",
                },
              ]}
            />
          </View>

          {/* Tăng / giảm âm lượng */}
          <View style={styles.volumeControls}>
            <TouchableOpacity onPress={toggleMute} style={styles.volumeButton}>
              <Icon as={isMuted ? VolumeX : Volume2} size="lg" color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  sideButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 14,
    borderRadius: 50,
  },
  playPauseButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 20,
    borderRadius: 50,
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 80,
    width: "90%",
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "red",
  },
  volumeControls: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  volumeButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 50,
  },
});

export default CustomVideoPlayer;
