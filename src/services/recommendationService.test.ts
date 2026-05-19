import { getHealingRecommendations } from "./recommendationService";

describe("recommendationService", () => {
  it("returns songs and movies for mood", async () => {
    const result = await getHealingRecommendations("calm");
    expect(result.songs.length).toBeGreaterThan(0);
    expect(result.movies.length).toBeGreaterThan(0);
    expect(result.suggestion.length).toBeGreaterThan(0);
  });
});
