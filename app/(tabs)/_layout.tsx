import { View, Text, ImageBackground, Image } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Icon } from "@/components/ui/icon";
import {
  Heart,
  Home,
  HomeIcon,
  PersonStanding,
  Save,
  SaveAll,
  SaveIcon,
  Search,
  User,
} from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import {AuthProvider} from "@/providers/auth-context";

const Layout = () => {
  return (
    <AuthProvider>
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
              <Ionicons
                name="home"
                size={24}
                color={focused ? "white" : "#a8b5db"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            title: "Search",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="search"
                size={24}
                color={focused ? "white" : "#a8b5db"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            headerShown: false,
            title: "Discover",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="grid-outline"
                size={24}
                color={focused ? "white" : "#a8b5db"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name="person-circle-outline"
                size={24}
                color={focused ? "white" : "#a8b5db"}
              />
            ),
          }}
        />
      </Tabs>
    </AuthProvider>
  );
};

export default Layout;
