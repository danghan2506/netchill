import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import useFetch from '@/services/useFetch';
import { getGenre } from '@/services/api';
import Genrebox from '@/components/Genrebox';
import { ScrollView } from 'react-native';

const MovieByGenre = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const gradientColors = [
    ['#ff9a9e', '#fad0c4'],
    ['#a18cd1', '#fbc2eb'],
    ['#f6d365', '#fda085'],
    ['#84fab0', '#8fd3f4'],
    ['#cfd9df', '#e2ebf0'],
    ['#ffecd2', '#fcb69f'],
    ['#a1c4fd', '#c2e9fb'],
    ['#667eea', '#764ba2'],
    ['#ff758c', '#ff7eb3'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#30cfd0', '#330867'],
    ['#b6cee8', '#f578dc'],
    ['#9796f0', '#fbc7d4'],
    ['#89f7fe', '#66a6ff']
  ];
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenre();
        setGenres(data);
      } catch (err: unknown) {
        console.log('Lỗi khi lấy thể loại:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ff7eb3" />
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View className="flex flex-wrap flex-row justify-between">
        {genres.map((genre, index) => (
          <Genrebox
            key={genre._id}
            title={genre.name}
            colors={gradientColors[index % gradientColors.length]}
            onPress={() => {
              // Handle genre press
              console.log(`Genre pressed: ${genre.name}`);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#121212',
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MovieByGenre;