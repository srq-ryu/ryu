import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Movie } from "../services/recommendationService";
import { linkService } from "../services/linkService";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { appTheme } from "../theme";

export function MovieCard({ movie }: { movie: Movie }) {
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const { colors } = appTheme(themeMode);

  const handleSave = async () => {
    try {
      await linkService.saveLink({
        title: movie.title,
        url: movie.watchUrl,
        type: 'movie'
      });
      Alert.alert("成功", "已保存到云端");
    } catch (error: any) {
      Alert.alert("保存失败", error.message);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.tag, { color: colors.accent }]}>CINEMATIC THERAPY</Text>
          <Pressable onPress={handleSave}>
            <Text style={[styles.saveBtn, { color: colors.textMuted }]}>⭐ 收藏</Text>
          </Pressable>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{movie.title}</Text>
        <Text style={[styles.rating, { color: colors.textMuted }]}>评分: {movie.rating}</Text>
        <Pressable onPress={() => Linking.openURL(movie.watchUrl)}>
          <Text style={[styles.link, { color: colors.primaryGreen }]}>查看观看链接</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 22,
    overflow: "hidden",
    marginTop: 12,
    borderWidth: 1,
  },
  poster: { width: 100, height: 140 },
  content: { flex: 1, padding: 14, justifyContent: "space-between" },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { fontSize: 10, fontWeight: "800", letterSpacing: 1.4 },
  saveBtn: { fontSize: 12, fontWeight: '700' },
  title: { fontWeight: "800", fontSize: 16, lineHeight: 22 },
  rating: { fontSize: 13, fontWeight: "600" },
  link: { fontWeight: "800", fontSize: 13 },
});
