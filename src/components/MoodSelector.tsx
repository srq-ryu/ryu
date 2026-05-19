import { Pressable, StyleSheet, Text, View } from "react-native";
import { MoodType } from "../store/slices/moodSlice";
import { colors } from "../theme";

const moodOptions: { key: MoodType; emoji: string; label: string }[] = [
  { key: "happy", emoji: "😊", label: "开心" },
  { key: "calm", emoji: "😌", label: "平静" },
  { key: "anxious", emoji: "😟", label: "焦虑" },
  { key: "sad", emoji: "😢", label: "低落" },
  { key: "tired", emoji: "😴", label: "疲惫" },
];

type Props = {
  value: MoodType | null;
  onChange: (m: MoodType) => void;
};

export function MoodSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {moodOptions.map((mood) => (
        <Pressable
          key={mood.key}
          style={[styles.item, value === mood.key && styles.active]}
          onPress={() => onChange(mood.key)}
        >
          <Text style={styles.emoji}>{mood.emoji}</Text>
          <Text style={styles.label}>{mood.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 12, paddingBottom: 8 },
  item: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#222B34",
    borderWidth: 1,
    borderColor: "#33414E",
    minWidth: 58,
  },
  active: { borderColor: colors.warmOrange, backgroundColor: "#3A2F28", transform: [{ translateY: -2 }] },
  emoji: { fontSize: 22 },
  label: { marginTop: 5, fontSize: 12, color: "#D7E4D8", fontWeight: "600" },
});
