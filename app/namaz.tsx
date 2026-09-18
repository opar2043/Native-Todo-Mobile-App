import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../components/shared/theme';
import NamazRules from '../components/Namaz/NamazRules';

export default function NamazScreen() {
  const [prayer, setPrayer] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'times' | 'rules'>('times');
  const [locationName, setLocationName] = useState('Your Location');
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const bg = isDark ? 'bg-[#0E0E12]' : 'bg-background';
  const card = isDark ? 'bg-[#1C1C23]' : 'bg-card';
  const primaryText = isDark ? 'text-white' : 'text-primaryText';
  const secondaryText = isDark ? 'text-[#A1A1AA]' : 'text-secondaryText';
  const border = isDark ? 'border-[#2A2A32]' : 'border-gray-100';

  useEffect(() => {
    const getData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let latitude = 23.8103; // Default Dhaka
        let longitude = 90.4125;

        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
          const address = await Location.reverseGeocodeAsync({ latitude, longitude });
          if (address[0]?.city || address[0]?.region) {
            setLocationName(address[0].city || address[0].region || 'Your Location');
          }
        }

        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const data = await res.json();
        setPrayer(data.data.timings);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const nextPrayer = () => {
    if (!prayer) return null;
    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();
    const labels = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const next = labels.find((name) => {
      const [h, m] = prayer[name].split(':').map(Number);
      return h * 60 + m > current;
    });
    return next ? { name: next, time: prayer[next] } : { name: 'Fajr', time: prayer.Fajr };
  };

  const upcoming = nextPrayer();
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-bold ${primaryText}`}>Namaz</Text>
        <View className="w-6" />
      </View>

      {/* Tabs */}
      <View className={`flex-row ${card} rounded-[14px] p-1 mx-5 mb-6 border ${border} shadow-sm`}>
        <TouchableOpacity
          onPress={() => setTab('times')}
          className={`flex-1 py-2 rounded-[10px] items-center ${tab === 'times' ? (isDark ? 'bg-[#26262E]' : 'bg-background') : ''}`}
        >
          <Text className={`font-bold text-[14px] ${tab === 'times' ? primaryText : secondaryText}`}>Prayer Times</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('rules')}
          className={`flex-1 py-2 rounded-[10px] items-center ${tab === 'rules' ? (isDark ? 'bg-[#26262E]' : 'bg-background') : ''}`}
        >
          <Text className={`font-bold text-[14px] ${tab === 'rules' ? primaryText : secondaryText}`}>Rules</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : tab === 'times' ? (
        <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
          {/* Next Prayer Hero */}
          {upcoming && (
            <View className="bg-accent p-6 rounded-[24px] mb-8 shadow-lg relative overflow-hidden">
              <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
              <View className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full" />
              <View className="flex-row justify-between items-start mb-6">
                <View>
                  <Text className="text-white/80 font-medium text-[14px] mb-1">Upcoming Prayer</Text>
                  <Text className="text-white font-bold text-[32px]">{upcoming.name}</Text>
                </View>
                <View className="bg-white/20 px-3 py-1.5 rounded-full">
                  <Text className="text-white font-bold text-[14px]">{upcoming.time}</Text>
                </View>
              </View>
              <Text className="text-white/80 text-[13px]">{date}</Text>
            </View>
          )}

          {/* Location */}
          <View className="flex-row items-center justify-center mb-5">
            <Ionicons name="location" size={16} color={colors.accent} />
            <Text className={`text-[13px] font-semibold ${secondaryText} ml-1`}>{locationName}</Text>
          </View>

          {/* Prayer List */}
          <Text className={`text-[20px] font-bold ${primaryText} mb-4`}>{"Today's Schedule"}</Text>
          {prayer &&
            prayers.map((name) => (
              <View
                key={name}
                className={`${card} p-4 rounded-[20px] mb-3 flex-row items-center shadow-sm border ${border}`}
              >
                <View className={`w-10 h-10 rounded-full ${isDark ? 'bg-[#26262E]' : 'bg-background'} items-center justify-center mr-4`}>
                  <Ionicons name="moon-outline" size={20} color={colors.secondaryText} />
                </View>
                <View className="flex-1">
                  <Text className={`font-bold text-[16px] ${primaryText}`}>{name}</Text>
                  <Text className={`text-[13px] ${secondaryText}`}>Sunnah & Fard</Text>
                </View>
                <Text className={`font-bold text-[16px] ${primaryText}`}>{prayer[name]}</Text>
              </View>
            ))}

          <Text className={`text-[13px] ${secondaryText} text-center mb-4`}>
            Times are calculated automatically from your location.
          </Text>
        </ScrollView>
      ) : (
        <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
          <NamazRules />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}