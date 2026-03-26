import { Redirect } from "expo-router";
import { useAuth } from "@/providers/auth-context";
import { useLoading } from "@/hooks/use-loading";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";
import { Text } from "react-native";

export default function Index() {
  const { user, isLoading: authLoading } = useAuth();
  const { setIsLoading, setMessage } = useLoading();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      setMessage("Kiểm tra trạng thái đăng nhập...");
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setIsReady(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authLoading, setIsLoading, setMessage]);

  if (!isReady) {
    return (
      <View className="flex-1 bg-background-100 justify-center items-center">
        <ActivityIndicator size="large" color="#EE1520" />
        <Text className="mt-4 text-white">Đang đăng nhập...</Text>
      </View>
    );
  }

  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}