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

import CalendarIcon from "@/assets/icons/calender.svg";
import ChecklistIcon from "@/assets/icons/checklist.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import ActiveCalendarIcon from "@/assets/icons/active_calender.svg";
import ActiveChecklistIcon from "@/assets/icons/active_checklist.svg";
import ActiveSettingsIcon from "@/assets/icons/active_settings.svg";
import ActiveHeartIcon from "@/assets/icons/active_heart.svg";
import {lightTheme} from "@/styles/theme";

const Tab = createBottomTabNavigator<RootTabParamList>();

const getTabBarIcon = (
  routeName: string,
  color: string,
  size: number,
  focused: boolean,
): React.ReactNode => {
  let IconComponent = focused ? ActiveCalendarIcon : CalendarIcon;
  if (routeName === "달력") {
    IconComponent = focused ? ActiveCalendarIcon : CalendarIcon;
  } else if (routeName === "오늘 할 일") {
    IconComponent = focused ? ActiveChecklistIcon : ChecklistIcon;
  } else if (routeName === "커스텀") {
    IconComponent = focused ? ActiveHeartIcon : HeartIcon;
  } else if (routeName === "설정") {
    IconComponent = focused ? ActiveSettingsIcon : SettingsIcon;
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
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.text,
            tabBarStyle: {
              paddingBottom: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontFamily: theme.fonts.Regular,
              fontSize: 12,
            },
          })}>
          <Tab.Screen name="달력" component={HomeScreen} />
          <Tab.Screen name="오늘 할 일" component={TodayScreen} />
          <Tab.Screen name="커스텀" component={CustomScreen} />
          <Tab.Screen name="설정" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppNavigator;
