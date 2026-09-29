# Job/Resume Matching System

A web-based system that matches a candidate's skills to job postings using core Data Structures and Algorithms. Built as a college minor project to demonstrate practical applications of DSA.

## What It Does

1. A candidate enters their profile — name, education, skills, and experience.
2. The system compares their skills against a dataset of job postings.
3. Each job receives a match percentage based on how many required skills the candidate has.
4. Jobs are ranked from best match to worst and displayed with matched/missing skills highlighted.

## DSA Components

| Component | Data Structure / Algorithm | Purpose |
|-----------|---------------------------|---------|
| **Hashing** | Custom hash set (separate chaining) | O(1) skill membership checking during matching |
| **Trie** | Prefix tree | O(L) skill search and autocomplete suggestions |
| **Graph & Distance** | Weighted Graph + Dijkstra's Algorithm | O((V + E) log V) location proximity and transit distance fit |
| **Matching** | Comparison algorithm using hash set & graph | Calculate match %, identify matched and missing skills |
| **Sorting** | Merge sort | O(N log N) rank jobs by match score (no `std::sort`) |

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** C++ (C++17)
- **Data:** JSON files
- **Compiler:** g++
- **Build:** Makefile

No frameworks, no databases, no external APIs.

## Project Structure

```
├── frontend/       # Modern responsive UI (HTML, CSS, JS)
├── backend/        # C++ HTTP server and route handlers
├── dsa/            # All DSA implementations (hashset, trie, sorting, city_graph, matcher)
├── models/         # Data structures: Job, Candidate, MatchResult
├── utils/          # JSON parsing, string utilities
├── data/           # jobs.json, skills.json
├── tests/          # Unit tests for each DSA component
├── docs/           # Specification, DSA plan, API reference
├── Makefile        # Build commands
└── README.md       # This file
```

## How It Works

```
Browser → Frontend UI → HTTP Request
                              ↓
                        C++ Backend
                              ↓
                ┌─────────────────────────┐
                │   1. Hash candidate     │
                │      skills into set    │
                │   2. Dijkstra shortest  │
                │      city graph path    │
                │   3. Match against      │
                │      each job           │
                │   4. Merge sort by      │
                │      overall score      │
                └─────────────────────────┘
                              ↓
                     JSON Response → UI renders ranked results
```

### Autocomplete (separate flow)

```
User types prefix → HTTP Request → Trie prefix search → Suggestions returned
```

## Building and Running

```bash
# Build
make

# Run server
./server

# Open in browser
# http://localhost:8080
```

## Example

**Candidate skills:** C++, DSA, Python, SQL, Git

**Job:** Software Developer at TechCorp
**Required:** C++, DSA, SQL, Git, Docker

**Result:**
- Match: **80%** (4 out of 5 skills)
- Matched: C++, DSA, SQL, Git
- Missing: Docker

## Documentation

- [Project Specification](docs/PROJECT_SPECIFICATION.md) — full requirements and architecture
- [DSA Plan](docs/DSA_PLAN.md) — detailed explanation of each DSA component with complexity analysis
- [API Endpoints](docs/API_ENDPOINTS.md) — HTTP API reference

## Development Phases

1. ✅ **Planning** — specification, architecture, data models
2. ⬜ **DSA Core** — hash set, trie, matcher, merge sort + tests
3. ⬜ **Data & Models** — JSON datasets, C++ structs, JSON parser
4. ⬜ **Backend** — HTTP server, routes, wiring
5. ⬜ **Frontend** — input form, autocomplete, results display
6. ⬜ **Integration** — end-to-end testing, edge cases
7. ⬜ **Documentation** — viva prep, complexity writeups

## Academic Context

This project is designed for a college minor project viva. Each DSA component can be independently demonstrated with:
- A small manual input/output example
- Time and space complexity analysis
- Justification for why that data structure was chosen over alternatives
