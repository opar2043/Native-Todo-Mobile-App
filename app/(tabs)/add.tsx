import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { taskService } from "../../components/shared/service/task.route";
import useAuth from "../../components/Hooks/useAuth";
import { useRouter } from "expo-router";

export default function TodoScreen() {
  const [title, setTitle] = useState("");
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const { user } = useAuth();
  const router = useRouter();
  
  const fetchTasks = () => {
    fetch("https://task-management-server-one-gamma.vercel.app/tasks")
      .then((res) => res.json())
      .then((data) => setData(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!user || !title) return;

    const obj = {
      title,
      isDone: false,
      name: user.displayName || "N/A",
      email: user.email || "N/A",
    };

    try {
      await taskService.addTask(obj);
      setTitle("");
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = (id) => {
    Alert.alert("Delete Task", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `https://task-management-server-one-gamma.vercel.app/tasks/${id}`,
              { method: "DELETE" }
            );
            if (!res.ok) throw new Error("Delete failed");
            fetchTasks();
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const toggleDone = async (id, currentStatus) => {
    try {
      await fetch(
        `https://task-management-server-one-gamma.vercel.app/tasks/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isDone: !currentStatus }),
        }
      );
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(
        `https://task-management-server-one-gamma.vercel.app/tasks/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editedTitle }),
        }
      );
      const resData = await res.json();
      if (resData.modifiedCount > 0) {
        setEditingId(null);
        fetchTasks();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = data && data.filter((d) => d.email == user?.email);

  return (
    <View className="flex-1 bg-background pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#010101" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-primaryText">My Tasks</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#010101" />
        </TouchableOpacity>
      </View>

      <View className="px-5 mb-6 flex-row">
        <TextInput
          placeholder="What needs to be done?"
          placeholderTextColor="#6B6B6B"
          value={title}
          onChangeText={setTitle}
          className="flex-1 bg-card h-[48px] rounded-[14px] px-4 font-normal text-[15px] text-primaryText shadow-sm mr-3 border border-gray-100"
        />
        <TouchableOpacity 
          onPress={handleAddTask}
          className="bg-accent w-[48px] h-[48px] rounded-[14px] items-center justify-center shadow-md"
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        className="px-5 mb-24"
        data={fetchData}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-card p-4 rounded-[20px] mb-4 flex-row items-center shadow-sm border border-gray-100">
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
                  className="bg-background border border-gray-100 p-2 rounded-md text-primaryText font-bold mb-1"
                  autoFocus
                />
              ) : (
                <Text className={`font-bold text-[16px] mb-1 ${item.isDone ? 'text-secondaryText line-through' : 'text-primaryText'}`}>
                  {item.title}
                </Text>
              )}
              <View className="flex-row">
                <View className="bg-background px-2 py-1 rounded-[8px] mr-2">
                  <Text className="text-secondaryText font-bold text-[10px] uppercase">Work</Text>
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
                }} className="w-8 h-8 items-center justify-center bg-background rounded-full mr-2">
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
    </View>
  );
}
