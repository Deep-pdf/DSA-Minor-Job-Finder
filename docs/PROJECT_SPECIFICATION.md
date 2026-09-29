# Project Specification: Job/Resume Matching System

## 1. Project Objective

Build a web-based Job/Resume Matching System that demonstrates how core Data Structures and Algorithms solve a real-world problem: matching a candidate's skills to job postings, calculating match percentages, and ranking results.

The system accepts a candidate's profile (skills, experience, education), compares it against a dataset of job postings, and returns jobs ranked by match score — all powered by hand-written DSA implementations in C++.

---

## 2. Functional Requirements

### FR-1: Candidate Input
- Accept candidate name, education level, list of skills, and years of experience.
- Skills are entered via a text input with autocomplete suggestions (Trie-powered).

### FR-2: Skill Autocomplete
- As the candidate types a skill name, the system suggests completions in real time.
- Powered by a Trie built from all known skills across the job dataset.

### FR-3: Skill Matching
- For each job, determine which of its required skills the candidate possesses.
- Use a hash set for O(1) average-case membership checking.
- Identify matched skills and missing skills per job.

### FR-4: Match Score Calculation
- Compute a match percentage: `(matched_skills / total_required_skills) * 100`.
- Optionally weight experience proximity as a secondary factor.

### FR-5: Job Ranking
- Sort all jobs by match score in descending order.
- Use a hand-implemented sorting algorithm (merge sort) — not `std::sort`.

### FR-6: Results Display
- Show ranked jobs with: job title, company, match percentage, matched skills (highlighted), missing skills, and location.

### FR-7: Skill Search
- Allow the candidate to search whether a specific skill exists in the system's skill database.
- Uses Trie prefix search.

---

## 3. Non-Functional Requirements

### NFR-1: Academic Clarity
- Every DSA component must be in its own file with clear comments.
- Each algorithm must be explainable with a small manual example during viva.

### NFR-2: Modularity
- DSA code is independent of HTTP/server code.
- Frontend is independent of backend.
- Data files are independent of application logic.

### NFR-3: Simplicity
- No frameworks, no databases, no external APIs.
- Plain HTML/CSS/JS frontend, C++ backend, JSON data files.

### NFR-4: Performance Transparency
- Time and space complexity documented for every DSA component.
- The system should be able to explain *why* each data structure was chosen.

### NFR-5: Portability
- Compiles with g++ on any standard system.
- No platform-specific dependencies beyond a C++17 compiler.

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     BROWSER                             │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Frontend (HTML + CSS + JS)                │  │
│  │  - Candidate input form                           │  │
│  │  - Skill autocomplete UI                          │  │
│  │  - Results display                                │  │
│  └───────────────────┬───────────────────────────────┘  │
└──────────────────────┼──────────────────────────────────┘
                       │ HTTP requests (fetch API)
                       ▼
┌──────────────────────────────────────────────────────────┐
│              C++ Backend (HTTP Server)                   │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Lightweight HTTP handler                          │  │
│  │  - Parses requests                                 │  │
│  │  - Routes to appropriate handler                   │  │
│  │  - Returns JSON responses                          │  │
│  └───────────────────┬────────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼────────────────────────────────┐  │
│  │           DSA Processing Layer                     │  │
│  │                                                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │  │
│  │  │  Trie    │  │ Hash Set │  │ Matching Engine  │ │  │
│  │  │ (auto-   │  │ (skill   │  │ (score calc)     │ │  │
│  │  │ complete)│  │  lookup) │  │                  │ │  │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  Merge Sort (job ranking by match score)     │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│                      │                                   │
│  ┌───────────────────▼────────────────────────────────┐  │
│  │           Data Layer (JSON files)                  │  │
│  │  - jobs.json                                       │  │
│  │  - skills.json (master skill list)                 │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Communication: Frontend ↔ Backend

The frontend communicates with the C++ backend over HTTP using the browser `fetch` API. The backend serves:
1. **Static files** — the HTML/CSS/JS frontend.
2. **API endpoints** — JSON request/response for autocomplete, matching, etc.

All API requests and responses use `Content-Type: application/json`.

---

## 5. Folder Structure

