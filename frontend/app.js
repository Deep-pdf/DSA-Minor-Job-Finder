/**
 * Matchly - DSA Job Matching System Frontend Engine
 * Powered by Trie prefix search, Hash Set matching, and Merge Sort ranking.
 */

// Global State
let selectedSkills = [];
let focusedIndex = -1;
let currentResults = [];
let activeFilter = 'all';
let currentSearchQuery = '';

// Embedded Fallback Skills & Jobs (allows complete standalone offline operation)
const EMBEDDED_SKILLS = [
    { name: "C", category: "Language" },
    { name: "C++", category: "Language" },
    { name: "Java", category: "Language" },
    { name: "Python", category: "Language" },
    { name: "PyTorch", category: "Library" },
    { name: "PySpark", category: "Library" },
    { name: "JavaScript", category: "Language" },
    { name: "TypeScript", category: "Language" },
    { name: "R", category: "Language" },
    { name: "SQL", category: "Database" },
    { name: "NoSQL", category: "Database" },
    { name: "Git", category: "Tool" },
    { name: "Docker", category: "DevOps" },
    { name: "Kubernetes", category: "DevOps" },
    { name: "AWS", category: "Cloud" },
    { name: "Azure", category: "Cloud" },
    { name: "GCP", category: "Cloud" },
    { name: "Linux", category: "OS" },
    { name: "Bash", category: "Scripting" },
    { name: "DSA", category: "Concept" },
    { name: "Data Structures", category: "Concept" },
    { name: "Algorithms", category: "Concept" },
    { name: "OOP", category: "Concept" },
    { name: "DBMS", category: "Concept" },
    { name: "OS", category: "Concept" },
    { name: "CN", category: "Concept" },
    { name: "HTML", category: "Web" },
    { name: "CSS", category: "Web" },
    { name: "React", category: "Framework" },
    { name: "Angular", category: "Framework" },
    { name: "Node.js", category: "Framework" },
    { name: "Django", category: "Framework" },
    { name: "Flask", category: "Framework" },
    { name: "Spring Boot", category: "Framework" },
    { name: "REST API", category: "Concept" },
    { name: "GraphQL", category: "Concept" },
    { name: "Machine Learning", category: "AI/ML" },
    { name: "Deep Learning", category: "AI/ML" },
    { name: "NLP", category: "AI/ML" },
    { name: "NumPy", category: "Library" },
    { name: "Pandas", category: "Library" },
    { name: "Scikit-learn", category: "Library" },
    { name: "TensorFlow", category: "AI/ML" },
    { name: "Power BI", category: "Analytics" },
    { name: "CI/CD", category: "DevOps" },
    { name: "Terraform", category: "DevOps" },
    { name: "Redis", category: "Database" },
    { name: "Selenium", category: "Testing" },
    { name: "Cybersecurity", category: "Security" },
    { name: "Android", category: "Mobile" },
    { name: "Kotlin", category: "Mobile" },
    { name: "Flutter", category: "Mobile" },
    { name: "Apache Spark", category: "Big Data" }
];

