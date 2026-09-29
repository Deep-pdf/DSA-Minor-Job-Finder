#include <iostream>
#include <cassert>
#include <vector>
#include "../dsa/hashset.h"
#include "../dsa/matcher.h"
#include "../dsa/sorting.h"
#include "../dsa/trie.h"

// Helper to run all tests
void runAllTests() {
    // 1. Hashing Tests
    std::cout << "Testing Hashing..." << std::endl;
    HashSet hs;
    hs.insert("C++");
    hs.insert("C++"); // Duplicate
    assert(hs.contains("c++"));
    assert(!hs.contains("Docker"));

    // 2. Trie Tests
    std::cout << "Testing Trie..." << std::endl;
    Trie trie;
    trie.insert("Python");
    trie.insert("PySpark");
    std::vector<std::string> suggestions = trie.autocomplete("py");
    assert(suggestions.size() == 2);
    assert(!trie.searchExact("Java"));

    // 3. Matcher Tests
    std::cout << "Testing Matcher..." << std::endl;
    Candidate c(1, "Name", "Ed", {"C++", "DSA"}, 2, {});
    Job j(1, "Title", "Comp", {"C++", "DSA", "Docker"}, {}, 1, 3, "Loc", "Desc");
    MatchResult r = Matcher::calculateMatch(c, j);
    assert(std::abs(r.match_percentage - 66.666) < 0.1);

    // 4. Sorting Tests
    std::cout << "Testing Merge Sort..." << std::endl;
    std::vector<MatchResult> results = {
        {1, "A", "C1", "L", "D", 50.0, {}, {}, true},
        {2, "B", "C2", "L", "D", 90.0, {}, {}, true}
    };
    Sorter::mergeSort(results);
    assert(results[0].company == "C2"); // 90% should be first

    std::cout << "All tests passed!" << std::endl;
}

int main() {
    runAllTests();
    return 0;
}
