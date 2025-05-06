import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export const SunflowerButton = ({ onPress } : { onPress: () => void}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={require('../../assets/images/sunflower.png')} // Coloque sua imagem aqui
        style={styles.backgroundImage}
      />
      <View style={styles.plusCircle}>
        <Text style={styles.plusText}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: 80,
    height: 80,
    position: 'absolute',
    resizeMode: 'contain',
  },
  plusCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#00C853', // verde
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // sombra no Android
    shadowColor: '#000', // sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  plusText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
