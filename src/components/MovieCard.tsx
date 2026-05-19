import { Alert, Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Movie } from "../services/recommendationService";
import { linkService } from "../services/linkService";

export function MovieCard({ movie }: { movie: Movie }) {
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
    <View style={styles.card}>
      <Image source={{ uri: movie.poster }} style={styles.poster} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.tag}>CINEMATIC THERAPY</Text>
          <Pressable onPress={handleSave}>
            <Text style={styles.saveBtn}>⭐ 收藏</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.rating}>评分: {movie.rating}</Text>
        <Pressable onPress={() => Linking.openURL(movie.watchUrl)}>
          <Text style={styles.link}>查看观看链接</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#1A232C",
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#2D3945",
  },
  poster: { width: 98, height: 128 },
  content: { flex: 1, padding: 12, justifyContent: "space-between" },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tag: { color: "#CBAF9C", fontSize: 10, fontWeight: "700", letterSpacing: 1.2 },
  saveBtn: { color: "#A8BAA9", fontSize: 12, fontWeight: '600' },
  title: { fontWeight: "800", color: "#E7F1E7", fontSize: 15, lineHeight: 20 },
  rating: { color: "#A8BAA9", fontSize: 13 },
  link: { color: "#F6BD8B", fontWeight: "700", fontSize: 13 },
});
