import React from "react";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import HomeScreen from "@/screens/HomeScreen";
import TodayScreen from "@/screens/TodayScreen";
import CustomScreen from "@/screens/CustomScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import {RootTabParamList} from "@/types/route";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import ChecklistIcon from "@/assets/icons/ChecklistIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import HeartIcon from "@/assets/icons/HeartIcon";
import ActiveCalendarIcon from "@/assets/icons/ActiveCalendarIcon";
import ActiveChecklistIcon from "@/assets/icons/ActiveChecklistIcon";
import ActiveSettingsIcon from "@/assets/icons/ActiveSettingsIcon";
import ActiveHeartIcon from "@/assets/icons/ActiveHeartIcon";
import {lightTheme} from "@/styles/theme";
import {StyleSheet} from "react-native";

const Tab = createBottomTabNavigator<RootTabParamList>();

const getTabBarIcon = (
  routeName: string,
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
  return <IconComponent width={35} height={35} />;
};

const MainScreen = () => {
  const theme = lightTheme;

  return (
    <Tab.Navigator
      screenOptions={({route}: BottomTabScreenProps<RootTabParamList>) => ({
        tabBarIcon: ({color, size, focused}) =>
          getTabBarIcon(route.name, focused),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          paddingBottom: 5,
          height: 70,
          fontFamily: theme.fonts.h1.fontFamily,
          fontSize: theme.fonts.h1.fontSize,
        },
        tabBarIconStyle: {width: 10, height: 10},
        headerTitleStyle: {
          fontFamily: theme.fonts.h1.fontFamily,
          fontSize: theme.fonts.h1.fontSize,
        },
      })}>
      <Tab.Screen name="달력" component={HomeScreen} />
      <Tab.Screen name="오늘 할 일" component={TodayScreen} />
      <Tab.Screen name="커스텀" component={CustomScreen} />
      <Tab.Screen name="설정" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default MainScreen;
