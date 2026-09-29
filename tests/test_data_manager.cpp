#include <iostream>
#include <cassert>
#include "../utils/validation.h"
#include "../backend/data_manager.h"

void testValidation() {
    std::cout << "Running validation tests..." << std::endl;

    // Valid Candidate
    Candidate validC(1, "Rahul", "B.Tech", {"C++", "DSA"}, 2, {});
    assert(Validator::isValid(validC) == true);

    // Invalid Candidate (empty name)
    Candidate invalidC(2, "", "B.Tech", {"C++"}, 1, {});
    assert(Validator::isValid(invalidC) == false);

    // Valid Job
    Job validJ(1, "Dev", "Company", {"C++"}, {}, 0, 2, "Remote", "Desc");
    assert(Validator::isValid(validJ) == true);

    // Invalid Job (empty skills)
    Job invalidJ(2, "Dev", "Company", {}, {}, 0, 2, "Remote", "Desc");
    assert(Validator::isValid(invalidJ) == false);

    std::cout << "Validation tests passed!" << std::endl;
}

void testDataManager() {
    std::cout << "Running DataManager tests..." << std::endl;
    DataManager dm;

    // Add Job
    Job j1(1, "Dev", "Company", {"C++"}, {}, 0, 2, "Remote", "Desc");
    assert(dm.addJob(j1) == true);
    assert(dm.getJobs().size() == 1);

    // Add Candidate
    Candidate c1(1, "Rahul", "B.Tech", {"C++"}, 1, {});
    assert(dm.addCandidate(c1) == true);
    assert(dm.getCandidates().size() == 1);

    std::cout << "DataManager tests passed!" << std::endl;
}

int main() {
    testValidation();
    testDataManager();
    std::cout << "All Phase 3 tests passed!" << std::endl;
    return 0;
}
