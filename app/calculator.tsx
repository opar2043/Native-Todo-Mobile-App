import { View, Text } from 'react-native'
import React from 'react'
import Calculator from '../components/Calculator/Calculator'

export default function calculator() {
  return (
    <View className="flex-1 bg-background pt-8">
      <Calculator />
    </View>
  )
}