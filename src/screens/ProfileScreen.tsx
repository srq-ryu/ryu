import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View, Switch } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { appTheme } from "../theme";
import { supabase } from "../services/supabaseClient";
import { linkService, UserLink } from "../services/linkService";
import { toggleTheme } from "../store/slices/themeSlice";

export function ProfileScreen() {
  const dispatch = useDispatch();
  const health = useSelector((s: RootState) => s.health);
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;
  const dynamicStyles = styles(colors);
  
  const [savedLinks, setSavedLinks] = useState<UserLink[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  const userGoals = [
    { title: "庄园步数", value: `${health.steps}`, target: "10,000", icon: "👣", color: colors.secondaryGreen },
    { title: "深睡时长", value: `${health.sleepHours}h`, target: "8h", icon: "🌙", color: colors.fountainBlue },
    { title: "静息心率", value: `${health.heartRate}`, target: "60-80", icon: "❤️", color: colors.roseRed },
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
    <View style={dynamicStyles.container}>
      {/* 装饰性背景 */}
      <View style={[dynamicStyles.bgCircle, { top: -100, left: -100, backgroundColor: colors.fountainBlue + "08" }]} />
      
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.topHeader}>
          <View style={dynamicStyles.brandContainer}>
            <Text style={dynamicStyles.brandLeaf}>⛲</Text>
            <Text style={dynamicStyles.brand}>MindGarden</Text>
          </View>
          <Pressable style={dynamicStyles.avatar} onPress={handleLogout}>
            <Text style={dynamicStyles.avatarText}>离开庄园</Text>
          </Pressable>
        </View>

        <View style={dynamicStyles.heroSection}>
          <Text style={dynamicStyles.title}>我的庄园</Text>
          <Text style={dynamicStyles.desc}>每一次心灵的灌溉，都是为了遇见更好的自己。</Text>
        </View>

        <Text style={dynamicStyles.subtitle}>庄园状态仪表盘</Text>
        <View style={dynamicStyles.statsGrid}>
          {userGoals.map((goal) => (
            <View key={goal.title} style={[dynamicStyles.statCard, theme.shadow.light]}>
              <Text style={dynamicStyles.statIcon}>{goal.icon}</Text>
              <Text style={dynamicStyles.statValue}>{goal.value}</Text>
              <Text style={dynamicStyles.statLabel}>{goal.title}</Text>
              <View style={[dynamicStyles.progressBar, { backgroundColor: colors.surface }]}>
                <View style={[dynamicStyles.progressFill, { backgroundColor: goal.color, width: "70%" }]} />
              </View>
            </View>
          ))}
        </View>

        <Text style={dynamicStyles.subtitle}>已珍藏的记忆</Text>
        <View style={[dynamicStyles.linksCard, theme.shadow.light]}>
          {savedLinks.length === 0 ? (
            <Text style={dynamicStyles.emptyText}>{loadingLinks ? '正在翻阅档案...' : '还没有收藏任何珍贵记忆'}</Text>
          ) : (
            savedLinks.map((link) => (
              <View key={link.id} style={dynamicStyles.linkItem}>
                <View style={dynamicStyles.linkInfo}>
                  <Text style={dynamicStyles.linkTitle}>{link.title}</Text>
                  <Text style={dynamicStyles.linkType}>{link.type === 'movie' ? '🎞 光影' : '🔗 笔录'}</Text>
                </View>
                <Pressable onPress={async () => {
                  await linkService.deleteLink(link.id!);
                  fetchLinks();
                }}>
                  <Text style={dynamicStyles.deleteBtn}>归档</Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        <Text style={dynamicStyles.subtitle}>庄园管家</Text>
        <View style={[dynamicStyles.settingsCard, theme.shadow.light]}>
          <View style={dynamicStyles.settingItem}>
            <View>
              <Text style={dynamicStyles.settingText}>🌙 深夜模式 (星光庄园)</Text>
              <Text style={dynamicStyles.settingSubDesc}>开启星光点点的静谧夜色</Text>
            </View>
            <Switch
              value={themeMode === "dark"}
              onValueChange={() => dispatch(toggleTheme())}
              trackColor={{ false: colors.border, true: colors.primaryGreen }}
              thumbColor={colors.card}
            />
          </View>
          <View style={dynamicStyles.divider} />
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingText}>🌿 庄园主匿名社区</Text>
            <View style={dynamicStyles.toggleActive} />
          </Pressable>
          <View style={dynamicStyles.divider} />
          <Pressable style={dynamicStyles.settingItem}>
            <Text style={dynamicStyles.settingText}>☁️ 记忆云端同步</Text>
            <Text style={dynamicStyles.settingSub}>已备份</Text>
          </Pressable>
        </View>

        <View style={dynamicStyles.footer}>
          <Text style={dynamicStyles.version}>MindGarden Classic v1.2.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  bgCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    zIndex: 0,
  },
  content: { padding: 20, paddingBottom: 100, zIndex: 1 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  brandContainer: { flexDirection: "row", alignItems: "center" },
  brandLeaf: { fontSize: 30, marginRight: 8 },
  brand: { color: colors.primaryGreen, fontSize: 24, fontWeight: "800", letterSpacing: -0.5 },
  avatar: {
    backgroundColor: colors.marbleWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  avatarText: { color: colors.primaryGreen, fontWeight: "800", fontSize: 13 },
  heroSection: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "800", color: colors.text },
  desc: { marginTop: 8, color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  subtitle: { fontSize: 18, fontWeight: "800", color: colors.text, marginBottom: 16, marginTop: 12 },
  statsGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 18,
    alignItems: "center",
  },
  statIcon: { fontSize: 26, marginBottom: 10 },
  statValue: { fontSize: 22, fontWeight: "800", color: colors.text },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 6, marginBottom: 14, fontWeight: "600" },
  progressBar: { height: 6, width: "100%", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  linksCard: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  linkInfo: { flex: 1 },
  linkTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  linkType: { fontSize: 13, color: colors.textMuted, marginTop: 6 },
  deleteBtn: { color: colors.roseRed, fontSize: 14, fontWeight: "700" },
  emptyText: { color: colors.textMuted, textAlign: "center", paddingVertical: 24, fontStyle: 'italic' },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  settingText: { fontSize: 16, fontWeight: "700", color: colors.text },
  settingSub: { fontSize: 14, color: colors.primaryGreen, fontWeight: "800" },
  settingSubDesc: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  toggleActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryGreen,
    borderWidth: 5,
    borderColor: colors.secondaryGreen,
  },
  divider: { height: 1, backgroundColor: colors.surface },
  footer: { marginTop: 40, alignItems: "center" },
  version: { color: colors.border, fontSize: 12, fontWeight: "800" },
});
