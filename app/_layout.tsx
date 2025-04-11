import { Stack, Tabs, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import "./global.css";
import { getAuth } from "@firebase/auth";
export default function RootLayout() {
  const router = useRouter();
  getAuth().onAuthStateChanged((user) => {
    if (!user) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(tabs)");
    }
  });
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,}}
      />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
