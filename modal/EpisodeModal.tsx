import { X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Icon } from "../components/ui/icon";

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
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-[#1c1c1c] p-4 rounded-2xl shadow-black ring-offset-slate-50"
                onPress={() => onEpisodeSelect(item)}
                activeOpacity={0.7}
              >
                <Text className="text-white text-lg text-center">{item.name}</Text>
              </TouchableOpacity>
            )}
            numColumns={4} // Hiển thị 4 cột
            columnWrapperStyle={{
              justifyContent: "flex-start",
              alignItems: "center", // Tạo khoảng cách đều giữa các cột
              marginBottom: 10,
              gap: 10,
               // Khoảng cách giữa các hàng
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EpisodeModal;
