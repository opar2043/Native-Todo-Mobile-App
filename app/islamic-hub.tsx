import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import Namaz from '../components/Namaz/Namaz'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function IslamicHubScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-5 pt-4 flex-row items-center mb-4">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center mr-2"
        >
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-primaryText">Islamic Hub</Text>
      </View>
      <Namaz />
    </SafeAreaView>
  )
}
