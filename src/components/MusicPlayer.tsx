import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Song } from "../services/recommendationService";
import { appTheme } from "../theme";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type Props = {
  songs?: Song[];
};

export function MusicPlayer({ songs }: Props) {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentSong = songs?.[currentIndex];
  
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const theme = appTheme(themeMode);
  const { colors } = theme;

  useEffect(() => {
    setCurrentIndex(0);
    setPlaying(false);
  }, [songs]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const toggle = async () => {
    if (!currentSong) return;
    if (!soundRef.current) {
      const { sound } = await Audio.Sound.createAsync({ uri: currentSong.previewUrl });
      soundRef.current = sound;
    }
    if (playing) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setPlaying(true);
    }
  };

  const changeTrack = async (nextIndex: number) => {
    if (!songs?.length) return;
    await soundRef.current?.unloadAsync();
    soundRef.current = null;
    setPlaying(false);
    setCurrentIndex((nextIndex + songs.length) % songs.length);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card }, theme.shadow.light]}>
      <Text style={[styles.kicker, { color: colors.accent }]}>🌷 HARMONY OF FLOWERS</Text>
      <Text style={[styles.title, { color: colors.text }]}>心灵播放器</Text>
      <Text style={[styles.name, { color: colors.textMuted }]}>
        {currentSong ? `${currentSong.title} - ${currentSong.artist}` : "在花园中静待旋律..."}
      </Text>
      <View style={styles.controls}>
        <Pressable style={[styles.secondaryButton, { backgroundColor: colors.surface }]} onPress={() => changeTrack(currentIndex - 1)}>
          <Text style={[styles.secondaryText, { color: colors.primaryGreen }]}>上一首</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: colors.primaryGreen }]} onPress={toggle}>
          <Text style={styles.buttonText}>{playing ? "⏸ 休息片刻" : "▶ 开始疗愈"}</Text>
        </Pressable>
        <Pressable style={[styles.secondaryButton, { backgroundColor: colors.surface }]} onPress={() => changeTrack(currentIndex + 1)}>
          <Text style={[styles.secondaryText, { color: colors.primaryGreen }]}>下一首</Text>
        </Pressable>
      </View>
      <Text style={[styles.meta, { color: colors.textMuted }]}>
        {songs?.length ? `莫奈的花园里还有 ${songs.length} 首旋律` : "等待花开，等待音乐"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginTop: 12,
  },
  kicker: { fontSize: 10, fontWeight: "800", letterSpacing: 1.5, marginBottom: 4 },
  title: { fontWeight: "800", fontSize: 18 },
  name: { marginTop: 10, lineHeight: 22, fontSize: 15, fontWeight: "600" },
  controls: { marginTop: 20, flexDirection: "row", gap: 12, alignItems: "center" },
  button: {
    flex: 2,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryText: { fontWeight: "700", fontSize: 13 },
  meta: { marginTop: 16, fontSize: 12, textAlign: "center", fontStyle: "italic" },
});
