import { useRef, useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

export const useInfiniteScroll = <T>(items: T[], scrollX: SharedValue<number>, itemWidth: number) => {
  const [data, setData] = useState<T[]>([]);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    if (items?.length > 0) {
      const augmentedData = [
        items[items.length - 1],
        ...items,
        items[0]
      ];
      setData(augmentedData);
    }
  }, [items]);

  // Use useDerivedValue to track scroll position changes
  useDerivedValue(() => {
    const currentIndex = Math.round(scrollX.value / itemWidth);
    if (data.length > 0) {
      // If at clone item at end
      if (currentIndex >= data.length - 1) {
        flatListRef.current?.scrollToOffset({
          offset: itemWidth,
          animated: false
        });
      }
      // If at clone item at start
      else if (currentIndex <= 0) {
        flatListRef.current?.scrollToOffset({
          offset: itemWidth * (data.length - 2),
          animated: false
        });
      }
    }
  }, [scrollX.value, data.length]);

  return {
    data,
    flatListRef
  };
};