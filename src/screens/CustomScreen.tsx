import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {Colors} from "react-native/Libraries/NewAppScreen";

function Custom(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <Text>Custom</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Custom;
