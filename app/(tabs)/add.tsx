import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { taskService } from "../../components/shared/service/task.route";
import useAuth from "../../components/Hooks/useAuth";
import { useRouter } from "expo-router";
import { useTheme } from "../../components/shared/theme";

export default function TodoScreen() {
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  const { colors, isDark } = useTheme();

  const bg = isDark ? "bg-[#0E0E12]" : "bg-background";
  const card = isDark ? "bg-[#1C1C23]" : "bg-card";
  const primaryText = isDark ? "text-white" : "text-primaryText";
  const secondaryText = isDark ? "text-[#A1A1AA]" : "text-secondaryText";
  const border = isDark ? "border-[#2A2A32]" : "border-gray-100";

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTask();
      setData(response || []);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load tasks. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    const trimmed = title.trim();
    if (!user || !trimmed) return;

    const obj = {
      title: trimmed,
      isDone: false,
      name: user.displayName || "N/A",
      email: user.email || "N/A",
    };

    setSubmitting(true);
    try {
      await taskService.addTask(obj);
      setTitle("");
      await fetchTasks();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to add task.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = (id) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setData((prev) => prev.filter((t) => t._id !== id));
          try {
            await taskService.deleteTask(id);
          } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to delete task.");
            await fetchTasks();
          }
        },
      },
    ]);
  };

  const toggleDone = async (id, currentStatus) => {
    try {
      await taskService.updateTask(id, { isDone: !currentStatus });
      await fetchTasks();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update task.");
    }
  };

  const handleUpdate = async (id) => {
    if (!editedTitle.trim()) return;
    try {
      const res = await taskService.updateTask(id, { title: editedTitle.trim() });
      if (res.modifiedCount > 0 || res.updatedCount > 0) {
        setEditingId(null);
        setEditedTitle("");
        await fetchTasks();
      } else {
        setEditingId(null);
        await fetchTasks();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update task.");
    }
  };

  const fetchData = Array.isArray(data) ? data.filter((d) => d.email === user?.email) : [];

  const renderEmpty = () => (
    <View className="items-center pt-16">
      <View className="w-20 h-20 rounded-full bg-card items-center justify-center mb-4 shadow-sm">
        <Ionicons name="checkmark-done" size={36} color="#6B6B6B" />
      </View>
      <Text className={`font-bold text-[18px] ${primaryText} mb-1`}>No tasks yet</Text>
      <Text className={`text-[14px] ${secondaryText}`}>Add a task above to get started.</Text>
    </View>
  );

  return (
    <View className={`flex-1 ${bg} pt-12`}>
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text className={`text-[20px] font-bold ${primaryText}`}>My Tasks</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.primaryText} />
        </TouchableOpacity>
      </View>

      <View className="px-5 mb-6 flex-row">
        <TextInput
          placeholder="What needs to be done?"
          placeholderTextColor="#6B6B6B"
          value={title}
          onChangeText={setTitle}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
          className={`flex-1 ${card} h-[48px] rounded-[14px] px-4 font-normal text-[15px] ${primaryText} shadow-sm mr-3 ${border}`}
        />
        <TouchableOpacity
          onPress={handleAddTask}
          disabled={submitting}
          className="bg-accent w-[48px] h-[48px] rounded-[14px] items-center justify-center shadow-md"
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="add" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 items-center pt-24">
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          className="px-5 mb-24"
          data={fetchData}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          renderItem={({ item }) => (
            <View className={`${card} p-4 rounded-[20px] mb-4 flex-row items-center shadow-sm ${border}`}>
              <TouchableOpacity
                onPress={() => toggleDone(item._id, item.isDone)}
                className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-4 ${item.isDone ? 'bg-success border-success' : 'border-[#6B6B6B]'}`}
              >
                {item.isDone && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </TouchableOpacity>

              <View className="flex-1 mr-2">
                {editingId === item._id ? (
                  <TextInput
                    value={editedTitle}
                    onChangeText={setEditedTitle}
                    onSubmitEditing={() => handleUpdate(item._id)}
                    className={`${bg} ${border} p-2 rounded-md ${primaryText} font-bold mb-1`}
                    autoFocus
                  />
                ) : (
                  <Text className={`font-bold text-[16px] mb-1 ${item.isDone ? `${secondaryText} line-through` : primaryText}`}>
                    {item.title}
                  </Text>
                )}
                <View className="flex-row">
                  <View className={`${bg} px-2 py-1 rounded-[8px] mr-2`}>
                    <Text className={`${secondaryText} font-bold text-[10px] uppercase`}>
                      {item.isDone ? 'Done' : 'Active'}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                {editingId === item._id ? (
                  <TouchableOpacity onPress={() => handleUpdate(item._id)} className="w-8 h-8 items-center justify-center bg-success/20 rounded-full mr-2">
                    <Ionicons name="checkmark" size={16} color="#4CAF82" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => {
                    setEditingId(item._id);
                    setEditedTitle(item.title);
                  }} className={`w-8 h-8 items-center justify-center ${bg} rounded-full mr-2`}>
                    <Ionicons name="pencil" size={16} color="#FF6B35" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleRemove(item._id)} className="w-8 h-8 items-center justify-center bg-red-50 rounded-full">
                  <Ionicons name="trash-outline" size={16} color="#E11D48" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}