<!--  xmas-house-of-games-prd.md  -->
# Product Requirements Document  
**Christmas House-of-Games – Family Quiz Night**  
**Version:** 2.0 – 17 Aug 2025  
**Author:** [Your Name]  

---

## 1. Purpose & Vision
A light-hearted, House-of-Games-style quiz tournament for the whole family to enjoy on Christmas Day (and re-use every year).  
**Must be zero-cost to host**, work on any phone or laptop, require no app-store install (PWA), and include an AI Question-Master to help the host generate fresh rounds on the fly.

---

## 2. Key Features (MVP)

| # | Feature | Description | Complexity |
|---|---------|-------------|------------|
| 1 | **Round-based quizzes** | 5 selectable mini-rounds (see §3) | Medium |
| 2 | **Family teams** | 2–4 teams, up to 8 players total | Low |
| 3 | **Real-time scoreboard** | Instant updates on every screen | Medium |
| 4 | **OAuth login** | Google + Apple sign-in, no new passwords | Low |
| 5 | **Host mode** | One device acts as quizmaster; others join | Low |
| 6 | **Question bank** | 200 curated questions + AI-generated extras | Medium |
| 7 | **AI Question-Master** | Host can auto-generate new questions for any round | Medium |
| 8 | **Offline-capable** | PWA caches assets & questions | Medium |
| 9 | **Festive theme** | Snowfall CSS, Santa avatars, sound effects | Low |

---

## 3. Mini-Rounds (select any 5)
1. **Clue-Five** – 5 clues, points decrease with each revealed clue.  
2. **Rhyme Time** – “Stinky Pinky” style two-word rhymes.  
3. **Answer Smash** – Combine two pictures into one answer.  
4. **Ridiculous Charades** – Acting round limited to Christmas props.  
5. **Sound Round** – 10-second reversed festive song snippets.  
6. **Broken Karaoke** – Finish the lyric with the last word missing.

---

## 4. User Flows

### 4.1 Host Flow
1. Opens site → “Host a Game” → OAuth → creates room code.  
2. Chooses 5 rounds (or uses AI to generate).  
3. Starts game, sees live scores, controls pacing.

### 4.2 Player Flow
1. Joins room → picks team & avatar → waits for host.  
2. Answers questions on phone → sees real-time leaderboard.

---

## 5. Data Model

```json
Game {
  id: uuid PK,
  host_id: uuid FK auth.users,
  rounds: jsonb[],
  teams: Team[],
  created_at: timestamptz
}

Team {
  id: uuid,
  name: text,
  players: Player[],
  score: int
}

Player {
  id: uuid FK auth.users,
  name: text,
  avatar_url: text
}

Question {
  id: uuid,
  round_type: text,
  prompt: text,
  answers: text[],
  points: int,
  media_url: text (optional)
}

Answer {
  id: uuid,
  player_id: uuid,
  question_id: uuid,
  text: text,
  timestamp: timestamptz,
  score: int
}

ai_generation_log {
  id: uuid,
  round_type: text,
  prompt: text,
  raw_response: jsonb,
  approved_questions: jsonb,
  created_at: timestamptz
}
