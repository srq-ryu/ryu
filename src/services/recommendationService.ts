import { MoodType } from "../store/slices/moodSlice";
import { getCache, setCache } from "./cache";

export type Song = {
  id: string;
  title: string;
  artist: string;
  previewUrl: string;
};

export type Movie = {
  id: string;
  title: string;
  rating: number;
  poster: string;
  watchUrl: string;
};

export type RecommendationPack = {
  songs: Song[];
  movies: Movie[];
  suggestion: string;
};

const moodSuggestion: Record<MoodType, string> = {
  happy: "把开心延续下去，试试分享一条今日感恩清单。",
  calm: "保持平稳节奏，安排一次10分钟深呼吸练习。",
  anxious: "先慢下来，听舒缓旋律并完成一次身体扫描放松。",
  sad: "允许情绪存在，选一部温暖电影陪伴自己。",
  tired: "降低负荷，给自己一个可执行的小目标。",
};

const moodSongs: Record<MoodType, Song[]> = {
  happy: [
    { id: "happy-song-1", title: "Golden Steps", artist: "Sunroom Bloom", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: "happy-song-2", title: "Bright Side Waltz", artist: "MindGarden Radio", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: "happy-song-3", title: "Colorful Morning", artist: "Amber Notes", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: "happy-song-4", title: "Joy in Motion", artist: "Therapy Notes", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  ],
  calm: [
    { id: "calm-song-1", title: "Breathing Meadow", artist: "Quiet Canvas", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: "calm-song-2", title: "Soft Rain Journal", artist: "Healing Ensemble", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: "calm-song-3", title: "Moonlit Tea", artist: "Still Lake", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: "calm-song-4", title: "Quiet Room", artist: "MindGarden Studio", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  ],
  anxious: [
    { id: "anxious-song-1", title: "Slow Heartbeat", artist: "Inner Bloom", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { id: "anxious-song-2", title: "Grounding Light", artist: "Quiet Canvas", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { id: "anxious-song-3", title: "Safe Harbor", artist: "MindGarden Radio", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
    { id: "anxious-song-4", title: "Breath by Breath", artist: "Therapy Notes", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  ],
  sad: [
    { id: "sad-song-1", title: "After Rain", artist: "Healing Ensemble", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: "sad-song-2", title: "A Small Warmth", artist: "Inner Bloom", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: "sad-song-3", title: "Holding On", artist: "MindGarden Studio", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: "sad-song-4", title: "Light Returns", artist: "Amber Notes", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  ],
  tired: [
    { id: "tired-song-1", title: "Amber Afternoon", artist: "Inner Bloom", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: "tired-song-2", title: "Sunrise Again", artist: "MindGarden Studio", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: "tired-song-3", title: "Gentle Restart", artist: "Quiet Canvas", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
    { id: "tired-song-4", title: "Warm Window", artist: "Therapy Notes", previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  ],
};

const moodMovies: Record<MoodType, Movie[]> = {
  happy: [
    { id: "happy-movie-1", title: "Soul (心灵奇旅)", rating: 8.7, poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "happy-movie-2", title: "Sing Street (初恋这首情歌)", rating: 8.5, poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "happy-movie-3", title: "Paddington 2 (帕丁顿熊 2)", rating: 8.6, poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "happy-movie-4", title: "Amélie (天使爱美丽)", rating: 8.7, poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600", watchUrl: "https://movie.douban.com/" },
  ],
  calm: [
    { id: "calm-movie-1", title: "Little Forest (小森林)", rating: 8.9, poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "calm-movie-2", title: "Kiki's Delivery Service (魔女宅急便)", rating: 8.6, poster: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "calm-movie-3", title: "Our Little Sister (海街日记)", rating: 8.4, poster: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "calm-movie-4", title: "Paterson (帕特森)", rating: 8.1, poster: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600", watchUrl: "https://movie.douban.com/" },
  ],
  anxious: [
    { id: "anxious-movie-1", title: "The Secret Life of Walter Mitty (白日梦想家)", rating: 8.4, poster: "https://images.unsplash.com/photo-1460881680858-30d872d5b530?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "anxious-movie-2", title: "Inside Out (头脑特工队)", rating: 8.8, poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "anxious-movie-3", title: "Wonder (奇迹男孩)", rating: 8.6, poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "anxious-movie-4", title: "The King's Speech (国王的演讲)", rating: 8.3, poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600", watchUrl: "https://movie.douban.com/" },
  ],
  sad: [
    { id: "sad-movie-1", title: "About Time (时空恋旅人)", rating: 8.8, poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "sad-movie-2", title: "Little Miss Sunshine (阳光小美女)", rating: 8.3, poster: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "sad-movie-3", title: "A Man Called Otto (一个叫奥托的男人)", rating: 8.1, poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "sad-movie-4", title: "Coco (寻梦环游记)", rating: 9.1, poster: "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=600", watchUrl: "https://movie.douban.com/" },
  ],
  tired: [
    { id: "tired-movie-1", title: "Chef (落魄大厨)", rating: 8.2, poster: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "tired-movie-2", title: "The Intern (实习生)", rating: 8.0, poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "tired-movie-3", title: "Julie & Julia (朱莉与朱莉娅)", rating: 8.1, poster: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=600", watchUrl: "https://movie.douban.com/" },
    { id: "tired-movie-4", title: "The Holiday (恋爱假期)", rating: 7.7, poster: "https://images.unsplash.com/photo-1511497584788-876760111969?w=1400", watchUrl: "https://movie.douban.com/" },
  ],
};

export async function getHealingRecommendations(mood: MoodType): Promise<RecommendationPack> {
  const key = `recommendation:${mood}`;
  const cached = getCache<RecommendationPack>(key);
  if (cached) return cached;

  // API integration placeholders (NetEase Cloud Music / Douban Movie).
  // Replace with secure backend proxy in production.
  const data: RecommendationPack = {
    songs: moodSongs[mood],
    movies: moodMovies[mood],
    suggestion: moodSuggestion[mood],
  };

  setCache(key, data);
  return data;
}
