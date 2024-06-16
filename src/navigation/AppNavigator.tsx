import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {ThemeProvider} from "styled-components/native";
import HomeScreen from "@/screens/HomeScreen";
import TodayScreen from "@/screens/TodayScreen";
import CustomScreen from "@/screens/CustomScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import {RootTabParamList} from "@/types/route";

import CalendarIcon from "@/assets/icons/calendar.svg";
import ChecklistIcon from "@/assets/icons/checklist.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import {lightTheme} from "@/styles/theme";

const Tab = createBottomTabNavigator<RootTabParamList>();

const getTabBarIcon = (
  routeName: string,
  color: string,
  size: number,
  focused: boolean,
): React.ReactNode => {
  let IconComponent = CalendarIcon;
  if (routeName === "Home") {
    IconComponent = focused ? HeartIcon : ChecklistIcon;
  } else if (routeName === "Today") {
    IconComponent = CalendarIcon;
  } else if (routeName === "Custom") {
    IconComponent = ChecklistIcon;
  } else if (routeName === "Settings") {
    IconComponent = SettingsIcon;
  }
  return <IconComponent width={size} height={size} fill={color} />;
};

const AppNavigator = () => {
  const theme = lightTheme;
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}: BottomTabScreenProps<RootTabParamList>) => ({
            tabBarIcon: ({color, size, focused}) =>
              getTabBarIcon(route.name, color, size, focused),
            tabBarActiveTintColor: "tomato",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {paddingBottom: 5, height: 60},
          })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Today" component={TodayScreen} />
          <Tab.Screen name="Custom" component={CustomScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;
