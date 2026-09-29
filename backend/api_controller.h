#ifndef API_CONTROLLER_H
#define API_CONTROLLER_H

#include "../backend/data_manager.h"
#include "../dsa/trie.h"
#include "../dsa/matcher.h"
#include "../dsa/sorting.h"
#include <string>

// The API Controller encapsulates the orchestration logic.
// It bridges the HTTP requests to the Application/Service layer and DSA layer.
class ApiController {
private:
    DataManager& dataManager;
    Trie& skillTrie;

public:
    ApiController(DataManager& dm, Trie& trie) : dataManager(dm), skillTrie(trie) {}

    // Processes candidate matching request
    std::string handleMatchRequest(const std::string& jsonInput);

    // Processes autocomplete request
    std::string handleAutocompleteRequest(const std::string& prefix);

    // Get all skills list
    std::string handleGetAllSkillsRequest();
};

#endif // API_CONTROLLER_H
