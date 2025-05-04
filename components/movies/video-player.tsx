import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, StatusBar } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

type VideoPlayerProps = {
  source: string;
  onBack?: () => void;
};

const CustomVideoPlayer = ({ source, onBack }: VideoPlayerProps) => {
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Định dạng thời gian thành MM:SS
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Chuyển đổi giữa phát và tạm dừng
  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!status.isPlaying);
      resetControlsTimeout();
    }
  };

  // Tua tới 10 giây
  const forward = async () => {
    if (videoRef.current && status.positionMillis) {
      await videoRef.current.setPositionAsync(Math.min(status.durationMillis, status.positionMillis + 10000));
      resetControlsTimeout();
    }
  };

  // Tua lui 10 giây
  const rewind = async () => {
    if (videoRef.current && status.positionMillis) {
      await videoRef.current.setPositionAsync(Math.max(0, status.positionMillis - 10000));
      resetControlsTimeout();
    }
  };

  // State cho modal tốc độ phát
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Chuyển đổi chế độ toàn màn hình
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    resetControlsTimeout();
  };
  
  // Thay đổi tốc độ phát video
  const changePlaybackSpeed = async (speed: number) => {
    setPlaybackRate(speed);
    setShowSpeedModal(false);
    if (videoRef.current) {
      await videoRef.current.setRateAsync(speed, true);
    }
    resetControlsTimeout();
  };

  // Reset timeout để ẩn controls sau một khoảng thời gian
  const resetControlsTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowControls(true);
    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // Xử lý khi nhấn vào video
  const handleVideoPress = () => {
    if (showControls) {
      setShowControls(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } else {
      setShowControls(true);
      resetControlsTimeout();
    }
  };

  // Cleanup timeout khi component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={isFullscreen} />

      {/* Video component */}
      <TouchableOpacity
        activeOpacity={1}
        style={styles.videoContainer}
        onPress={handleVideoPress}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: source }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping={true}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
          useNativeControls={false}
        />
      </TouchableOpacity>

      {/* Video Controls */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          {/* Top Controls */}
          {!isFullscreen && onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}

          {/* Center Controls */}
          <View className='flex-1 justify-center items-center'>
          <View style={styles.centerControls}>
            <TouchableOpacity onPress={rewind} style={styles.controlButton}>
              <Ionicons name="play-back" size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
              <Ionicons name={isPlaying ? "pause" : "play"} size={28} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={forward} style={styles.controlButton}>
              <Ionicons name="play-forward" size={28} color="white" />
            </TouchableOpacity>
          </View>
          </View>
          

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <View style={styles.progressContainer}>
              {/* Progress Bar */}
              <Slider
                style={styles.progressBar}
                value={status.positionMillis || 0}
                minimumValue={0}
                maximumValue={status.durationMillis || 1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                thumbTintColor="#FFFFFF"
                onSlidingComplete={async (value) => {
                  if (videoRef.current) {
                    await videoRef.current.setPositionAsync(value);
                    resetControlsTimeout();
                  }
                }}
              />
              
              {/* Time Display */}
              <View style={styles.timeDisplay}>
                <Text style={styles.timeText}>
                  {formatTime(status.positionMillis ? status.positionMillis / 1000 : 0)}
                </Text>
                <Text style={styles.timeText}>
                  {formatTime(status.durationMillis ? status.durationMillis / 1000 : 0)}
                </Text>
              </View>
            </View>

            {/* Right Controls */}
            <View style={styles.rightControls}>
              <TouchableOpacity 
                style={styles.settingsButton}
                onPress={() => setShowSpeedModal(true)}
              >
                <Text style={styles.speedText}>{playbackRate}x</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
                <Ionicons name={isFullscreen ? "contract" : "expand"} size={22} color="white" />
              </TouchableOpacity>
            </View>
            
            {/* Speed Selection Modal */}
            {showSpeedModal && (
              <View style={styles.speedModalOverlay}>
                <View style={styles.speedModal}>
                  <Text style={styles.speedModalTitle}>Tốc độ phát</Text>
                  <View style={styles.speedOptions}>
                    {speedOptions.map((speed) => (
                      <TouchableOpacity 
                        key={speed}
                        style={[
                          styles.speedOption,
                          speed === playbackRate && styles.activeSpeedOption
                        ]}
                        onPress={() => changePlaybackSpeed(speed)}
                      >
                        <Text style={[
                          styles.speedOptionText,
                          speed === playbackRate && styles.activeSpeedOptionText
                        ]}>
                          {speed}x
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomControls: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  playPauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 40,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
  },
  rightControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  settingsButton: {
    padding: 8,
    marginRight: 12,
  },
  fullscreenButton: {
    padding: 8,
  },
  speedText: {
    color: 'white',
    fontSize: 14,
  },
  speedModalOverlay: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    padding: 10,
    zIndex: 100,
  },
  speedModal: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 10,
  },
  speedModalTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  speedOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  speedOption: {
    padding: 8,
    margin: 4,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  activeSpeedOption: {
    backgroundColor: '#666',
  },
  speedOptionText: {
    color: 'white',
    fontSize: 14,
  },
  activeSpeedOptionText: {
    fontWeight: 'bold',
    color: '#00aced',
  },

});

export default CustomVideoPlayer;