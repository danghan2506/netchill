import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert, TextInput, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../FirebaseConfig'
import { Feather } from '@expo/vector-icons'
import { signOut, updateProfile } from 'firebase/auth'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

const Profile = () => {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    const user = auth.currentUser
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        setUserInfo({
          email: data.email,
          displayName: data.name || 'Anonymous',
          uid: data.uid,
          profileUrl: data.profileUrl || null,
        })
        setNewName(data.name || '')
      }
    }
  }

  const handleSignOut = async () => {
    Alert.alert('Confirm', 'Do you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
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

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      alert('Tên không được để trống')
      return
    }

    try {
      const user = auth.currentUser
      if (user) {
        await updateProfile(user, { displayName: newName })
        await updateDoc(doc(db, 'users', user.uid), {
          name: newName,
          updatedAt: serverTimestamp(),
        })
        setEditingName(false)
        fetchUserInfo()
        alert('Cập nhật thành công!')
      }
    } catch (error) {
      console.log(error)
      alert('Cập nhật thất bại!')
    }
  }

  const pickImageAndUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true, // thêm dòng này để lấy base64
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`
      await uploadBase64Image(base64Image)
    }
  }

  const uploadBase64Image = async (base64Image: string) => {
    try {
      setUploading(true)
      const user = auth.currentUser
  
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          profileUrl: base64Image,
          updatedAt: serverTimestamp(),
        })
  
        fetchUserInfo()
        alert('Cập nhật ảnh đại diện thành công!')
      }
    } catch (error) {
      console.log(error)
      alert('Cập nhật ảnh thất bại!')
    } finally {
      setUploading(false)
    }
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
        <TouchableOpacity onPress={pickImageAndUpload} disabled={uploading}>
          {userInfo.profileUrl ? (
            <Image
              source={{ uri: userInfo.profileUrl }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Feather name="user" size={80} color="#E50914" />
          )}
        </TouchableOpacity>
        {uploading && <ActivityIndicator color="#fff" className="mt-2" />}
        <Text className="text-white text-2xl font-bold mt-4">{userInfo.displayName}</Text>
        <Text className="text-white text-sm mt-2">{userInfo.email}</Text>
        <Text className="text-white text-xs mt-1 opacity-60">UID: {userInfo.uid}</Text>
      </View>

      <View className="mt-10 p-5 bg-gray-900/80 rounded-xl">
        <Text className="text-red-600 font-bold text-base mb-2">Thông tin cá nhân</Text>

        <View className="mb-5">
          <Text className="text-white/70 text-sm mb-1">Tên hiển thị</Text>
          {editingName ? (
            <>
              <TextInput
                className="bg-white/10 text-white rounded-lg px-3 h-10"
                value={newName}
                onChangeText={setNewName}
              />
              <TouchableOpacity
                onPress={handleUpdateProfile}
                className="bg-red-600 rounded-lg h-10 justify-center items-center mt-2"
              >
                <Text className="text-white font-bold text-sm">Lưu</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text className="text-white text-base">{userInfo.displayName || 'Chưa có tên'}</Text>
              <Text className="text-white/40 text-xs mt-1">Nhấn để chỉnh sửa</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mb-3">
          <Text className="text-white/70 text-sm">Email</Text>
          <Text className="text-white text-base">{userInfo.email}</Text>
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
