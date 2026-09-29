CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra
LDFLAGS = -pthread

SRCS = backend/main.cpp backend/api_controller.cpp dsa/matcher.cpp dsa/sorting.cpp dsa/trie.cpp dsa/hashset.cpp dsa/city_graph.cpp

all: server

server: $(SRCS)
	$(CXX) $(CXXFLAGS) $(SRCS) $(LDFLAGS) -o server

test_city_graph: dsa/city_graph.cpp tests/test_city_graph.cpp
	$(CXX) $(CXXFLAGS) dsa/city_graph.cpp tests/test_city_graph.cpp -o test_city_graph
	./test_city_graph

build_test:
	@echo "Checking if models are valid C++..."
	$(CXX) $(CXXFLAGS) -c models/candidate.h -o models/candidate.o
	$(CXX) $(CXXFLAGS) -c models/job.h -o models/job.o
	$(CXX) $(CXXFLAGS) -c models/match_result.h -o models/match_result.o
	$(CXX) $(CXXFLAGS) -c models/skill.h -o models/skill.o
	@echo "Models compiled successfully."
	@rm -f models/*.o

clean:
	rm -f server test_city_graph models/*.o
