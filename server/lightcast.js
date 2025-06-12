import axios from "axios";
import redis from "redisClient.js";
import dotenv from "dotenv";
dotenv.config();

const BASE_URL = "https://skills.lightcast.io/api/v1/skills/autocomplete";
const TTL_SECONDS = 60 * 60 * 24; // 24 hours

export async function getAutocompleteSuggestions(query, subcategory = null) {
  if (!query || query.length < 3) return [];

  const key = `autocomplete:${subcategory || "global"}:${query.toLowerCase()}`;

  // Step 1: Check Redis Cache
  const cached = await redis.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  // Step 2: Call Lightcast API
  try {
    const params = { query };
    if (subcategory) params.subCategory = subcategory;

    const response = await axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${process.env.LIGHTCAST_API_KEY}` },
      params
    });

    const suggestions = response.data.data || [];

    // Step 3: Cache the result
    await redis.set(key, JSON.stringify(suggestions), "EX", TTL_SECONDS);

    return suggestions;

  } catch (error) {
    console.error("Lightcast API Error:", error.message);
    return [];
  }
}
