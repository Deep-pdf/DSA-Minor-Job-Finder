# Data Model Documentation

## 1. Candidate Model
- **id** (int): Unique identifier assigned by the frontend when user submits.
- **name** (string): Non-empty candidate full name.
- **education** (string): e.g., "B.Tech CSE".
- **skills** (list of strings): List of skills possessed (must exist in `skills.json`).
- **experience** (int): Years of professional experience (>= 0).
- **certifications** (list of strings): Optional professional certs.

*Validation Rules:*
- `name` cannot be empty.
- `skills` must contain at least one skill.
- `experience` must be >= 0.

## 2. Job Model
- **id** (int): Unique identifier.
- **title** (string): Non-empty job title.
- **company** (string): Non-empty company name.
- **requiredSkills** (list of strings): Skills essential for the role.
- **optionalSkills** (list of strings): Skills that boost match score but aren't strictly required.
- **experience** (struct {min, max}): Min/max years required.
- **location** (string): Job location.
- **description** (string): Role summary.

*Validation Rules:*
- `title` and `company` cannot be empty.
- `requiredSkills` must contain at least one skill.

## 3. MatchResult Model
This model is generated dynamically after comparing a Candidate to a specific Job. It is NOT stored in JSON.

- **jobId** (int): Links to the original job.
- **matchedSkills** (list of strings): Skills present in both Candidate and Job.
- **missingSkills** (list of strings): Skills required by Job but missing in Candidate.
- **matchPercentage** (double): Score calculated as `(matched / total_required_skills) * 100`.

---

## JSON Structure

### jobs.json
```json
{
  "jobs": [ { "id": 1, ... } ]
}
```

### skills.json
```json
{
  "skills": [ { "name": "C++", "category": "Programming Language" }, ... ]
}
```

---

## Future Interaction Flow

1. **Initialization:**
   - Server reads `data/skills.json` → builds Trie for autocomplete.
   - Server reads `data/jobs.json` → loads into memory (vector of `Job` structs).

2. **Autocomplete Request:**
   - Frontend GET `api/autocomplete?prefix=...`
   - Backend calls `Trie.autocomplete(prefix)` → returns JSON list.

3. **Matching Request:**
   - Frontend POST `api/match` (with Candidate JSON).
   - Backend:
     - Creates `Candidate` struct.
     - Calls `HashSet.insert` to store candidate skills.
     - Iterates through `vector<Job>`:
       - Calls matching algorithm → `MatchResult`.
     - Calls `MergeSort` on resulting list of `MatchResult`s.
     - Returns ranked list as JSON using `MatchResult` fields.
