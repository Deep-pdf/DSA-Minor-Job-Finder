#include "trie.h"

Trie::Trie() {
    root = new TrieNode();
}

Trie::~Trie() {
    delete root;
}

void Trie::insert(const std::string& skillName) {
    TrieNode* curr = root;
    std::string normalized = StringUtils::toLowerCase(skillName);

    for (char c : normalized) {
        if (curr->children.find(c) == curr->children.end()) {
            curr->children[c] = new TrieNode();
        }
        curr = curr->children[c];
    }
    curr->isEndOfWord = true;
    curr->canonicalWord = skillName; // Store original casing
}

bool Trie::searchExact(const std::string& skillName) const {
    TrieNode* curr = root;
    std::string normalized = StringUtils::toLowerCase(skillName);

    for (char c : normalized) {
        if (curr->children.find(c) == curr->children.end()) {
            return false;
        }
        curr = curr->children[c];
    }
    return curr->isEndOfWord;
}

void Trie::collectWords(TrieNode* node, std::vector<std::string>& results) const {
    if (node->isEndOfWord) {
        results.push_back(node->canonicalWord);
    }
    for (auto const& [key, childNode] : node->children) {
        collectWords(childNode, results);
    }
}

std::vector<std::string> Trie::autocomplete(const std::string& prefix) const {
    TrieNode* curr = root;
    std::string normalized = StringUtils::toLowerCase(prefix);
    std::vector<std::string> results;

    for (char c : normalized) {
        if (curr->children.find(c) == curr->children.end()) {
            return results; // Return empty
        }
        curr = curr->children[c];
    }

    collectWords(curr, results);
    return results;
}
