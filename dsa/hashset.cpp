#include "hashset.h"

HashSet::HashSet() {}

int HashSet::hash(const std::string& key) const {
    unsigned long hashValue = 0;
    for (char c : key) {
        hashValue = hashValue * 31 + c; // Use 31 as a small prime multiplier
    }
    return hashValue % BUCKET_COUNT;
}

void HashSet::insert(const std::string& key) {
    std::string normalized = StringUtils::toLowerCase(key);
    int h = hash(normalized);

    // Check if already present to prevent duplicates (as per requirements)
    for (const auto& item : table[h]) {
        if (item == normalized) return;
    }

    table[h].push_back(normalized);
}

bool HashSet::contains(const std::string& key) const {
    std::string normalized = StringUtils::toLowerCase(key);
    int h = hash(normalized);

    for (const auto& item : table[h]) {
        if (item == normalized) return true;
    }
    return false;
}
