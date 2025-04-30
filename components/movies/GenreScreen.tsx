import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
  Modal,
  Text,
  StyleSheet
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchGenres } from '@/services/api';
import { LOADING } from '@/constants/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MovieGenre, MovieType } from '@/types/movie-type';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH * 0.85 - 48) / 3;

interface DiscoverModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: string, name: string, type: 'genre' | 'type') => void;
  onUnselect?: () => void;
  hasActiveFilter?: boolean;
}

const GENRE_ICONS: Record<string, string> = {
  'hanh-dong': 'local-fire-department',
  'mien-tay': 'landscape',
  'tre-em': 'child-care',
  'lich-su': 'history-edu',
  'co-trang': 'account-balance',
  'chien-tranh': 'military-tech',
  'vien-tuong': 'rocket',
  'kinh-di': 'nights-stay',
  'tai-lieu': 'assignment',
  'bi-an': 'search',
  'phim-18': '18-up-rating',
  'tinh-cam': 'favorite',
  'tam-ly': 'psychology',
  'the-thao': 'sports',
  'phieu-luu': 'explore',
  'am-nhac': 'music-note',
  'gia-dinh': 'family-restroom',
  'hoc-duong': 'school',
  'hai-huoc': 'mood',
  'hinh-su': 'gavel',
  'vo-thuat': 'sports-martial-arts',
  'khoa-hoc': 'science',
  'than-thoai': 'auto-fix-high',
  'chinh-kich': 'theater-comedy',
  'kinh-dien': 'workspace-premium',
  'default': 'category'
};

const TYPE_ICONS: Record<string, string> = {
  'tvshows': 'tv',
  'series': 'live-tv',
  'single': 'movie',
  'hoathinh': 'animation',
  'default': 'devices'
};

export default function DiscoverModal({ 
  visible, 
  onClose, 
  onSelect, 
  onUnselect,
  hasActiveFilter = false 
}: DiscoverModalProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'genres' | 'types'>('genres');
  const [genres, setGenres] = useState<MovieGenre[]>([]);
  const [types, setTypes] = useState<MovieType[]>([]);
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
      setGenres(genresData);
      // For now, set some dummy types until you implement real types
      setTypes([
        { id: 'tvshows', name: 'TV Shows', slug: 'tvshows' },
        { id: 'series', name: 'Phim Bộ', slug: 'series' },
        { id: 'single', name: 'Phim Lẻ', slug: 'single' },
        { id: 'hoathinh', name: 'Hoạt Hình', slug: 'hoathinh' }
      ]);
    } catch (error) {
      console.error("Error fetching filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (id: string, name: string, type: 'genre' | 'type') => {
    onSelect(id, name, type);
    onClose();
  };

  const handleUnselect = () => {
    if (onUnselect) {
      onUnselect();
      onClose();
    }
  };

  const getFilteredItems = () => {
    return activeTab === 'genres' ? genres : types;
  };

  const getIconName = (name: string, slug: string, isGenre: boolean) => {
    if (isGenre) {
      return GENRE_ICONS[slug] || GENRE_ICONS.default;
    } else {
      return TYPE_ICONS[slug] || TYPE_ICONS.default;
    }
  };

  const getGradientColors = (index: number, isGenre: boolean): [string, string] => {
    if (isGenre) {
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
    } else {
      return ['#1A2980', '#26D0CE'];
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modalContainer}>
          <BlurView intensity={25} tint="dark" style={styles.blurView}>
            <LinearGradient
              colors={['rgba(18,18,24,0.97)', 'rgba(10,10,14,0.98)']}
              style={styles.gradientBackground}
            >
              <View style={styles.modalHeader}>
                <View style={styles.headerContent}>
                  <TouchableOpacity 
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.tabContainer}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.tabScroll}
                >
                  <TouchableOpacity 
                    style={[
                      styles.tabButton,
                      activeTab === 'genres' ? styles.activeTab : styles.inactiveTab
                    ]}
                    onPress={() => setActiveTab('genres')}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'genres' ? styles.activeTabText : styles.inactiveTabText
                    ]}>
                      Thể loại
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.tabButton,
                      activeTab === 'types' ? styles.activeTab : styles.inactiveTab
                    ]}
                    onPress={() => setActiveTab('types')}
                  >
                    <Text style={[
                      styles.tabText,
                      activeTab === 'types' ? styles.activeTabText : styles.inactiveTabText
                    ]}>
                      Loại phim
                    </Text>
                  </TouchableOpacity>
                  
                  {hasActiveFilter && onUnselect && (
                    <TouchableOpacity
                      style={styles.unselectButton}
                      onPress={handleUnselect}
                    >
                      <Ionicons name="close-circle-outline" size={16} color="#fff" />
                      <Text style={styles.unselectText}>Bỏ chọn</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
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
                      { paddingBottom: insets.bottom || 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                  >
                    {getFilteredItems().map((item, index) => {
                      const isGenre = activeTab === 'genres';
                      const iconName = getIconName(item.name, item.slug, isGenre);
                      const gradientColors = getGradientColors(index, isGenre);
                      
                      return (
                        <TouchableOpacity
                          key={item.id}
                          activeOpacity={0.7}
                          onPress={() => handleSelect(item.id, item.name, isGenre ? 'genre' : 'type')}
                          style={styles.genreItem}
                        >
                          <LinearGradient
                            colors={gradientColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.genreGradient}
                          >
                            <View style={styles.iconContainer}>
                              <MaterialIcons name={iconName as any} size={24} color="white" />
                            </View>
                            <Text 
                              style={styles.genreText}
                              numberOfLines={2}
                            >
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
  tabContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  tabScroll: {
    flexDirection: 'row',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: '#FF5F6D', // Use your primary color here
  },
  inactiveTab: {
    backgroundColor: 'rgba(60,60,70,0.6)',
  },
  tabText: {
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  inactiveTabText: {
    color: '#a1a1aa', // zinc-400
  },
  unselectButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(82,82,91,0.8)', // zinc-700/80
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
    color: '#a1a1aa', // zinc-400
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