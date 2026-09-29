#include <iostream>
#include <cassert>
#include <cmath>
#include "../dsa/city_graph.h"

void testDistance(const CityGraph& graph, const std::string& u, const std::string& v, double expectedKm) {
    double d = graph.getShortestDistance(u, v);
    if (std::abs(d - expectedKm) < 0.001) {
        std::cout << "[PASS] Distance " << u << " <-> " << v << " = " << d << " km" << std::endl;
    } else {
        std::cerr << "[FAIL] Distance " << u << " <-> " << v << " Expected " << expectedKm << ", Got " << d << std::endl;
        exit(1);
    }
}

void testScore(const CityGraph& graph, const std::string& candLoc, const std::string& jobLoc,
               double expectedScore, double expectedDist) {
    auto [score, dist] = graph.calculateLocationScoreAndDistance(candLoc, jobLoc);
    bool scoreOk = std::abs(score - expectedScore) < 0.001;
    bool distOk = (expectedDist < 0 && dist < 0) || std::abs(dist - expectedDist) < 0.001;

    if (scoreOk && distOk) {
        std::cout << "[PASS] Score (" << candLoc << " -> " << jobLoc << "): " 
                  << score << "% (" << dist << " km)" << std::endl;
    } else {
        std::cerr << "[FAIL] Score (" << candLoc << " -> " << jobLoc 
                  << ") Expected score=" << expectedScore << ", dist=" << expectedDist
                  << " | Got score=" << score << ", dist=" << dist << std::endl;
        exit(1);
    }
}

int main() {
    std::cout << "=== Running CityGraph (Dijkstra) Tests ===" << std::endl;
    CityGraph graph;

    // 1. City normalization
    assert(CityGraph::normalizeCity("Bengaluru, India") == "bengaluru");
    assert(CityGraph::normalizeCity("Bangalore") == "bengaluru");
    assert(CityGraph::normalizeCity("  Pune, India  ") == "pune");
    assert(CityGraph::normalizeCity("Delhi") == "noida");
    std::cout << "[PASS] City normalization verified." << std::endl;

    // 2. Direct distances
    testDistance(graph, "Pune", "Mumbai", 150.0);
    testDistance(graph, "Noida", "Gurgaon", 50.0);
    testDistance(graph, "Bengaluru", "Chennai", 350.0);

    // 3. Multi-hop / Shortest path
    // Bengaluru -> Hyderabad (570 km)
    testDistance(graph, "Bengaluru", "Hyderabad", 570.0);

    // 4. Same city (0 km, 100%)
    testScore(graph, "Bengaluru, India", "Bengaluru, India", 100.0, 0.0);
    testScore(graph, "Bangalore", "Bengaluru", 100.0, 0.0);

    // 5. Remote job (0 km, 100%)
    testScore(graph, "Hyderabad, India", "Remote", 100.0, 0.0);

    // 6. Regional commute (<= 200 km -> 90%)
    testScore(graph, "Pune, India", "Mumbai, India", 90.0, 150.0);
    testScore(graph, "Noida, India", "Gurgaon, India", 90.0, 50.0);

    // 7. Regional hub (<= 700 km -> 75%)
    testScore(graph, "Bengaluru, India", "Chennai, India", 75.0, 350.0);
    testScore(graph, "Bengaluru, India", "Hyderabad, India", 75.0, 570.0);

    // 8. Long distance (> 1200 km -> 40%)
    // Bengaluru -> Hyderabad (570) + Hyderabad -> Noida (1550) = 2120 km (Shortest Dijkstra path)
    testScore(graph, "Bengaluru, India", "Noida, India", 40.0, 2120.0);

    std::cout << "All CityGraph tests passed successfully!" << std::endl;
    return 0;
}
