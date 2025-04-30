import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

interface GenreBoxProps {
  title: string;
  colors: [string, string]; // Ví dụ: ['#ff7e5f', '#feb47b']
  onPress: () => void;
  icon?: React.ReactNode; // Optional icon component
}

const GenreBox: React.FC<GenreBoxProps> = ({ title, colors, onPress, icon }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient 
        colors={colors} 
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1, // Makes it a perfect square
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden', // Ensures the gradient respects the border radius
  },
  gradient: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
  },
  iconContainer: {
    marginBottom: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GenreBox;