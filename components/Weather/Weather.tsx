import {
  View,
  Text,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "9aabe9b0afebdfdf7304773b095539b0"; // Using existing key

  const fetchWeather = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const url = query.lat 
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=metric`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.cod !== 200) {
        setError(data.message || "City not found");
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Failed to fetch weather");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        fetchWeather("Dhaka"); // Fallback
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      fetchWeather({ lat: location.coords.latitude, lon: location.coords.longitude });
    })();
  }, []);

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeather(city);
      Keyboard.dismiss();
    }
  };

  const getIcon = (condition) => {
    switch (condition) {
      case "Clouds": return "cloud-outline";
      case "Rain": return "rainy-outline";
      case "Clear": return "sunny-outline";
      case "Haze": return "partly-sunny-outline";
      case "Snow": return "snow-outline";
      case "Thunderstorm": return "thunderstorm-outline";
      default: return "cloud-outline";
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-5 pt-4" showsVerticalScrollIndicator={false}>
      {/* Search Header */}
      <View className="flex-row items-center bg-card border border-gray-100 rounded-[14px] px-4 py-3 mb-8 shadow-sm">
        <Ionicons name="location-outline" size={20} color="#FF6B35" />
        <TextInput
          placeholder="Enter global city..."
          placeholderTextColor="#6B6B6B"
          value={city}
          onChangeText={setCity}
          onSubmitEditing={handleSearch}
          className="flex-1 ml-3 h-10 text-primaryText font-normal text-[15px]"
        />
        {city ? (
          <TouchableOpacity onPress={() => setCity("")}>
            <Ionicons name="close-circle" size={20} color="#6B6B6B" />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <View className="py-24 items-center">
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text className="mt-6 text-secondaryText font-medium text-[13px]">Accessing Meteorological Data...</Text>
        </View>
      ) : error ? (
        <View className="py-24 items-center bg-[#FCE8E6] border border-[#FAD2CF] rounded-[20px]">
          <Ionicons name="alert-circle" size={50} color="#C5221F" />
          <Text className="mt-4 text-[#C5221F] font-bold text-base px-6 text-center">{error}</Text>
          <TouchableOpacity onPress={() => fetchWeather("London")} className="mt-6 bg-primaryText px-8 py-3 rounded-[14px]">
            <Text className="text-white font-bold text-sm">Default Search</Text>
          </TouchableOpacity>
        </View>
      ) : weather ? (
        <View>
          {/* Main Display */}
          <View className="mb-10 items-center">
            <Text className="text-secondaryText font-medium text-[13px] mb-2">Current Location</Text>
            <Text className="text-[32px] font-bold text-primaryText mb-1">{weather.name}</Text>
            <Text className="text-secondaryText capitalize text-[18px]">{weather.weather[0].description}</Text>
          </View>

          {/* Central Hero Card */}
          <LinearGradient
            colors={['#FF6B35', '#E65100']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[32px] p-8 mb-8 items-center shadow-lg relative overflow-hidden"
          >
            <View className="absolute right-[-20] top-[-20] opacity-20">
                 <Ionicons name={getIcon(weather.weather[0].main)} size={200} color="#FFFFFF" />
            </View>
            <Ionicons name={getIcon(weather.weather[0].main)} size={80} color="#FFFFFF" />
            <View className="flex-row items-start mt-4">
               <Text className="text-[80px] font-light text-white tracking-tighter">{Math.round(weather.main.temp)}</Text>
               <Text className="text-[40px] font-bold text-white mt-2">°</Text>
            </View>
            <View className="bg-white/20 px-5 py-2.5 rounded-full mt-4 flex-row items-center border border-white/30">
                <Ionicons name="leaf" size={14} color="#FFFFFF" className="mr-2" />
                <Text className="text-white font-bold text-[13px] ml-2">
                  Air Quality: Excellent
                </Text>
            </View>
          </LinearGradient>

          {/* Data Grid */}
          <View className="flex-row flex-wrap justify-between">
            <StatRow icon="water-outline" label="Humidity" value={`${weather.main.humidity}%`} color="#3B82F6" />
            <StatRow icon="eye-outline" label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} color="#8B5CF6" />
            <StatRow icon="navigate-outline" label="Wind" value={`${weather.wind.speed} m/s`} color="#F59E0B" />
            <StatRow icon="thermometer-outline" label="Feels Like" value={`${Math.round(weather.main.feels_like)}°`} color="#E11D48" />
            <StatRow icon="sunny-outline" label="Sunrise" value={new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} color="#EA580C" />
            <StatRow icon="moon-outline" label="Sunset" value={new Date(weather.sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} color="#4F46E5" />
          </View>

          {/* 7-Day Forecast Mock */}
          <View className="mt-4 mb-8 bg-card border border-gray-100 rounded-[24px] p-6 shadow-sm">
            <Text className="text-primaryText font-bold text-[18px] mb-6">7-Day Forecast</Text>
            {[1,2,3].map((day, i) => (
              <View key={i} className="flex-row justify-between items-center mb-4 border-b border-gray-50 pb-4">
                <Text className="text-secondaryText font-medium text-[15px] w-16">{i === 0 ? 'Tmrw' : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay() + i]}</Text>
                <View className="flex-row items-center flex-1 justify-center">
                  <Ionicons name={i === 1 ? 'rainy' : 'sunny'} size={20} color={i === 1 ? '#3B82F6' : '#FF6B35'} />
                  <Text className="text-primaryText font-bold text-[15px] ml-2">{i === 1 ? '60%' : '10%'}</Text>
                </View>
                <Text className="text-primaryText font-bold text-[15px]">
                  {Math.round(weather.main.temp_max) + (i === 1 ? -2 : i)}° <Text className="text-secondaryText font-normal text-[14px]">{Math.round(weather.main.temp_min) + i}°</Text>
                </Text>
              </View>
            ))}
            <TouchableOpacity className="items-center py-2">
              <Text className="text-accent font-bold text-[14px]">View Full Forecast</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 p-6 bg-primaryText rounded-[24px] flex-row items-center justify-between shadow-sm">
             <View className="flex-1 pr-4">
                <Text className="text-white/60 font-medium text-[12px] mb-1">Weather Sentiment</Text>
                <Text className="text-white font-medium text-[14px]">
                    {weather.main.temp > 25 ? "Optimal conditions for outdoor collaboration." : "Colder environment detected. Recommend climate control."}
                </Text>
             </View>
             <Ionicons name="analytics" size={30} color="#FF6B35" />
          </View>
        </View>
      ) : null}
      <View className="h-24" />
    </ScrollView>
  );
}

function StatRow({ icon, label, value, color }) {
  return (
    <View className="bg-card border border-gray-100 p-5 rounded-[20px] w-[48%] items-center mb-4 shadow-sm">
      <View className="bg-background w-12 h-12 rounded-full items-center justify-center mb-3">
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-secondaryText text-[12px] font-medium">{label}</Text>
      <Text className="text-primaryText font-bold text-[16px] mt-1">{value}</Text>
    </View>
  );
}