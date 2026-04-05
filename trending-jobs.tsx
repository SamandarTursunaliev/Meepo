import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  FlatList,
  Button,
  Modal,
  TouchableOpacity,
} from 'react-native';

// Define the type for a job object
interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  experience: number;
  skills: string[];
  jobType: string;
  postedAt: string;
}

// Trie data structure for efficient search
class TrieNode {
  children: { [key: string]: TrieNode };
  isEndOfWord: boolean;

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(prefix: string): string[] {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this._getAllWords(node, prefix);
  }

  _getAllWords(node: TrieNode, prefix: string): string[] {
    let words: string[] = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (const char in node.children) {
      words = words.concat(this._getAllWords(node.children[char], prefix + char));
    }
    return words;
  }
}

const JobListings: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isPreferencesModalVisible, setPreferencesModalVisible] = useState<boolean>(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [userExperience, setUserExperience] = useState<number>(0);

  const trie = new Trie();

  // Fetch job data from the API which connects to the database
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`http://192.168.0.231:5000/api/jobs?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch job listings');
        }
        const data: Job[] = await response.json();
        setJobs((prev) => [...prev, ...data]);
        setFilteredJobs((prev) => [...prev, ...data]);
        data.forEach((job) => trie.insert(job.title));
        setHasMore(data.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page]);

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setSuggestions(trie.search(query));
    } else {
      setSuggestions([]);
    }
  };

  // Filter jobs based on search query
  useEffect(() => {
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchQuery, jobs]);

  // Job recommendation algorithm (Uses weighted scoring system)
  const recommendJobs = (skills: string[], location: string, experience: number) => {
    return jobs.map((job) => {
      let score = 0;

      // It adds score based on matching skills
      const matchingSkills = job.skills.filter((skill) => skills.includes(skill)).length;
      score += matchingSkills * 2;

      // It adds score based on location
      if (job.location.toLowerCase() === location.toLowerCase()) {
        score += 3;
      }

      // It adds score based on experience
      if (job.experience <= experience) {
        score += 1;
      }

      return { ...job, score };
    }).sort((a, b) => b.score - a.score);
  };

  // Apply user preferences
  const applyPreferences = () => {
    const recommendedJobs = recommendJobs(userSkills, userLocation, userExperience);
    setFilteredJobs(recommendedJobs);
    setPreferencesModalVisible(false); // Close the modal after applying preferences
  };

  // Load more jobs for pagination
  const loadMoreJobs = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading job listings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Job Listings</Text>

      {/* Preferences Button */}
      <Button
        title="Set Preferences"
        onPress={() => setPreferencesModalVisible(true)}
      />

      {/* Preferences Modal */}
      <Modal
        visible={isPreferencesModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Set Preferences</Text>

            {/* Skills Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter skills (comma-separated)"
              value={userSkills.join(', ')}
              onChangeText={(text) => setUserSkills(text.split(',').map((skill) => skill.trim()))}
            />

            {/* Location Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter preferred location"
              value={userLocation}
              onChangeText={setUserLocation}
            />

            {/* Experience Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter years of experience"
              keyboardType="numeric"
              value={userExperience.toString()}
              onChangeText={(text) => setUserExperience(parseInt(text, 10) || 0)}
            />

            {/* Apply Button */}
            <Button title="Apply Preferences" onPress={applyPreferences} />

            {/* Close Button */}
            <Button
              title="Close"
              onPress={() => setPreferencesModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search jobs..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Display Suggestions */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <Text key={index} style={styles.suggestionText}>
              {suggestion}
            </Text>
          ))}
        </View>
      )}

      {/* Job Listings */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobText}><Text style={styles.bold}>Company:</Text> {item.company}</Text>
            <Text style={styles.jobText}><Text style={styles.bold}>Location:</Text> {item.location}</Text>
            <Text style={styles.jobText}><Text style={styles.bold}>Salary:</Text> ${item.salary}</Text>
            <Text style={styles.jobText}><Text style={styles.bold}>Experience:</Text> {item.experience} years</Text>
            <Text style={styles.jobText}>
              <Text style={styles.bold}>Skills:</Text>{' '}
              <Text style={styles.skills}>{item.skills.join(', ')}</Text>
            </Text>
            <Text style={styles.jobText}><Text style={styles.bold}>Job Type:</Text> {item.jobType}</Text>
            <Text style={styles.jobText}>
              <Text style={styles.bold}>Posted At:</Text> {new Date(item.postedAt).toLocaleDateString()}
            </Text>
          </View>
        )}
        onEndReached={loadMoreJobs}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#007bff" /> : null
        }
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 8,
  },
  suggestionText: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 4,
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  jobText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
  },
  skills: {
    color: '#007bff',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  noJobsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
});

export default JobListings;
