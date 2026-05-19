import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { colors } from "../theme";
import { supabase } from "../services/supabaseClient";
import { linkService, UserLink } from "../services/linkService";

export function ProfileScreen() {
  const health = useSelector((s: RootState) => s.health);
  const [savedLinks, setSavedLinks] = useState<UserLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  const userGoals = [
    { title: "每日步数", value: `${health.steps}`, target: "10,000", icon: "👣", color: "#F3D4C5" },
    { title: "睡眠时长", value: `${health.sleepHours}h`, target: "8h", icon: "🌙", color: "#AEC2B0" },
    { title: "静息心率", value: `${health.heartRate}`, target: "60-80", icon: "❤️", color: "#F4DED1" },
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    setLoadingLinks(true);
    try {
      const links = await linkService.getUserLinks();
      setSavedLinks(links);
    } catch (error) {
      console.log('Fetch links error:', error);
    }
    setLoadingLinks(false);
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('登出失败', error.message);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topHeader}>
        <Text style={styles.brand}>MindGarden</Text>
        <Pressable style={styles.avatar} onPress={handleLogout}>
          <Text style={styles.avatarText}>登出</Text>
        </Pressable>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.title}>我的花园</Text>
        <Text style={styles.desc}>你的每一次自我照顾，都会让内心重新长出光。</Text>
      </View>

      <Text style={styles.subtitle}>健康仪表盘</Text>
      <View style={styles.statsGrid}>
        {userGoals.map((goal) => (
          <View key={goal.title} style={styles.statCard}>
            <Text style={styles.statIcon}>{goal.icon}</Text>
            <Text style={styles.statValue}>{goal.value}</Text>
            <Text style={styles.statLabel}>{goal.title}</Text>
            <View style={[styles.progressBar, { backgroundColor: "#232D36" }]}>
              <View style={[styles.progressFill, { backgroundColor: goal.color, width: "70%" }]} />
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>已收藏的资源</Text>
      <View style={styles.linksCard}>
        {savedLinks.length === 0 ? (
          <Text style={styles.emptyText}>{loadingLinks ? '加载中...' : '还没有收藏任何资源'}</Text>
        ) : (
          savedLinks.map((link) => (
            <View key={link.id} style={styles.linkItem}>
              <View style={styles.linkInfo}>
                <Text style={styles.linkTitle}>{link.title}</Text>
                <Text style={styles.linkType}>{link.type === 'movie' ? '🎬 电影' : '🔗 链接'}</Text>
              </View>
              <Pressable onPress={async () => {
                await linkService.deleteLink(link.id!);
                fetchLinks();
              }}>
                <Text style={styles.deleteBtn}>删除</Text>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Text style={styles.subtitle}>社区与同步</Text>
      <View style={styles.settingsCard}>
        <Pressable style={styles.settingItem}>
          <Text style={styles.settingText}>🌿 匿名分享社区</Text>
          <View style={styles.toggleActive} />
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.settingItem}>
          <Text style={styles.settingText}>☁️ 多设备云端同步</Text>
          <Text style={styles.settingSub}>已同步</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>MindGarden v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1318" },
  content: { padding: 16, paddingBottom: 100 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  brand: { color: "#F3D4C5", fontSize: 24, fontWeight: "900", letterSpacing: 0.5 },
  avatar: {
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A3038",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3A4654",
  },
  avatarText: { color: "#F3D4C5", fontWeight: "700", fontSize: 13 },
  heroSection: { marginBottom: 28 },
  title: { fontSize: 32, fontWeight: "900", color: "#FFF5EE" },
  desc: { marginTop: 8, color: "#AEC2B0", fontSize: 14, lineHeight: 22 },
  subtitle: { marginTop: 12, marginBottom: 16, fontWeight: "800", color: "#F4DED1", fontSize: 18, letterSpacing: 0.5 },
  statsGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: "#151C23",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#26303A",
    alignItems: "center",
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { color: "#FFF5EE", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#8A978A", fontSize: 11, marginTop: 4, fontWeight: "600" },
  progressBar: { height: 4, width: "100%", borderRadius: 2, marginTop: 12, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  linksCard: { backgroundColor: "#141B22", borderRadius: 22, padding: 16, borderWidth: 1, borderColor: "#26303A", marginBottom: 28 },
  linkItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#26303A' },
  linkInfo: { flex: 1 },
  linkTitle: { color: '#FFF5EE', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  linkType: { color: '#8A978A', fontSize: 12 },
  deleteBtn: { color: '#FF6B6B', fontSize: 13, fontWeight: '600' },
  emptyText: { color: '#8A978A', textAlign: 'center', paddingVertical: 20 },
  settingsCard: {
    backgroundColor: "#141B22",
    borderRadius: 22,
    padding: 4,
    borderWidth: 1,
    borderColor: "#26303A",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingText: { color: "#E6F0E6", fontSize: 15, fontWeight: "600" },
  settingSub: { color: "#8A978A", fontSize: 13 },
  toggleActive: {
    width: 24,
    height: 12,
    backgroundColor: "#F3D4C5",
    borderRadius: 6,
  },
  footer: { marginTop: 32, alignItems: "center" },
  version: { color: "#26303A", fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#26303A", marginVertical: 16 },
});
