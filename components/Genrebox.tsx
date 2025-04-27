import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface GenreBoxProps {
  title: string;
  colors: [string, string]; // Ví dụ: ['#ff7e5f', '#feb47b']
  onPress: () => void;
}


const Genrebox: React.FC<GenreBoxProps> = ({ title, colors, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="rounded-xl m-2 overflow-hidden">
    <LinearGradient colors={colors} className="p-4 rounded-xl">
      <Text className="text-white font-bold text-lg">{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: 200,
    height: 300, // For Android shadow
  },
  text: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Genrebox;