
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';


app.get("/api/skills/autocomplete", async (req, res) => {
  const { query, subcategory } = req.query;

  if (!query || query.length < 3) {
    return res.status(400).json({ message: "Query must be at least 3 characters." });
  }

  const suggestions = await getAutocompleteSuggestions(query, subcategory);
  res.json({ suggestions });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
