#include "api_controller.h"
#include <iostream>
#include <sstream>
#include <cmath>
#include "include/json.hpp"
#include "../dsa/matcher.h"
#include "../dsa/sorting.h"

using json = nlohmann::json;

std::string ApiController::handleMatchRequest(const std::string& jsonInput) {
    try {
        auto j = json::parse(jsonInput);

        std::vector<std::string> candSkills;
        if (j.contains("skills") && j["skills"].is_array()) {
            for (const auto& s : j["skills"]) candSkills.push_back(s.get<std::string>());
        }

        std::vector<std::string> candCerts;
        if (j.contains("certifications") && j["certifications"].is_array()) {
            for (const auto& s : j["certifications"]) candCerts.push_back(s.get<std::string>());
        }

        Education edu = {
            j["education"].value("degree", ""),
            j["education"].value("field", ""),
            j["education"].value("institution", ""),
            j["education"].value("graduationYear", 0)
        };

        Candidate candidate(1, j.value("name", "Unknown"), edu, candSkills,
                            j.value("experienceYears", 0.0), candCerts, j.value("location", ""));

        std::vector<MatchResult> results;
        for (const auto& job : dataManager.getJobs()) {
            results.push_back(Matcher::calculateMatch(candidate, job));
        }

        Sorter::mergeSort(results);

        json response;
        response["results"] = json::array();

        for (const auto& r : results) {
            json jobJson;
            jobJson["jobId"] = r.jobId;
            jobJson["title"] = r.title;
            jobJson["company"] = r.company;
            jobJson["location"] = r.location;
            jobJson["description"] = r.description;
            jobJson["overallMatch"] = r.overallMatch;
            jobJson["matchCategory"] = r.matchCategory;

            jobJson["breakdown"] = {
                {"skills", r.breakdown.skills},
                {"experience", r.breakdown.experience},
                {"education", r.breakdown.education},
                {"certifications", r.breakdown.certifications},
                {"location", r.breakdown.location}
            };

            jobJson["candidate"] = {
                {"name", r.candidate.name},
                {"experienceYears", r.candidate.experienceYears},
                {"education", r.candidate.education},
                {"location", r.candidate.location}
            };

            jobJson["requirements"] = {
                {"requiredSkills", r.requirements.requiredSkills},
                {"experience", {{"minYears", r.requirements.experience.minYears}, {"maxYears", r.requirements.experience.maxYears}}},
                {"education", r.requirements.education},
                {"certifications", r.requirements.certifications},
                {"location", r.requirements.location}
            };

            jobJson["matchedSkills"] = r.matchedSkills;
            jobJson["missingSkills"] = r.missingSkills;
            jobJson["optionalMatchedSkills"] = r.optionalMatchedSkills;
            jobJson["candidateCertifications"] = r.candidateCertifications;
            jobJson["matchedCertifications"] = r.matchedCertifications;
            jobJson["missingCertifications"] = r.missingCertifications;

            response["results"].push_back(jobJson);
        }

        return response.dump();

    } catch (const std::exception& e) {
        return "{\"error\": \"Invalid request: " + std::string(e.what()) + "\"}";
    }
}

std::string ApiController::handleAutocompleteRequest(const std::string& prefix) {
    auto suggestions = skillTrie.autocomplete(prefix);
    json response;
    response["suggestions"] = suggestions;
    return response.dump();
}

std::string ApiController::handleGetAllSkillsRequest() {
    return "{\"skills\": [\"C++\", \"DSA\", \"Python\", \"SQL\", \"Git\"]}";
}
