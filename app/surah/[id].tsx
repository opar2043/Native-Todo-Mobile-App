import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getBanglaSurahName } from '../../components/Quran/quran.constants';

export default function SurahDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [suraDetails, setSuraDetails] = useState(null);
  const [banglaAyahs, setBanglaAyahs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSura = async () => {
      try {
        const [arabicRes, banglaRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${id}`),
          fetch(`https://api.alquran.cloud/v1/surah/${id}/bn.bengali`),
        ]);
        const arabicData = await arabicRes.json();
        const banglaData = await banglaRes.json();
        setSuraDetails(arabicData.data);
        setBanglaAyahs(banglaData.data?.ayahs || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (id) {
      fetchSura();
    }
  }, [id]);

  const banglaName = suraDetails ? getBanglaSurahName(suraDetails.number) : '';

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-5 mb-4 py-2">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <View className="items-center flex-1">
          <Text className="text-[20px] font-bold text-primaryText">{banglaName}</Text>
          {suraDetails && (
            <Text className="text-secondaryText text-[12px]">
              {suraDetails.englishName}
            </Text>
          )}
        </View>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {loading || !suraDetails ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <ScrollView className="px-5 pb-10" showsVerticalScrollIndicator={false}>
          {/* Sura Info Header */}
          <View className="bg-card p-6 rounded-[20px] items-center mb-6 shadow-sm border border-gray-100">
            <Text className="text-[28px] font-bold text-accent mb-1">{suraDetails.name}</Text>
            <Text className="text-[16px] font-bold text-primaryText mb-1">{banglaName}</Text>
            <Text className="text-secondaryText text-[14px] mb-4">
              {suraDetails.revelationType} • {suraDetails.numberOfAyahs} Ayahs
            </Text>

            {/* Bismillah */}
            {suraDetails.number !== 1 && suraDetails.number !== 9 && (
              <View className="border-t border-gray-100 pt-4 w-full items-center mt-2">
                <Text className="text-[24px] text-primaryText font-bold leading-10 text-center">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </Text>
              </View>
            )}
          </View>

          {/* Ayahs List */}
          {suraDetails.ayahs.map((ayah, index) => {
            const banglaAyah = banglaAyahs[index];
            return (
              <View key={ayah.number} className="bg-card p-5 rounded-[20px] mb-4 shadow-sm border border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                  <View className="w-8 h-8 rounded-full bg-background items-center justify-center">
                    <Text className="font-bold text-primaryText text-[12px]">{ayah.numberInSurah}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="bookmark-outline" size={20} color="#6B6B6B" />
                  </TouchableOpacity>
                </View>
                <Text className="text-[22px] font-bold text-primaryText text-right leading-loose mb-3">
                  {ayah.text}
                </Text>
                {banglaAyah?.text && (
                  <View className="border-t border-gray-100 pt-3 mt-1">
                    <Text className="text-[15px] text-secondaryText leading-7">
                      {banglaAyah.text}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}