const EMBEDDED_JOBS = [
    {
        id: "JOB001",
        title: "Software Engineer",
        company: "TechNova Solutions",
        location: "Bengaluru, India",
        requiredSkills: ["C++", "Data Structures", "Algorithms", "SQL", "Git"],
        optionalSkills: ["Docker", "Linux"],
        experienceRequired: { minYears: 0, maxYears: 2 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["C++ Programming"],
        description: "Develop high-performance systems and maintain software applications using modern C++ best practices."
    },
    {
        id: "JOB002",
        title: "Frontend Developer",
        company: "PixelWave",
        location: "Pune, India",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Git"],
        optionalSkills: ["TypeScript", "Cypress"],
        experienceRequired: { minYears: 0, maxYears: 2 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Computer Science"],
        certificationsPreferred: ["Web Development"],
        description: "Design and implement beautiful, accessible, and responsive client-side web interfaces."
    },
    {
        id: "JOB003",
        title: "Backend Developer",
        company: "WebSoft Solutions",
        location: "Hyderabad, India",
        requiredSkills: ["Java", "Spring Boot", "SQL", "REST API", "Git"],
        optionalSkills: ["Docker", "Kubernetes"],
        experienceRequired: { minYears: 1, maxYears: 3 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["Java Certified"],
        description: "Build robust, scalable backend microservices and RESTful APIs."
    },
    {
        id: "JOB004",
        title: "Python Developer",
        company: "DataForge Labs",
        location: "Hyderabad, India",
        requiredSkills: ["Python", "SQL", "REST API", "Git"],
        optionalSkills: ["Django", "Flask", "Docker"],
        experienceRequired: { minYears: 0, maxYears: 2 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Computer Science"],
        certificationsPreferred: ["Python Programming"],
        description: "Develop scalable backend services and automated workflows using modern Python."
    },
    {
        id: "JOB005",
        title: "Data Analyst",
        company: "InsightBridge",
        location: "Mumbai, India",
        requiredSkills: ["Python", "SQL", "Pandas", "NumPy", "Power BI"],
        optionalSkills: ["Excel", "Machine Learning"],
        experienceRequired: { minYears: 0, maxYears: 3 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Data Science"],
        certificationsPreferred: ["Data Analysis"],
        description: "Analyze complex business datasets to uncover key metrics, trends, and actionable insights."
    },
    {
        id: "JOB006",
        title: "Machine Learning Intern",
        company: "NeuralPath AI",
        location: "Bengaluru, India",
        requiredSkills: ["Python", "NumPy", "Pandas", "Scikit-learn", "Machine Learning"],
        optionalSkills: ["TensorFlow", "PyTorch"],
        experienceRequired: { minYears: 0, maxYears: 1 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["Machine Learning"],
        description: "Collaborate with senior researchers to train, evaluate, and deploy predictive AI models."
    },
    {
        id: "JOB007",
        title: "C++ Systems Developer",
        company: "SystemCore Technologies",
        location: "Chennai, India",
        requiredSkills: ["C++", "Data Structures", "Algorithms", "Git", "Linux"],
        optionalSkills: ["Docker", "C"],
        experienceRequired: { minYears: 1, maxYears: 4 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["C++ Programming"],
        description: "Engineer low-latency, mission-critical systems and multi-threaded networking engines."
    },
    {
        id: "JOB008",
        title: "Full Stack Developer",
        company: "BuildRight Labs",
        location: "Pune, India",
        requiredSkills: ["JavaScript", "Node.js", "React", "SQL", "Git"],
        optionalSkills: ["TypeScript", "Docker"],
        experienceRequired: { minYears: 1, maxYears: 3 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Computer Science"],
        certificationsPreferred: ["MERN Stack"],
        description: "Own end-to-end full stack architecture from relational database schema to modern React UI."
    },
    {
        id: "JOB009",
        title: "DevOps Engineer",
        company: "CloudScale",
        location: "Noida, India",
        requiredSkills: ["Linux", "Git", "Docker", "AWS", "Kubernetes"],
        optionalSkills: ["Terraform", "CI/CD"],
        experienceRequired: { minYears: 0, maxYears: 1 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["AWS Certified"],
        description: "Manage deployment pipelines, continuous integration, and Kubernetes container orchestration."
    },
    {
        id: "JOB010",
        title: "QA Automation Engineer",
        company: "QualityFirst",
        location: "Hyderabad, India",
        requiredSkills: ["Java", "Selenium", "Git", "SQL"],
        optionalSkills: ["Cypress", "Python"],
        experienceRequired: { minYears: 0, maxYears: 2 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Computer Science"],
        certificationsPreferred: ["QA Automation"],
        description: "Architect automated test suites, end-to-end regression workflows, and CI validation."
    },
    {
        id: "JOB011",
        title: "Java Backend Engineer",
        company: "Enterprise Systems",
        location: "Bengaluru, India",
        requiredSkills: ["Java", "Spring Boot", "SQL", "Git"],
        optionalSkills: ["AWS", "Docker"],
        experienceRequired: { minYears: 2, maxYears: 4 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["Java Certified"],
        description: "Develop enterprise-grade Spring Boot microservices handling high transaction volumes."
    },
    {
        id: "JOB012",
        title: "Cloud Solutions Engineer",
        company: "SkyHigh Cloud",
        location: "Noida, India",
        requiredSkills: ["AWS", "Linux", "Terraform", "Docker", "Git"],
        optionalSkills: ["Kubernetes", "Azure"],
        experienceRequired: { minYears: 1, maxYears: 3 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["AWS Certified"],
        description: "Design cloud architecture, infrastructure as code with Terraform, and security policies."
    },
    {
        id: "JOB013",
        title: "Cybersecurity Analyst",
        company: "SecureNet",
        location: "Gurgaon, India",
        requiredSkills: ["Networking", "Linux", "Cybersecurity", "Python"],
        optionalSkills: ["AWS", "SQL"],
        experienceRequired: { minYears: 1, maxYears: 3 },
        educationRequired: ["B.Tech Computer Science", "B.E. Computer Science"],
        certificationsPreferred: ["Certified Ethical Hacker"],
        description: "Monitor security incidents, analyze packet captures, and harden server infrastructure."
    },
    {
        id: "JOB014",
        title: "Mobile App Developer",
        company: "AppFlow",
        location: "Bangalore, India",
        requiredSkills: ["Android", "Kotlin", "Flutter", "Git"],
        optionalSkills: ["REST API", "Firebase"],
        experienceRequired: { minYears: 0, maxYears: 2 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Computer Science"],
        certificationsPreferred: ["Android Developer"],
        description: "Build reactive, smooth cross-platform and native mobile apps with Kotlin and Flutter."
    },
    {
        id: "JOB015",
        title: "Data Platform Engineer",
        company: "DataFlow",
        location: "Hyderabad, India",
        requiredSkills: ["Python", "SQL", "Apache Spark", "Cloud", "Git"],
        optionalSkills: ["AWS", "Docker"],
        experienceRequired: { minYears: 1, maxYears: 3 },
        educationRequired: ["B.Tech Computer Science", "B.Sc Data Science"],
        certificationsPreferred: ["Data Engineering"],
        description: "Build robust distributed streaming pipelines and data lake tables using Apache Spark."
    }
];

// Elements
const inputField = document.getElementById('skill-input');
const autocompleteList = document.getElementById('autocomplete-list');
const skillsList = document.getElementById('skills-list');
const skillCounter = document.getElementById('skill-counter');
const clearInputBtn = document.getElementById('clear-input-btn');
const clearAllSkillsBtn = document.getElementById('clear-all-skills');
const matchBtn = document.getElementById('match-btn');
const jobCardsContainer = document.getElementById('job-cards');
const filterSearchInput = document.getElementById('filter-search');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Populate default initial skills
    const initialSkills = ["C++", "Data Structures", "Algorithms", "SQL", "Git"];
    initialSkills.forEach(s => addSkill(s, false));
    renderSkillsList();

    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Autocomplete input
    inputField.addEventListener('input', handleAutocompleteInput);
    inputField.addEventListener('keydown', handleInputKeydown);

    // Clear input button
    clearInputBtn.addEventListener('click', () => {
        inputField.value = '';
        clearInputBtn.classList.remove('active');
        autocompleteList.classList.remove('show');
        inputField.focus();
    });

    // Clear all skills
    clearAllSkillsBtn.addEventListener('click', () => {
        if (selectedSkills.length === 0) return;
        selectedSkills = [];
        renderSkillsList();
        showToast("All skills cleared", "info");
    });

    // Click outside to close dropdown
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.skills-input-wrapper')) {
            autocompleteList.classList.remove('show');
        }
    });

    // Match Button
    matchBtn.addEventListener('click', handleMatchClick);

    // Filter Tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderResults();
        });
    });

    // Filter Search
    filterSearchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        renderResults();
    });

    // Escape closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeJobModal();
            autocompleteList.classList.remove('show');
        }
    });
}

