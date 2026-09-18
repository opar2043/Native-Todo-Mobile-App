import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import useAuth from "../Hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const { user, logOut } = useAuth();

  const handleUserLogout = async () => {
    try {
      await logOut();
      Alert.alert("Logout Successful!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Sign Out Failed: " + error.message);
    }
  };

  const handlebackHome = () => {
    router.replace("/");
  };

  return (
    <View style={{ position: "relative", zIndex: 100 }}>
      {/* Header Bar */}
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
        <View className="flex-row items-center">
            <View className="bg-indigo-600 w-9 h-9 rounded-md items-center justify-center mr-3 shadow-sm shadow-indigo-600/20">
                <Ionicons name="layers" size={18} color="white" />
            </View>
            <Text className="font-bold text-xl tracking-tighter text-slate-900">
            NATIVE<Text className="text-indigo-600">PRO</Text>
            </Text>
        </View>

        <TouchableOpacity
          onPress={() => setOpenMenu((prev) => !prev)}
          className="active:opacity-70"
        >
          <View className="bg-slate-50 p-0.5 rounded-md border border-slate-200">
            <Image
                source={{
                uri:
                    user?.photoURL ||
                    "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png",
                }}
                className="w-10 h-10 rounded-md"
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Overlay */}
      {openMenu && (
        <Pressable
          onPress={() => setOpenMenu(false)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Executive Dropdown */}
      {openMenu && (
        <View
          style={{
            position: "absolute",
            top: 70,
            right: 16,
            width: 260,
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#F1F5F9",
            borderRadius: 8,
            padding: 24,
            shadowColor: "#64748B",
            shadowOpacity: 0.15,
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 10 },
            elevation: 15,
          }}
        >
          {/* Profile Section */}
          <View className="items-center mb-8">
            <Text className="text-slate-900 font-bold text-lg tracking-tight">
              {user?.displayName || "Access User"}
            </Text>
            <Text className="text-slate-400 font-bold text-[9px] uppercase tracking-widest mt-1">{user?.email}</Text>
          </View>

          {/* Navigation Options */}
          <TouchableOpacity
            onPress={handlebackHome}
            className="bg-slate-50 border border-slate-100 py-3 rounded-md mb-3 flex-row justify-center items-center"
          >
            <Ionicons name="home-outline" size={16} color="#4F46E5" style={{ marginRight: 10 }} />
            <Text className="font-extrabold text-[10px] text-slate-600 uppercase tracking-widest">
              Executive Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleUserLogout}
            className="bg-rose-50 border border-rose-100 py-3 rounded-md flex-row justify-center items-center"
          >
            <Ionicons name="log-out-outline" size={16} color="#E11D48" style={{ marginRight: 10 }} />
            <Text className="font-extrabold text-[10px] text-rose-600 uppercase tracking-widest">
              Terminate Session
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}