import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { addEntry } from "../store/slices/journalSlice";
import { MoodSelector } from "../components/MoodSelector";
import { MoodType } from "../store/slices/moodSlice";
import { EmotionChart } from "../components/EmotionChart";
import { appTheme } from "../theme";

const moodWeight: Record<MoodType, number> = { happy: 5, calm: 4, tired: 3, anxious: 2, sad: 1 };

export function JournalScreen() {
  const dispatch = useDispatch();
  const entries = useSelector((s: RootState) => s.journal.entries);
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;
  const dynamicStyles = styles(colors);
  const [mood, setMood] = useState<MoodType>("calm");
  const [text, setText] = useState("");

  const chartData = useMemo(
    () =>
      entries.slice(0, 7).map((e, idx) => ({
        x: `${idx + 1}`,
        y: moodWeight[e.mood],
      })),
    [entries]
  );

  const save = () => {
    if (!text.trim()) {
      Alert.alert("提示", "请至少写一点心情文字。");
      return;
    }
    dispatch(
      addEntry({
        id: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        mood,
        text,
      })
    );
    setText("");
  };

  return (
    <View style={dynamicStyles.container}>
      {/* 装饰性背景元素 */}
      <View style={[dynamicStyles.bgCircle, { top: -80, right: -80, backgroundColor: colors.roseRed + "08" }]} />
      <View style={[dynamicStyles.bgCircle, { bottom: 50, left: -100, backgroundColor: colors.fountainBlue + "10" }]} />
      
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.topHeader}>
          <View style={dynamicStyles.brandContainer}>
            <Text style={dynamicStyles.brandLeaf}>⛲</Text>
            <Text style={dynamicStyles.brand}>MindGarden</Text>
          </View>
          <Text style={dynamicStyles.headerPill}>玫瑰庄园</Text>
        </View>

        <View style={dynamicStyles.heroSection}>
          <Text style={dynamicStyles.title}>笔尖花开</Text>
          <Text style={dynamicStyles.subtitle}>在庄园的静谧时刻，让文字如玫瑰般绽放</Text>
        </View>

        <View style={[dynamicStyles.block, appTheme(themeMode).shadow.light]}>
          <Text style={dynamicStyles.blockTitle}>🌹 此刻的心情花种</Text>
          <MoodSelector value={mood} onChange={setMood} />
        </View>

        <View style={[dynamicStyles.inputCard, appTheme(themeMode).shadow.medium]}>
          <TextInput
            multiline
            value={text}
            onChangeText={setText}
            placeholder="在阳光洒下的长椅上，写下你的故事..."
            placeholderTextColor={colors.textMuted}
            style={dynamicStyles.input}
          />
          <View style={dynamicStyles.row}>
            <Pressable style={dynamicStyles.ghostBtn}>
              <Text style={dynamicStyles.ghostBtnText}>📸 留住芬芳</Text>
            </Pressable>
            <Pressable style={dynamicStyles.ghostBtn}>
              <Text style={dynamicStyles.ghostBtnText}>🦋 听蝶起舞</Text>
            </Pressable>
          </View>
          <Pressable style={dynamicStyles.saveBtn} onPress={save}>
            <Text style={dynamicStyles.saveText}>播种此刻的心情</Text>
          </Pressable>
        </View>

        <View style={[dynamicStyles.chartBlock, appTheme(themeMode).shadow.light]}>
          <Text style={dynamicStyles.sectionTitle}>🦋 心灵成长轨迹</Text>
          <View style={dynamicStyles.chartWrapper}>
            <EmotionChart data={chartData.length ? chartData : [{ x: "1", y: 3 }]} />
          </View>
        </View>

        <Text style={dynamicStyles.sectionTitle}>🖼 记忆长廊</Text>
        {entries.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <Text style={dynamicStyles.emptyText}>花园里还有位置，等候你的心情之花...</Text>
          </View>
        ) : (
          entries.map((e) => (
            <View key={e.id} style={[dynamicStyles.entryCard, appTheme(themeMode).shadow.light]}>
              <View style={dynamicStyles.entryHeader}>
                <Text style={dynamicStyles.entryDate}>{e.date}</Text>
                <View style={[dynamicStyles.moodTag, { backgroundColor: colors.secondaryGreen + "30" }]}>
                  <Text style={dynamicStyles.moodTagText}>{e.mood.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={dynamicStyles.entryText}>{e.text}</Text>
              <Text style={dynamicStyles.flowerDecor}>🌹</Text>
            </View>
          ))
        )}
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
  headerPill: {
    color: colors.primaryGreen,
    backgroundColor: colors.marbleWhite,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  heroSection: { marginBottom: 24 },
  title: { fontSize: 32, fontWeight: "800", color: colors.text },
  subtitle: { marginTop: 8, color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  block: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
  },
  blockTitle: { fontSize: 15, color: colors.text, fontWeight: "800", marginBottom: 16, letterSpacing: 0.5 },
  inputCard: {
    backgroundColor: colors.card,
    borderRadius: 36,
    padding: 24,
    marginBottom: 24,
  },
  input: {
    color: colors.text,
    fontSize: 17,
    minHeight: 140,
    textAlignVertical: "top",
    marginBottom: 20,
    lineHeight: 26,
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 20 },
  ghostBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  ghostBtnText: { color: colors.primaryGreen, fontSize: 14, fontWeight: "700" },
  saveBtn: {
    backgroundColor: colors.primaryGreen,
    borderRadius: 22,
    padding: 20,
    alignItems: "center",
  },
  saveText: { color: "#FFFFFF", fontWeight: "800", fontSize: 17 },
  chartBlock: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 24,
    marginBottom: 28,
  },
  chartWrapper: { marginTop: 12, alignItems: "center" },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: colors.text, marginBottom: 16 },
  entryCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: 24,
    marginBottom: 16,
    borderLeftWidth: 8,
    borderLeftColor: colors.roseRed,
    position: 'relative',
    overflow: 'hidden',
  },
  flowerDecor: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    fontSize: 20,
    opacity: 0.25,
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  entryDate: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  moodTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodTagText: { color: colors.primaryGreen, fontSize: 11, fontWeight: "800" },
  entryText: { color: colors.text, fontSize: 16, lineHeight: 24 },
  emptyState: { padding: 40, alignItems: "center" },
  emptyText: { color: colors.textMuted, fontSize: 15, textAlign: "center", fontStyle: "italic" },
});
