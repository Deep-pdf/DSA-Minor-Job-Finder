#include <iostream>
#include <cassert>
#include <cmath>
#include "../dsa/matcher.h"

void test(const std::string& name, const MatchResult& r, double expectedScore) {
    if (std::abs(r.match_percentage - expectedScore) < 0.001) {
        std::cout << "PASS: " << name << " (" << r.match_percentage << "%)" << std::endl;
    } else {
        std::cerr << "FAIL: " << name << " Expected " << expectedScore << "%, Got " << r.match_percentage << "%" << std::endl;
        exit(1);
    }
}

int main() {
    // 1. 100% Match
    Candidate c1(1, "R", "B", {"C++", "DSA"}, 1, {});
    Job j1(1, "T", "C", {"C++", "DSA"}, {}, 0, 2, "L", "D");
    test("100% Match", Matcher::calculateMatch(c1, j1), 100.0);

    // 2. 80% Match
    Candidate c2(1, "R", "B", {"C++", "DSA", "SQL", "Git"}, 1, {});
    Job j2(2, "T", "C", {"C++", "DSA", "SQL", "Git", "Docker"}, {}, 0, 2, "L", "D");
    test("80% Match", Matcher::calculateMatch(c2, j2), 80.0);

    // 3. 0% Match
    Candidate c3(1, "R", "B", {"Python"}, 1, {});
    Job j3(3, "T", "C", {"C++", "Docker"}, {}, 0, 2, "L", "D");
    test("0% Match", Matcher::calculateMatch(c3, j3), 0.0);

    // 4. Case Independence
    Candidate c4(1, "R", "B", {"c++"}, 1, {});
    Job j4(4, "T", "C", {"C++"}, {}, 0, 2, "L", "D");
    test("Case Insensitivity", Matcher::calculateMatch(c4, j4), 100.0);

    // 5. Empty Candidate Skills
    Candidate c5(1, "R", "B", {}, 1, {});
    Job j5(5, "T", "C", {"Git"}, {}, 0, 2, "L", "D");
    test("Empty Candidate", Matcher::calculateMatch(c5, j5), 0.0);

    // 6. No Required Job Skills (Edge Case)
    Candidate c6(1, "R", "B", {"Python"}, 1, {});
    Job j6(6, "T", "C", {}, {}, 0, 2, "L", "D");
    test("No Required Skills", Matcher::calculateMatch(c6, j6), 100.0);

    std::cout << "All Matcher tests passed!" << std::endl;
    return 0;
}
