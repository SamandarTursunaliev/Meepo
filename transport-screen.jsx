import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TextInput,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
//https://transportapi.com
const TransportScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [station, setStation] = useState("LST"); // Default station code
  const [destination, setDestination] = useState(""); // Destination input
  const [transportType, setTransportType] = useState("train"); // Default transport type
  const [routes, setRoutes] = useState([]); // Store route information

  const fetchTransportData = async (retryCount = 3) => {
    try {
      setLoading(true);
      setError(null);

      const url =
        transportType === "train"
          ? `https://transportapi.com/v3/uk/train/station/${station}/live.json`
          : `https://transportapi.com/v3/uk/bus/stop/${station}/live.json`;

      const response = await axios.get(url, {
        params: {
          app_id: "d661088c",
          app_key: "da638e154fc98faf2f2403f7fd647580",
          group: transportType === "bus" ? "no" : "route", 
          ...(transportType === "train" && { darwin: "true", train_status: "passenger" }),
        },
        timeout: 10000, 
      });

      console.log("API Response:", JSON.stringify(response.data, null, 2)); // Debugging

      if (transportType === "train" && response.data.departures?.all) {
        setData(response.data.departures.all);
      } else if (transportType === "bus" && response.data.departures) {
        setData(response.data.departures);
      } else {
        setData([]); 
        setError("No departures found.");
      }
    } catch (err) {
      console.log("API Fetch Error:", err.response?.data || err.message);
      if (retryCount > 0) {
        // Retry the request if there are retries left
        setTimeout(() => fetchTransportData(retryCount - 1), 2000); // Retry after 2 seconds
      } else {
        setError("Failed to fetch transport data. Please try again later.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://transportapi.com/v3/uk/public/journey/from/${station}/to/${destination}.json`,
        {
          params: {
            app_id: "d661088c",
            app_key: "da638e154fc98faf2f2403f7fd647580",
            service: transportType, 
          },
          timeout: 10000, 
        }
      );

      console.log("Route API Response:", JSON.stringify(response.data, null, 2)); // Debugging

      if (response.data.routes) {
        setRoutes(response.data.routes);
      } else {
        setRoutes([]); 
        setError("No routes found.");
      }
    } catch (err) {
      console.log("Route API Fetch Error:", err.response?.data || err.message);
      setError("Failed to fetch route data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportData();
  }, [station, transportType]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransportData();
  };

  const handleStationChange = (text) => {
    setStation(text.toUpperCase()); 
  };

  const handleDestinationChange = (text) => {
    setDestination(text.toUpperCase()); 
  };

  const handleTransportTypeChange = (value) => {
    setTransportType(value);
  };

  const handleFindRoute = () => {
    if (station && destination) {
      fetchRoutes();
    } else {
      setError("Please enter both station and destination.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Departures & Route Planner</Text>

      {/* Station Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter station code (e.g., LST)"
        value={station}
        onChangeText={handleStationChange}
      />

      {/* Destination Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter destination code (e.g., EUS)"
        value={destination}
        onChangeText={handleDestinationChange}
      />

      {/* Transport Type Picker */}
      <Picker
        selectedValue={transportType}
        style={styles.picker}
        onValueChange={handleTransportTypeChange}
      >
        <Picker.Item label="Train" value="train" />
        <Picker.Item label="Bus" value="bus" />
      </Picker>

      {/* Find Route Button */}
      <Button title="Find Route" onPress={handleFindRoute} />

      {loading && <ActivityIndicator size="large" color="#007AFF" />}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Display Routes */}
      {routes.length > 0 && (
        <View style={styles.routeContainer}>
          <Text style={styles.subtitle}>Available Routes:</Text>
          <FlatList
            data={routes}
            keyExtractor={(item) => item.route_id || Math.random().toString()}
            renderItem={({ item }) => (
              <View style={styles.routeItem}>
                <Text style={styles.routeText}>
                  {item.duration} - {item.description}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Display Departures */}
      <Text style={styles.subtitle}>Live Departures:</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id || item.train_uid || Math.random().toString()}
        renderItem={({ item }) => {
          if (!item) return null; // Skip rendering if item is undefined
          return (
            <View style={styles.departureItem}>
              <Text style={styles.departureText}>
                {transportType === "train"
                  ? `${item.destination_name} - ${item.aimed_departure_time}`
                  : `${item.line_name} to ${item.direction} - ${item.aimed_departure_time}`}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          !loading && !error ? (
            <Text style={styles.emptyText}>No departures available.</Text>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#007AFF",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
  },
  departureItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  departureText: {
    fontSize: 18,
    fontWeight: "500",
  },
  routeContainer: {
    marginTop: 20,
  },
  routeItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  routeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default TransportScreen;