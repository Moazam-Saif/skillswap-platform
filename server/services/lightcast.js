import axios from "axios";
import dotenv from "dotenv";
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
  const token = await fetchToken();

  const response = await axios.get("https://emsiservices.com/skills/versions/latest/skills", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: { q: query}
  });

  return response.data;
}
