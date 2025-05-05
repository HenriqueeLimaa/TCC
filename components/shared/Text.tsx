import React from "react";
import { Text as RNText, StyleSheet, TextProps, TextStyle } from "react-native";

interface CustomTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
  fontFamily?: 'regular' | 'medium' | 'bold' | 'italic';
}

export const Text = ({ 
  children, 
  style, 
  fontFamily = 'regular', 
  ...props 
}: CustomTextProps) => {
  
  // Mapeia a propriedade fontFamily para os nomes das fontes carregadas
  const fontMap = {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
    italic: 'Roboto-Italic'
  };
  
  // Determina a fonte baseada na prop fontFamily
  const selectedFont = fontMap[fontFamily];

  return (
    <RNText 
      style={[
        { fontFamily: selectedFont },
        styles.defaultText,
        style
      ]} 
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontSize: 16,
  }
});