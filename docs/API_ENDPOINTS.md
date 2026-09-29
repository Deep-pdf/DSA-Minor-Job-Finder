# API Endpoints Reference

This document defines the HTTP API exposed by the C++ backend.

All API endpoints accept and return `application/json`.

---

## Static File Serving

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Serves `frontend/index.html` |
| GET | `/style.css` | Serves `frontend/style.css` |
| GET | `/app.js` | Serves `frontend/app.js` |

---

## API Endpoints

### POST `/api/match`

Match a candidate against all jobs and return ranked results.

**Request:**

```http
POST /api/match HTTP/1.1
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "education": "B.Tech CSE",
  "skills": ["C++", "DSA", "Python", "SQL", "Git"],
  "experience": 1
}
```

**Response (200 OK):**

```json
{
  "candidate_name": "Rahul Sharma",
  "total_jobs": 20,
  "results": [
    {
      "job_id": 1,
      "title": "Software Developer",
      "company": "TechCorp",
      "location": "Bangalore",
      "match_percentage": 80.0,
      "matched_skills": ["C++", "DSA", "SQL", "Git"],
      "missing_skills": ["Docker"],
      "experience_fit": true,
      "description": "Develop and maintain backend systems."
    },
    {
      "job_id": 5,
      "title": "Backend Engineer",
      "company": "WebSoft",
      "location": "Pune",
      "match_percentage": 60.0,
      "matched_skills": ["C++", "Git", "SQL"],
      "missing_skills": ["Java", "Spring"],
      "experience_fit": true,
      "description": "Build scalable backend services."
    }
  ]
}
```

Results are sorted by `match_percentage` descending (using merge sort).

**Error Response (400 Bad Request):**

```json
{
  "error": "Missing required field: skills"
}
```

---

### GET `/api/autocomplete?prefix=<prefix>`

Get skill suggestions for a typed prefix.

**Request:**

```http
GET /api/autocomplete?prefix=py HTTP/1.1
```

**Response (200 OK):**

```json
{
  "prefix": "py",
  "suggestions": ["Python", "PyTorch", "PySpark"]
}
```

If no matches are found, `suggestions` is an empty array.

---

### GET `/api/skills`

Get the full list of valid skills in the system.

**Request:**

```http
GET /api/skills HTTP/1.1
```

**Response (200 OK):**

```json
{
  "count": 32,
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

---

## Internal Processing Flow for `/api/match`

```
1. Parse JSON body → extract Candidate { name, education, skills[], experience }
2. Create HashSet from candidate.skills
   └── For each skill: hashset.insert(lowercase(skill))
3. Load jobs from data/jobs.json
4. For each job:
   a. Initialize matched = 0, matched_list = [], missing_list = []
   b. For each required_skill in job.required_skills:
      - If hashset.contains(lowercase(required_skill)): matched++, add to matched_list
      - Else: add to missing_list
   c. match_percentage = (matched / total_required) * 100
   d. experience_fit = (candidate.experience >= job.experience_min
                        && candidate.experience <= job.experience_max)
   e. Create MatchResult { job_id, title, company, location,
                           match_percentage, matched_list, missing_list,
                           experience_fit }
5. Collect all MatchResult objects into an array
6. Merge sort the array by match_percentage (descending)
7. Serialize to JSON and return
```

---

## Error Handling

| Scenario | HTTP Status | Response |
|----------|------------|----------|
| Valid request | 200 | Normal response body |
| Missing `skills` field | 400 | `{"error": "Missing required field: skills"}` |
| Empty skills array | 400 | `{"error": "Skills array cannot be empty"}` |
| Invalid JSON | 400 | `{"error": "Invalid JSON in request body"}` |
| Unknown endpoint | 404 | `{"error": "Not found"}` |
| Wrong HTTP method | 405 | `{"error": "Method not allowed"}` |
