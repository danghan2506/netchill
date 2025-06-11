import { View, Text, FlatList } from 'react-native'
import React from 'react'
import { DownloadTask } from '@/types/download';
import DownloadedMovies from './download-movie';
import DownloadingMovie from './downloading-movie';
import CancelledMovie from './cancelled-movies';
type DownloadedGroupProps = {
 title: string;
  movieId: string;
  tasks: DownloadTask[];
  type: "completed" | "downloading" | "cancelled";
  onPlay?: (task: DownloadTask) => void;
  onDelete: (task: DownloadTask) => void;
  onCancel?: (task: DownloadTask) => void;
  onRetry?: (task: DownloadTask) => void;
}
const DownloadedGroup : React.FC<DownloadedGroupProps>= ({
    title, movieId, tasks, type, onPlay, onDelete, onCancel, onRetry
}) => {
   if (!tasks || tasks.length === 0) return null;   const renderCompletedGroup = () => (
     <View className="mb-6">
      <Text className="text-white font-semibold text-base mb-2 px-4">
        {title}
      </Text>

      <FlatList
        data={tasks}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <DownloadedMovies
            movie={item} 
            onPlay={onPlay!} 
            onDelete={onDelete} 
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
    </View>
   );
   
   const renderDownloadingGroup = () => (
     <View className="mb-4">
      <Text className="text-white font-semibold text-base mb-2 px-4">
        {title}
      </Text>

      {tasks.map(item => (
        <DownloadingMovie
          key={item.id} 
          movie={item} 
          onCancel={onCancel!} 
        />
      ))}
    </View>
   );
   
   const renderCancelledGroup = () => (
    <View className="mb-4">
      <Text className="text-white font-semibold text-base mb-2 px-4">
        {title}
      </Text>

      {tasks.map(item => (
        <CancelledMovie
          key={item.id} 
          movie={item} 
          onDelete={onDelete} 
          onRetry={onRetry!} 
        />
      ))}
    </View>
   )
    switch (type) {
    case "completed":
      return renderCompletedGroup();
    case "downloading":
      return renderDownloadingGroup();
    case "cancelled":
      return renderCancelledGroup();
    default:
      return null;
  }
}
export default DownloadedGroup