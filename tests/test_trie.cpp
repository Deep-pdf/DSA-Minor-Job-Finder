#include <iostream>
#include <cassert>
#include "../dsa/trie.h"
#include "../utils/json_loader.h"

int main() {
    Trie trie;

    // Phase 1: Manual Insert/Search
    trie.insert("Python");
    trie.insert("PyTorch");
    trie.insert("PySpark");
    trie.insert("C++");

    assert(trie.searchExact("python") == true); // Case-insensitive
    assert(trie.searchExact("C++") == true);
    assert(trie.searchExact("Java") == false);

    // Phase 2: Autocomplete
    std::vector<std::string> suggestions = trie.autocomplete("py");
    assert(suggestions.size() == 3);

    // Phase 3: Load from JSON
    Trie jsonTrie;
    JsonLoader::loadSkillsIntoTrie("data/skills.json", jsonTrie);
    assert(jsonTrie.searchExact("C++") == true);
    assert(jsonTrie.searchExact("JavaScript") == true);

    std::cout << "All Trie tests passed!" << std::endl;
    return 0;
}
