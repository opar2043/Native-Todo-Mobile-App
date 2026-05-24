import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const router = useRouter();

  const buttons = [
    "C", "⌫", "%", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    "0", "00", ".", "=",
  ];

  const handlePress = (btn) => {
    if (btn === "C") {
      setInput("");
    } else if (btn === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    } else if (btn === "=") {
      try {
        const result = eval(input); // 🔥 easiest way
        setHistory(prev => [...prev.slice(-4), { equation: input, result: result.toString() }]);
        setInput(result.toString());
      } catch {
        setInput("Error");
      }
    } else {
      setInput((prev) => prev + btn);
    }
  };

  return (
    <View className="flex-1 bg-background justify-center">
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-primaryText">Calculator Pro</Text>
        <TouchableOpacity>
          <Ionicons name="time-outline" size={24} color="#010101" />
        </TouchableOpacity>
      </View>

      <View className="px-5 flex-1 justify-end pb-8">
        {/* History Area */}
        <View className="mb-4 h-24 justify-end items-end">
          {history.map((item, index) => (
            <Text key={index} className="text-secondaryText text-[16px] mb-1">
              {item.equation} = <Text className="font-bold text-primaryText">{item.result}</Text>
            </Text>
          ))}
        </View>

      {/* Display */}
      <View className="bg-card border border-gray-100 p-8 rounded-[20px] mb-8 shadow-sm relative">
        <Text className="text-right text-[64px] font-light text-primaryText tracking-tighter" numberOfLines={1} adjustsFontSizeToFit>
          {input || "0"}
        </Text>
      </View>

      {/* Grid */}
      <View className="flex-row flex-wrap justify-between">
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePress(btn)}
            className={`w-[22%] h-[72px] mb-4 rounded-[14px] items-center justify-center shadow-sm
              ${["/", "*", "-", "+", "=", "%"].includes(btn) ? "bg-accent" : "bg-card border border-gray-100"}
              ${btn === "C" ? "bg-[#FCE8E6] border-[#FAD2CF]" : ""}
              ${btn === "⌫" ? "bg-card border border-gray-100" : ""}
            `}
          >
            <Text className={`text-[24px] font-bold ${["/", "*", "-", "+", "=", "%"].includes(btn) ? "text-white" : btn === "C" ? "text-[#C5221F]" : "text-primaryText"}`}>
              {btn}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
    </View>
  );
}