CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra

# For now, just compile to ensure files are valid.
# Phase 3 will add real source linking.

all: build_test

build_test:
	@echo "Checking if models are valid C++..."
	$(CXX) $(CXXFLAGS) -c models/candidate.h -o models/candidate.o
	$(CXX) $(CXXFLAGS) -c models/job.h -o models/job.o
	$(CXX) $(CXXFLAGS) -c models/match_result.h -o models/match_result.o
	$(CXX) $(CXXFLAGS) -c models/skill.h -o models/skill.o
	@echo "Models compiled successfully."
	@rm models/*.o

clean:
	rm -f models/*.o
