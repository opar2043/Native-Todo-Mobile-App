import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../components/shared/theme'

type Category = 'length' | 'weight' | 'temperature' | 'currency';

interface Unit {
  label: string;
  factor: number;
}

const LENGTH: Unit[] = [
  { label: 'mm', factor: 0.001 },
  { label: 'cm', factor: 0.01 },
  { label: 'm', factor: 1 },
  { label: 'km', factor: 1000 },
  { label: 'in', factor: 0.0254 },
  { label: 'ft', factor: 0.3048 },
  { label: 'yd', factor: 0.9144 },
  { label: 'mi', factor: 1609.344 },
];

const WEIGHT: Unit[] = [
  { label: 'mg', factor: 0.000001 },
  { label: 'g', factor: 0.001 },
  { label: 'kg', factor: 1 },
  { label: 'tonne', factor: 1000 },
  { label: 'oz', factor: 0.0283495 },
  { label: 'lb', factor: 0.453592 },
];

const TEMPERATURE = ['°C', '°F', 'K'];

const FALLBACK_CURRENCY: Unit[] = [
  { label: 'USD', factor: 1 },
  { label: 'EUR', factor: 0.92 },
  { label: 'GBP', factor: 0.79 },
  { label: 'JPY', factor: 149 },
  { label: 'INR', factor: 83 },
  { label: 'BDT', factor: 109 },
  { label: 'AED', factor: 3.67 },
  { label: 'SAR', factor: 3.75 },
  { label: 'CAD', factor: 1.36 },
  { label: 'AUD', factor: 1.52 },
  { label: 'CNY', factor: 7.2 },
];

const CATEGORIES: { key: Category; label: string; icon: any }[] = [
  { key: 'length', label: 'Length', icon: 'resize-outline' },
  { key: 'weight', label: 'Weight', icon: 'scale-outline' },
  { key: 'temperature', label: 'Temp', icon: 'thermometer-outline' },
  { key: 'currency', label: 'Currency', icon: 'cash-outline' },
];

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === '°C') celsius = value;
  else if (from === '°F') celsius = ((value - 32) * 5) / 9;
  else celsius = value - 273.15;

  if (to === '°C') return celsius;
  if (to === '°F') return (celsius * 9) / 5 + 32;
  return celsius + 273.15;
}

