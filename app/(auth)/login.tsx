import { View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar, Image } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../FirebaseConfig';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { images } from '@/constants/images'
const login = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const signIn = async () => {
    if (!email || !password) {
      alert('Please enter email and password!')
      return
    }
    setLoading(true)
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if(user){
        setLoading(false)
        router.replace('/(tabs)')
      }
    } catch (error: any) {
      console.log(error)
      alert('Đăng nhập thất bại: ' + error.message)
      setLoading(false)
    }
  }
  
  return (
    <ImageBackground
      source={images.bg}
      resizeMode='cover'
      className="flex-1 w-full h-full"
    >
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black/75 justify-center px-5">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center"
        >
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-red-600 tracking-wide">COZY MOVIES</Text>
            <Text className="text-white text-sm mt-1">WATCH ANY MOVIES THAT YOU LIKE BEST!</Text>
          </View>
          
          <View className="bg-gray-900/80 rounded-xl p-5 w-full">
            <Text className="text-2xl font-bold text-white mb-6 text-center">Login</Text>
            
            <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
              <Feather name="mail" size={20} color="#E50914" className="mr-2" />
              <TextInput 
                placeholder="Email" 
                placeholderTextColor="#999"
                onChangeText={setEmail} 
                value={email}
                className="flex-1 text-white h-full"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
              <Feather name="lock" size={20} color="#E50914" className="mr-2" />
              <TextInput 
                placeholder="Mật khẩu" 
                placeholderTextColor="#999"
                onChangeText={setPassword} 
                value={password}
                secureTextEntry={!showPassword}
                className="flex-1 text-white h-full"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#999" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity className="self-end mb-5">
              <Text className="text-red-600 text-xs">Forgot password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`bg-red-600 rounded-lg h-12 justify-center items-center mb-5 ${loading ? 'opacity-70' : ''}`}
              onPress={signIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-base font-bold">Login</Text>
              )}
            </TouchableOpacity>
            <View className="flex-row items-center my-5">
              <View className="flex-1 h-px bg-white/30" />
              <Text className="text-white/60 px-3 text-xs">or</Text>
              <View className="flex-1 h-px bg-white/30" />
            </View>
            
            <TouchableOpacity 
              className="border border-red-600 rounded-lg h-12 justify-center items-center"
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text className="text-red-600 text-sm font-bold">Create a new account!</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  )
}

export default login