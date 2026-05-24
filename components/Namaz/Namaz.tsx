import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Namaz() {
  const [prayer, setPrayer] = useState(null);
  const [suras, setSuras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('prayer'); // 'prayer', 'suras', 'tasbih'
  const [count, setCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      try {
        // Get Prayer Times
        let { status } = await Location.requestForegroundPermissionsAsync();
        let latitude = 23.8103; // Default Dhaka
        let longitude = 90.4125;

        if (status === 'granted') {
          let location = await Location.getCurrentPositionAsync({});
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
        }

        const prayerRes = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
        );
        const prayerData = await prayerRes.json();
        setPrayer(prayerData.data.timings);

        // Get Suras
        const suraRes = await fetch('https://api.alquran.cloud/v1/surah');
        const suraData = await suraRes.json();
        setSuras(suraData.data); // All 114 suras

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const getNextPrayer = () => {
    if (!prayer) return null;
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const times = Object.entries(prayer).slice(0, 6).map(([name, time]) => {
        const [h, m] = time.split(':').map(Number);
        return { name, minutes: h * 60 + m, time };
    });

    return times.find(p => p.minutes > currentTime) || times[0];
  };

  const nextPrayer = getNextPrayer();

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-primaryText">Daily Namaz</Text>
        <TouchableOpacity>
          <Ionicons name="pencil" size={20} color="#010101" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
        
        {/* Custom Tabs */}
        <View className="flex-row bg-card rounded-[14px] p-1 mb-6 border border-gray-100 shadow-sm">
          <TouchableOpacity 
            onPress={() => setTab('prayer')}
            className={`flex-1 py-2 rounded-[10px] items-center ${tab === 'prayer' ? 'bg-background' : ''}`}
          >
            <Text className={`font-bold text-[14px] ${tab === 'prayer' ? 'text-primaryText' : 'text-secondaryText'}`}>Prayers</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setTab('suras')}
            className={`flex-1 py-2 rounded-[10px] items-center ${tab === 'suras' ? 'bg-background' : ''}`}
          >
            <Text className={`font-bold text-[14px] ${tab === 'suras' ? 'text-primaryText' : 'text-secondaryText'}`}>Quran</Text>
          </TouchableOpacity>
        </View>

        {tab === 'prayer' ? (
          <>
            {/* Date */}
        <Text className="text-secondaryText text-[15px] font-medium mb-4">24 February, 2024</Text>

        {/* Stats Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <View className="bg-[#E6F4EA] px-4 py-2 rounded-full mr-3 flex-row items-center">
            <Text className="text-[14px] mr-2">🌟</Text>
            <Text className="text-[#137333] font-bold text-[13px]">Fajr</Text>
          </View>
          <View className="bg-[#E8F0FE] px-4 py-2 rounded-full mr-3 flex-row items-center">
            <Text className="text-[14px] mr-2">⏰</Text>
            <Text className="text-[#1967D2] font-bold text-[13px]">5 Prayers</Text>
          </View>
          <View className="bg-[#FCE8E6] px-4 py-2 rounded-full mr-3 flex-row items-center">
            <Text className="text-[14px] mr-2">👤</Text>
            <Text className="text-[#C5221F] font-bold text-[13px]">3 Done</Text>
          </View>
        </ScrollView>

        {/* Premium Next Prayer Hero */}
        {nextPrayer && (
          <View className="bg-accent p-6 rounded-[24px] mb-8 shadow-lg shadow-accent/30 relative overflow-hidden">
            <View className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />
            <View className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full" />
            
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="text-white/80 font-medium text-[14px] mb-1">Upcoming Prayer</Text>
                <Text className="text-white font-bold text-[32px]">{nextPrayer.name}</Text>
              </View>
              <View className="bg-white/20 px-3 py-1.5 rounded-full">
                <Text className="text-white font-bold text-[14px]">{nextPrayer.time}</Text>
              </View>
            </View>
            
            <View className="bg-white/20 h-1.5 rounded-full w-full mb-3 overflow-hidden">
              <View className="bg-white h-full rounded-full w-2/3" />
            </View>
            <View className="flex-row justify-between">
              <Text className="text-white/90 text-[13px] font-medium">Time remaining</Text>
              <Text className="text-white font-bold text-[13px]">- 45 mins</Text>
            </View>
          </View>
        )}

        {/* Prayer List */}
        <Text className="text-[20px] font-bold text-primaryText mb-4">Today's Schedule</Text>
        
        {prayer && Object.entries(prayer).slice(0, 6).map(([name, time]) => {
          const isDone = name === 'Fajr' || name === 'Dhuhr' || name === 'Asr'; // Mocking done state
          return (
            <View key={name} className="bg-card p-4 rounded-[20px] mb-3 flex-row justify-between items-center shadow-sm border border-gray-100">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-background items-center justify-center mr-4">
                  <Ionicons name="moon-outline" size={20} color="#6B6B6B" />
                </View>
                <View>
                  <Text className="font-bold text-[16px] text-primaryText">{name}</Text>
                  <Text className="text-secondaryText text-[13px]">{String(time)}</Text>
                </View>
              </View>
              <TouchableOpacity className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isDone ? 'bg-success border-success' : 'border-gray-300'}`}>
                {isDone && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </TouchableOpacity>
            </View>
          );
        })}
          </>
        ) : (
          /* Quran Suras List */
          <View>
            <Text className="text-[20px] font-bold text-primaryText mb-4">All Surahs</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#FF6B35" className="mt-10" />
            ) : (
              suras.map((sura) => (
                <TouchableOpacity 
                  key={sura.number} 
                  onPress={() => router.push(`/surah/${sura.number}`)}
                  className="bg-card p-4 rounded-[20px] mb-3 flex-row justify-between items-center shadow-sm border border-gray-100"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-full bg-background items-center justify-center mr-4">
                      <Text className="font-bold text-primaryText text-[12px]">{sura.number}</Text>
                    </View>
                    <View>
                      <Text className="font-bold text-[16px] text-primaryText">{sura.englishName}</Text>
                      <Text className="text-secondaryText text-[12px]">{sura.englishNameTranslation} • {sura.numberOfAyahs} Ayahs</Text>
                    </View>
                  </View>
                  <Text className="font-bold text-[18px] text-accent">{sura.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
        
      </ScrollView>
    </View>
  );
}