```
DSA Minor1/
├── frontend/
│   ├── index.html          # Main page
│   ├── style.css           # Styling
│   └── app.js              # Frontend logic, fetch calls, UI updates
│
├── backend/
│   ├── main.cpp            # Entry point: starts HTTP server
│   ├── server.h            # Minimal HTTP server (request parsing, routing)
│   ├── server.cpp          # Server implementation
│   ├── routes.h            # API route handlers (declarations)
│   └── routes.cpp          # API route handler implementations
│
├── dsa/
│   ├── trie.h              # Trie class declaration
│   ├── trie.cpp            # Trie implementation (insert, search, autocomplete)
│   ├── hashset.h           # Hash set class declaration
│   ├── hashset.cpp         # Hash set implementation (insert, contains)
│   ├── matcher.h           # Matching engine declaration
│   ├── matcher.cpp         # Match score calculation, missing skill identification
│   ├── sorting.h           # Sorting algorithm declaration
│   └── sorting.cpp         # Merge sort implementation for job ranking
│
├── models/
│   ├── job.h               # Job struct/class
│   ├── candidate.h         # Candidate struct/class
│   └── match_result.h      # MatchResult struct (score, matched/missing skills)
│
├── utils/
│   ├── json_parser.h       # Minimal JSON reading utility (declarations)
│   ├── json_parser.cpp     # JSON parsing implementation
│   └── string_utils.h      # String helpers (lowercase, trim)
│
├── data/
│   ├── jobs.json           # Job postings dataset
│   └── skills.json         # Master list of all valid skills
│
├── tests/
│   ├── test_trie.cpp       # Trie unit tests
│   ├── test_hashset.cpp    # Hash set unit tests
│   ├── test_matcher.cpp    # Matcher unit tests
│   └── test_sorting.cpp    # Sorting unit tests
│
├── docs/
│   ├── PROJECT_SPECIFICATION.md   # This file
│   ├── DSA_PLAN.md                # Detailed DSA documentation
│   └── API_ENDPOINTS.md           # API endpoint reference
│
├── Makefile                # Build commands
└── README.md               # Project overview
```

### Module Responsibilities

| Module | Responsibility |
|--------|---------------|
| `frontend/` | User interface — input forms, autocomplete display, results rendering. Zero DSA logic. |
| `backend/` | HTTP server, request routing, JSON serialization. Calls into DSA layer. |
| `dsa/` | All data structures and algorithms. No HTTP awareness. Pure logic. |
| `models/` | Data structures for domain objects (Job, Candidate, MatchResult). |
| `utils/` | JSON file reading, string normalization. Shared helpers. |
| `data/` | Static JSON datasets. No code. |
| `tests/` | Standalone test programs for each DSA component. |
| `docs/` | Planning documents, API docs, DSA explanations. |

---

## 6. Data Models

### 6.1 Job (jobs.json)

```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Software Developer",
      "company": "TechCorp",
      "required_skills": ["C++", "DSA", "SQL", "Git", "Docker"],
      "experience_min": 0,
      "experience_max": 2,
      "location": "Bangalore",
      "description": "Develop and maintain backend systems."
    },
    {
      "id": 2,
      "title": "Data Analyst",
      "company": "DataWorks",
      "required_skills": ["Python", "SQL", "Excel", "Statistics", "Tableau"],
      "experience_min": 0,
      "experience_max": 3,
      "location": "Hyderabad",
      "description": "Analyze business data and produce insights."
    }
  ]
}
```

### 6.2 Skills Master List (skills.json)

```json
{
  "skills": [
    "C", "C++", "Java", "Python", "JavaScript",
    "SQL", "NoSQL", "Git", "Docker", "Kubernetes",
    "DSA", "OOP", "DBMS", "OS", "CN",
    "HTML", "CSS", "React", "Angular", "Node.js",
    "Machine Learning", "Deep Learning", "NLP",
    "Excel", "Tableau", "Power BI", "Statistics",
    "AWS", "Azure", "GCP", "Linux", "REST API"
  ]
}
```

### 6.3 Candidate (sent from frontend, not stored)

```json
{
  "name": "Rahul Sharma",
  "education": "B.Tech CSE",
  "skills": ["C++", "DSA", "Python", "SQL", "Git"],
  "experience": 1
}
```

### 6.4 Match Result (returned from backend)

```json
{
  "results": [
    {
      "job_id": 1,
      "title": "Software Developer",
      "company": "TechCorp",
      "location": "Bangalore",
      "match_percentage": 80.0,
      "matched_skills": ["C++", "DSA", "SQL", "Git"],
      "missing_skills": ["Docker"],
      "experience_fit": true
    }
  ]
}
```

---

## 7. API Endpoints

### GET `/`
Serves `frontend/index.html`.

### GET `/style.css`, `/app.js`
Serves static frontend assets.

### POST `/api/match`
**Purpose:** Accept candidate data, run matching + sorting, return ranked results.

