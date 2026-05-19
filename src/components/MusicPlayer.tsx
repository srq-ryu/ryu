import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Song } from "../services/recommendationService";

type Props = {
  songs?: Song[];
};

export function MusicPlayer({ songs }: Props) {
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentSong = songs?.[currentIndex];

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
    <View style={styles.card}>
      <Text style={styles.kicker}>HEALING SOUNDSCAPE</Text>
      <Text style={styles.title}>治愈播放器</Text>
      <Text style={styles.name}>
        {currentSong ? `${currentSong.title} - ${currentSong.artist}` : "请选择心情后播放"}
      </Text>
      <View style={styles.controls}>
        <Pressable style={styles.secondaryButton} onPress={() => changeTrack(currentIndex - 1)}>
          <Text style={styles.secondaryText}>上一首</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={toggle}>
          <Text style={styles.buttonText}>{playing ? "暂停" : "播放"}</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => changeTrack(currentIndex + 1)}>
          <Text style={styles.secondaryText}>下一首</Text>
        </Pressable>
      </View>
      <Text style={styles.meta}>
        {songs?.length ? `歌单共 ${songs.length} 首 · 放松呼吸跟随节拍` : "等待推荐歌单"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1B232B",
    borderRadius: 22,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2D3945",
  },
  kicker: { color: "#CFB2A1", fontSize: 10, fontWeight: "700", letterSpacing: 1.4 },
  title: { fontWeight: "800", color: "#E8F2E8", fontSize: 17, letterSpacing: 0.3 },
  name: { marginTop: 8, color: "#A9BCAB", lineHeight: 21, fontSize: 14 },
  controls: { marginTop: 14, flexDirection: "row", gap: 8, alignItems: "center" },
  button: {
    backgroundColor: "#2E6A55",
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    alignItems: "center",
  },
  buttonText: { color: "#E8FFF2", fontWeight: "700" },
  secondaryButton: {
    backgroundColor: "#26303A",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#364351",
  },
  secondaryText: { color: "#C6D4C8", fontWeight: "600" },
  meta: { marginTop: 12, fontSize: 12, color: "#95A998", letterSpacing: 0.2 },
});
