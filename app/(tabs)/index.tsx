import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

export default function HomeDashboard() {
  const router = useRouter();

  const categories = [
    { name: 'Tasks', icon: 'checkmark-circle-outline', active: true, route: '/add' },
    { name: 'Namaz', icon: 'moon-outline', active: false, route: '/calendar' },
    { name: 'Islamic', icon: 'book-outline', active: false, route: '/islamic-hub' },
    { name: 'Calculator', icon: 'calculator-outline', active: false, route: '/calculator' },
    { name: 'Age Calc', icon: 'timer-outline', active: false, route: '/stats' },
    { name: 'Weather', icon: 'cloud-outline', active: false, route: '/weather' },
  ];

  const tasks = [
    { id: 1, title: 'Read Surah Yaseen', category: 'Surah', time: '10:00 AM', completed: false },
    { id: 2, title: 'Team Meeting', category: 'Work', time: '02:00 PM', completed: true },
    { id: 3, title: 'Asr Prayer', category: 'Namaz', time: '04:30 PM', completed: false },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#6B6B6B" />
            </View>
            <Text style={styles.greeting}>Hello, <Text style={styles.greetingName}>Ahmed</Text></Text>
          </View>
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications-outline" size={24} color="#010101" />
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
          <Text style={styles.bannerTitle}>Today's Tasks</Text>
          <Text style={styles.bannerSubtitle}>3 pending, 2 done</Text>
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
                <Ionicons name={cat.icon} size={24} color={cat.active ? '#FFFFFF' : '#6B6B6B'} />
              </TouchableOpacity>
              <Text style={[styles.categoryLabel, cat.active && styles.categoryLabelActive]}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Today's Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/add')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="checkmark-done" size={20} color="#4CAF82" />
              </View>
              <Text style={styles.statValue}>5/8</Text>
              <Text style={styles.statLabel}>Tasks Done</Text>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '60%', backgroundColor: '#4CAF82' }]} /></View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/calendar')}>
              <View style={styles.statIconContainer}>
                <Ionicons name="moon" size={20} color="#FF6B35" />
              </View>
              <Text style={styles.statValue}>3/5</Text>
              <Text style={styles.statLabel}>Prayers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => router.push('/islamic-hub')}>
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
          
          {tasks.map(task => (
            <View key={task.id} style={styles.taskCard}>
              <TouchableOpacity style={[styles.checkbox, task.completed && styles.checkboxCompleted]}>
                {task.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
              </TouchableOpacity>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>{task.title}</Text>
                <View style={styles.taskMeta}>
                  <View style={styles.taskChip}>
                    <Text style={styles.taskChipText}>{task.category}</Text>
                  </View>
                  <Text style={styles.taskTime}>{task.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  greeting: {
    fontSize: 18,
    color: '#6B6B6B',
  },
  greetingName: {
    fontWeight: '700',
    color: '#010101',
  },
  bellIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  },
  categoryIconBtnActive: {
    backgroundColor: '#FF6B35',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#010101',
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
    color: '#010101',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
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
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#010101',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#EFEFEF',
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
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
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
    borderColor: '#6B6B6B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  checkboxCompleted: {
    backgroundColor: '#4CAF82',
    borderColor: '#4CAF82',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#010101',
    marginBottom: 6,
  },
  taskTitleCompleted: {
    color: '#6B6B6B',
    textDecorationLine: 'line-through',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskChip: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  taskChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B6B6B',
    textTransform: 'uppercase',
  },
  taskTime: {
    fontSize: 13,
    color: '#6B6B6B',
  },
});
