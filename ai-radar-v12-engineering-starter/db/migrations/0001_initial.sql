-- DRAFT SCHEMA FOR STAGING ONLY. Apply via Wrangler after creating staging D1.
PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS sources (id TEXT PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL UNIQUE, type TEXT, language TEXT, enabled INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, source_id TEXT NOT NULL REFERENCES sources(id), title TEXT NOT NULL, summary TEXT, url TEXT NOT NULL UNIQUE, language TEXT, published_at TEXT NOT NULL, discovered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, published INTEGER NOT NULL DEFAULT 1);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(published, published_at DESC);
CREATE TABLE IF NOT EXISTS topics (id TEXT PRIMARY KEY, name TEXT NOT NULL, is_featured INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS research_tracks (id TEXT PRIMARY KEY, primary_topic_id TEXT NOT NULL REFERENCES topics(id), name TEXT NOT NULL, description TEXT, published INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT NOT NULL, event_date TEXT, primary_topic_id TEXT REFERENCES topics(id), event_type TEXT, verification_status TEXT NOT NULL DEFAULT 'candidate', milestone_status TEXT NOT NULL DEFAULT 'none', published INTEGER NOT NULL DEFAULT 0, revision INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS event_articles (event_id TEXT NOT NULL REFERENCES events(id), article_id TEXT NOT NULL REFERENCES articles(id), relation TEXT NOT NULL DEFAULT 'supports', PRIMARY KEY(event_id,article_id));
CREATE TABLE IF NOT EXISTS event_topics (event_id TEXT NOT NULL REFERENCES events(id), topic_id TEXT NOT NULL REFERENCES topics(id), relevance REAL, PRIMARY KEY(event_id,topic_id));
CREATE TABLE IF NOT EXISTS event_tracks (event_id TEXT NOT NULL REFERENCES events(id), track_id TEXT NOT NULL REFERENCES research_tracks(id), confirmed INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(event_id,track_id));
CREATE TABLE IF NOT EXISTS scores (id TEXT PRIMARY KEY, event_id TEXT NOT NULL REFERENCES events(id), heat REAL, importance REAL, confidence REAL, model_version TEXT NOT NULL, rationale TEXT, observed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS reviews (id TEXT PRIMARY KEY, event_id TEXT REFERENCES events(id), action TEXT NOT NULL, before_json TEXT, after_json TEXT, rationale TEXT, reviewer_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS notes (id TEXT PRIMARY KEY, track_id TEXT REFERENCES research_tracks(id), title TEXT NOT NULL, content TEXT, published INTEGER NOT NULL DEFAULT 0, revised_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
