import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import {Heart, Home, HomeIcon, PersonStanding, Save, SaveAll, SaveIcon, Search, User} from "lucide-react-native"

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#171717",
          height: 57,
          width: "100%",
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#0F0D23",
        },
        tabBarActiveTintColor: "white", // Màu chữ khi tab được chọn
        tabBarInactiveTintColor: "#A8B5DB", // Màu chữ khi tab không được chọn
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon as={Home} color={focused ? "white" : "#A8B5DB"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <Icon as={Search} color={focused ? "white" : "#A8B5DB"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="save"
        options={{
          headerShown: false,
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <Icon as={Heart} color={focused ? "white" : "#A8B5DB"} size="xl" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Icon as={User} color={focused ? "white" : "#A8B5DB"} size="xl" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
