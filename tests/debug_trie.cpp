#include <iostream>
#include <vector>
#include "../dsa/trie.h"
#include <fstream>
#include "../backend/include/json.hpp"

using json = nlohmann::json;

int main() {
    Trie trie;

    // Mimic loadData logic from main.cpp
    std::ifstream sfs("data/skills.json");
    if (!sfs.is_open()) {
        std::cerr << "Failed to open skills.json" << std::endl;
        return 1;
    }
    json sjson; sfs >> sjson;
    for (auto& s : sjson["skills"]) {
        std::string name = s["name"];
        trie.insert(name);
    }

    // Manual test
    std::vector<std::string> suggestions = trie.autocomplete("py");
    std::cout << "Suggestions for 'py': " << suggestions.size() << std::endl;
    for (const auto& s : suggestions) std::cout << "- " << s << std::endl;

    return 0;
}
