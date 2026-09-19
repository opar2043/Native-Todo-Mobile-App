import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { AuthContext } from "./AuthProvider";

const Login = () => {
  const { googleSignIn: handleGoogleLogin, loading, handleLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async () => {
    try {
      await handleLogin(email, password);
      Alert.alert("Success", "Logged In Successfully");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  
  const handleGoogle = async () => {
    try {
      await handleGoogleLogin();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Sign In Failed", error.message);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-background px-5">
      
      <View className="items-center mb-10">
        <View className="bg-card w-20 h-20 rounded-[20px] items-center justify-center shadow-lg mb-6 border border-gray-100">
            <Ionicons name="checkmark-done" size={40} color="#FF6B35" />
        </View>
        <Text className="text-[32px] font-bold text-primaryText">Daily Tracker</Text>
        <Text className="text-secondaryText font-medium text-[15px] mt-1">Organize your life seamlessly</Text>
      </View>

      {/* Email Input */}
      <View className="bg-card border border-gray-100 rounded-[14px] mb-4 px-4 py-3 shadow-sm">
        <Text className="text-secondaryText font-medium text-[13px] mb-1">Email Address</Text>
        <View className="flex-row items-center">
            <Ionicons name="mail-outline" size={20} color="#6B6B6B" />
            <TextInput
            placeholder="name@example.com"
            placeholderTextColor="#6B6B6B"
            value={email}
            onChangeText={setEmail}
            className="flex-1 p-2 text-primaryText font-normal text-[15px]"
            autoCapitalize="none"
            />
        </View>
      </View>

      {/* Password Input */}
      <View className="bg-card border border-gray-100 rounded-[14px] mb-6 px-4 py-3 shadow-sm">
        <Text className="text-secondaryText font-medium text-[13px] mb-1">Password</Text>
        <View className="flex-row items-center">
            <Ionicons name="lock-closed-outline" size={20} color="#6B6B6B" />
            <TextInput
            placeholder="••••••••"
            placeholderTextColor="#6B6B6B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="flex-1 p-2 text-primaryText font-normal text-[15px]"
            />
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-accent h-[48px] rounded-[14px] flex-row justify-center items-center shadow-md"
        onPress={handleEmailLogin}
      >
        <Text className="text-white font-bold text-[15px]">Log In</Text>
      </TouchableOpacity>

      {/* Social Login Divider */}
      <View className="flex-row items-center my-8">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Text className="mx-4 text-secondaryText font-medium text-[13px]">Or continue with</Text>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>

      {/* Google Login */}
      <TouchableOpacity
        className="bg-card border-2 border-primaryText h-[48px] rounded-[14px] flex-row justify-center items-center shadow-sm"
        onPress={handleGoogleLogin}
      >
        <Ionicons name="logo-google" size={20} color="#E11D48" />
        <Text className="text-primaryText font-bold ml-2 text-[15px]">Google</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={() => router.push("/register")} className="mt-8">
        <Text className="text-center text-secondaryText font-medium text-[14px]">
          {"Don't have an account? "}<Text className="text-accent font-bold">Sign Up</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Login;
