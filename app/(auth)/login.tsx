import { View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { images } from '@/constants/images'
import { Icon } from '@/components/ui/icon';
import { Eye, EyeOff } from 'lucide-react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/providers/auth-context';
import { useSignIn } from '@clerk/expo';
import { handleAuthError } from '@/lib/error-handling';
const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email!').email('Email không hợp lệ!'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu!'),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { refreshUserData } = useAuth();
  const { signIn: clerkSignIn } = useSignIn();
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signIn = async (data: LoginForm) => {
    setLoading(true);
    try {
      const { error } = await clerkSignIn.password({
        emailAddress: data.email,
        password: data.password,
      });

      if (error) {
        const authError = handleAuthError(error);
        alert(authError.message);
        return;
      }

      if (clerkSignIn.status !== 'complete') {
        alert('Đăng nhập chưa hoàn tất. Vui lòng thử lại.');
        return;
      }

      const { error: finalizeError } = await clerkSignIn.finalize();
      if (finalizeError) {
        const authError = handleAuthError(finalizeError);
        alert(authError.message);
        return;
      }

      await refreshUserData();
      router.replace('/(tabs)');
    } catch (error: any) {
      const authError = handleAuthError(error);
      alert(authError.message);
    } finally {
      setLoading(false);
    }
  };

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
            <Text className="text-6xl font-bold text-red-600 tracking-wide font-[BebasNeue] font-regular ">NETCHILL</Text>
            <Text className="text-white opacity-40 text-2xl mt-1 font-[BebasNeue] font-regular font-[400]">WATCH TV SHOW AND MOVIES.</Text>
          </View>
          <View className="rounded-xl p-5 w-full">
            <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
              <TextInput
                placeholder="abc@gmail.com"
                placeholderTextColor="#999"
                onChangeText={text => form.setValue('email', text, { shouldValidate: true })}
                value={form.watch('email')}
                className="flex-1 text-white h-full"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {form.formState.errors.email && (
              <Text className="text-red-500 mb-2 ml-2 text-xs">{form.formState.errors.email.message}</Text>
            )}
            <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#999"
                onChangeText={text => form.setValue('password', text, { shouldValidate: true })}
                value={form.watch('password')}
                secureTextEntry={!showPassword}
                className="flex-1 text-white h-full"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                {showPassword ? <Icon as={Eye} color='white'/> : <Icon as={EyeOff} color='white'/>}
              </TouchableOpacity>
            </View>
            {form.formState.errors.password && (
              <Text className="text-red-500 mb-2 ml-2 text-xs">{form.formState.errors.password.message}</Text>
            )}
            <TouchableOpacity className="self-end mb-5">
              <Text className="text-gray-500 text-xs">Forgot password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`bg-[#EE1520] rounded-lg h-12 justify-center items-center mb-5 ${loading ? 'opacity-70' : ''}`}
              onPress={form.handleSubmit(signIn)}
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
              <Text className="text-white/60 px-3 text-xs">OR CONTINUE WITH</Text>
              <View className="flex-1 h-px bg-white/30" />
            </View>
            <TouchableOpacity 
              className="bg-[#EE1520] rounded-lg h-12 justify-center items-center"
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text className="text-white text-sm font-bold">Create a new account!</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              
            </TouchableOpacity>
            <TouchableOpacity>

            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};

export default Login;