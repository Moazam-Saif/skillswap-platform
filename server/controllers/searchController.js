import User from '../models/User.js';
import redis from '../services/redisClient.js';

export const searchBySkill = async (req, res) => {
  try {
    const skillName = req.params.skillName.toLowerCase();
    const cacheKey = `search:skill:${skillName}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for skill: ${skillName}`);
      return res.json(JSON.parse(cached));
    }
    
    console.log(`Cache miss for skill: ${skillName}`);
    // If not cached, query database
    const users = await User.find({ 
      "skillsHave.name": { $regex: skillName, $options: 'i' }
    }).select('name imageUrl skillsHave');
    
    // Cache results for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(users));
    
    res.json(users);
  } catch (err) {
    console.error('Search by skill error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const searchByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const cacheKey = `search:category:${category}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for category: ${category}`);
      return res.json(JSON.parse(cached));
    }
    
    console.log(`Cache miss for category: ${category}`);
    // If not cached, query database
    const users = await User.find({ 
      "skillsHave.category": { $regex: category, $options: 'i' }
    }).select('name imageUrl skillsHave');
    
    // Cache results for 10 minutes
    await redis.setex(cacheKey, 600, JSON.stringify(users));
    
    res.json(users);
  } catch (err) {
    console.error('Search by category error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const searchByName = async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const cacheKey = `search:name:${name}`;
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for name: ${name}`);
      return res.json(JSON.parse(cached));
    }
    
    console.log(`Cache miss for name: ${name}`);
    // If not cached, query database
    const users = await User.find({ 
      name: { $regex: name, $options: 'i' }
    }).select('name imageUrl skillsHave');
    
    // Cache results for 5 minutes (names change less frequently)
    await redis.setex(cacheKey, 300, JSON.stringify(users));
    
    res.json(users);
  } catch (err) {
    console.error('Search by name error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const clearSearchCache = async () => {
  try {
    const keys = await redis.keys('search:*');
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`Cleared ${keys.length} search cache entries`);
    }
  } catch (err) {
    console.error('Failed to clear search cache:', err);
  }
};