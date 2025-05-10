import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert, TextInput, ActivityIndicator, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../FirebaseConfig'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { signOut, updateProfile } from 'firebase/auth'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
type userInfoProps = {
  email: string,
  displayName: string,
  uid: string,
  profileUrl: string
}
const Profile = () => {
  
  const [userInfo, setUserInfo] = useState<userInfoProps | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [downloadedVideos, setDownloadedVideos] = useState<any[]>([])
  const router = useRouter()
  

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
          profileUrl: data.profileUrl || "https://static.thenounproject.com/png/5034901-200.png",
        }
      )
        setNewName(data.name || '')
      }
      
    }
  }

  const fetchDownloadedVideos = async () => {
    // Here you would fetch the downloaded videos from local storage or your database
    // For now, let's use an empty array
    setDownloadedVideos([])
  }

  useEffect(() => {
    fetchUserInfo()
    fetchDownloadedVideos()
  }, [])

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
      mediaTypes: ['images'],
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
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <ScrollView className="flex-1 bg-black px-5 pt-10">
      <StatusBar barStyle="light-content" />
      
      {/* Profile Header Section */}
      <View className="items-center mt-10 relative">
        <TouchableOpacity onPress={pickImageAndUpload} disabled={uploading} className="relative">
          {userInfo.profileUrl ? (
            <Image
              source={{ uri: userInfo.profileUrl }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <Image 
              source={{uri: "https://static.thenounproject.com/png/5034901-200.png"}}
              className='w-24 h-24 rounded-full'
            />
          )}
          {/* Edit Avatar Icon */}
          <View className="absolute bottom-0 right-0 rounded-full p-1">
            <Ionicons name="create-outline" size={16} color="#fff"/>
          </View>
        </TouchableOpacity>
        
        {uploading && <ActivityIndicator color="#fff" className="mt-2" />}
        <Text className="text-white text-2xl font-bold mt-4">{userInfo.displayName}</Text>
        <Text className="text-white text-sm mt-2">{userInfo.email}</Text>
      </View>

      {/* User Info Section */}
      <View className="mt-10 p-5 bg-zinc-600/50 rounded-xl">
        <Text className="text-red-600 font-bold text-base mb-2">Thông tin cá nhân</Text>

        {/* Display Name Section */}
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
            <TouchableOpacity 
              onPress={() => setEditingName(true)}
              className="flex-row items-center justify-between"
            >
              <View>
                <Text className="text-white text-base">{userInfo.displayName || 'Chưa có tên'}</Text>
                <Text className="text-white/40 text-xs mt-1">Nhấn để chỉnh sửa</Text>
              </View>
              <Feather name="edit" size={16} color="white" opacity={0.6} />
            </TouchableOpacity>
          )}
        </View>

        {/* Email and UID Section */}
        <View className="mb-3">
          <Text className="text-white/70 text-sm">Email</Text>
          <Text className="text-white text-base">{userInfo.email}</Text>
        </View>
      </View>

      {/* Downloaded Videos Section */}
      <View className="mt-6 p-5 bg-zinc-600/50 rounded-xl">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-red-600 font-bold text-base">Video đã tải xuống</Text>
          <MaterialIcons name="video-library" size={20} color="#dc2626" />
        </View>
        {downloadedVideos.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {downloadedVideos.map((video, index) => (
              <TouchableOpacity 
                key={index}
                className="mr-4 w-32"
              >
                <Image
                  source={{ uri: video.thumbnail }}
                  className="w-32 h-48 rounded-lg"
                  resizeMode="cover"
                />
                <Text className="text-white text-sm mt-2" numberOfLines={2}>
                  {video.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="items-center py-8">
            <MaterialIcons name="video-library" size={40} color="#4b5563" />
            <Text className="text-gray-500 text-base mt-2">Chưa có video nào được tải xuống</Text>
          </View>
        )}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="mt-10 mb-8 bg-red-600 rounded-lg h-12 justify-center items-center flex-row"
      >
        <Text className="text-white font-bold text-base mr-2">Đăng xuất</Text>
        <Ionicons name="log-out-outline" size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile
