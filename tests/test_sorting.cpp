#include <iostream>
#include <cassert>
#include "../dsa/sorting.h"

void testSorting() {
    std::vector<MatchResult> results = {
        {1, "Job A", "C1", "L", "D", 65.0, {}, {}, true},
        {2, "Job B", "C2", "L", "D", 91.0, {}, {}, true},
        {3, "Job C", "C3", "L", "D", 78.0, {}, {}, true},
        {4, "Job D", "C4", "L", "D", 84.0, {}, {}, true}
    };

    Sorter::mergeSort(results);

    assert(results[0].title == "Job B");
    assert(results[1].title == "Job D");
    assert(results[2].title == "Job C");
    assert(results[3].title == "Job A");

    std::cout << "Standard sorting test passed!" << std::endl;
}

void testEqualScores() {
    std::vector<MatchResult> results = {
        {1, "Job Z", "C1", "L", "D", 80.0, {"s1"}, {}, true}, // 1 matched skill
        {2, "Job A", "C1", "L", "D", 80.0, {"s1", "s2"}, {}, true} // 2 matched skills
    };

    Sorter::mergeSort(results);

    // Should rank by number of matched skills (Job A first)
    assert(results[0].title == "Job A");
    assert(results[1].title == "Job Z");

    std::cout << "Equal scores test passed!" << std::endl;
}

int main() {
    testSorting();
    testEqualScores();
    std::cout << "All Sorting tests passed!" << std::endl;
    return 0;
}
