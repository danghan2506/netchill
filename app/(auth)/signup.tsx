import { View, Text, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, KeyboardAvoidingView, Platform, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { images } from '@/constants/images'
import { Icon } from '@/components/ui/icon'
import { Eye, EyeOff } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'
import { handleAuthError } from '@/lib/error-handling'
import { authService } from '@/services/auth-service'

const signupSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email!').email('Email không hợp lệ!'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu!'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không khớp',
  path: ['confirmPassword'],
});

type SignupForm = z.infer<typeof signupSchema>;

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState(''); // Lưu email để gửi OTP verify

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const signUp = async (data: SignupForm) => {
    setLoading(true);
    try {
      const { error } = await authService.signUp(data.email, data.password);

      if (error) {
        const authError = handleAuthError(error);
        alert(authError.message);
        return;
      }

      setRegisteredEmail(data.email);
      setPendingVerification(true);
      alert('Đăng ký thành công! Vui lòng kiểm tra email để lấy mã xác thực OTP.');
    } catch (error: any) {
        const authError = handleAuthError(error);
        alert(authError.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!verificationCode.trim()) {
      alert('Vui lòng nhập mã xác thực');
      return;
    }

    setLoading(true);
    try {
      const { error } = await authService.verifyOtp(registeredEmail, verificationCode.trim());
      
      if (error) {
        const authError = handleAuthError(error);
        alert(authError.message);
        return;
      }

      alert('Xác thực e-mail thành công!');
      // Auth context sẽ tự động lắng nghe onAuthStateChange và fetch data
      router.replace('/(tabs)');
    } catch (error: any) {
      const authError = handleAuthError(error);
      alert(authError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={images.bg} className="flex-1 w-full h-full">
      <StatusBar barStyle="light-content" />
      <View className="flex-1 bg-black/75 justify-center px-5">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 justify-center">
          <View className="items-center mb-12">
            <Text className="text-6xl font-bold text-red-600 tracking-wide font-[BebasNeue] font-regular ">COZY MOVIES</Text>
            <Text className="text-white opacity-40 text-2xl mt-1 font-[BebasNeue] font-regular font-[400]">WATCH TV SHOW AND MOVIES.</Text>
          </View>
          <View className="p-5 w-full">
            {!pendingVerification ? (
              <>
                <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
                  <TextInput
                    placeholder="abc@gmail.com"
                    placeholderTextColor="#999"
                    onChangeText={text => form.setValue('email', text, { shouldValidate: true })}
                    value={form.watch('email')}
                    className="flex-1 text-white h-full ml-2"
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
                    className="flex-1 text-white h-full ml-2"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                    {showPassword ? <Icon as={Eye} color='white'/> : <Icon as={EyeOff} color='white'/>}
                  </TouchableOpacity>
                </View>
                {form.formState.errors.password && (
                  <Text className="text-red-500 mb-2 ml-2 text-xs">{form.formState.errors.password.message}</Text>
                )}
                <View className="flex-row items-center bg-white/10 rounded-lg mb-5 px-3 h-12">
                  <TextInput
                    placeholder="Confirm password"
                    placeholderTextColor="#999"
                    onChangeText={text => form.setValue('confirmPassword', text, { shouldValidate: true })}
                    value={form.watch('confirmPassword')}
                    secureTextEntry={!showPassword}
                    className="flex-1 text-white h-full ml-2"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-1">
                    {showPassword ? <Icon as={Eye} color='white'/> : <Icon as={EyeOff} color='white'/>}
                  </TouchableOpacity>
                </View>
                {form.formState.errors.confirmPassword && (
                  <Text className="text-red-500 mb-2 ml-2 text-xs">{form.formState.errors.confirmPassword.message}</Text>
                )}
                <TouchableOpacity
                  className={`bg-red-600 rounded-lg h-12 justify-center items-center mb-5 ${loading ? 'opacity-70' : ''}`}
                  onPress={form.handleSubmit(signUp)}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-base font-bold">Register</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="text-white/70 text-sm mb-3">Nhập mã xác thực đã gửi tới email của bạn</Text>
                <View className="flex-row items-center bg-white/10 rounded-lg mb-4 px-3 h-12">
                  <TextInput
                    placeholder="Verification code"
                    placeholderTextColor="#999"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    className="flex-1 text-white h-full ml-2"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity
                  className={`bg-red-600 rounded-lg h-12 justify-center items-center mb-5 ${loading ? 'opacity-70' : ''}`}
                  onPress={verifyEmailCode}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white text-base font-bold">Verify</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-lg h-12 justify-center items-center mb-5"
                  onPress={() => {
                    setPendingVerification(false);
                    setVerificationCode('');
                  }}
                  disabled={loading}
                >
                  <Text className="text-white/60 text-sm font-bold">Back</Text>
                </TouchableOpacity>
              </>
            )}
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
  );
};

export default SignUp;
