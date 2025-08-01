import { autocompleteSkills } from "../services/lightcast.js";

export async function findSkills(req, res) {
  const { query } = req.query;
  if (!query || query.length < 3) {
    return res.status(400).json({ message: "Query must be at least 3 characters." });
  }

  try {
    const suggestions = await autocompleteSkills(query);
    res.json(suggestions);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
}