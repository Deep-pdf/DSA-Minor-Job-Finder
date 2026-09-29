#ifndef STRING_UTILS_H
#define STRING_UTILS_H

#include <string>
#include <algorithm>
#include <cctype>

namespace StringUtils {
    // Normalizes a string to lowercase for case-insensitive matching.
    inline std::string toLowerCase(std::string s) {
        std::transform(s.begin(), s.end(), s.begin(),
                       [](unsigned char c){ return std::tolower(c); });

        // Trim both leading and trailing space
        size_t first = s.find_first_not_of(' ');
        if (std::string::npos == first) return "";
        size_t last = s.find_last_not_of(' ');
        return s.substr(first, (last - first + 1));
    }
}

#endif // STRING_UTILS_H
