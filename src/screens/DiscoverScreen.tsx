import { useEffect, useRef, useState } from "react";
import { ImageBackground, ScrollView, StyleSheet, Text, View, FlatList, Dimensions, Animated } from "react-native";
import { MoodSelector } from "../components/MoodSelector";
import { MusicPlayer } from "../components/MusicPlayer";
import { MovieCard } from "../components/MovieCard";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { setMood } from "../store/slices/moodSlice";
import { fetchRecommendations } from "../store/slices/recommendationSlice";
import { appTheme } from "../theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HERO_IMAGES = [
  {
    id: "1",
    uri: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1000",
    title: "在深林中重拾宁静",
    subtitle: "让绿意包裹心灵，像呼吸森林般自由。",
  },
  {
    id: "2",
    uri: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=1000",
    title: "聆听喷泉的回响",
    subtitle: "流水声中，烦恼如涟漪般渐渐消散。",
  },
  {
    id: "3",
    uri: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=1000",
    title: "捕捉波光的闪烁",
    subtitle: "每一个光点，都是花园赠予你的星辰。",
  },
  {
    id: "4",
    uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000",
    title: "绣球花开的午后",
    subtitle: "在温柔的蓝色中，遇见久违的自己。",
  },
];

export function DiscoverScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const mood = useSelector((s: RootState) => s.mood.selectedMood);
  const recommendation = useSelector((s: RootState) => s.recommendation.data);
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;
  const dynamicStyles = styles(colors);
  
  const mindfulTags = ["深呼吸", "泉水鸣", "花间行", "静心坐", "观自在", "慢生活"];
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mood) dispatch(fetchRecommendations(mood));
  }, [mood, dispatch]);

  return (
    <View style={dynamicStyles.container}>
      {/* 古典花园背景装饰 */}
      <View style={[dynamicStyles.bgDecor, { top: -100, right: -100, backgroundColor: colors.fountainBlue + "10" }]} />
      <View style={[dynamicStyles.bgDecor, { bottom: 100, left: -150, backgroundColor: colors.secondaryGreen + "15" }]} />
      
      <ScrollView contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.topHeader}>
          <View style={dynamicStyles.brandContainer}>
            <Text style={dynamicStyles.brandLeaf}>⛲</Text>
            <Text style={dynamicStyles.brand}>MindGarden</Text>
          </View>
          <Text style={dynamicStyles.headerPill}>古典画卷</Text>
        </View>

        <View style={dynamicStyles.heroSection}>
          <FlatList
            data={HERO_IMAGES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            renderItem={({ item }) => (
              <View style={dynamicStyles.heroItem}>
                <ImageBackground
                  source={{ uri: item.uri }}
                  style={dynamicStyles.hero}
                  imageStyle={dynamicStyles.heroImage}
                >
                  <View style={dynamicStyles.heroOverlay}>
                    <Text style={dynamicStyles.eyebrow}>THE SECRET GARDEN OF PEACE</Text>
                    <Text style={dynamicStyles.title}>{item.title}</Text>
                    <Text style={dynamicStyles.subtitle}>{item.subtitle}</Text>
                    <View style={dynamicStyles.breathTipContainer}>
                      <Text style={dynamicStyles.breathTip}>🌹 玫瑰呼吸法：吸气 4s · 呼气 6s</Text>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          {/* 指示器 */}
          <View style={dynamicStyles.indicatorContainer}>
            {HERO_IMAGES.map((_, i) => {
              const opacity = scrollX.interpolate({
                inputRange: [(i - 1) * SCREEN_WIDTH, i * SCREEN_WIDTH, (i + 1) * SCREEN_WIDTH],
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });
              return <Animated.View key={i} style={[dynamicStyles.indicator, { opacity }]} />;
            })}
          </View>
        </View>

        <View style={[dynamicStyles.block, appTheme(themeMode).shadow.light]}>
          <Text style={dynamicStyles.blockTitle}>⛲ 心灵喷泉 · 心情调色</Text>
          <MoodSelector value={mood} onChange={(m) => dispatch(setMood(m))} />
        </View>

        <View style={[dynamicStyles.cardSoft, appTheme(themeMode).shadow.light]}>
          <Text style={dynamicStyles.cardTitle}>📜 花园私语</Text>
          <Text style={dynamicStyles.cardText}>{recommendation?.suggestion ?? "在喷泉旁坐下，等待花园的启示..."}</Text>
          <Text style={dynamicStyles.butterflyDecor}>🦋</Text>
        </View>

        <Text style={dynamicStyles.sectionTitle}>🦋 漫步声景画廊</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dynamicStyles.horizontalRow}>
          {[
            { title: "玫瑰庄园", image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=600" },
            { title: "林间小径", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600" },
            { title: "月下喷泉", image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&q=80&w=600" },
          ].map((item) => (
            <ImageBackground
              key={item.title}
              source={{ uri: item.image }}
              style={dynamicStyles.collectionCard}
              imageStyle={dynamicStyles.collectionImage}
            >
              <View style={dynamicStyles.collectionOverlay}>
                <Text style={dynamicStyles.collectionTitle}>{item.title}</Text>
                <Text style={dynamicStyles.collectionSub}>实景愈心声</Text>
              </View>
            </ImageBackground>
          ))}
        </ScrollView>

        <View style={[dynamicStyles.cardSoft, appTheme(themeMode).shadow.light]}>
          <Text style={dynamicStyles.sectionTitleSmall}>🎵 舒缓旋律播放器</Text>
          <MusicPlayer songs={recommendation?.songs} />
        </View>

        <Text style={dynamicStyles.sectionTitle}>🎞 治愈光影推荐</Text>
        {recommendation?.movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        <Text style={dynamicStyles.sectionTitle}>🫧 呼吸瞬间</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={dynamicStyles.mindfulRow}>
          {mindfulTags.map((tag) => (
            <View key={tag} style={dynamicStyles.mindfulItem}>
              <View style={[dynamicStyles.mindfulDotContainer, appTheme(themeMode).shadow.light]}>
                <Text style={dynamicStyles.mindfulDot}>🌹</Text>
              </View>
              <Text style={dynamicStyles.mindfulText}>{tag}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  bgDecor: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    zIndex: 0,
  },
  content: { padding: 20, paddingBottom: 100, zIndex: 1 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  brandContainer: { flexDirection: "row", alignItems: "center" },
  brandLeaf: { fontSize: 28, marginRight: 8 },
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
  heroSection: { marginBottom: 24, position: 'relative' },
  heroItem: { width: SCREEN_WIDTH - 40 },
  hero: {
    height: 280,
    borderRadius: 40,
    overflow: "hidden",
  },
  heroImage: { borderRadius: 40 },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 28,
    justifyContent: "flex-end",
  },
  eyebrow: { color: "rgba(255,255,255,0.9)", fontSize: 10, letterSpacing: 1.8, fontWeight: "800" },
  title: { fontSize: 30, fontWeight: "800", color: "#FFFFFF", marginTop: 10 },
  subtitle: { marginTop: 10, color: "rgba(255,255,255,0.9)", fontSize: 16, lineHeight: 24 },
  breathTipContainer: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  breathTip: {
    color: "#FFFFFF",
    backgroundColor: colors.primaryGreen + "E6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 13,
    fontWeight: "800",
    overflow: "hidden",
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  block: {
    marginTop: 12,
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 24,
    marginBottom: 16,
  },
  blockTitle: { fontSize: 15, color: colors.text, fontWeight: "800", marginBottom: 16 },
  cardSoft: {
    backgroundColor: colors.card,
    borderRadius: 32,
    padding: 24,
    marginTop: 16,
    position: 'relative',
  },
  butterflyDecor: {
    position: 'absolute',
    top: 10,
    right: 15,
    fontSize: 24,
    opacity: 0.4,
  },
  cardTitle: { fontWeight: "800", color: colors.text, fontSize: 17 },
  cardText: { marginTop: 12, color: colors.textMuted, lineHeight: 24, fontSize: 16, fontStyle: 'italic' },
  sectionTitle: { marginTop: 32, fontWeight: "800", color: colors.text, fontSize: 20 },
  sectionTitleSmall: { fontWeight: "800", color: colors.text, marginBottom: 14, fontSize: 16 },
  horizontalRow: { gap: 16, paddingTop: 16, paddingBottom: 4 },
  collectionCard: {
    width: 160,
    height: 110,
    borderRadius: 28,
    overflow: "hidden",
  },
  collectionImage: { borderRadius: 28 },
  collectionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
    padding: 14,
  },
  collectionTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  collectionSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 4, fontWeight: "600" },
  mindfulRow: { gap: 20, paddingVertical: 16 },
  mindfulItem: { alignItems: "center", width: 70 },
  mindfulDotContainer: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 28,
  },
  mindfulDot: {
    fontSize: 24,
  },
  mindfulText: { marginTop: 10, color: colors.textMuted, fontSize: 13, fontWeight: "800" },
});
