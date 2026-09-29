#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <unordered_map>
#include <vector>
#include "../utils/string_utils.h"

// Trie Node for Autocomplete support
struct TrieNode {
    std::unordered_map<char, TrieNode*> children;
    bool isEndOfWord;
    std::string canonicalWord; // Stores original name, e.g., "Python"

    TrieNode() : isEndOfWord(false), canonicalWord("") {}

    // Destructor to clean up children
    ~TrieNode() {
        for (auto& pair : children) {
            delete pair.second;
        }
    }
};

class Trie {
private:
    TrieNode* root;

    // Helper for autocomplete DFS
    void collectWords(TrieNode* node, std::vector<std::string>& results) const;

public:
    Trie();
    ~Trie();

    void insert(const std::string& skillName);
    bool searchExact(const std::string& skillName) const;
    std::vector<std::string> autocomplete(const std::string& prefix) const;
};

#endif // TRIE_H
