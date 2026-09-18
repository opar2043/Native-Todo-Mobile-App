import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";

export default function AgeCalculator() {
  const router = useRouter();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [ageData, setAgeData] = useState(null);

  const getZodiac = (d, m) => {
    const day = parseInt(d);
    const month = parseInt(m);
    if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return "Capricorn";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return "Pisces";
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    return "";
  };

  const calculateAge = () => {
    if (!day || !month || !year) {
      Alert.alert("Error", "All parameters are required for professional analysis.");
      return;
    }

    const birthDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      Alert.alert("Error", "Date format unrecognized.");
      return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(today.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setAgeData({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
      totalHours,
      daysToNextBday,
      zodiac: getZodiac(day, month),
      progress: Math.min((years / 100) * 100, 100).toFixed(1)
    });
  };

  const copyToClipboard = async () => {
    if (!ageData) return;
    const text = `Age Report: ${ageData.years}Y ${ageData.months}M ${ageData.days}D. Zodiac: ${ageData.zodiac}. Total Days: ${ageData.totalDays}. Generated via Premium Pro.`;
    await Clipboard.setStringAsync(text);
    Alert.alert("Success", "Professional report copied to clipboard.");
  };

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-primaryText">Age Calculator</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#010101" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pb-24" showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primaryText items-center justify-center mb-4 shadow-sm">
             <Ionicons name="timer" size={40} color="#FFFFFF" />
          </View>
          <Text className="text-[28px] font-bold text-primaryText">Age Calculator</Text>
          <Text className="text-secondaryText text-[15px] mt-1">Enter your date of birth</Text>
        </View>

        {/* Input fields */}
        <View className="flex-row justify-between mb-6">
          <InputGroup label="Day" value={day} onChange={setDay} placeholder="DD" />
          <InputGroup label="Month" value={month} onChange={setMonth} placeholder="MM" />
          <InputGroup label="Year" value={year} onChange={setYear} placeholder="YYYY" wide />
        </View>
        <TouchableOpacity
          onPress={calculateAge}
          className="bg-accent h-[48px] rounded-[14px] flex-row justify-center items-center shadow-md mb-8"
        >
          <Text className="text-white font-bold text-[15px]">Calculate Age</Text>
        </TouchableOpacity>

        {ageData && (
          <View>
             {/* Result display */}
             <View className="bg-card p-6 rounded-[20px] shadow-sm mb-6 items-center border border-gray-100">
                <Text className="text-[28px] font-bold text-accent mb-1">
                   {ageData.years} <Text className="text-[18px] font-normal text-secondaryText">Years</Text>
                </Text>
                <Text className="text-[18px] font-bold text-primaryText">
                  {ageData.months} <Text className="font-normal text-secondaryText">Months</Text> • {ageData.days} <Text className="font-normal text-secondaryText">Days</Text>
                </Text>
             </View>

             <View className="flex-row flex-wrap justify-between mb-8 gap-y-4">
               <View className="bg-card w-[48%] p-3 rounded-[20px] shadow-sm items-center border border-gray-100">
                 <Text className="text-secondaryText text-[12px] mb-1">Total Months</Text>
                 <Text className="font-bold text-[16px] text-primaryText">{ageData.totalMonths}</Text>
               </View>
               <View className="bg-card w-[48%] p-3 rounded-[20px] shadow-sm items-center border border-gray-100">
                 <Text className="text-secondaryText text-[12px] mb-1">Total Weeks</Text>
                 <Text className="font-bold text-[16px] text-primaryText">{ageData.totalWeeks}</Text>
               </View>
               <View className="bg-card w-[31%] p-3 rounded-[20px] shadow-sm items-center border border-gray-100">
                 <Text className="text-secondaryText text-[12px] mb-1">Total Days</Text>
                 <Text className="font-bold text-[16px] text-primaryText">{ageData.totalDays}</Text>
               </View>
               <View className="bg-card w-[31%] p-3 rounded-[20px] shadow-sm items-center border border-gray-100">
                 <Text className="text-secondaryText text-[12px] mb-1">Heartbeats</Text>
                 <Text className="font-bold text-[16px] text-primaryText" adjustsFontSizeToFit numberOfLines={1}>{(ageData.totalDays * 103680).toLocaleString()}</Text>
               </View>
               <View className="bg-card w-[31%] p-3 rounded-[20px] shadow-sm items-center border border-gray-100">
                 <Text className="text-secondaryText text-[12px] mb-1">Zodiac</Text>
                 <Text className="font-bold text-[16px] text-primaryText" adjustsFontSizeToFit numberOfLines={1}>{ageData.zodiac}</Text>
               </View>
             </View>

             {/* Upcoming Milestone */}
             <View className="bg-[#E6F4EA] p-4 rounded-[20px] mb-6 flex-row items-center justify-between shadow-sm border border-green-100">
               <View className="flex-row items-center flex-1">
                 <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-3 shadow-sm">
                   <Ionicons name="gift" size={20} color="#137333" />
                 </View>
                 <View>
                   <Text className="text-[#137333] font-bold text-[15px] mb-1">Upcoming Milestone</Text>
                   <Text className="text-[#137333]/80 text-[13px] font-medium">You will be {Number(ageData.years) + 1} soon!</Text>
                 </View>
               </View>
               <View className="bg-white px-3 py-1.5 rounded-full shadow-sm">
                 <Text className="text-[#137333] font-bold text-[13px]">{ageData.daysToNextBday}d left</Text>
               </View>
             </View>

             {/* Bottom Stats Card */}
             <View className="bg-card p-5 rounded-[24px] shadow-sm mb-6 flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="sparkles" size={20} color="#FF6B35" />
                    <Text className="font-bold text-[18px] text-primaryText ml-2">Zodiac Sign</Text>
                    <View className="bg-[#E8F0FE] px-2 py-1 rounded-full ml-3">
                      <Text className="text-[#1967D2] font-bold text-[10px]">PRO</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="star" size={16} color="#6B6B6B" />
                    <Text className="text-secondaryText font-medium ml-2">{ageData.zodiac}</Text>
                  </View>
                </View>
             </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InputGroup({ label, value, onChange, placeholder, wide = false }) {
  return (
    <View className={`${wide ? "w-[35%]" : "w-[30%]"}`}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        keyboardType="numeric"
        value={value}
        onChangeText={onChange}
        className="bg-card h-[56px] rounded-[14px] text-center font-bold text-[18px] text-primaryText shadow-sm"
      />
      <Text className="text-[13px] text-secondaryText mt-2 text-center font-medium">{label}</Text>
    </View>
  );
}
