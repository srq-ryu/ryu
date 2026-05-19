import { StyleSheet, Text, View } from "react-native";

type Props = {
  data: { x: string; y: number }[];
};

export function EmotionChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.y), 1);
  return (
    <View style={styles.wrap}>
      {data.map((item) => (
        <View key={item.x} style={styles.row}>
          <Text style={styles.label}>{item.x}</Text>
          <View style={styles.track}>
            <View style={[styles.bar, { width: `${(item.y / max) * 100}%` }]} />
          </View>
          <Text style={styles.value}>{item.y}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 8, backgroundColor: "#fff", borderRadius: 12, padding: 10, gap: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { width: 20, color: "#6B786C" },
  track: { flex: 1, height: 10, borderRadius: 10, backgroundColor: "#E9EFE7", overflow: "hidden" },
  bar: { height: 10, borderRadius: 10, backgroundColor: "#A8D5BA" },
  value: { width: 20, textAlign: "right", color: "#3C4D3F" },
});
