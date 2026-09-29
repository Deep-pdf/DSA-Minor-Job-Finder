#ifndef SORTING_H
#define SORTING_H

#include "../models/match_result.h"
#include <vector>

class Sorter {
public:
    // Sorts MatchResult vector using Merge Sort (Descending order)
    static void mergeSort(std::vector<MatchResult>& results);

private:
    static void mergeSortRecursive(std::vector<MatchResult>& results, int left, int right);
    static void merge(std::vector<MatchResult>& results, int left, int mid, int right);

    // Deterministic comparison criteria for ranking
    static bool compareResults(const MatchResult& a, const MatchResult& b);
};

#endif // SORTING_H
