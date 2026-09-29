#ifndef MATCHER_H
#define MATCHER_H

#include "../models/candidate.h"
#include "../models/job.h"
#include "../models/match_result.h"
#include "../dsa/hashset.h"
#include "../dsa/city_graph.h"
#include <vector>

class Matcher {
public:
    static MatchResult calculateMatch(const Candidate& candidate, const Job& job);
};

#endif // MATCHER_H
