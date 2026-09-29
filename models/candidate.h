#ifndef CANDIDATE_H
#define CANDIDATE_H

#include <string>
#include <vector>

struct Education {
    std::string degree;
    std::string field;
    std::string institution;
    int graduationYear;
};

// Represents a job-seeking candidate.
struct Candidate {
    int id;
    std::string name;
    Education education;
    std::vector<std::string> skills;
    double experienceYears;
    std::vector<std::string> certifications;
    std::string location;

    Candidate()
        : id(0), name(""), education({"", "", "", 0}), skills({}), experienceYears(0.0), certifications({}), location("") {}

    Candidate(int id,
              const std::string& name,
              const Education& education,
              const std::vector<std::string>& skills,
              double experienceYears,
              const std::vector<std::string>& certifications,
              const std::string& location)
        : id(id),
          name(name),
          education(education),
          skills(skills),
          experienceYears(experienceYears),
          certifications(certifications),
          location(location) {}
};

#endif // CANDIDATE_H
