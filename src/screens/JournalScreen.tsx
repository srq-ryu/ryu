import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { addEntry } from "../store/slices/journalSlice";
import { MoodSelector } from "../components/MoodSelector";
import { MoodType } from "../store/slices/moodSlice";
import { EmotionChart } from "../components/EmotionChart";
import { colors } from "../theme";

const moodWeight: Record<MoodType, number> = { happy: 5, calm: 4, tired: 3, anxious: 2, sad: 1 };

export function JournalScreen() {
  const dispatch = useDispatch();
  const entries = useSelector((s: RootState) => s.journal.entries);
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topHeader}>
        <Text style={styles.brand}>MindGarden</Text>
        <Text style={styles.headerPill}>Mood Journal</Text>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.title}>记录此刻</Text>
        <Text style={styles.subtitle}>用温柔的文字，把情绪从心里慢慢放下</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>How are you feeling?</Text>
        <MoodSelector value={mood} onChange={setMood} />
      </View>

      <View style={styles.inputCard}>
        <TextInput
          multiline
          value={text}
          onChangeText={setText}
          placeholder="写下今天发生的事..."
          placeholderTextColor="#6F7B70"
          style={styles.input}
        />
        <View style={styles.row}>
          <Pressable style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>📸 上传图片</Text>
          </Pressable>
          <Pressable style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>🎙 语音记录</Text>
          </Pressable>
        </View>
        <Pressable style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>保存记录</Text>
        </Pressable>
      </View>

      <View style={styles.chartBlock}>
        <Text style={styles.sectionTitle}>月度情绪分布</Text>
        <View style={styles.chartWrapper}>
          <EmotionChart data={chartData.length ? chartData : [{ x: "1", y: 3 }]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>时光长廊</Text>
      {entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>还没有记录，开始写下第一篇吧...</Text>
        </View>
      ) : (
        entries.map((e) => (
          <View key={e.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>{e.date}</Text>
              <View style={styles.moodTag}>
                <Text style={styles.moodTagText}>{e.mood.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.entryText}>{e.text}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0E1318" },
  content: { padding: 16, paddingBottom: 100 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  brand: { color: "#F3D4C5", fontSize: 24, fontWeight: "900", letterSpacing: 0.5 },
  headerPill: {
    color: "#F7DDD0",
    backgroundColor: "#2A3038",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "700",
  },
  heroSection: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "900", color: "#FFF5EE" },
  subtitle: { marginTop: 6, color: "#AEC2B0", fontSize: 14, lineHeight: 22 },
  block: {
    backgroundColor: "#151C23",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#26303A",
    padding: 16,
    marginBottom: 16,
  },
  blockTitle: { fontSize: 13, color: "#F4DED1", fontWeight: "700", marginBottom: 12, letterSpacing: 1 },
  inputCard: {
    backgroundColor: "#141B22",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#26303A",
    marginBottom: 20,
  },
  input: {
    color: "#E6F0E6",
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  row: { flexDirection: "row", gap: 12, marginBottom: 16 },
  ghostBtn: {
    flex: 1,
    backgroundColor: "#232D36",
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A4654",
  },
  ghostBtnText: { color: "#B7C4B7", fontSize: 13, fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#F3D4C5",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#F3D4C5",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  saveText: { color: "#2F5D46", fontWeight: "800", fontSize: 16 },
  chartBlock: {
    backgroundColor: "#151C23",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#26303A",
    marginBottom: 24,
  },
  chartWrapper: { marginTop: 10, alignItems: "center" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#F4DED1", marginBottom: 12, letterSpacing: 0.5 },
  entryCard: {
    backgroundColor: "#1C242C",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#F3D4C5",
  },
  entryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  entryDate: { color: "#8A978A", fontSize: 12, fontWeight: "600" },
  moodTag: {
    backgroundColor: "#2A3038",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  moodTagText: { color: "#F3D4C5", fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  entryText: { color: "#E6F0E6", fontSize: 15, lineHeight: 24 },
  emptyState: { padding: 40, alignItems: "center" },
  emptyText: { color: "#6F7B70", textAlign: "center", fontSize: 14 },
});
