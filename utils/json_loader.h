#ifndef JSON_LOADER_H
#define JSON_LOADER_H

#include "../dsa/trie.h"
#include <fstream>
#include <string>
#include <iostream>

namespace JsonLoader {
    // Simple loader for skills.json
    // Finds "name": "..." entries without a full JSON parser
    void loadSkillsIntoTrie(const std::string& filepath, Trie& trie) {
        std::ifstream file(filepath);
        if (!file.is_open()) {
            std::cerr << "Error: Could not open " << filepath << std::endl;
            return;
        }

        std::string line;
        while (std::getline(file, line)) {
            size_t namePos = line.find("\"name\": \"");
            if (namePos != std::string::npos) {
                size_t start = namePos + 9;
                size_t end = line.find("\"", start);
                if (end != std::string::npos) {
                    std::string skill = line.substr(start, end - start);
                    trie.insert(skill);
                }
            }
        }
    }
}

#endif // JSON_LOADER_H
