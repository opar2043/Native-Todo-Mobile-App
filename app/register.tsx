import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "../components/Hooks/useAuth";
import { useRouter } from "expo-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { handleRegister } = useAuth();
  const router = useRouter();

const handleEmailRegister = async () => {
  try {
    await handleRegister(name, email, password);
    Alert.alert("Success", "Account Created Successfully");
    router.replace("/");
  } catch (error) {
    Alert.alert("Register Failed", error.message);
  }
};

  return (
    <View className="flex-1 justify-center bg-background px-5">
      
      <View className="items-center mb-10">
        <View className="bg-card w-20 h-20 rounded-[20px] items-center justify-center shadow-lg mb-6 border border-gray-100">
            <Ionicons name="person-add" size={40} color="#FF6B35" />
        </View>
        <Text className="text-[32px] font-bold text-primaryText">Daily Tracker</Text>
        <Text className="text-secondaryText font-medium text-[15px] mt-1">Create your account</Text>
      </View>

      {/* Name Input */}
      <View className="bg-card border border-gray-100 rounded-[14px] mb-4 px-4 py-3 shadow-sm">
        <Text className="text-secondaryText font-medium text-[13px] mb-1">Full Name</Text>
        <View className="flex-row items-center">
            <Ionicons name="person-outline" size={20} color="#6B6B6B" />
            <TextInput
            placeholder="John Doe"
            placeholderTextColor="#6B6B6B"
            value={name}
            onChangeText={setName}
            className="flex-1 p-2 text-primaryText font-normal text-[15px]"
            />
        </View>
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

      {/* Register Button */}
      <TouchableOpacity
        className="bg-accent h-[48px] rounded-[14px] flex-row justify-center items-center shadow-md"
        onPress={handleEmailRegister}
      >
        <Text className="text-white font-bold text-[15px]">Sign Up</Text>
      </TouchableOpacity>

      {/* Go Login */}
      <TouchableOpacity onPress={() => router.push("/")} className="mt-8">
        <Text className="text-center text-secondaryText font-medium text-[14px]">
          Already Registered? <Text className="text-accent font-bold">Log In</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Register;