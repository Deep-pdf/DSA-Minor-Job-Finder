#include "matcher.h"
#include <cmath>
#include <algorithm>

// Weight configuration
const double WEIGHT_SKILLS = 0.60;
const double WEIGHT_EXPERIENCE = 0.15;
const double WEIGHT_EDUCATION = 0.10;
const double WEIGHT_CERTIFICATIONS = 0.10;
const double WEIGHT_LOCATION = 0.05;

MatchResult Matcher::calculateMatch(const Candidate& candidate, const Job& job) {
    MatchResult result;
    result.jobId = job.id;
    result.title = job.title;
    result.company = job.company;
    result.location = job.location;
    result.description = job.description;

    result.candidate.name = candidate.name;
    result.candidate.experienceYears = candidate.experienceYears;
    result.candidate.education = candidate.education.degree + " in " + candidate.education.field;
    result.candidate.location = candidate.location;

    result.requirements.requiredSkills = job.requiredSkills;
    result.requirements.experience = {job.experienceRequired.minYears, job.experienceRequired.maxYears};
    result.requirements.education = job.educationRequired;
    result.requirements.certifications = job.certificationsPreferred;
    result.requirements.location = job.location;

    // 1. Skill Score (60%)
    HashSet candidateSkillsHash;
    for (const auto& skill : candidate.skills) candidateSkillsHash.insert(skill);

    int matchedCount = 0;
    if (!job.requiredSkills.empty()) {
        for (const auto& skill : job.requiredSkills) {
            if (candidateSkillsHash.contains(skill)) {
                matchedCount++;
                result.matchedSkills.push_back(skill);
            } else {
                result.missingSkills.push_back(skill);
            }
        }
        result.breakdown.skills = (static_cast<double>(matchedCount) / job.requiredSkills.size()) * 100.0;
    } else {
        result.breakdown.skills = 100.0;
    }

    // Optional Skills
    for (const auto& skill : job.optionalSkills) {
        if (candidateSkillsHash.contains(skill)) {
            result.optionalMatchedSkills.push_back(skill);
        }
    }

    // 2. Experience Score (15%)
    if (job.experienceRequired.minYears == 0) {
        result.breakdown.experience = 100.0;
    } else {
        result.breakdown.experience = std::min(100.0, (candidate.experienceYears / job.experienceRequired.minYears) * 100.0);
    }

    // 3. Education Score (10%)
    bool eduMatch = false;
    for (const auto& eduReq : job.educationRequired) {
        if (eduReq == candidate.education.degree + " " + candidate.education.field) {
            eduMatch = true;
            break;
        }
    }
    result.breakdown.education = eduMatch ? 100.0 : 0.0;

    // 4. Certification Score (10%)
    if (job.certificationsPreferred.empty()) {
        result.breakdown.certifications = 100.0;
    } else {
        int certMatched = 0;
        for (const auto& cert : job.certificationsPreferred) {
            auto it = std::find(candidate.certifications.begin(), candidate.certifications.end(), cert);
            if (it != candidate.certifications.end()) {
                certMatched++;
                result.matchedCertifications.push_back(cert);
            } else {
                result.missingCertifications.push_back(cert);
            }
        }
        result.breakdown.certifications = (static_cast<double>(certMatched) / job.certificationsPreferred.size()) * 100.0;
    }
    result.candidateCertifications = candidate.certifications;

    // 5. Location Score (5%)
    // Deterministic matching: Simple string comparison for now.
    if (job.location == "Remote" || job.location == candidate.location) {
        result.breakdown.location = 100.0;
    } else {
        // Simple heuristic: same city? (if location is "City, India")
        // Just checking equality for now as per requirements: "100 if same city, 50 if different".
        // The requirements say: Same city 100, Same state/region 75, Different 50.
        // With current data "City, India", we only have City resolution.
        // Let's stick to 100 for same, 50 for different.
        result.breakdown.location = 50.0;
    }

    // Final Score
    result.overallMatch = (result.breakdown.skills * WEIGHT_SKILLS) +
                          (result.breakdown.experience * WEIGHT_EXPERIENCE) +
                          (result.breakdown.education * WEIGHT_EDUCATION) +
                          (result.breakdown.certifications * WEIGHT_CERTIFICATIONS) +
                          (result.breakdown.location * WEIGHT_LOCATION);

    result.overallMatch = std::round(result.overallMatch * 10.0) / 10.0;

    if (result.overallMatch >= 80.0) result.matchCategory = "high";
    else if (result.overallMatch >= 60.0) result.matchCategory = "medium";
    else result.matchCategory = "low";

    return result;
}
