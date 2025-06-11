import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchGenres } from '@/services/api';
import { LOADING } from '@/constants/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MovieGenre } from '@/types/movie-type';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH * 0.85 - 48) / 3;

interface DiscoverModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: string, name: string, type: 'genre') => void;
  onUnselect?: () => void;
  hasActiveFilter?: boolean;
}
// tạo một danh sách GENRE_ICONS để ánh xạ slug với tên của icon từ thư viện MaterialIcons:
const GENRE_ICONS: Record<string, string> = {
  'hanh-dong': 'electric-bolt',
  'mien-tay': 'landscape',
  'tre-em': 'child-care',
  'lich-su': 'schedule',
  'co-trang': 'elderly', 
  'chien-tranh': 'military-tech',
  'vien-tuong': 'rocket',
  'kinh-di': 'nights-stay',
  'tai-lieu': 'description',
  'bi-an': 'key',
  'tinh-cam': 'favorite',
  'tam-ly': 'psychology-alt',
  'the-thao': 'sports',
  'phieu-luu': 'explore',
  'am-nhac': 'music-note',
  'gia-dinh': 'family-restroom',
  'hoc-duong': 'school',
  'hai-huoc': 'mood',
  'hinh-su': 'gavel',
  'vo-thuat': 'sports-martial-arts',
  'khoa-hoc': 'science',
  'than-thoai': 'auto-awesome',
  'chinh-kich': 'theater-comedy',
  'kinh-dien': 'class',
  default: 'help-outline', // Add a default icon
};

export default function DiscoverModal({
  visible,
  onClose,
  onSelect,
  onUnselect,
  hasActiveFilter = false,
}: DiscoverModalProps) {
  const insets = useSafeAreaInsets();
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (visible) {
      fetchFilters();
    }
  }, [visible]);

  const fetchFilters = async () => {
    setIsLoading(true);
    try {
      const genresData = await fetchGenres();
      const filteredGenres = genresData.filter(
        (genre: { slug: string; }) => genre.slug !== 'phim-18'
      );
      setGenres(filteredGenres);
    } catch (error) {
      console.error('Error fetching filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (id: string, name: string) => {
    onSelect(id, name, 'genre');
    onClose();
  };

  const handleUnselect = () => {
    if (onUnselect) {
      onUnselect();
      onClose();
    }
  };

  const getGradientColors = (index: number): [string, string] => {
    const palettes: [string, string][] = [
      ['#FF5F6D', '#FFC371'],
      ['#2193b0', '#6dd5ed'],
      ['#834d9b', '#d04ed6'],
      ['#4b6cb7', '#182848'],
      ['#11998e', '#38ef7d'],
      ['#FC466B', '#3F5EFB'],
      ['#F09819', '#EDDE5D'],
      ['#3A1C71', '#D76D77'],
    ];
    return palettes[index % palettes.length];
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContainer}>
          <BlurView intensity={25} tint="dark" style={styles.blurView}>
            <LinearGradient
              colors={['rgba(18,18,24,0.97)', 'rgba(10,10,14,0.98)']}
              style={styles.gradientBackground}
            >
              <View style={styles.modalHeader}>
                <View style={styles.headerContent}>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.contentContainer}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={LOADING.INDICATOR_COLOR} />
                    <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.itemsScroll}
                    contentContainerStyle={[
                      styles.itemsContainer,
                      { paddingBottom: insets.bottom || 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                  >
                    {genres.map((item, index) => {
                      const iconName = GENRE_ICONS[item.slug] || GENRE_ICONS.default; // Ensure default icon is used
                      const gradientColors = getGradientColors(index);
                      return (
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          onPress={() => handleSelect(item.id, item.name)}
                          style={styles.genreItem}
                        >
                          <LinearGradient
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.genreGradient}
                          >
                            <View style={styles.iconContainer}>
                              {/* hien thi icon */}
                              <MaterialIcons name={iconName as any} size={24} color="white" />
                            </View>
                            <Text style={styles.genreText} numberOfLines={2}>
                              {item.name}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
            </LinearGradient>
          </BlurView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // giữ nguyên toàn bộ styles không thay đổi...
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContainer: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  blurView: {
    width: '100%',
    height: '100%',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(60,60,70,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  unselectButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(82,82,91,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  unselectText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 64,
  },
  loadingText: {
    color: '#a1a1aa',
    marginTop: 12,
  },
  itemsScroll: {
    flex: 1,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  genreItem: {
    width: ITEM_SIZE,
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  genreGradient: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 13,
    marginTop: 8,
  },
});