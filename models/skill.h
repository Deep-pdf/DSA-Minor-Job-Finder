#ifndef SKILL_H
#define SKILL_H

#include <string>

// Represents a single skill in the system.
// Used by the Trie (autocomplete) and HashSet (lookup).
// The canonical name preserves the original casing for display;
// all comparisons use the lowercase form.
struct Skill {
    std::string name;       // display name, e.g. "C++"
    std::string category;   // e.g. "Programming Language", "Tool", "Concept"

    Skill() : name(""), category("") {}

    Skill(const std::string& name, const std::string& category)
        : name(name), category(category) {}
};

#endif // SKILL_H
