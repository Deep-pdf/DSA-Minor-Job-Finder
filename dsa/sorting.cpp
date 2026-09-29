#include "sorting.h"
#include <cmath>
#include <algorithm>

void Sorter::mergeSort(std::vector<MatchResult>& results) {
    if (results.size() <= 1) return;
    mergeSortRecursive(results, 0, results.size() - 1);
}

void Sorter::mergeSortRecursive(std::vector<MatchResult>& results, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSortRecursive(results, left, mid);
        mergeSortRecursive(results, mid + 1, right);
        merge(results, left, mid, right);
    }
}

void Sorter::merge(std::vector<MatchResult>& results, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;

    std::vector<MatchResult> leftArr(n1), rightArr(n2);

    for (int i = 0; i < n1; i++) leftArr[i] = results[left + i];
    for (int j = 0; j < n2; j++) rightArr[j] = results[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (compareResults(leftArr[i], rightArr[j])) {
            results[k] = leftArr[i];
            i++;
        } else {
            results[k] = rightArr[j];
            j++;
        }
        k++;
    }

    while (i < n1) results[k++] = leftArr[i++];
    while (j < n2) results[k++] = rightArr[j++];
}

// Deterministic comparison criteria:
// 1. Higher overallMatch score
// 2. Higher skill score (breakdown.skills)
// 3. More matched required skills
// 4. Alphabetical title (asc)
bool Sorter::compareResults(const MatchResult& a, const MatchResult& b) {
    if (std::abs(a.overallMatch - b.overallMatch) > 0.001) {
        return a.overallMatch > b.overallMatch; // Higher overallMatch
    }
    if (std::abs(a.breakdown.skills - b.breakdown.skills) > 0.001) {
        return a.breakdown.skills > b.breakdown.skills; // Higher skill score
    }
    if (a.matchedSkills.size() != b.matchedSkills.size()) {
        return a.matchedSkills.size() > b.matchedSkills.size(); // More matched skills
    }
    return a.title < b.title; // Alphabetical title
}
