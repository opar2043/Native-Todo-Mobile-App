import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useAuth from '../../components/Hooks/useAuth';

export default function ProfileScreen() {
  const { user, logOut } = useAuth();

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-8">
        <Text className="text-[20px] font-bold text-primaryText">My Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#010101" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View className="bg-card p-6 rounded-[20px] shadow-sm mb-6 items-center border border-gray-100">
          <View className="w-24 h-24 rounded-full bg-[#E8F0FE] items-center justify-center mb-4 overflow-hidden">
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} className="w-full h-full" />
            ) : (
              <Ionicons name="person" size={40} color="#1967D2" />
            )}
          </View>
          <Text className="text-[24px] font-bold text-primaryText mb-1">{user?.displayName || "John Doe"}</Text>
          <Text className="text-secondaryText text-[15px] mb-4">{user?.email || "john.doe@example.com"}</Text>
          
          <View className="bg-[#E6F4EA] px-4 py-2 rounded-full">
            <Text className="text-success font-bold text-[12px]">PRO Member</Text>
          </View>
        </View>

        {/* Settings List */}
        <View className="mb-6">
          <Text className="text-[18px] font-bold text-primaryText mb-4">Account</Text>
          
          <View className="bg-card rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
            <SettingRow icon="person-outline" title="Personal Data" color="#3B82F6" />
            <View className="h-[1px] bg-gray-100 mx-4" />
            <SettingRow icon="notifications-outline" title="Notifications" color="#F59E0B" />
            <View className="h-[1px] bg-gray-100 mx-4" />
            <SettingRow icon="shield-checkmark-outline" title="Privacy & Security" color="#10B981" />
          </View>
        </View>

        <TouchableOpacity 
          onPress={logOut}
          className="bg-card border-2 border-primaryText h-[56px] rounded-[14px] flex-row justify-center items-center mt-4 shadow-sm"
        >
          <Ionicons name="log-out-outline" size={20} color="#010101" />
          <Text className="text-primaryText font-bold text-[16px] ml-2">Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SettingRow({ icon, title, color }) {
  return (
    <TouchableOpacity className="flex-row items-center justify-between p-4 bg-white">
      <View className="flex-row items-center">
        <View className="w-10 h-10 rounded-full bg-background items-center justify-center mr-4">
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text className="font-bold text-[16px] text-primaryText">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B6B6B" />
    </TouchableOpacity>
  );
}
