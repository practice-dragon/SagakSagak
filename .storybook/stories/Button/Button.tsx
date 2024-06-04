import React from "react";
import {TouchableOpacity, Text, StyleSheet} from "react-native";

interface ButtonProps {
  text: string;
  onPress: () => void;
  size: "sm" | "lg";
}

export const Button = ({text, onPress, size}: ButtonProps) => {
  const buttonStyle = [styles.button, size === "sm" ? styles.sm : styles.lg];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
