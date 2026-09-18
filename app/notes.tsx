import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../components/shared/theme'

const NOTES_KEY = '@dailytracker/notes';

interface Note {
  id: string;
  text: string;
  createdAt: number;
}

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const bg = isDark ? 'bg-[#0E0E12]' : 'bg-background';
  const card = isDark ? 'bg-[#1C1C23]' : 'bg-card';
  const primaryText = isDark ? 'text-white' : 'text-primaryText';
  const secondaryText = isDark ? 'text-[#A1A1AA]' : 'text-secondaryText';
  const border = isDark ? 'border-[#2A2A32]' : 'border-gray-100';

  const loadNotes = async () => {
    try {
      const raw = await AsyncStorage.getItem(NOTES_KEY);
      setNotes(raw ? JSON.parse(raw) : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Persist whenever notes change (after the initial load)
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes)).catch(() => {});
    }
  }, [notes, loading]);

  const addNote = async () => {
    const text = input.trim();
    if (!text) return;
    const note: Note = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, createdAt: Date.now() };
    setNotes((prev) => [note, ...prev]);
    setInput('');
  };

  const removeNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setNotes((prev) => prev.filter((n) => n.id !== id)),
      },
    ]);
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView className={`flex-1 ${bg}`} edges={['top']}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 pt-4 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-bold ${primaryText}`}>Quick Notes</Text>
        <TouchableOpacity onPress={loadNotes}>
          <Ionicons name="refresh" size={22} color={colors.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Input */}
      <View className="px-5 mb-6 flex-row">
        <TextInput
          placeholder="Write a quick note..."
          placeholderTextColor="#6B6B6B"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addNote}
          returnKeyType="done"
          multiline
          className={`flex-1 ${card} min-h-[48px] rounded-[14px] px-4 py-3 font-normal text-[15px] ${primaryText} shadow-sm mr-3 ${border}`}
        />
        <TouchableOpacity
          onPress={addNote}
          className="bg-accent w-[48px] h-[48px] rounded-[14px] items-center justify-center shadow-md self-start"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center pt-24">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          className="px-5 mb-24"
          data={notes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center pt-16">
              <View className={`w-20 h-20 rounded-full ${card} items-center justify-center mb-4 shadow-sm`}>
                <Ionicons name="document-text-outline" size={36} color={colors.secondaryText} />
              </View>
              <Text className={`font-bold text-[18px] ${primaryText} mb-1`}>No notes yet</Text>
              <Text className={`text-[14px] ${secondaryText}`}>Jot down ideas before you forget them.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View className={`${card} p-4 rounded-[20px] mb-3 shadow-sm border ${border}`}>
              <Text className={`text-[15px] ${primaryText} leading-6`}>{item.text}</Text>
              <View className="flex-row justify-between items-center mt-3">
                <Text className={`text-[11px] ${secondaryText}`}>{formatDate(item.createdAt)}</Text>
                <TouchableOpacity onPress={() => removeNote(item.id)} className="bg-red-50 w-8 h-8 rounded-full items-center justify-center">
                  <Ionicons name="trash-outline" size={16} color="#E11D48" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}