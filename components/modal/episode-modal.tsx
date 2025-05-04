import { X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Icon } from "../ui/icon";

const screenWidth = Dimensions.get("window").width;

interface EpisodeModalProps {
  visible: boolean;
  onClose: () => void;
  episodes: { id: string; name: string; link_m3u8: string }[];
  onEpisodeSelect: (episode: { id: string; name: string; link_m3u8: string }) => void;
}

const EpisodeModal: React.FC<EpisodeModalProps> = ({
  visible,
  onClose,
  episodes,
  onEpisodeSelect,
}) => {
  const numColumns = 4;
  const modalWidth = screenWidth * 0.9; // 90% của chiều rộng màn hình
  const contentPadding = 20; // Padding nội dung
  const gap = 8; // Khoảng cách giữa các ô
  
  // Tính toán lại kích thước từng ô
  const totalGapWidth = gap * (numColumns - 1);
  const availableWidth = modalWidth - contentPadding * 2 - totalGapWidth;
  const itemWidth = availableWidth / numColumns;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { width: modalWidth }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Danh sách tập phim</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon as={X} size="md" color="white" />
            </TouchableOpacity>
          </View>

          {/* Episode List */}
          <FlatList
            data={episodes || []}
            keyExtractor={(item, index) => `${item?.id || index}-${index}`}
            numColumns={numColumns}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  setTimeout(() => onEpisodeSelect(item), 200);
                }}
                activeOpacity={0.7}
                style={[
                  styles.episodeItem,
                  {
                    width: itemWidth,
                    marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
                    marginBottom: gap,
                  },
                ]}
              >
                <Text style={styles.episodeText}>
                  {item?.name || `Tập ${index + 1}`}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{
              paddingHorizontal: contentPadding,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#0e0e0e',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 4,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  closeButton: {
    padding: 6,
    position: 'absolute',
    right: 0,
  },
  episodeItem: {
    backgroundColor: '#2c2c2c',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  episodeText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default EpisodeModal;