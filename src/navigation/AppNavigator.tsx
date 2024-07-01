import React from "react";
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";
import HomeScreen from "@/screens/HomeScreen";
import CustomScreen from "@/screens/CustomScreen";
import SettingsScreen from "@/screens/SettingsScreen";
import ChangeConnectedAccountsScreen from "@/screens/Settings/ChangeConnectedAccountsScreen";
import {RootTabParamList, SettingsStackParamList} from "@/types/route";
import CalendarIcon from "@/assets/icons/CalendarIcon";
import ChecklistIcon from "@/assets/icons/ChecklistIcon";
import SettingsIcon from "@/assets/icons/SettingsIcon";
import HeartIcon from "@/assets/icons/HeartIcon";
import ActiveCalendarIcon from "@/assets/icons/ActiveCalendarIcon";
import ActiveChecklistIcon from "@/assets/icons/ActiveChecklistIcon";
import ActiveSettingsIcon from "@/assets/icons/ActiveSettingsIcon";
import ActiveHeartIcon from "@/assets/icons/ActiveHeartIcon";
import {lightTheme} from "@/styles/theme";
import ChangeTimeScreen from "@/screens/Settings/ChangeTimeScreen";

const Tab = createBottomTabNavigator<RootTabParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

const getTabBarIcon = (
  routeName: string,
  focused: boolean,
): React.ReactNode => {
  let IconComponent = focused ? ActiveCalendarIcon : CalendarIcon;
  if (routeName === "캘린더") {
    IconComponent = focused ? ActiveCalendarIcon : CalendarIcon;
  } else if (routeName === "커스텀") {
    IconComponent = focused ? ActiveHeartIcon : HeartIcon;
  } else if (routeName === "설정") {
    IconComponent = focused ? ActiveSettingsIcon : SettingsIcon;
  }
  return <IconComponent width={35} height={35} />;
};

const theme = lightTheme;

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        fontFamily: theme.fonts.h3.fontFamily,
        fontSize: theme.fonts.h3.fontSize,
      },
    }}>
    <SettingsStack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{headerShown: false}}
    />
    <SettingsStack.Screen
      name="ChangeConnectedAccounts"
      component={ChangeConnectedAccountsScreen}
      options={{title: "계정 설정하기"}}
    />
    <SettingsStack.Screen
      name="Notifications"
      component={ChangeTimeScreen}
      options={{title: "알림 설정하기"}}
    />
  </SettingsStack.Navigator>
);

const MainScreen = () => {
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
        },
        tabBarIconStyle: {width: 10, height: 10},
        headerTitleStyle: {
          fontFamily: theme.fonts.h1.fontFamily,
          fontSize: theme.fonts.h1.fontSize,
        },
      })}>
      <Tab.Screen name="캘린더" component={HomeScreen} />
      <Tab.Screen name="커스텀" component={CustomScreen} />
      <Tab.Screen name="설정" component={SettingsStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainScreen;
