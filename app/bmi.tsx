import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BMI() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const calculateBMI = () => {
    if (!height || !weight) {
        Alert.alert("Input Required", "Please provide both height and weight parameters.");
        return;
    }

    setLoading(true);
    
    // Simulate a brief analysis period for "Premium" feel
    setTimeout(() => {
        const heightInMeters = parseFloat(height) / 100;
        const weightInKg = parseFloat(weight);
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        const bmiNum = parseFloat(bmiValue);
        
        setBmi(bmiNum);

        if (bmiNum < 18.5) {
            setStatus("Underweight");
        } else if (bmiNum < 24.9) {
            setStatus("Optimal");
        } else if (bmiNum < 29.9) {
            setStatus("Overweight");
        } else {
            setStatus("Obese");
        }
        setLoading(false);
    }, 600);
  };

  const getStatusColor = () => {
    if (status === "Underweight") return "text-blue-500";
    if (status === "Optimal") return "text-emerald-500";
    if (status === "Overweight") return "text-orange-500";
    if (status === "Obese") return "text-rose-500";
    return "text-slate-400";
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View className="flex-row items-center mb-8">
            <TouchableOpacity 
                onPress={() => router.back()}
                className="w-10 h-10 items-center justify-center mr-2"
            >
                <Ionicons name="arrow-back" size={24} color="#010101" />
            </TouchableOpacity>
            <View>
                <Text className="text-[20px] font-bold text-primaryText">Health Scan Pro</Text>
            </View>
        </View>

        {/* HERO */}
        <View className="items-center mb-8">
          <View className="w-20 h-20 rounded-full bg-primaryText items-center justify-center mb-4 shadow-sm">
             <Ionicons name="pulse" size={40} color="#FFFFFF" />
          </View>
          <Text className="text-secondaryText text-[15px]">Calculate your Body Mass Index</Text>
        </View>

        {/* INPUT SECTION */}
        <View className="flex-row justify-between mb-6">
            <View className="w-[48%]">
                <TextInput
                placeholder="Height (cm)"
                placeholderTextColor="#6B6B6B"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                className="bg-card h-[56px] rounded-[14px] text-center font-bold text-[18px] text-primaryText shadow-sm"
                />
                <Text className="text-[13px] text-secondaryText mt-2 text-center font-medium">Height (cm)</Text>
            </View>
            <View className="w-[48%]">
                <TextInput
                placeholder="Weight (kg)"
                placeholderTextColor="#6B6B6B"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                className="bg-card h-[56px] rounded-[14px] text-center font-bold text-[18px] text-primaryText shadow-sm"
                />
                <Text className="text-[13px] text-secondaryText mt-2 text-center font-medium">Weight (kg)</Text>
            </View>
        </View>

        <TouchableOpacity
        onPress={calculateBMI}
        className="bg-accent h-[48px] rounded-[14px] flex-row justify-center items-center shadow-md mb-8"
        >
        {loading ? (
            <ActivityIndicator color="white" />
        ) : (
            <Text className="text-white font-bold text-[15px]">Execute Scan</Text>
        )}
        </TouchableOpacity>

        {/* RESULTS SECTION */}
        {bmi && (
            <View className="mb-24">
                <View className="bg-card p-6 rounded-[20px] shadow-sm mb-6 items-center">
                    <Text className="text-[14px] text-secondaryText font-medium mb-1">Calculated BMI</Text>
                    <View className="flex-row items-baseline">
                        <Text className="text-[48px] font-bold text-primaryText">{bmi}</Text>
                    </View>
                    <View className="bg-[#E8F0FE] px-3 py-1 rounded-full mt-2">
                        <Text className="text-accent font-bold text-[12px]">{status}</Text>
                    </View>
                </View>

                {/* Range Indicator */}
                <View className="bg-card p-5 rounded-[20px] shadow-sm mb-6 border border-gray-100">
                    <Text className="text-secondaryText font-medium text-[13px] mb-3 text-center">Clinical Scale</Text>
                    <View className="h-3 rounded-full overflow-hidden flex-row">
                        <View className="flex-1 bg-blue-400" />
                        <View className="flex-1 bg-success" />
                        <View className="flex-1 bg-orange-400" />
                        <View className="flex-1 bg-rose-400" />
                    </View>
                    <View className="flex-row justify-between mt-2">
                        <Text className="text-secondaryText font-bold text-[10px] uppercase">Under</Text>
                        <Text className="text-secondaryText font-bold text-[10px] uppercase">Optimal</Text>
                        <Text className="text-secondaryText font-bold text-[10px] uppercase">Over</Text>
                        <Text className="text-secondaryText font-bold text-[10px] uppercase">Obese</Text>
                    </View>
                </View>

                <View className="bg-primaryText p-5 rounded-[24px] shadow-sm flex-row items-center">
                    <View className="flex-1 pr-4">
                        <Text className="text-white/60 font-bold uppercase text-[10px] mb-1">Clinical Observation</Text>
                        <Text className="text-white font-medium text-[14px]">
                            Your index suggests a {status.toLowerCase()} profile. {bmi < 25 ? "Maintain balanced nutrition and regular activity." : "Consider optimizing your physical routine for better metrics."}
                        </Text>
                    </View>
                    <Ionicons name="medical" size={32} color="#FF6B35" />
                </View>
            </View>
        )}
        </ScrollView>
    </SafeAreaView>
  );
}