**Request body:**
```json
{
  "name": "Rahul Sharma",
  "education": "B.Tech CSE",
  "skills": ["C++", "DSA", "Python", "SQL", "Git"],
  "experience": 1
}
```

**Response body:**
```json
{
  "results": [
    {
      "job_id": 1,
      "title": "Software Developer",
      "company": "TechCorp",
      "location": "Bangalore",
      "match_percentage": 80.0,
      "matched_skills": ["C++", "DSA", "SQL", "Git"],
      "missing_skills": ["Docker"],
      "experience_fit": true
    }
  ]
}
```

**Internal flow:**
1. Parse candidate JSON.
2. Load jobs from `jobs.json`.
3. Insert candidate skills into a hash set.
4. For each job, check each required skill against the hash set → compute match score.
5. Merge sort all match results by score descending.
6. Return sorted results as JSON.

### GET `/api/autocomplete?prefix=py`
**Purpose:** Return skill suggestions for the typed prefix.

**Response body:**
```json
{
  "suggestions": ["Python", "PyTorch", "PySpark"]
}
```

**Internal flow:**
1. The Trie (pre-built at server startup from `skills.json`) searches for all words with the given prefix.
2. Return matching skills.

### GET `/api/skills`
**Purpose:** Return the full master skill list (for display/validation).

**Response body:**
```json
{
  "skills": ["C", "C++", "Java", "Python", ...]
}
```

---

## 8. DSA Plan Summary

| DSA Component | Data Structure / Algorithm | Purpose | File |
|---------------|---------------------------|---------|------|
| Hashing | Custom hash set (open addressing or separate chaining) | O(1) average skill membership check during matching | `dsa/hashset.h/.cpp` |
| Trie | Prefix tree | Skill autocomplete and prefix search | `dsa/trie.h/.cpp` |
| Matching | Iterative comparison using hash set | Calculate match %, identify matched/missing skills | `dsa/matcher.h/.cpp` |
| Sorting | Merge sort | Rank jobs by match score (stable, O(n log n)) | `dsa/sorting.h/.cpp` |

*(Detailed DSA documentation is in `docs/DSA_PLAN.md`.)*

---

## 9. Development Roadmap

### Phase 1 — Project Planning ✅ (current)
- Define specification, architecture, data models, API design.
- Create README, folder structure, documentation.

### Phase 2 — DSA Core
- Implement `HashSet` (insert, contains, remove).
- Implement `Trie` (insert, search, autocomplete).
- Implement `Matcher` (score calculation, skill comparison).
- Implement `MergeSort` (sort MatchResult array by score).
- Write unit tests for each.

### Phase 3 — Data & Models
- Create `jobs.json` with 15–20 realistic job postings.
- Create `skills.json` master list.
- Define C++ structs: `Job`, `Candidate`, `MatchResult`.
- Implement JSON parser utility.

### Phase 4 — Backend Server
- Build minimal HTTP server in C++ (socket-based, single-threaded).
- Implement route handlers for `/api/match`, `/api/autocomplete`, `/api/skills`.
- Serve static files.
- Wire routes to DSA layer.

### Phase 5 — Frontend
- Build HTML form for candidate input.
- Build skill input with autocomplete (calls `/api/autocomplete`).
- Build results display (match cards with scores, skills, missing skills).
- Style with CSS.

### Phase 6 — Integration & Testing
- End-to-end testing: form submission → backend → DSA → response → UI.
- Edge cases: no skills entered, zero matches, 100% match.
- Polish UI, fix bugs.

### Phase 7 — Documentation & Viva Prep
- Document each DSA component with worked examples.
- Prepare time/space complexity analysis.
- Create a walkthrough demonstrating the full Input → DSA → Output flow.

---

## 10. Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | C++ (C++17) |
| Data | JSON files |
| Compiler | g++ |
| Build | Makefile |
| Version Control | Git |

---

## 11. Constraints

1. **No frameworks** — no React, Angular, Vue, Tailwind, etc.
2. **No databases** — JSON files only.
3. **No external APIs** — no AI, no search engines, no auth services.
4. **No `std::sort`** — sorting must be hand-implemented (merge sort).
5. **No autocomplete libraries** — Trie must be hand-implemented.
6. **No `std::unordered_set`** for skill matching — hash set must be hand-implemented.
7. **Minimal external dependencies** — the only allowed external code is a lightweight JSON library (nlohmann/json, header-only) or a hand-written JSON parser.
8. **DSA code must be isolated** — no HTTP logic in `dsa/` files.
9. **Frontend must be isolated** — no C++ in `frontend/` files.
10. **Every DSA component must be independently testable.**
