#include "city_graph.h"
#include <queue>
#include <limits>
#include <algorithm>
#include <cctype>

CityGraph::CityGraph() {
    initializeGraph();
}

void CityGraph::addEdge(const std::string& u, const std::string& v, double weightKm) {
    adjList[u].push_back({v, weightKm});
    adjList[v].push_back({u, weightKm});
}

void CityGraph::initializeGraph() {
    // Inter-city road/rail transit distances (in kilometers) between major Indian tech hubs
    addEdge("noida", "gurgaon", 50.0);
    addEdge("mumbai", "pune", 150.0);
    addEdge("bengaluru", "chennai", 350.0);
    addEdge("pune", "hyderabad", 560.0);
    addEdge("bengaluru", "hyderabad", 570.0);
    addEdge("chennai", "hyderabad", 630.0);
    addEdge("mumbai", "hyderabad", 710.0);
    addEdge("bengaluru", "pune", 840.0);
    addEdge("gurgaon", "mumbai", 1380.0);
    addEdge("noida", "mumbai", 1420.0);
    addEdge("hyderabad", "noida", 1550.0);
    addEdge("bengaluru", "noida", 2150.0);
    addEdge("chennai", "noida", 2180.0);
}

std::string CityGraph::normalizeCity(const std::string& location) {
    std::string s = location;
    // Lowercase
    std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c) {
        return std::tolower(c);
    });

    // Strip trailing country info if present (e.g., ", india")
    size_t commaPos = s.find(',');
    if (commaPos != std::string::npos) {
        s = s.substr(0, commaPos);
    }

    // Trim whitespace
    size_t first = s.find_first_not_of(" \t\n\r");
    if (first == std::string::npos) return "";
    size_t last = s.find_last_not_of(" \t\n\r");
    s = s.substr(first, (last - first + 1));

    // Handle common city aliases
    if (s == "bangalore") s = "bengaluru";
    if (s == "delhi" || s == "new delhi") s = "noida";
    if (s == "gurugram") s = "gurgaon";
    if (s == "bombay") s = "mumbai";
    if (s == "madras") s = "chennai";

    return s;
}

double CityGraph::getShortestDistance(const std::string& fromCity, const std::string& toCity) const {
    std::string start = normalizeCity(fromCity);
    std::string target = normalizeCity(toCity);

    if (start.empty() || target.empty()) return -1.0;
    if (start == target) return 0.0;

    // Check if start exists in graph
    if (adjList.find(start) == adjList.end() || adjList.find(target) == adjList.end()) {
        return -1.0; // Unreachable or unknown city
    }

    // Min-Priority Queue for Dijkstra: pair<distance, city>
    using P = std::pair<double, std::string>;
    std::priority_queue<P, std::vector<P>, std::greater<P>> pq;

    std::unordered_map<std::string, double> dist;
    for (const auto& pair : adjList) {
        dist[pair.first] = std::numeric_limits<double>::infinity();
    }

    dist[start] = 0.0;
    pq.push({0.0, start});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();

        if (d > dist[u]) continue;
        if (u == target) return d;

        auto it = adjList.find(u);
        if (it == adjList.end()) continue;

        for (const auto& edge : it->second) {
            const std::string& v = edge.first;
            double weight = edge.second;

            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.push({dist[v], v});
            }
        }
    }

    return (dist[target] == std::numeric_limits<double>::infinity()) ? -1.0 : dist[target];
}

std::pair<double, double> CityGraph::calculateLocationScoreAndDistance(const std::string& candidateLoc,
                                                                      const std::string& jobLoc) const {
    std::string cCity = normalizeCity(candidateLoc);
    std::string jCity = normalizeCity(jobLoc);

    // Remote work is 100% fit regardless of candidate location
    if (jCity == "remote") {
        return {100.0, 0.0};
    }

    // Exact city match
    if (cCity == jCity && !cCity.empty()) {
        return {100.0, 0.0};
    }

    double distance = getShortestDistance(cCity, jCity);

    // Score gradation based on Dijkstra shortest path transit distance:
    if (distance < 0.0) {
        // Disconnected or unknown city: default to moderate baseline
        return {40.0, -1.0};
    }

    if (distance <= 0.0) {
        return {100.0, 0.0};
    } else if (distance <= 200.0) {
        // Direct adjacent/metro region (e.g. Pune <-> Mumbai, Noida <-> Gurgaon)
        return {90.0, distance};
    } else if (distance <= 700.0) {
        // Interstate regional tech hub (e.g. Bengaluru <-> Chennai, Bengaluru <-> Hyderabad)
        return {75.0, distance};
    } else if (distance <= 1200.0) {
        // Moderate distance (e.g. Bengaluru <-> Pune)
        return {55.0, distance};
    } else {
        // Long distance (e.g. Bengaluru <-> Noida, Chennai <-> Noida)
        return {40.0, distance};
    }
}
