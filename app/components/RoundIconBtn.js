import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';

const RoundIconBtn = ({ antIconName, size, color, style, onPress }) => {
    return (
      <AntDesign
        name={antIconName}
        size={size || 24}
        color={color || colors.light}
        style={[styles.icon, { ...style }]}
        onPress={onPress}
      />
    );
  };
  
  const styles = StyleSheet.create({
    icon: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 50,
      elevation: 5,
    },
  });
  
  export default RoundIconBtn;