# DSA Plan: Job/Resume Matching System

This document explains every DSA component used in the project — what it is, why it was chosen, how it works, its complexity, and a small manual example suitable for viva explanation.

---

## 1. Hash Set — Skill Membership Checking [IMPLEMENTED]
Implementation: `dsa/hashset.cpp`
Status: Verified (Phase 4). Handles case-insensitivity, collisions, and duplicates.

### What
A custom hash set that stores strings. Supports `insert(key)` and `contains(key)`.

### Why
During matching, for every job we must check: "Does the candidate have skill X?" If the candidate has `k` skills and a job requires `r` skills, a naive list scan costs **O(k)** per check, giving **O(r × k)** per job. With a hash set holding the candidate's skills, each check is **O(1)** average, giving **O(r)** per job.

### How It Works
1. A fixed-size array of "buckets" (linked lists or vectors).
2. To insert a skill string, compute `hash(skill) % bucket_count` → append to that bucket.
3. To check membership, compute the same hash → search only that bucket.
4. Collision resolution: **separate chaining** (each bucket is a linked list). This is simpler to implement and explain than open addressing.

### Hash Function
A simple polynomial rolling hash:
```
hash("C++") = ('C' * 31^2 + '+' * 31^1 + '+' * 31^0) % bucket_count
```

### Complexity

| Operation | Average | Worst Case |
|-----------|---------|------------|
| Insert    | O(1)    | O(n)       |
| Contains  | O(1)    | O(n)       |
| Space     | O(n)    |            |

Worst case occurs when all keys hash to the same bucket (extremely unlikely with a decent hash function and reasonable load factor).

### Manual Example

```
Candidate skills: ["C++", "Python", "SQL"]
Bucket count: 7

hash("C++")    = 4821 % 7 = 5
hash("Python") = 8372 % 7 = 3
hash("SQL")    = 2941 % 7 = 2

Buckets:
[0]: empty
[1]: empty
[2]: "SQL"
[3]: "Python"
[4]: empty
[5]: "C++"
[6]: empty

contains("C++")    → hash = 5 → bucket[5] has "C++" → TRUE
contains("Docker") → hash = 1 → bucket[1] is empty  → FALSE
```

### Implementation Decisions
- Bucket count: start with a prime number (e.g., 53). This reduces clustering.
- Load factor threshold: if `size / bucket_count > 0.75`, rehash (double bucket count).
- Case handling: convert all skills to lowercase before hashing for case-insensitive matching.

---

## 2. Trie — Skill Autocomplete [IMPLEMENTED]

### What
A prefix tree (Trie) where each node represents a character, and paths from root to leaf spell out complete skill names. Supports `insert(word)`, `search(word)`, and `autocomplete(prefix)`.

### Why
When the user types "Py", the system should instantly suggest "Python", "PyTorch", "PySpark". A Trie finds all words sharing a prefix in **O(p + m)** time where `p` is the prefix length and `m` is the number of matches — far better than scanning the entire skill list and checking each with `startsWith()`.

### How It Works
1. Each node has:
   - An array/map of children (one per possible character).
   - A boolean `is_end_of_word` flag.
2. **Insert:** Walk down the tree character by character, creating nodes as needed. Mark the last node.
3. **Search:** Walk down the tree. If the path exists and the last node is marked, the word exists.
4. **Autocomplete:** Walk to the prefix's last node, then DFS/BFS to collect all words below it.

### Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Insert    | O(L) where L = word length | O(L) new nodes |
| Search    | O(L) | O(1) |
| Autocomplete | O(P + M) where P = prefix length, M = total chars in all matches | — |
| Total space | O(N × L) where N = number of words, L = average length | — |

---

## 3. Matching Algorithm — Score Calculation
### What
An algorithm that compares a candidate's skills against a job's required skills and produces a match score.

### Complexity
| Metric | Value |
|--------|-------|
| Time per job | O(J) where J = number of required skills |
| Time for all jobs | O(N * J_avg) where N = number of jobs |
| Space | O(J) for matched/missing lists per job |


---

## 4. Merge Sort — Job Ranking [IMPLEMENTED]

Status: Verified (Phase 7). Implementation: `dsa/sorting.cpp`.

**Deterministic Ranking Criteria (Descending):**
1. Primary: `match_percentage`
2. Secondary: `matched_skills.size()`
3. Tertiary: `title` (alphabetical)

### Why We Chose Merge Sort
1. **Stable sort** — jobs with equal match scores retain their original order.
2. **Guaranteed O(n log n)** — unlike quicksort, merge sort never degrades to O(n²).
3. **Easy to explain** — the divide-and-conquer strategy is intuitive.
4. **Academic requirement** — we cannot use `std::sort`.

### How It Works
1. **Divide:** Split the array in half recursively until each sub-array has one element.
2. **Conquer:** Each single-element array is trivially sorted.
3. **Merge:** Combine two sorted halves by comparing elements and placing the larger one first (descending order).

### Complexity

| Metric | Value |
|--------|-------|
| Time (all cases) | O(n log n) |
| Space | O(n) auxiliary (for the merge step) |
| Stable? | Yes |

---

## 5. How DSA Components Connect

```
Candidate Input
       │
       ▼
  ┌─────────────┐
  │  Hash Set   │ ← candidate skills inserted here
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐     ┌──────────────┐
  │  Matcher    │ ──→ │  Job Dataset │
  │  (uses hash │     └──────────────┘
  │   set for   │
  │   lookups)  │
  └──────┬──────┘
         │ produces MatchResult[] (unsorted)
         ▼
  ┌─────────────┐
  │ Merge Sort  │
  └──────┬──────┘
         │ produces MatchResult[] (sorted by score desc)
         ▼
    JSON Response → Frontend

  ┌─────────────┐
  │    Trie     │ ← built once at startup from skills.json
  └──────┬──────┘
         │ used independently for autocomplete requests
         ▼
    Suggestions → Frontend
```
