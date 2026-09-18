import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

export default function Exam() {
    const [emails, setEmail] = useState("");
    const [passwords, setPassword] = useState("");
    const [err , setErr] = useState("");
    function handleSubmit(){
      if(!emails){
        setErr("Email is required");
        return;
      }
      if(!emails.includes("@")){
        setErr("Please enter a valid email");
        return;
      }
      if(!passwords || passwords.length < 5){
        setErr("Password must be at least 5 characters long");
        return;
      }
      if(!passwords){
        setErr("Password is required");
        return;
      }
        const obj = {
            emails , passwords
        }
        console.log(obj);
    }
    
  return (
    <View className="flex-1 bg-background px-5 justify-center">
        <Text className="font-bold text-[32px] text-primaryText mb-8">Login Form</Text>
        
        {/* Email */}
        <View className="bg-card border border-gray-100 rounded-[14px] mb-4 px-4 py-3 shadow-sm">
          <Text className="text-secondaryText font-medium text-[13px] mb-1">Email</Text>
          <TextInput 
            placeholder="name@example.com"
            placeholderTextColor="#6B6B6B"
            className="flex-1 text-primaryText font-normal text-[15px] p-2"
            value={emails}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* Password */}
        <View className="bg-card border border-gray-100 rounded-[14px] mb-4 px-4 py-3 shadow-sm">
          <Text className="text-secondaryText font-medium text-[13px] mb-1">Password</Text>
          <TextInput 
            placeholder="••••••••"
            placeholderTextColor="#6B6B6B"
            className="flex-1 text-primaryText font-normal text-[15px] p-2"
            value={passwords}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {err && (
          <View className="bg-[#FCE8E6] px-4 py-2 rounded-full mb-4 self-start">
            <Text className="text-[#C5221F] font-bold text-[12px]">{err}</Text>
          </View>
        )}

        <TouchableOpacity onPress={handleSubmit} className="bg-accent h-[48px] rounded-[14px] justify-center items-center shadow-md mt-4">
          <Text className="text-white font-bold text-[15px]">Sign In</Text>
        </TouchableOpacity>
    </View>
  );
}