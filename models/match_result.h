#ifndef MATCH_RESULT_H
#define MATCH_RESULT_H

#include <string>
#include <vector>
#include <map>

struct MatchResult {
    std::string jobId;
    std::string title;
    std::string company;
    std::string location;
    std::string description;

    double overallMatch;
    std::string matchCategory; // "high", "medium", "low"

    struct Breakdown {
        double skills;
        double experience;
        double education;
        double certifications;
        double location;
        double locationDistanceKm;
    } breakdown;

    struct CandidateInfo {
        std::string name;
        double experienceYears;
        std::string education;
        std::string location;
    } candidate;

    struct Requirements {
        std::vector<std::string> requiredSkills;
        struct { int minYears; int maxYears; } experience;
        std::vector<std::string> education;
        std::vector<std::string> certifications;
        std::string location;
    } requirements;

    std::vector<std::string> matchedSkills;
    std::vector<std::string> missingSkills;
    std::vector<std::string> optionalMatchedSkills;
    std::vector<std::string> candidateCertifications;
    std::vector<std::string> matchedCertifications;
    std::vector<std::string> missingCertifications;

    MatchResult() : jobId(""), title(""), company(""), location(""), description(""),
                    overallMatch(0.0), matchCategory("low") {}
};

#endif // MATCH_RESULT_H
