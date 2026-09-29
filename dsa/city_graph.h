#ifndef CITY_GRAPH_H
#define CITY_GRAPH_H

#include <string>
#include <vector>
#include <unordered_map>
#include <utility>

/**
 * CityGraph represents a weighted undirected graph of tech hub cities.
 * Uses Dijkstra's algorithm (min-priority queue) to calculate shortest transit
 * distances between candidate and job locations, determining accurate location proximity fit.
 */
class CityGraph {
private:
    // Adjacency List: city -> vector of (neighbor, distance_in_km)
    std::unordered_map<std::string, std::vector<std::pair<std::string, double>>> adjList;

    void initializeGraph();

public:
    CityGraph();

    // Add an undirected weighted edge between two cities
    void addEdge(const std::string& u, const std::string& v, double weightKm);

    // Standardize city string (lowercase, handle aliases like Bangalore -> Bengaluru)
    static std::string normalizeCity(const std::string& location);

    // Dijkstra's Shortest Path Algorithm
    // Time Complexity: O((V + E) log V) using min-heap
    double getShortestDistance(const std::string& fromCity, const std::string& toCity) const;

    // Calculates proximity score [0-100] and distance in km
    // Returns pair: {proximityScore, distanceKm}
    std::pair<double, double> calculateLocationScoreAndDistance(const std::string& candidateLoc,
                                                               const std::string& jobLoc) const;
};

#endif // CITY_GRAPH_H
