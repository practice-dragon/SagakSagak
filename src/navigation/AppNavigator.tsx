import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {ThemeProvider} from "styled-components/native";
import HomeScreen from "@/screens/HomeScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import {RootTabParamList} from "@/types/route";

import CalendarIcon from "@/assets/icons/calender.svg";
import ChecklistIcon from "@/assets/icons/checklist.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import {lightTheme} from "@/styles/theme";

const Tab = createBottomTabNavigator<RootTabParamList>();

const getTabBarIcon = (
  routeName: string,
  color: string,
  size: number,
): React.ReactNode => {
  let IconComponent = CalendarIcon;
  if (routeName === "Home") {
    IconComponent = ChecklistIcon;
  } else if (routeName === "Settings") {
    IconComponent = SettingsIcon;
  }
  return <IconComponent width={size} height={size} fill={color} />;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppNavigator = () => {
  const theme = lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}: BottomTabScreenProps<RootTabParamList>) => ({
            tabBarIcon: ({color, size}) =>
              getTabBarIcon(route.name, color, size),
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {paddingBottom: 5, height: 60},
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

// export default AppNavigator;

import StorybookUIRoot from "@story/index";
export default StorybookUIRoot;
