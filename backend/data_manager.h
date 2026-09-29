#ifndef DATA_MANAGER_H
#define DATA_MANAGER_H

#include "../models/candidate.h"
#include "../models/job.h"
#include "../utils/validation.h"
#include <vector>
#include <optional>
#include <algorithm>

// Manages collections of Jobs and Candidates in memory.
class DataManager {
private:
    std::vector<Job> jobs;
    std::vector<Candidate> candidates;

public:
    // --- Job Operations ---
    bool addJob(const Job& job) {
        if (!Validator::isValid(job)) return false;
        jobs.push_back(job);
        return true;
    }

    const std::vector<Job>& getJobs() const { return jobs; }

    // --- Candidate Operations ---
    bool addCandidate(const Candidate& candidate) {
        if (!Validator::isValid(candidate)) return false;
        candidates.push_back(candidate);
        return true;
    }

    const std::vector<Candidate>& getCandidates() const { return candidates; }

    // Update exists for future use when we implement persistence or GUI edits
    bool updateCandidate(int id, const Candidate& updatedCandidate) {
        auto it = std::find_if(candidates.begin(), candidates.end(), [id](const Candidate& c) { return c.id == id; });
        if (it != candidates.end() && Validator::isValid(updatedCandidate)) {
            *it = updatedCandidate;
            return true;
        }
        return false;
    }
};

#endif // DATA_MANAGER_H
