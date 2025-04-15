import { View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../FirebaseConfig'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { images } from '@/constants/images'
import { Icon } from '@/components/ui/icon'
import { Eye, EyeOff } from 'lucide-react-native'

const signup = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const signUp = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp')
      return
    }
    setLoading(true)
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) {
        setLoading(false)
        router.replace('/(tabs)')
      }
    } catch (error: any) {
      console.log(error)
      alert('Đăng ký thất bại: ' + error.message)
      setLoading(false)
    }
  }
  return (
    <ImageBackground
      source={images.bg}
      className="flex-1 w-full h-full"
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black/75 justify-center px-5">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center"
        >
          <View className="items-center mb-12">
            <Text className="text-6xl font-bold text-red-600 tracking-wide font-[BebasNeue] font-regular ">COZY MOVIES</Text>
            <Text className="text-white opacity-40 text-2xl mt-1 font-[BebasNeue] font-regular font-[400]">WATCH TV SHOW AND MOVIES.</Text>
          </View>

          <View className="p-5 w-full">
            <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
              <TextInput
                placeholder="abc@gmail.com"
                placeholderTextColor="#999"
                onChangeText={setEmail}
                value={email}
                className="flex-1 text-white h-full ml-2"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#999"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={!showPassword}
                className="flex-1 text-white h-full ml-2"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
              ${showPassword ? <Icon as={Eye} color='white'/> : <Icon as={EyeOff} color='white'/>}
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-white/10 rounded-lg mb-5 px-3 h-12">
              <TextInput
                placeholder="Confirm password"
                placeholderTextColor="#999"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry={!showPassword}
                className="flex-1 text-white h-full ml-2"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
              ${showPassword ? <Icon as={Eye} color='white'/> : <Icon as={EyeOff} color='white'/>}
              </TouchableOpacity>
            </View>


            <TouchableOpacity
              className={`bg-red-600 rounded-lg h-12 justify-center items-center mb-5 ${loading ? 'opacity-70' : ''}`}
              onPress={signUp}
              
              disabled={loading}
            >
              
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-bold">Register</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center my-5">
              <View className="flex-1 h-px bg-white/30" />
              <Text className="text-white/60 px-3 text-xs">OR</Text>
              <View className="flex-1 h-px bg-white/30" />
            </View>

            <TouchableOpacity
              className="bg-[#EE1520] rounded-lg h-12 justify-center items-center"
              onPress={() => router.push('/(auth)/login')}
            >
              <Text className="text-white text-base font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  )
}

export default signup
