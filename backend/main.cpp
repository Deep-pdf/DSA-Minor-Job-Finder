#include "include/httplib.h"
#include "include/json.hpp"
#include "../backend/api_controller.h"
#include "../backend/data_manager.h"
#include "../dsa/trie.h"
#include <fstream>
#include <iostream>

using json = nlohmann::json;

void loadData(DataManager& dm, Trie& trie) {
    std::ifstream sfs("data/skills.json");
    json sjson; sfs >> sjson;
    for (auto& s : sjson["skills"]) trie.insert(s["name"]);

    std::ifstream jfs("data/jobs.json");
    json jjson; jfs >> jjson;
    for (auto& j : jjson["jobs"]) {
        ExperienceRange exp = {j["experienceRequired"]["minYears"], j["experienceRequired"]["maxYears"]};

        dm.addJob(Job(j["id"], j["title"], j["company"], j["location"],
                  j["requiredSkills"].get<std::vector<std::string>>(),
                  j["optionalSkills"].get<std::vector<std::string>>(),
                  exp,
                  j["educationRequired"].get<std::vector<std::string>>(),
                  j["certificationsPreferred"].get<std::vector<std::string>>(),
                  j["description"]));
    }
}

int main() {
    DataManager dm;
    Trie trie;
    loadData(dm, trie);
    ApiController controller(dm, trie);

    httplib::Server svr;
    svr.set_mount_point("/", "./frontend");

    svr.Post("/api/match", [&](const httplib::Request& req, httplib::Response& res) {
        res.set_content(controller.handleMatchRequest(req.body), "application/json");
    });

    svr.Get("/api/autocomplete", [&](const httplib::Request& req, httplib::Response& res) {
        res.set_content(controller.handleAutocompleteRequest(req.get_param_value("prefix")), "application/json");
    });

    std::cout << "Server starting on http://localhost:8080..." << std::endl;
    svr.listen("0.0.0.0", 8080);
    return 0;
}
