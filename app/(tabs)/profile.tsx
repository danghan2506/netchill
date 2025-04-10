import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../../FirebaseConfig'
import { Feather } from '@expo/vector-icons'
import { signOut } from 'firebase/auth'
import { useRouter } from 'expo-router'

const Profile = () => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const user = auth.currentUser
    if (user) {
      setUserInfo({
        email: user.email,
        displayName: user.displayName || 'Anonymous',
        uid: user.uid,
      })
    }
  }, [])

  const handleSignOut = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn đăng xuất?', [
      {
        text: 'Huỷ',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth)
            router.replace('/(auth)/login') 
          } catch (error) {
            console.log('Lỗi đăng xuất:', error)
            alert('Đăng xuất thất bại!')
          }
        },
      },
    ])
  }

  if (!userInfo) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Đang tải thông tin người dùng...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-black px-5 pt-10">
      <StatusBar barStyle="light-content" />
      <View className="items-center mt-10">
        <Feather name="user" size={80} color="#E50914" />
        <Text className="text-white text-2xl font-bold mt-4">{userInfo.displayName}</Text>
        <Text className="text-white text-sm mt-2">{userInfo.email}</Text>
        <Text className="text-white text-xs mt-1 opacity-60">UID: {userInfo.uid}</Text>
      </View>

      <View className="mt-10 p-5 bg-gray-900/80 rounded-xl">
        <Text className="text-red-600 font-bold text-base mb-2">Thông tin cá nhân</Text>
        <View className="mb-3">
          <Text className="text-white/70 text-sm">Email</Text>
          <Text className="text-white text-base">{userInfo.email}</Text>
        </View>
        <View className="mb-3">
          <Text className="text-white/70 text-sm">Tên hiển thị</Text>
          <Text className="text-white text-base">{userInfo.displayName}</Text>
        </View>
        <View>
          <Text className="text-white/70 text-sm">UID</Text>
          <Text className="text-white text-base">{userInfo.uid}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSignOut}
        className="mt-10 bg-red-600 rounded-lg h-12 justify-center items-center"
      >
        <Text className="text-white font-bold text-base">Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Profile
