-- SK150 Cloudflare D1 SQL Schema

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  achievement TEXT NOT NULL,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  imageSrc TEXT NOT NULL,
  metrics TEXT NOT NULL,          -- JSON string array/object
  bioParagraphs TEXT NOT NULL,    -- JSON string array
  highlightQuote TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  imageSrc TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,             -- JSON string array
  date TEXT NOT NULL,
  readTime TEXT NOT NULL,
  publishedTime TEXT NOT NULL,
  authorName TEXT NOT NULL,
  authorAvatar TEXT NOT NULL,
  authorTitle TEXT NOT NULL,
  content TEXT NOT NULL           -- JSON string array of paragraphs
);

CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,             -- 'upcoming' or 'past'
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  locationType TEXT NOT NULL,     -- 'physical' or 'virtual'
  countdownTarget TEXT,
  coverImage TEXT NOT NULL,
  galleryImages TEXT NOT NULL,    -- JSON string array
  videoUrl TEXT,
  phase TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  platform TEXT NOT NULL,         -- 'youtube' or 'tiktok'
  videoId TEXT NOT NULL,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  date TEXT NOT NULL,
  coverImage TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  fileSize TEXT NOT NULL,
  fileExtension TEXT NOT NULL,
  href TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS timeline (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  phase TEXT NOT NULL,
  imageSrc TEXT NOT NULL,
  tags TEXT NOT NULL,             -- JSON string array
  description TEXT NOT NULL,
  bullets TEXT NOT NULL,          -- JSON string array
  date TEXT NOT NULL
);
