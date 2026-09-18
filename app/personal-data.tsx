import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuth from '../components/Hooks/useAuth'
import { useTheme } from '../components/shared/theme'

export default function PersonalDataScreen() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const bg = isDark ? 'bg-[#0E0E12]' : 'bg-background';
  const card = isDark ? 'bg-[#1C1C23]' : 'bg-card';
  const primaryText = isDark ? 'text-white' : 'text-primaryText';
  const secondaryText = isDark ? 'text-[#A1A1AA]' : 'text-secondaryText';
  const border = isDark ? 'border-[#2A2A32]' : 'border-gray-100';

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile({ displayName: trimmed });
      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', error?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 mb-8">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-bold ${primaryText}`}>Personal Data</Text>
        <View className="w-6" />
      </View>

      {/* Avatar */}
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-full bg-[#E8F0FE] items-center justify-center mb-4 overflow-hidden">
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} className="w-full h-full" />
          ) : (
            <Ionicons name="person" size={40} color="#1967D2" />
          )}
        </View>
        <Text className={`text-[15px] font-bold ${primaryText}`}>{user?.email || 'Not signed in'}</Text>
      </View>

      {/* Form */}
      <View className="px-5">
        <Text className={`text-[13px] font-bold uppercase tracking-widest ${secondaryText} mb-2`}>Full Name</Text>
        <View className={`${card} rounded-[16px] px-4 flex-row items-center border ${border} shadow-sm mb-6`}>
          <Ionicons name="person-outline" size={18} color={colors.secondaryText} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#6B6B6B"
            className={`flex-1 p-3.5 ml-2 text-[15px] font-normal ${primaryText}`}
          />
        </View>

        <Text className={`text-[13px] font-bold uppercase tracking-widest ${secondaryText} mb-2`}>Email Address</Text>
        <View className={`${card} rounded-[16px] px-4 flex-row items-center border ${border} shadow-sm mb-8 opacity-60`}>
          <Ionicons name="mail-outline" size={18} color={colors.secondaryText} />
          <TextInput
            value={user?.email || ''}
            editable={false}
            placeholder="Email"
            placeholderTextColor="#6B6B6B"
            className={`flex-1 p-3.5 ml-2 text-[15px] font-normal ${primaryText}`}
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className="bg-accent h-[54px] rounded-[16px] items-center justify-center shadow-md flex-row"
        >
          {saving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              <Text className="text-white font-bold text-[16px] ml-2">Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}