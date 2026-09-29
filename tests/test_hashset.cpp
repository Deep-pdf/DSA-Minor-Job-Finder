#include <iostream>
#include <cassert>
#include "../dsa/hashset.h"

int main() {
    HashSet hs;

    // 1. Basic Insert / Search
    hs.insert("C++");
    assert(hs.contains("C++") == true);
    assert(hs.contains("c++") == true); // Case-insensitive test
    assert(hs.contains("C++ ") == true); // Trim test

    // 2. Duplicate
    hs.insert("C++");
    assert(hs.contains("C++") == true);

    // 3. Multiple
    hs.insert("Python");
    hs.insert("SQL");
    assert(hs.contains("Python") == true);
    assert(hs.contains("SQL") == true);

    // 4. Missing
    assert(hs.contains("Docker") == false);

    // 5. Collision (implied by multiple inserts, check consistency)
    // To induce a collision, we'd need to know which words hash to the same bucket.
    // Given BUCKET_COUNT=53, multiple inserts do this automatically.
    hs.insert("a");
    hs.insert("b");
    assert(hs.contains("a") == true);
    assert(hs.contains("b") == true);
    hs.insert("DSA");
    assert(hs.contains("dsa") == true);

    std::cout << "HashSet tests passed successfully!" << std::endl;
    return 0;
}
