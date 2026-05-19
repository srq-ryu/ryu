import { useEffect } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { MoodSelector } from "../components/MoodSelector";
import { MusicPlayer } from "../components/MusicPlayer";
import { MovieCard } from "../components/MovieCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { setMood } from "../store/slices/moodSlice";
import { fetchRecommendations } from "../store/slices/recommendationSlice";

export function DiscoverScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const mood = useSelector((s: RootState) => s.mood.selectedMood);
  const recommendation = useSelector((s: RootState) => s.recommendation.data);
  const mindfulTags = ["呼吸", "感恩", "松弛", "专注", "希望", "当下", "慢下来"];
  const soundCollections = [
    { title: "森林风", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400" },
    { title: "海浪白噪音", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400" },
    { title: "黄昏钢琴", image: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=400" },
    { title: "雨夜冥想", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400" },
    { title: "晨光鸟鸣", image: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=400" },
  ];

  useEffect(() => {
    if (mood) dispatch(fetchRecommendations(mood));
  }, [mood, dispatch]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.topHeader}>
        <Text style={styles.brand}>MindGarden</Text>
        <Text style={styles.headerPill}>Night Calm Journey</Text>
      </View>

      <View style={styles.heroSection}>
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1400" }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.eyebrow}>GET STARTED ON YOUR HEALING JOURNEY</Text>
            <Text style={styles.title}>深夜也能被温柔接住</Text>
            <Text style={styles.subtitle}>选择情绪，自动匹配音乐、电影与呼吸节奏。</Text>
            <Text style={styles.breathTip}>90秒呼吸：吸气4秒 · 呼气6秒</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Mood Match</Text>
        <MoodSelector value={mood} onChange={(m) => dispatch(setMood(m))} />
      </View>

      <View style={styles.cardSoft}>
        <Text style={styles.cardTitle}>今日疗愈建议</Text>
        <Text style={styles.cardText}>{recommendation?.suggestion ?? "先选择一个心情，再获取个性化建议。"}</Text>
      </View>

      <Text style={styles.sectionTitle}>Explore & Unwind</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
        {soundCollections.map((item) => (
          <ImageBackground
            key={item.title}
            source={{ uri: item.image }}
            style={styles.collectionCard}
            imageStyle={styles.collectionImage}
          >
            <View style={styles.collectionOverlay}>
              <Text style={styles.collectionTitle}>{item.title}</Text>
              <Text style={styles.collectionSub}>自然疗愈声景</Text>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={styles.cardSoft}>
        <Text style={styles.sectionTitleSmall}>Featured Healing Player</Text>
        <MusicPlayer songs={recommendation?.songs} />
      </View>

      <Text style={styles.sectionTitle}>温暖电影推荐</Text>
      {recommendation?.movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      <Text style={styles.sectionTitle}>Mindful Moments</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mindfulRow}>
        {mindfulTags.map((tag) => (
          <View key={tag} style={styles.mindfulItem}>
            <Text style={styles.mindfulDot}>●</Text>
            <Text style={styles.mindfulText}>{tag}</Text>
          </View>
        ))}
      </ScrollView>
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
  hero: {
    height: 210,
    borderRadius: 22,
    overflow: "hidden",
  },
  heroImage: { borderRadius: 22 },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 16,
    justifyContent: "flex-end",
  },
  eyebrow: { color: "#DCC7B8", fontSize: 10, letterSpacing: 1.3, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "900", color: "#FFF5EE", marginTop: 4 },
  subtitle: { marginTop: 6, color: "#F2E5DD", fontSize: 14, lineHeight: 20 },
  breathTip: {
    marginTop: 10,
    color: "#FFE9DD",
    backgroundColor: "rgba(32, 39, 46, 0.8)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: "700",
  },
  block: {
    marginTop: 14,
    backgroundColor: "#151C23",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#26303A",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 2,
  },
  blockTitle: { fontSize: 13, color: "#AEC2B0", fontWeight: "700", marginTop: 4, marginLeft: 4 },
  cardSoft: {
    backgroundColor: "#141B22",
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#26303A",
  },
  cardTitle: { fontWeight: "800", color: "#E6F0E6", fontSize: 15 },
  cardText: { marginTop: 8, color: "#B7C4B7", lineHeight: 21, fontSize: 14 },
  sectionTitle: { marginTop: 18, fontWeight: "800", color: "#F4DED1", fontSize: 17, letterSpacing: 0.3 },
  sectionTitleSmall: { fontWeight: "700", color: "#D8E7D8", marginBottom: 8 },
  horizontalRow: { gap: 10, paddingTop: 10, paddingBottom: 4 },
  collectionCard: {
    width: 120,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#2A323C",
    borderWidth: 1,
    borderColor: "#3A4654",
    overflow: "hidden",
  },
  collectionImage: { borderRadius: 14 },
  collectionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    padding: 10,
  },
  collectionTitle: { color: "#FFF5EE", fontWeight: "800", fontSize: 13, textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 4, textShadowOffset: { width: 0, height: 1 } },
  collectionSub: { color: "#F3D4C5", fontSize: 11, marginTop: 4, fontWeight: "600" },
  mindfulRow: { gap: 12, paddingVertical: 10 },
  mindfulItem: { alignItems: "center", width: 58 },
  mindfulDot: {
    color: "#F2D6C7",
    width: 42,
    height: 42,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#232D36",
    borderRadius: 999,
    fontSize: 14,
    lineHeight: 42,
  },
  mindfulText: { marginTop: 6, color: "#B7C4B7", fontSize: 11 },
});
