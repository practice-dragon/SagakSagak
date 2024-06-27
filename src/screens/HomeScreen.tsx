// import {RootTabParamList} from "@/types/route";
// import {NavigationProp, useNavigation} from "@react-navigation/native";

import React from "react";
import type {PropsWithChildren} from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import {Colors} from "react-native/Libraries/NewAppScreen";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Home(): React.JSX.Element {
  // const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView>
      {/* <ScrollView contentInsetAdjustmentBehavior="automatic"> */}
      <View
        style={{
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        <Text>Home</Text>
        <Text>폰트가 잘 될까용</Text>
        <Text>일반 폰트의 안녕하세요</Text>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

export default Home;
