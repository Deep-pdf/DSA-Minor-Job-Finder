#ifndef HASHSET_H
#define HASHSET_H

#include <vector>
#include <string>
#include "../utils/string_utils.h"

// HashSet implementation using Separate Chaining.
class HashSet {
private:
    static const int BUCKET_COUNT = 53; // Prime number
    std::vector<std::string> table[BUCKET_COUNT];

    // Polynomial rolling hash function
    int hash(const std::string& key) const;

public:
    HashSet();
    void insert(const std::string& key);
    bool contains(const std::string& key) const;
};

#endif // HASHSET_H
