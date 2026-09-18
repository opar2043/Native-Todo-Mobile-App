import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useAuth from '../../components/Hooks/useAuth';
import { useTheme, ThemeMode } from '../../components/shared/theme';

export default function ProfileScreen() {
  const { user, logOut } = useAuth();
  const { colors, isDark, theme, setTheme } = useTheme();
  const router = useRouter();

  const bg = isDark ? 'bg-[#0E0E12]' : 'bg-background';
  const card = isDark ? 'bg-[#1C1C23]' : 'bg-card';
  const primaryText = isDark ? 'text-white' : 'text-primaryText';
  const secondaryText = isDark ? 'text-[#A1A1AA]' : 'text-secondaryText';
  const border = isDark ? 'border-[#2A2A32]' : 'border-gray-100';
  const chipBg = isDark ? 'bg-[#26262E]' : 'bg-background';

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  const themeOptions: { label: string; value: ThemeMode; icon: any }[] = [
    { label: 'Light', value: 'light', icon: 'sunny-outline' },
    { label: 'Dark', value: 'dark', icon: 'moon-outline' },
    { label: 'System', value: 'system', icon: 'phone-portrait-outline' },
  ];

  return (
    <View className={`flex-1 ${bg}`}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-12 mb-8">
        <Text className={`text-[20px] font-bold ${primaryText}`}>My Profile</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={colors.primaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <View className={`${card} p-6 rounded-[20px] shadow-sm mb-6 items-center ${border}`}>
          <View className="w-24 h-24 rounded-full bg-[#E8F0FE] items-center justify-center mb-4 overflow-hidden">
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} className="w-full h-full" />
            ) : (
              <Ionicons name="person" size={40} color="#1967D2" />
            )}
          </View>
          <Text className={`text-[24px] font-bold ${primaryText} mb-1`}>{user?.displayName || 'Daily Tracker User'}</Text>
          <Text className={`${secondaryText} text-[15px] mb-4`}>{user?.email || 'Not signed in'}</Text>

          <View className="bg-[#E6F4EA] px-4 py-2 rounded-full">
            <Text className="text-success font-bold text-[12px]">PRO Member</Text>
          </View>
        </View>

        {/* Appearance */}
        <View className="mb-6">
          <Text className={`text-[18px] font-bold ${primaryText} mb-4`}>Appearance</Text>

          <View className={`${card} rounded-[20px] shadow-sm ${border} p-5`}>
            <Text className={`text-[15px] font-bold ${primaryText} mb-1`}>Theme</Text>
            <Text className={`${secondaryText} text-[13px] mb-4`}>
              Choose how Daily Tracker looks.
            </Text>
            <View className="flex-row gap-3">
              {themeOptions.map((opt) => {
                const selected = theme === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setTheme(opt.value)}
                    className={`flex-1 py-3 rounded-[14px] items-center border-2 ${
                      selected ? 'border-accent' : `${border}`
                    } ${selected ? (isDark ? 'bg-accent/15' : 'bg-accent/10') : ''}`}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={20}
                      color={selected ? colors.accent : colors.secondaryText}
                    />
                    <Text
                      className={`font-bold text-[13px] mt-1 ${
                        selected ? 'text-accent' : secondaryText
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Account */}
        <View className="mb-6">
          <Text className={`text-[18px] font-bold ${primaryText} mb-4`}>Account</Text>

          <View className={`${card} rounded-[20px] shadow-sm ${border} overflow-hidden`}>
            <SettingRow icon="person-outline" title="Personal Data" color="#3B82F6" isDark={isDark} primaryText={primaryText} secondaryText={secondaryText} chipBg={chipBg} onPress={() => router.push('/personal-data')} />
            <View className={`h-[1px] ${isDark ? 'bg-[#2A2A32]' : 'bg-gray-100'} mx-4`} />
            <SettingRow icon="notifications-outline" title="Notifications" color="#F59E0B" isDark={isDark} primaryText={primaryText} secondaryText={secondaryText} chipBg={chipBg} onPress={() => Alert.alert('Notifications', 'Notifications are not available yet.')} />
            <View className={`h-[1px] ${isDark ? 'bg-[#2A2A32]' : 'bg-gray-100'} mx-4`} />
            <SettingRow icon="shield-checkmark-outline" title="Privacy & Security" color="#10B981" isDark={isDark} primaryText={primaryText} secondaryText={secondaryText} chipBg={chipBg} onPress={() => Alert.alert('Privacy', 'Secured with Firebase Authentication.')} />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className={`${card} border-2 ${border} h-[56px] rounded-[14px] flex-row justify-center items-center mt-4 shadow-sm`}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.primaryText} />
          <Text className={`${primaryText} font-bold text-[16px] ml-2`}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function SettingRow({ icon, title, color, isDark, primaryText, secondaryText, chipBg, onPress }) {
  return (
    <TouchableOpacity className={`flex-row items-center justify-between p-4 ${isDark ? 'bg-[#1C1C23]' : 'bg-white'}`} onPress={onPress}>
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full ${chipBg} items-center justify-center mr-4`}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text className={`font-bold text-[16px] ${primaryText}`}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6B6B6B" />
    </TouchableOpacity>
  );
}