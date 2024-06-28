import React from "react";
import {View, TouchableOpacity, Text, StyleSheet, Animated} from "react-native";
import Modal from "react-native-modal";
import styled from "styled-components/native";

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomBottomSheet = ({
  visible,
  onClose,
  children,
}: CustomBottomSheetProps) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}>
      <SheetContent>
        <Handle />
        {children}
      </SheetContent>
    </Modal>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});

const SheetContent = styled.View`
  background-color: white;
  padding: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  max-height: 50%;
`;

const Handle = styled.View`
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 2.5px;
  align-self: center;
  margin-bottom: 10px;
`;
