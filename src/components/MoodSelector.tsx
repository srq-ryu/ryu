import { Pressable, StyleSheet, Text, View } from "react-native";
import { MoodType } from "../store/slices/moodSlice";
import { appTheme } from "../theme";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

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
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;

  return (
    <View style={styles.row}>
      {moodOptions.map((mood) => {
        const isActive = value === mood.key;
        return (
          <Pressable
            key={mood.key}
            style={[
              styles.item,
              { backgroundColor: colors.surface },
              isActive && styles.active,
              isActive && { backgroundColor: colors.card },
              isActive && theme.shadow.medium
            ]}
            onPress={() => onChange(mood.key)}
          >
            <View style={[styles.emojiCircle, isActive && { backgroundColor: themeMode === "light" ? "#F9F1C0" : "#344E41" }]}>
              <Text style={[styles.emoji, isActive && styles.activeEmoji]}>{mood.emoji}</Text>
            </View>
            <Text style={[styles.label, { color: colors.textMuted }, isActive && { color: colors.primaryGreen }]}>{mood.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginVertical: 8, 
    paddingBottom: 4 
  },
  item: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 24,
    minWidth: 64,
  },
  active: { 
    transform: [{ scale: 1.08 }],
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emoji: { 
    fontSize: 24,
    opacity: 0.7,
  },
  activeEmoji: {
    opacity: 1,
  },
  label: { 
    marginTop: 8, 
    fontSize: 12, 
    fontWeight: "600" 
  },
});
