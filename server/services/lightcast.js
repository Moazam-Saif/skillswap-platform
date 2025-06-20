import axios from "axios";
import dotenv from "dotenv";
import redis from "./redisClient.js";
dotenv.config();

let accessToken = null;
let tokenExpiry = 0;

async function fetchToken() {
  const now = Date.now();
  if (accessToken && tokenExpiry > now) {
    return accessToken;
  }

  const response = await axios.post("https://auth.emsicloud.com/connect/token", new URLSearchParams({
    client_id: process.env.LIGHTCAST_CLIENT_ID,
    client_secret: process.env.LIGHTCAST_CLIENT_SECRET,
    grant_type: "client_credentials",
    scope: "emsi_open"
  }));

  accessToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000;
  return accessToken;
}

export async function autocompleteSkills(query) {
  const cacheKey = `skills:${query}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("returned cached data");
    return JSON.parse(cached);
  }

  const token = await fetchToken();

  const response = await axios.get("https://emsiservices.com/skills/versions/latest/skills", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { q: query }
  });

  const foundData =response.data.data;
  await redis.set(cacheKey, JSON.stringify(foundData), "EX", 3600);

  return foundData;
}

export const fetchSkillTitles = async (skillId) => {
  const cacheKey = `skill_titles_${skillId}`;
  // Try to get from Redis cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

   const token = await fetchToken();
  // If not cached, fetch from external API
  const res = await axios.get(`https://emsiservices.com/skills/${skillId}/titles`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const titles = res.data;

  // Cache the result in Redis for 24 hours (86400 seconds)
  await redis.set(cacheKey, JSON.stringify(titles), "EX", 86400);

  return titles;
};