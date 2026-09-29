#ifndef JOB_H
#define JOB_H

#include <string>
#include <vector>

struct ExperienceRange {
    int minYears;
    int maxYears;
};

// Represents a job posting loaded from jobs.json.
struct Job {
    std::string id;
    std::string title;
    std::string company;
    std::string location;
    std::vector<std::string> requiredSkills;
    std::vector<std::string> optionalSkills;
    ExperienceRange experienceRequired;
    std::vector<std::string> educationRequired;
    std::vector<std::string> certificationsPreferred;
    std::string description;

    Job() : id(""), title(""), company(""), location(""),
            experienceRequired({0, 0}), description("") {}

    Job(std::string id, std::string title, std::string company, std::string location,
        std::vector<std::string> req, std::vector<std::string> opt,
        ExperienceRange exp, std::vector<std::string> edu, std::vector<std::string> cert, std::string desc)
        : id(id), title(title), company(company), location(location),
          requiredSkills(req), optionalSkills(opt),
          experienceRequired(exp), educationRequired(edu), certificationsPreferred(cert),
          description(desc) {}
};

#endif // JOB_H