// Skill Management Functions
function addSkill(skillName, showNotification = true) {
    const trimmed = skillName.trim();
    if (!trimmed) return false;

    // Duplicate check (case-insensitive)
    const exists = selectedSkills.some(s => s.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
        if (showNotification) {
            showToast(`"${trimmed}" is already added!`, 'warning');
        }
        return false;
    }

    selectedSkills.push(trimmed);
    renderSkillsList();
    if (showNotification) {
        showToast(`Added ${trimmed}`, 'success');
    }
    return true;
}

function removeSkill(skillName) {
    selectedSkills = selectedSkills.filter(s => s !== skillName);
    renderSkillsList();
    showToast(`Removed ${skillName}`, 'info');
}

function quickAddSkill(skillName) {
    addSkill(skillName, true);
}

function renderSkillsList() {
    skillsList.innerHTML = '';
    skillCounter.textContent = selectedSkills.length;

    if (selectedSkills.length === 0) {
        skillsList.innerHTML = `<div class="skills-empty-hint">No skills added yet. Search above or use quick-add pills.</div>`;
        return;
    }

    selectedSkills.forEach(skill => {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `
            <span class="tag-dot"></span>
            <span>${escapeHtml(skill)}</span>
            <button type="button" class="remove-btn" title="Remove skill">&times;</button>
        `;
        tag.querySelector('.remove-btn').addEventListener('click', () => removeSkill(skill));
        skillsList.appendChild(tag);
    });
}

