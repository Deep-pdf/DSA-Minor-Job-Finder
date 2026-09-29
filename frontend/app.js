let selectedSkills = [];
let focusedIndex = -1;

const inputField = document.getElementById('skill-input');
const autocompleteList = document.getElementById('autocomplete-list');

inputField.addEventListener('input', async (e) => {
    const val = e.target.value;
    focusedIndex = -1;
    if (val.length < 1) {
        autocompleteList.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`/api/autocomplete?prefix=${encodeURIComponent(val)}`);
        const data = await res.json();

        autocompleteList.innerHTML = '';
        if (data.suggestions && Array.isArray(data.suggestions)) {
            data.suggestions.forEach((s, index) => {
                const div = document.createElement('div');
                div.textContent = s;
                div.className = 'autocomplete-item';
                div.dataset.index = index;
                div.onclick = () => selectSkill(s);
                autocompleteList.appendChild(div);
            });
        }
    } catch (err) { console.error("Fetch error:", err); }
});

inputField.addEventListener('keydown', (e) => {
    const items = document.querySelectorAll('.autocomplete-item');
    if (items.length === 0) return;
    if (e.key === 'ArrowDown') {
        focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
        updateFocus(items);
    } else if (e.key === 'ArrowUp') {
        focusedIndex = Math.max(focusedIndex - 1, 0);
        updateFocus(items);
    } else if (e.key === 'Enter' && focusedIndex >= 0) {
        items[focusedIndex].click();
        e.preventDefault();
    }
});

function updateFocus(items) {
    items.forEach((item, index) => {
        item.style.backgroundColor = index === focusedIndex ? '#ddd' : '';
    });
}

function selectSkill(s) {
    selectedSkills.push(s);
    document.getElementById('skills-list').innerHTML += `<span class="skill-tag">${s}</span>`;
    autocompleteList.innerHTML = '';
    inputField.value = '';
    focusedIndex = -1;
}

document.getElementById('match-btn').addEventListener('click', async () => {
    const candidateData = {
        name: document.getElementById('name').value,
        education: { degree: document.getElementById('education').value, field: "Computer Science", institution: "Example", graduationYear: 2027 },
        experienceYears: parseFloat(document.getElementById('experience').value),
        skills: selectedSkills,
        location: "Bengaluru, India"
    };

    try {
        const res = await fetch('/api/match', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidateData)
        });
        const data = await res.json();

        const jobCards = document.getElementById('job-cards');
        jobCards.innerHTML = '';

        if (data.results && Array.isArray(data.results)) {
            data.results.forEach(job => {
                jobCards.innerHTML += `
                    <div class="job-card">
                        <h3>${job.title} at ${job.company}</h3>
                        <p>Location: ${job.location}</p>
                        <div class="match-score">${job.overallMatch}% Match</div>
                        <p>Skills Match: ${job.breakdown.skills}%</p>
                    </div>
                `;
            });
        }
    } catch (err) { console.error("Match error:", err); }
});
