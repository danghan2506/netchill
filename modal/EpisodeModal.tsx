import { X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Icon } from "../components/ui/icon";
const screenWidth = Dimensions.get("window").width;
const gap = 10;
const horizontalPadding = 20; // tổng padding 2 bên container


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
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center">
        <View className="w-[90%] bg-[#0e0e0e] rounded-2xl px-5 pt-3 pb-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-xl font-bold text-white text-center">Danh sách tập phim</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Icon as={X} size="md" color="white" />
            </TouchableOpacity>
          </View>

          {/* Episode List */}
          <FlatList
  data={episodes}
  keyExtractor={(item, index) => `${item.id}-${index}`}
  numColumns={4}
  renderItem={({ item }) => (
    <TouchableOpacity
      onPress={() => onEpisodeSelect(item)}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#2c2c2c",
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        width: "23%"
      }}
    >
      <Text style={{ color: "white", fontSize: 16 }}>{item.name}</Text>
    </TouchableOpacity>
  )}
  columnWrapperStyle={{
    flexDirection: "row",
    gap: gap,
    marginBottom: 10,
    paddingHorizontal: horizontalPadding / 2,
  }}
  contentContainerStyle={{
    paddingBottom: 20,
  }}
  showsVerticalScrollIndicator={false}
/>
        </View>
      </View>
    </Modal>
  );
};

export default EpisodeModal;
