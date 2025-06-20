import axios from "axios";
import redis from "./redisClient.js";

export const fetchSkillTitles = async (skillId) => {
  const cacheKey = `skill_titles_${skillId}`;
  // Try to get from Redis cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // If not cached, fetch from external API
  const res = await axios.get(`https://your-api.com/skills/${skillId}/titles`);
  const titles = res.data;

  // Cache the result in Redis for 24 hours (86400 seconds)
  await redis.set(cacheKey, JSON.stringify(titles), "EX", 86400);

  return titles;
};