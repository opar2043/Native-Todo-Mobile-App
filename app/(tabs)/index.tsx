import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter, Href } from 'expo-router';
import { useTheme, ThemeColors } from '../../components/shared/theme';
import { taskService } from '../../components/shared/service/task.route';
import useAuth from '../../components/Hooks/useAuth';

interface Category {
  name: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  active: boolean;
  route: Href;
}

interface TaskItem {
  _id: string;
  title: string;
  isDone?: boolean;
}

export default function HomeDashboard() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [tasks, setTasks] = useState<TaskItem[]>([]);

  const categories: Category[] = [
    { name: 'Tasks', icon: 'checkmark-circle-outline', active: true, route: '/add' },
    { name: 'Namaz', icon: 'moon-outline', active: false, route: '/namaz' },
    { name: 'Quran', icon: 'book-outline', active: false, route: '/quran' },
    { name: 'Notes', icon: 'document-text-outline', active: false, route: '/notes' },
    { name: 'Converter', icon: 'swap-horizontal-outline', active: false, route: '/converter' },
    { name: 'Calculator', icon: 'calculator-outline', active: false, route: '/calculator' },
    { name: 'Age Calc', icon: 'timer-outline', active: false, route: '/stats' },
    { name: 'Weather', icon: 'cloud-outline', active: false, route: '/weather' },
  ];

  const loadTasks = useCallback(async () => {
    try {
      const res = await taskService.getTask();
      const list = Array.isArray(res) ? res.filter((t) => t.email === user?.email) : [];
      setTasks(list);
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const pendingCount = tasks.filter((t) => !t.isDone).length;
  const doneCount = tasks.filter((t) => t.isDone).length;

  const toggleTask = async (task) => {
    try {
      await taskService.updateTask(task._id, { isDone: !task.isDone });
      await loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const previewTasks = tasks.slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={colors.secondaryText} />
            </View>
            <Text style={styles.greeting}>Hello, <Text style={styles.greetingName}>{user?.displayName?.split(' ')[0] || 'there'}</Text></Text>
          </View>
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications-outline" size={24} color={colors.primaryText} />
          </TouchableOpacity>
        </View>

        {/* Featured Banner Card */}
        <LinearGradient
          colors={['#38B2AC', '#2C7A7B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bannerCard}
        >
          <View style={styles.bannerChip}>
            <Text style={styles.bannerChipText}>🏆 Featured</Text>
          </View>
          <Text style={styles.bannerTitle}>{"Today's Tasks"}</Text>
          <Text style={styles.bannerSubtitle}>{pendingCount} pending, {doneCount} done</Text>
          <TouchableOpacity style={styles.bannerBtn} onPress={() => router.push('/add')}>
            <Text style={styles.bannerBtnText}>Get Started</Text>
            <Ionicons name="play" size={14} color="#010101" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick Category Icons Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryScrollContent}>
          {categories.map((cat, idx) => (
            <View key={idx} style={styles.categoryItem}>
              <TouchableOpacity
                style={[styles.categoryIconBtn, cat.active && styles.categoryIconBtnActive]}
                onPress={() => router.push(cat.route)}
              >
                <Ionicons name={cat.icon} size={24} color={cat.active ? colors.accentText : colors.secondaryText} />
              </TouchableOpacity>
              <Text style={[styles.categoryLabel, cat.active && styles.categoryLabelActive]}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Today's Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{"Today's Overview"}</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/add')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="checkmark-done" size={20} color={colors.success} />
              </View>
              <Text style={styles.statValue}>{doneCount}/{tasks.length}</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: `${tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0}%`, backgroundColor: colors.success }]} /></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/calendar')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="moon" size={20} color="#FF6B35" />
              </View>
              <Text style={styles.statValue}>3/5</Text>
              <Text style={styles.statLabel}>Prayers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/quran')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="book" size={20} color="#38B2AC" />
              </View>
              <Text style={styles.statValue}>Juz 3</Text>
              <Text style={styles.statLabel}>Surah Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/stats')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="gift" size={20} color="#E11D48" />
              </View>
              <Text style={styles.statValue}>24y 3m</Text>
              <Text style={styles.statLabel}>Age Today</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Todo List Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Tasks</Text>
            <TouchableOpacity onPress={() => router.push('/add')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {previewTasks.length === 0 ? (
            <View style={styles.emptyTasks}>
              <Ionicons name="sparkles-outline" size={22} color={colors.secondaryText} />
              <Text style={styles.emptyTasksText}>{'No tasks yet. Tap "See All" to add one.'}</Text>
            </View>
          ) : (
            previewTasks.map((task) => (
              <View key={task._id} style={styles.taskCard}>
                <TouchableOpacity
                  style={[styles.checkbox, task.isDone && styles.checkboxCompleted]}
                  onPress={() => toggleTask(task)}
                >
                  {task.isDone && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </TouchableOpacity>
                <View style={styles.taskInfo}>
                  <Text style={[styles.taskTitle, task.isDone && styles.taskTitleCompleted]} numberOfLines={1}>{task.title}</Text>
                  <View style={styles.taskMeta}>
                    <View style={styles.taskChip}>
                      <Text style={styles.taskChipText}>{task.isDone ? 'Done' : 'Active'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 100, // Space for bottom nav
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    greeting: {
      fontSize: 18,
      color: colors.secondaryText,
    },
    greetingName: {
      fontWeight: '700',
      color: colors.primaryText,
    },
    bellIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 2,
    },
    bannerCard: {
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
    },
    bannerChip: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      marginBottom: 16,
    },
    bannerChipText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    bannerTitle: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 4,
    },
    bannerSubtitle: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 14,
      marginBottom: 20,
    },
    bannerBtn: {
      backgroundColor: '#FFFFFF',
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 14,
      flexDirection: 'row',
      alignItems: 'center',
    },
    bannerBtnText: {
      color: '#010101',
      fontWeight: '600',
      fontSize: 14,
    },
    categoryScroll: {
      marginHorizontal: -20,
      marginBottom: 32,
    },
    categoryScrollContent: {
      paddingHorizontal: 20,
      gap: 16,
    },
    categoryItem: {
      alignItems: 'center',
      marginRight: 16,
    },
    categoryIconBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 1,
    },
    categoryIconBtnActive: {
      backgroundColor: colors.accent,
    },
    categoryLabel: {
      fontSize: 13,
      color: colors.secondaryText,
      fontWeight: '500',
    },
    categoryLabelActive: {
      color: colors.primaryText,
      fontWeight: '700',
    },
    section: {
      marginBottom: 32,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primaryText,
      marginBottom: 16,
    },
    seeAllText: {
      color: colors.accent,
      fontWeight: '600',
      fontSize: 14,
      marginBottom: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    statCard: {
      width: '48%',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 12,
      elevation: 2,
      marginBottom: 14,
    },
    statIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.iconBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    statValue: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.primaryText,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 13,
      color: colors.secondaryText,
    },
    progressBarBg: {
      height: 4,
      backgroundColor: colors.chipBg,
      borderRadius: 2,
      marginTop: 12,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 2,
    },
    taskCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 16,
      elevation: 2,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.secondaryText,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    checkboxCompleted: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    taskInfo: {
      flex: 1,
    },
    taskTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primaryText,
      marginBottom: 6,
    },
    taskTitleCompleted: {
      color: colors.secondaryText,
      textDecorationLine: 'line-through',
    },
    taskMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    taskChip: {
      backgroundColor: colors.chipBg,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 10,
    },
    taskChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.secondaryText,
      textTransform: 'uppercase',
    },
    taskTime: {
      fontSize: 13,
      color: colors.secondaryText,
    },
    emptyTasks: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.04,
      shadowRadius: 16,
      elevation: 2,
    },
    emptyTasksText: {
      marginLeft: 10,
      fontSize: 14,
      color: colors.secondaryText,
      flexShrink: 1,
    },
  });