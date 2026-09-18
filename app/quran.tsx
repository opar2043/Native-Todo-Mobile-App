import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BANGLA_SURAH_NAMES } from '../components/Quran/quran.constants'

export default function QuranScreen() {
  const [suras, setSuras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getSuras = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSuras(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getSuras();
  }, []);

  const filteredSuras = suras.filter((sura, index) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    const bangla = BANGLA_SURAH_NAMES[index];
    return (
      String(sura.number).includes(q) ||
      bangla?.name?.toLowerCase().includes(q) ||
      bangla?.meaning?.toLowerCase().includes(q) ||
      sura.englishName?.toLowerCase().includes(q) ||
      sura.englishNameTranslation?.toLowerCase().includes(q) ||
      sura.name?.toLowerCase().includes(q)
    );
  });

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-5 mb-4 pt-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-primaryText">{searching ? '' : 'পবিত্র কুরআন'}</Text>
        {searching ? (
          <TouchableOpacity
            onPress={() => {
              setSearching(false);
              setQuery('');
            }}
            className="p-1"
          >
            <Ionicons name="close" size={24} color="#010101" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setSearching(true)} className="p-1">
            <Ionicons name="search-outline" size={22} color="#010101" />
          </TouchableOpacity>
        )}
      </View>

      {searching && (
        <View className="px-5 mb-4">
          <View className="bg-card rounded-[14px] flex-row items-center px-4 border border-gray-100 shadow-sm">
            <Ionicons name="search" size={18} color="#6B6B6B" />
            <TextInput
              autoFocus
              value={query}
              onChangeText={setQuery}
              placeholder="Search surah, number or meaning..."
              placeholderTextColor="#6B6B6B"
              className="flex-1 p-3 text-primaryText font-normal text-[15px] ml-2"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color="#6B6B6B" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
        {searching ? null : (
          <View className="mb-6">
            <View className="bg-accent p-5 rounded-[20px] shadow-lg">
              <Text className="text-white font-bold text-[26px] leading-10 text-center">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </Text>
              <Text className="text-white/80 text-[14px] text-center mt-3">
                কুরআন মাজীদ • ১১৪টি সূরা • বাংলা অনুবাদসহ
              </Text>
            </View>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#FF6B35" className="mt-10" />
        ) : filteredSuras.length === 0 ? (
          <View className="items-center pt-16">
            <View className="w-20 h-20 rounded-full bg-card items-center justify-center mb-4 shadow-sm">
              <Ionicons name="search-outline" size={36} color="#6B6B6B" />
            </View>
            <Text className="font-bold text-[18px] text-primaryText mb-1">No results</Text>
            <Text className="text-secondaryText text-[14px]">Try a different search term.</Text>
          </View>
        ) : (
          filteredSuras.map((sura, index) => {
            const bangla = BANGLA_SURAH_NAMES[sura.number - 1];
            return (
              <TouchableOpacity
                key={sura.number}
                onPress={() => router.push(`/surah/${sura.number}`)}
                className="bg-card p-4 rounded-[20px] mb-3 flex-row justify-between items-center shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <View className="w-11 h-11 rounded-full bg-background items-center justify-center mr-4">
                    <Text className="font-bold text-primaryText text-[12px]">{sura.number}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-[16px] text-primaryText">{bangla?.name}</Text>
                    <Text className="text-secondaryText text-[12px]" numberOfLines={1}>
                      {bangla?.meaning} • {sura.numberOfAyahs} আয়াত
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="font-bold text-[18px] text-accent">{sura.name}</Text>
                  <Text className="text-secondaryText text-[10px]">{sura.revelationType}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}