import { StyleSheet, Text, View } from "react-native";
import { appTheme } from "../theme";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type Props = {
  data: { x: string; y: number }[];
};

export function EmotionChart({ data }: Props) {
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const { colors } = appTheme(themeMode);
  const max = Math.max(...data.map((d) => d.y), 1);
  
  return (
    <View style={[styles.wrap, { backgroundColor: colors.card }]}>
      {data.map((item) => (
        <View key={item.x} style={styles.row}>
          <Text style={[styles.label, { color: colors.textMuted }]}>{item.x}</Text>
          <View style={[styles.track, { backgroundColor: colors.surface }]}>
            <View style={[styles.bar, { width: `${(item.y / max) * 100}%`, backgroundColor: colors.fountainBlue }]} />
          </View>
          <Text style={[styles.value, { color: colors.text }]}>{item.y}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { 
    marginTop: 8, 
    width: '100%',
    borderRadius: 20, 
    padding: 16, 
    gap: 12 
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { width: 28, fontSize: 12, fontWeight: "700" },
  track: { flex: 1, height: 14, borderRadius: 14, overflow: "hidden" },
  bar: { height: 14, borderRadius: 14 },
  value: { width: 24, textAlign: "right", fontSize: 12, fontWeight: "800" },
});
