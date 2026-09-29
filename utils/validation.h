#ifndef VALIDATION_H
#define VALIDATION_H

#include "../models/candidate.h"
#include "../models/job.h"
#include <vector>
#include <string>
#include <algorithm>

namespace Validator {
    inline bool isValid(const Candidate& candidate) {
        if (candidate.name.empty()) return false;
        if (candidate.skills.empty()) return false;
        return true;
    }

    inline bool isValid(const Job& job) {
        if (job.title.empty()) return false;
        if (job.company.empty()) return false;
        if (job.requiredSkills.empty()) return false;
        return true;
    }
}

#endif // VALIDATION_H