export default function ConverterScreen() {
  const [category, setCategory] = useState<Category>('length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [currencyRates, setCurrencyRates] = useState<Unit[]>(FALLBACK_CURRENCY);
  const [rateSource, setRateSource] = useState<'live' | 'fallback'>('fallback');
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const bg = isDark ? 'bg-[#0E0E12]' : 'bg-background';
  const card = isDark ? 'bg-[#1C1C23]' : 'bg-card';
  const primaryText = isDark ? 'text-white' : 'text-primaryText';
  const secondaryText = isDark ? 'text-[#A1A1AA]' : 'text-secondaryText';
  const border = isDark ? 'border-[#2A2A32]' : 'border-gray-100';
  const chipBg = isDark ? 'bg-[#26262E]' : 'bg-background';

  useEffect(() => {
    if (category === 'currency' && rateSource === 'fallback') {
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then((res) => res.json())
        .then((data) => {
          if (data?.rates) {
            const labels = FALLBACK_CURRENCY.map((u) => u.label);
            setCurrencyRates(labels.filter((l) => data.rates[l]).map((l) => ({ label: l, factor: data.rates[l] })));
            setRateSource('live');
          }
        })
        .catch((e) => console.log(e));
    }
  }, [category, rateSource]);

  const units = () => {
    if (category === 'length') return LENGTH;
    if (category === 'weight') return WEIGHT;
    if (category === 'temperature') return TEMPERATURE.map((l) => ({ label: l, factor: 1 }));
    return currencyRates;
  };

  const unitList = units();

  useEffect(() => {
    if (unitList.length) {
      if (!unitList.find((u) => u.label === fromUnit)) setFromUnit(unitList[0].label);
      if (!unitList.find((u) => u.label === toUnit)) setToUnit(unitList[1].label);
    }
  }, [unitList, fromUnit, toUnit]);

  const numeric = parseFloat(value);

  let result = 0;
  const from = unitList.find((u) => u.label === fromUnit);
  const to = unitList.find((u) => u.label === toUnit);
  if (!isNaN(numeric) && from && to) {
    if (category === 'temperature') {
      result = convertTemperature(numeric, from.label, to.label);
    } else {
      result = (numeric * from.factor) / to.factor;
    }
  }

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const displayResult = !isNaN(numeric) ? result.toLocaleString('en-US', { maximumFractionDigits: 6 }) : '0';

  const renderUnitChips = (active: string, onSelect: (label: string) => void) => (
    <View className="flex-row flex-wrap -m-1 mt-2">
      {unitList.map((u) => {
        const isActive = u.label === active;
        return (
          <TouchableOpacity
            key={u.label}
            onPress={() => onSelect(u.label)}
            className={`m-1 px-4 py-2 rounded-full border ${
              isActive ? 'bg-accent border-accent shadow-sm' : `${chipBg} ${border}`
            }`}
          >
            <Text className={`font-bold text-[13px] ${isActive ? 'text-white' : secondaryText}`}>{u.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-bold ${primaryText}`}>Unit Converter</Text>
        <View className="w-6" />
      </View>

      {/* Category Tabs */}
      <View className="px-5 mb-6">
        <View className={`flex-row ${card} rounded-[14px] p-1 border ${border} shadow-sm`}>
          {CATEGORIES.map((c) => {
            const active = category === c.key;
            return (
              <TouchableOpacity
                key={c.key}
                onPress={() => setCategory(c.key)}
                className={`flex-1 py-2.5 rounded-[10px] flex-row items-center justify-center ${active ? (isDark ? 'bg-[#26262E]' : 'bg-background') : ''}`}
              >
                <Ionicons name={c.icon} size={15} color={active ? colors.accent : colors.secondaryText} />
                <Text className={`font-bold text-[14px] ml-1.5 ${active ? primaryText : secondaryText}`}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
        {/* From */}
        <Text className={`text-[13px] font-bold uppercase tracking-widest ${secondaryText} mb-2`}>
          <Ionicons name="arrow-up-circle-outline" size={13} color={colors.secondaryText} /> From
        </Text>
        <View className={`${card} rounded-[20px] p-4 shadow-sm border ${border} mb-5`}>
          <View className="flex-row items-center justify-between">
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="numeric"
              placeholder="Enter value"
              placeholderTextColor="#6B6B6B"
              className={`text-[30px] font-bold ${primaryText} flex-1`}
            />
            <View className="px-3 py-1.5 rounded-full bg-accent/10">
              <Text className="text-accent font-bold text-[13px]">{fromUnit || '—'}</Text>
            </View>
          </View>
          {renderUnitChips(fromUnit, setFromUnit)}
        </View>

        {/* Swap */}
        <View className="items-center -my-1 mb-4 z-10">
          <View className={`w-12 h-12 rounded-full bg-accent items-center justify-center shadow-md border-4 ${isDark ? 'border-[#0E0E12]' : 'border-background'}`}>
            <TouchableOpacity onPress={swap} className="w-full h-full items-center justify-center">
              <Ionicons name="swap-vertical" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* To / Result */}
        <Text className={`text-[13px] font-bold uppercase tracking-widest ${secondaryText} mb-2`}>
          <Ionicons name="arrow-down-circle-outline" size={13} color={colors.secondaryText} /> To
        </Text>
        <View className={`${card} rounded-[20px] p-4 shadow-sm border ${border} mb-6 overflow-hidden`}>
          <View className="flex-row items-center justify-between">
            <Text className="text-[30px] font-bold text-accent flex-1" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.5}>
              {displayResult}
            </Text>
            <View className="px-3 py-1.5 rounded-full bg-accent">
              <Text className="text-white font-bold text-[13px]">{toUnit || '—'}</Text>
            </View>
          </View>
          {renderUnitChips(toUnit, setToUnit)}
        </View>

        {category === 'currency' && (
          <View className={`${card} rounded-full py-2 px-4 self-center mb-2 flex-row items-center border ${border}`}>
            <View className={`w-2 h-2 rounded-full mr-2 ${rateSource === 'live' ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <Text className={`text-[12px] font-semibold ${secondaryText} text-center`}>
              {rateSource === 'live' ? 'Live exchange rates' : 'Offline rates — check your connection'}
            </Text>
          </View>
        )}

        {unitList.length === 0 && (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color={colors.accent} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}