// Autocomplete Logic
async function handleAutocompleteInput(e) {
    const val = e.target.value.trim();
    focusedIndex = -1;

    if (val.length > 0) {
        clearInputBtn.classList.add('active');
    } else {
        clearInputBtn.classList.remove('active');
        autocompleteList.classList.remove('show');
        autocompleteList.innerHTML = '';
        return;
    }

    let suggestions = [];

    // Attempt API call to C++ backend
    try {
        const res = await fetch(`/api/autocomplete?prefix=${encodeURIComponent(val)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.suggestions && Array.isArray(data.suggestions)) {
                suggestions = data.suggestions;
            }
        } else {
            suggestions = getClientSideSuggestions(val);
        }
    } catch (err) {
        // Fallback to local Trie-like lookup if backend is offline
        suggestions = getClientSideSuggestions(val);
    }

    renderAutocompleteSuggestions(val, suggestions);
}

function getClientSideSuggestions(prefix) {
    const p = prefix.toLowerCase();
    return EMBEDDED_SKILLS
        .filter(s => s.name.toLowerCase().startsWith(p) || s.name.toLowerCase().includes(p))
        .map(s => s.name)
        .slice(0, 8);
}

function renderAutocompleteSuggestions(query, suggestions) {
    autocompleteList.innerHTML = '';

    if (suggestions.length === 0) {
        autocompleteList.innerHTML = `
            <div class="autocomplete-item" onclick="addCustomSkillFromInput()">
                <span>Add <strong>"${escapeHtml(query)}"</strong> as custom skill</span>
                <span class="autocomplete-category">Custom</span>
            </div>
        `;
        autocompleteList.classList.add('show');
        return;
    }

    suggestions.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'autocomplete-item';
        div.dataset.index = index;

        // Highlight matching characters
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        const highlighted = escapeHtml(item).replace(regex, '<span class="match-highlight">$1</span>');

        // Look up category
        const skillMeta = EMBEDDED_SKILLS.find(s => s.name.toLowerCase() === item.toLowerCase());
        const category = skillMeta ? skillMeta.category : "Skill";

        div.innerHTML = `
            <span>${highlighted}</span>
            <span class="autocomplete-category">${category}</span>
        `;

        div.onclick = () => {
            addSkill(item);
            inputField.value = '';
            clearInputBtn.classList.remove('active');
            autocompleteList.classList.remove('show');
            inputField.focus();
        };

        autocompleteList.appendChild(div);
    });

    autocompleteList.classList.add('show');
}

function handleInputKeydown(e) {
    const items = autocompleteList.querySelectorAll('.autocomplete-item');

    if (e.key === 'ArrowDown') {
        if (items.length > 0) {
            e.preventDefault();
            focusedIndex = (focusedIndex + 1) % items.length;
            updateFocus(items);
        }
    } else if (e.key === 'ArrowUp') {
        if (items.length > 0) {
            e.preventDefault();
            focusedIndex = (focusedIndex - 1 + items.length) % items.length;
            updateFocus(items);
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusedIndex >= 0 && items[focusedIndex]) {
            items[focusedIndex].click();
        } else if (inputField.value.trim().length > 0) {
            addSkill(inputField.value.trim());
            inputField.value = '';
            clearInputBtn.classList.remove('active');
            autocompleteList.classList.remove('show');
        }
    } else if (e.key === 'Escape') {
        autocompleteList.classList.remove('show');
    }
}

function updateFocus(items) {
    items.forEach((item, index) => {
        if (index === focusedIndex) {
            item.classList.add('focused');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('focused');
        }
    });
}

function addCustomSkillFromInput() {
    const val = inputField.value.trim();
    if (val) {
        addSkill(val);
        inputField.value = '';
        clearInputBtn.classList.remove('active');
        autocompleteList.classList.remove('show');
    }
}

// Preset Demo Profiles
function loadDemoProfile(profileType) {
    if (profileType === 'cpp') {
        document.getElementById('name').value = "Rahul Sharma";
        document.getElementById('education').value = "B.Tech Computer Science";
        document.getElementById('experience').value = "1.5";
        document.getElementById('location').value = "Bengaluru, India";
        selectedSkills = ["C++", "Data Structures", "Algorithms", "SQL", "Git", "Linux"];
    } else if (profileType === 'frontend') {
        document.getElementById('name').value = "Priya Patel";
        document.getElementById('education').value = "B.Tech Computer Science";
        document.getElementById('experience').value = "1";
        document.getElementById('location').value = "Pune, India";
        selectedSkills = ["HTML", "CSS", "JavaScript", "React", "Git", "TypeScript"];
    } else if (profileType === 'data') {
        document.getElementById('name').value = "Amit Verma";
        document.getElementById('education').value = "B.Sc Data Science";
        document.getElementById('experience').value = "1";
        document.getElementById('location').value = "Hyderabad, India";
        selectedSkills = ["Python", "SQL", "Pandas", "NumPy", "Power BI", "Git"];
    } else if (profileType === 'devops') {
        document.getElementById('name').value = "Sneha Kulkarni";
        document.getElementById('education').value = "B.Tech Computer Science";
        document.getElementById('experience').value = "1";
        document.getElementById('location').value = "Noida, India";
        selectedSkills = ["Linux", "Git", "Docker", "AWS", "Kubernetes", "CI/CD"];
    }

    renderSkillsList();
    showToast(`Loaded ${profileType.toUpperCase()} demo profile`, 'success');

    // Automatically trigger match
    handleMatchClick();
}

// Job Matching Logic
async function handleMatchClick() {
    if (selectedSkills.length === 0) {
        showToast("Please add at least one skill to match jobs!", "warning");
        inputField.focus();
        return;
    }

    // Button loading state
    matchBtn.classList.add('loading');
    matchBtn.disabled = true;

    const candidateData = {
        name: document.getElementById('name').value || "Candidate",
        education: {
            degree: document.getElementById('education').value || "B.Tech Computer Science",
            field: "Computer Science",
            institution: "University",
            graduationYear: 2026
        },
        experienceYears: parseFloat(document.getElementById('experience').value) || 0,
        skills: selectedSkills,
        certifications: [],
        location: document.getElementById('location').value || "Bengaluru, India"
    };

    try {
        const res = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidateData)
        });

        if (res.ok) {
            const data = await res.json();
            if (data.results && Array.isArray(data.results)) {
                currentResults = data.results;
            } else {
                currentResults = runFallbackMatch(candidateData);
            }
        } else {
            currentResults = runFallbackMatch(candidateData);
        }
    } catch (err) {
        // Backend offline fallback - calculate client-side with same DSA logic
        currentResults = runFallbackMatch(candidateData);
    } finally {
        matchBtn.classList.remove('loading');
        matchBtn.disabled = false;
    }

    // Update results subtitle
    const candidateName = candidateData.name || "Candidate";
    document.getElementById('results-meta-subtitle').innerHTML = `
        Found <strong>${currentResults.length} opportunities</strong> ranked using Merge Sort for <strong>${escapeHtml(candidateName)}</strong>.
    `;

    renderResults();

    // Scroll to results smoothly
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
    showToast(`Matched ${currentResults.length} jobs successfully!`, 'success');
}

// City Graph & Dijkstra Algorithm for Location Proximity
const CITY_GRAPH = {
    edges: {
        "noida": [["gurgaon", 50], ["mumbai", 1420], ["hyderabad", 1550], ["bengaluru", 2150], ["chennai", 2180]],
        "gurgaon": [["noida", 50], ["mumbai", 1380]],
        "mumbai": [["pune", 150], ["hyderabad", 710], ["noida", 1420], ["gurgaon", 1380]],
        "pune": [["mumbai", 150], ["hyderabad", 560], ["bengaluru", 840]],
        "bengaluru": [["chennai", 350], ["hyderabad", 570], ["pune", 840], ["noida", 2150]],
        "chennai": [["bengaluru", 350], ["hyderabad", 630], ["noida", 2180]],
        "hyderabad": [["pune", 560], ["bengaluru", 570], ["chennai", 630], ["mumbai", 710], ["noida", 1550]]
    },
    normalize(city) {
        if (!city) return '';
        let s = city.toLowerCase();
        if (s.includes(',')) s = s.split(',')[0];
        s = s.trim();
        if (s === 'bangalore') s = 'bengaluru';
        if (s === 'delhi' || s === 'new delhi') s = 'noida';
        if (s === 'gurugram') s = 'gurgaon';
        if (s === 'bombay') s = 'mumbai';
        if (s === 'madras') s = 'chennai';
        return s;
    },
    getShortestDistance(fromCity, toCity) {
        const start = this.normalize(fromCity);
        const target = this.normalize(toCity);
        if (!start || !target) return -1;
        if (start === target) return 0;
        if (!this.edges[start] || !this.edges[target]) return -1;

        // Dijkstra's Algorithm using min-distance search
        const dist = {};
        const visited = new Set();
        for (const node in this.edges) dist[node] = Infinity;
        dist[start] = 0;

        while (true) {
            let u = null;
            let minDist = Infinity;
            for (const node in dist) {
                if (!visited.has(node) && dist[node] < minDist) {
                    minDist = dist[node];
                    u = node;
                }
            }
            if (!u || minDist === Infinity) break;
            if (u === target) return dist[target];
            visited.add(u);

            for (const [v, w] of this.edges[u]) {
                if (dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        return dist[target] === Infinity ? -1 : dist[target];
    },
    calculateScore(candLoc, jobLoc) {
        const c = this.normalize(candLoc);
        const j = this.normalize(jobLoc);
        if (j === 'remote') return { score: 100, dist: 0 };
        if (c === j && c) return { score: 100, dist: 0 };
        const d = this.getShortestDistance(c, j);
        if (d < 0) return { score: 40, dist: -1 };
        if (d <= 0) return { score: 100, dist: 0 };
        if (d <= 200) return { score: 90, dist: d };
        if (d <= 700) return { score: 75, dist: d };
        if (d <= 1200) return { score: 55, dist: d };
        return { score: 40, dist: d };
    }
};

// Client-side Fallback Matching (Identical to C++ backend algorithms)
function runFallbackMatch(candidate) {
    const candidateSkillsLower = new Set(candidate.skills.map(s => s.toLowerCase().trim()));

    const results = EMBEDDED_JOBS.map(job => {
        // Compute skill matching via Hash Set (O(1) lookups)
        const matchedSkills = [];
        const missingSkills = [];

        job.requiredSkills.forEach(req => {
            if (candidateSkillsLower.has(req.toLowerCase().trim())) {
                matchedSkills.push(req);
            } else {
                missingSkills.push(req);
            }
        });

        const optionalMatched = [];
        job.optionalSkills.forEach(opt => {
            if (candidateSkillsLower.has(opt.toLowerCase().trim())) {
                optionalMatched.push(opt);
            }
        });

        // Scores
        const skillsScore = job.requiredSkills.length > 0 
            ? Math.round((matchedSkills.length / job.requiredSkills.length) * 100) 
            : 0;

        let expScore = 100;
        if (candidate.experienceYears < job.experienceRequired.minYears) {
            expScore = Math.max(20, Math.round((candidate.experienceYears / Math.max(1, job.experienceRequired.minYears)) * 80));
        }

        const eduScore = 100;
        const certScore = 50;

        // Location proximity via CityGraph & Dijkstra
        const locAnalysis = CITY_GRAPH.calculateScore(candidate.location, job.location);
        const locScore = locAnalysis.score;
        const locDist = locAnalysis.dist;

        // Weighted Overall Score
        const overallMatch = Math.round(
            skillsScore * 0.55 +
            expScore * 0.15 +
            eduScore * 0.10 +
            locScore * 0.15 +
            certScore * 0.05
        );

        let matchCategory = 'low';
        if (overallMatch >= 75) matchCategory = 'high';
        else if (overallMatch >= 50) matchCategory = 'medium';

        return {
            jobId: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            overallMatch: overallMatch,
            matchCategory: matchCategory,
            breakdown: {
                skills: skillsScore,
                experience: expScore,
                education: eduScore,
                certifications: certScore,
                location: locScore,
                locationDistanceKm: locDist
            },
            requirements: {
                requiredSkills: job.requiredSkills,
                optionalSkills: job.optionalSkills,
                experience: job.experienceRequired,
                education: job.educationRequired,
                certifications: job.certificationsPreferred
            },
            matchedSkills: matchedSkills,
            missingSkills: missingSkills,
            optionalMatchedSkills: optionalMatched
        };
    });

    // Merge Sort (Algorithm implementation)
    return mergeSort(results);
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    let result = [];
    let l = 0, r = 0;
    while (l < left.length && r < right.length) {
        if (left[l].overallMatch >= right[r].overallMatch) {
            result.push(left[l]);
            l++;
        } else {
            result.push(right[r]);
            r++;
        }
    }
    return result.concat(left.slice(l)).concat(right.slice(r));
}

// Render Results with Filtering & Search
function renderResults() {
    jobCardsContainer.innerHTML = '';

    if (!currentResults || currentResults.length === 0) {
        jobCardsContainer.innerHTML = `
            <div class="empty-results-card">
                <div class="empty-icon">🎯</div>
                <h3>No Matches Computed Yet</h3>
                <p>Add your skills above and click <strong>"Run Matching Algorithm"</strong> to see ranked results.</p>
            </div>
        `;
        return;
    }

    // Filter by match tier
    let filtered = currentResults.filter(job => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'high') return (job.overallMatch >= 75 || job.matchCategory === 'high');
        if (activeFilter === 'medium') return (job.overallMatch >= 50 && job.overallMatch < 75) || job.matchCategory === 'medium';
        if (activeFilter === 'low') return (job.overallMatch < 50 || job.matchCategory === 'low');
        return true;
    });

    // Filter by search query
    if (currentSearchQuery) {
        filtered = filtered.filter(job => {
            const haystack = `${job.title} ${job.company} ${job.location} ${(job.matchedSkills || []).join(' ')} ${(job.missingSkills || []).join(' ')}`.toLowerCase();
            return haystack.includes(currentSearchQuery);
        });
    }

    if (filtered.length === 0) {
        jobCardsContainer.innerHTML = `
            <div class="empty-results-card">
                <div class="empty-icon">🔍</div>
                <h3>No Jobs Match Current Filters</h3>
                <p>Try clearing the search query or selecting <strong>"All Jobs"</strong> to view all results.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(job => {
        const card = createJobCard(job);
        jobCardsContainer.appendChild(card);
    });
}

function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';

    // Format score category
    const score = Math.round(job.overallMatch);
    let scoreClass = 'low';
    let categoryText = 'Partial Match';
    if (score >= 75) {
        scoreClass = 'high';
        categoryText = 'High Fit';
    } else if (score >= 50) {
        scoreClass = 'medium';
        categoryText = 'Good Fit';
    }

    // Company initials
    const initials = (job.company || "TC").split(' ').map(w => w[0]).slice(0, 2).join('');

    // Matched skills pills
    const matchedHtml = (job.matchedSkills && job.matchedSkills.length > 0)
        ? job.matchedSkills.map(s => `<span class="match-skill-pill matched"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> ${escapeHtml(s)}</span>`).join('')
        : `<span style="font-size:0.8rem; color:var(--slate-400);">None</span>`;

    // Missing skills pills
    const missingHtml = (job.missingSkills && job.missingSkills.length > 0)
        ? job.missingSkills.map(s => `<span class="match-skill-pill missing"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> ${escapeHtml(s)}</span>`).join('')
        : `<span style="font-size:0.8rem; color:var(--success); font-weight:600;">Full Skill Match! 🎉</span>`;

    // Optional skills pills
    const optionalHtml = (job.optionalMatchedSkills && job.optionalMatchedSkills.length > 0)
        ? `<div class="comparison-group">
            <span class="comparison-label optional">Bonus Matched:</span>
            <div class="skills-pill-wrap">
                ${job.optionalMatchedSkills.map(s => `<span class="match-skill-pill optional">★ ${escapeHtml(s)}</span>`).join('')}
            </div>
           </div>`
        : '';

    // Experience string
    const minExp = job.requirements && job.requirements.experience ? job.requirements.experience.minYears : 0;
    const maxExp = job.requirements && job.requirements.experience ? job.requirements.experience.maxYears : 2;

    const skillsBreakdown = job.breakdown ? Math.round(job.breakdown.skills) : 0;
    const expBreakdown = job.breakdown ? Math.round(job.breakdown.experience) : 100;
    const locBreakdown = job.breakdown ? Math.round(job.breakdown.location) : 100;
    const locDist = (job.breakdown && job.breakdown.locationDistanceKm !== undefined) ? job.breakdown.locationDistanceKm : -1;
    const eduBreakdown = job.breakdown ? Math.round(job.breakdown.education) : 100;

    // Location proximity pill details
    let locPillClass = 'proximity-far';
    let locPillText = escapeHtml(job.location);
    if (job.location.toLowerCase().includes('remote') || locDist === 0) {
        locPillClass = 'proximity-exact';
        locPillText = `${escapeHtml(job.location)} (0 km • 100% Fit)`;
    } else if (locDist > 0 && locDist <= 200) {
        locPillClass = 'proximity-near';
        locPillText = `${escapeHtml(job.location)} (${locDist} km • ${locBreakdown}% Fit)`;
    } else if (locDist > 200 && locDist <= 700) {
        locPillClass = 'proximity-mid';
        locPillText = `${escapeHtml(job.location)} (${locDist} km • ${locBreakdown}% Fit)`;
    } else if (locDist > 700) {
        locPillClass = 'proximity-far';
        locPillText = `${escapeHtml(job.location)} (${locDist} km • ${locBreakdown}% Fit)`;
    }

    card.innerHTML = `
        <div class="job-card-top">
            <div class="job-main-info">
                <div class="company-avatar">${escapeHtml(initials)}</div>
                <div>
                    <h3 class="job-title">${escapeHtml(job.title)}</h3>
                    <div class="company-name">
                        <span>${escapeHtml(job.company)}</span>
                    </div>
                    <div class="job-meta-pills">
                        <span class="meta-pill proximity ${locPillClass}">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            ${locPillText}
                        </span>
                        <span class="meta-pill">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                            ${minExp}-${maxExp} yrs exp
                        </span>
                    </div>
                </div>
            </div>
            <div class="match-score-badge">
                <div class="score-pill ${scoreClass}">
                    <span>${score}%</span>
                </div>
                <div class="match-category-label ${scoreClass}">${categoryText}</div>
            </div>
        </div>

        <!-- Breakdown Progress Bars -->
        <div class="breakdown-row">
            <div class="meter-group">
                <div class="meter-header">
                    <span>Skills</span>
                    <span>${skillsBreakdown}%</span>
                </div>
                <div class="meter-bar-track">
                    <div class="meter-bar-fill fill-skills" style="width: ${skillsBreakdown}%"></div>
                </div>
            </div>
            <div class="meter-group">
                <div class="meter-header">
                    <span>Experience</span>
                    <span>${expBreakdown}%</span>
                </div>
                <div class="meter-bar-track">
                    <div class="meter-bar-fill fill-exp" style="width: ${expBreakdown}%"></div>
                </div>
            </div>
            <div class="meter-group">
                <div class="meter-header">
                    <span>Location (Dijkstra)</span>
                    <span>${locBreakdown}%</span>
                </div>
                <div class="meter-bar-track">
                    <div class="meter-bar-fill fill-loc" style="width: ${locBreakdown}%"></div>
                </div>
            </div>
            <div class="meter-group">
                <div class="meter-header">
                    <span>Education</span>
                    <span>${eduBreakdown}%</span>
                </div>
                <div class="meter-bar-track">
                    <div class="meter-bar-fill fill-edu" style="width: ${eduBreakdown}%"></div>
                </div>
            </div>
        </div>

        <!-- Skills Comparison -->
        <div class="skills-comparison">
            <div class="comparison-group">
                <span class="comparison-label matched">Matched (${(job.matchedSkills || []).length}):</span>
                <div class="skills-pill-wrap">
                    ${matchedHtml}
                </div>
            </div>
            <div class="comparison-group">
                <span class="comparison-label missing">Missing (${(job.missingSkills || []).length}):</span>
                <div class="skills-pill-wrap">
                    ${missingHtml}
                </div>
            </div>
            ${optionalHtml}
        </div>

        <div class="job-card-footer">
            <div class="job-desc-snippet">${escapeHtml(job.description || '')}</div>
            <button type="button" class="view-details-btn">
                <span>View Full Details</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
        </div>
    `;

    card.querySelector('.view-details-btn').addEventListener('click', () => openJobModal(job));

    return card;
}

// Modal View
function openJobModal(job) {
    const modal = document.getElementById('job-modal');
    const content = document.getElementById('modal-content');

    const score = Math.round(job.overallMatch);
    const minExp = job.requirements && job.requirements.experience ? job.requirements.experience.minYears : 0;
    const maxExp = job.requirements && job.requirements.experience ? job.requirements.experience.maxYears : 2;
    const locScore = job.breakdown ? Math.round(job.breakdown.location) : 100;
    const locDist = (job.breakdown && job.breakdown.locationDistanceKm !== undefined) ? job.breakdown.locationDistanceKm : -1;

    const missingList = (job.missingSkills && job.missingSkills.length > 0)
        ? job.missingSkills.map(s => `<li style="margin-bottom:6px;"><strong style="color:var(--danger);">${escapeHtml(s)}</strong> &mdash; Recommended to prepare project or certification.</li>`).join('')
        : `<li>None! You meet all required skills for this role! 🎉</li>`;

    let distExplanation = "Office located in candidate's home city (0 km travel).";
    if (job.location.toLowerCase().includes('remote')) {
        distExplanation = "100% remote opportunity — work from anywhere without relocation.";
    } else if (locDist > 0 && locDist <= 200) {
        distExplanation = `Nearby regional corridor (${locDist} km via transit). High proximity fit (${locScore}%).`;
    } else if (locDist > 200) {
        distExplanation = `Intercity corridor (${locDist} km shortest path via Dijkstra graph). Proximity fit (${locScore}%). Relocation may be supported.`;
    }

    content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; padding-right:30px;">
            <div>
                <h2 style="font-size:1.6rem; font-weight:800; color:var(--slate-900); margin-bottom:4px;">${escapeHtml(job.title)}</h2>
                <div style="font-size:1.1rem; color:var(--slate-600); font-weight:600;">${escapeHtml(job.company)} &bull; ${escapeHtml(job.location)}</div>
            </div>
            <div style="font-size:1.5rem; font-weight:800; color:var(--primary); background:var(--primary-light); padding:8px 16px; border-radius:var(--radius-lg);">
                ${score}% Match
            </div>
        </div>

        <div style="background:var(--slate-50); padding:16px 20px; border-radius:var(--radius-md); border:1px solid var(--slate-200); margin-bottom:20px;">
            <h4 style="font-size:0.9rem; font-weight:700; text-transform:uppercase; color:var(--slate-500); margin-bottom:8px;">Job Summary</h4>
            <p style="font-size:0.95rem; color:var(--slate-700); line-height:1.6;">${escapeHtml(job.description)}</p>
            <div style="margin-top:12px; font-size:0.88rem; color:var(--slate-600);">
                <strong>Experience Required:</strong> ${minExp} to ${maxExp} years
            </div>
        </div>

        <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:16px 20px; border-radius:var(--radius-md); margin-bottom:20px;">
            <h4 style="font-size:0.9rem; font-weight:700; text-transform:uppercase; color:#166534; margin-bottom:6px;">Location Proximity (Dijkstra Shortest Path)</h4>
            <p style="font-size:0.92rem; color:#14532d; line-height:1.5;">${distExplanation}</p>
        </div>

        <div style="margin-bottom:24px;">
            <h4 style="font-size:0.9rem; font-weight:700; text-transform:uppercase; color:var(--slate-500); margin-bottom:10px;">DSA Skill Gap Analysis</h4>
            <div style="background:var(--danger-bg); border:1px solid var(--danger-border); border-radius:var(--radius-md); padding:16px 20px;">
                <h5 style="font-size:0.95rem; font-weight:700; color:var(--danger-text); margin-bottom:8px;">To Reach 100% Match:</h5>
                <ul style="padding-left:20px; font-size:0.9rem; color:var(--slate-700);">
                    ${missingList}
                </ul>
            </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeJobModal()">Close</button>
            <button type="button" class="btn btn-primary" onclick="showToast('Application simulated for ${escapeHtml(job.company)}!', 'success'); closeJobModal();">Quick Apply</button>
        </div>
    `;

    modal.classList.add('open');
}

function closeJobModal() {
    const modal = document.getElementById('job-modal');
    modal.classList.remove('open');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Security / Helper Utils
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Expose globals for inline onclick handlers in HTML
window.quickAddSkill = quickAddSkill;
window.loadDemoProfile = loadDemoProfile;
window.closeJobModal = closeJobModal;
window.addCustomSkillFromInput = addCustomSkillFromInput;
