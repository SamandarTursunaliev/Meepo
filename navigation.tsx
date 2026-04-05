import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

const GOOGLE_MAPS_API_KEY = "";
const API_BASE_URL = "http://192.168.0.231:5000/api"; 

//https://developers.google.com/maps/documentation/routes
//https://mapsplatform.google.com/resources/blog/address-geocoding-in-google-maps-apis/?

interface TransitDetails {
  stopName?: string;
  line?: string;
  vehicle?: string;
  headsign?: string;
}

interface TravelStep {
  instructions: string;
  distance?: number;
  duration?: string;
  transitDetails?: TransitDetails;
}

export default function NavigationScreen() {
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number }>({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [travelSteps, setTravelSteps] = useState<TravelStep[]>([]);
  const [previousDestinations, setPreviousDestinations] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to use this feature.");
        setLoading(false);
        return;
      }
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    fetchPreviousDestinations();
  }, []);

  // Fetching previous destinations from the backend
  const fetchPreviousDestinations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations`);
      const data = await response.json();
      if (response.ok) {
        const destinations = data.map((item) => item.name);
        setPreviousDestinations(destinations);
      } else {
        throw new Error(data.message || "Failed to fetch destinations");
      }
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setPreviousDestinations([]);
    }
  };

  // Saving a new destination to the backend
  const saveDestination = async (address: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: address }),
      });
      const data = await response.json();
      if (response.ok) {
        // Updating the list of previous destinations
        setPreviousDestinations((prev) => [...prev, address]);
      } else {
        throw new Error(data.message || "Failed to save destination");
      }
    } catch (error) {
      console.error("Error saving destination:", error);
    }
  };

  // Handle destination search and save
  const handleDestinationSubmit = async () => {
    if (!destinationAddress) {
      Alert.alert("Error", "Please enter a destination address.");
      return;
    }
    try {
      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        destinationAddress
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(geocodingUrl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const newDestination = { latitude: lat, longitude: lng };
        setDestination(newDestination);

        // Save the destination to the backend
        await saveDestination(destinationAddress);

        if (location) {
          fetchRoute(location, newDestination);
        }
      } else {
        Alert.alert("Error", "Could not find the destination address.");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      Alert.alert("Error", "Failed to geocode the address. Please try again.");
    }
  };

  // Fetch route
  const fetchRoute = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => {
    try {
      const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
      const requestBody = {
        origin: {
          location: {
            latLng: {
              latitude: origin.latitude,
              longitude: origin.longitude,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.latitude,
              longitude: destination.longitude,
            },
          },
        },
        travelMode: "TRANSIT",
        transitPreferences: {
          routingPreference: "LESS_WALKING",
          allowedTravelModes: ["BUS", "SUBWAY", "TRAIN"],
        },
        computeAlternativeRoutes: false,
        routeModifiers: {
          avoidTolls: false,
          avoidHighways: false,
          avoidFerries: false,
        },
        polylineEncoding: "GEO_JSON_LINESTRING",
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "routes.polyline,routes.legs,routes.legs.steps,routes.legs.steps.navigationInstruction,routes.legs.steps.transitDetails",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const polyline = data.routes[0].polyline;
        const decodedPolyline = decodePolyline(polyline);
        setRouteCoords(decodedPolyline);

        if (data.routes[0].legs && data.routes[0].legs.length > 0) {
          const steps = data.routes[0].legs[0].steps.map((step) => ({
            instructions: step.navigationInstruction?.instructions || "",
            distance: step.distanceMeters,
            duration: step.staticDuration,
            transitDetails: step.transitDetails && {
              stopName: step.transitDetails.stopDetails?.name,
              line: step.transitDetails.transitLine?.name,
              vehicle: step.transitDetails.transitLine?.vehicle?.type,
              headsign: step.transitDetails.headsign,
            },
          }));
          setTravelSteps(steps);
        }

        if (mapRef.current) {
          mapRef.current.fitToCoordinates(decodedPolyline, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      } else {
        Alert.alert("No route found", "Could not find a route to the destination.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
      Alert.alert("Error", "Failed to get the route. Please try again.");
    }
  };

  // Decode polyline 
  const decodePolyline = (polyline: any) => {
    if (!polyline || !polyline.geoJsonLinestring || !polyline.geoJsonLinestring.coordinates) {
      return [];
    }
    return polyline.geoJsonLinestring.coordinates.map((coord: any) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Navigation</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter destination address"
        value={destinationAddress}
        onChangeText={setDestinationAddress}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleDestinationSubmit}>
        <MaterialIcons name="search" size={24} color="white" />
        <Text style={styles.buttonText}>Search Route</Text>
      </TouchableOpacity>

      <View style={styles.previousDestinationsContainer}>
        <Text style={styles.previousDestinationsHeader}>Previous Destinations</Text>
        {Array.isArray(previousDestinations) && previousDestinations.map((dest, index) => (
          <TouchableOpacity
            key={index}
            style={styles.previousDestinationItem}
            onPress={() => setDestinationAddress(dest)}
          >
            <Text style={styles.previousDestinationText}>{dest}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
      ) : location ? (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          >
            <Marker coordinate={location} title="Your Location" />
            <Marker coordinate={destination} title="Destination" pinColor="blue" />
            {routeCoords.length > 0 && (
              <Polyline coordinates={routeCoords} strokeWidth={5} strokeColor="blue" />
            )}
          </MapView>
          <ScrollView style={styles.stepsContainer}>
            {Array.isArray(travelSteps) && travelSteps.map((step, index) => (
              <View key={index} style={styles.step}>
                <Text style={styles.stepText}>{step.instructions}</Text>
                {step.transitDetails && (
                  <View style={styles.transitInfo}>
                    <Text style={styles.transitText}>
                      {step.transitDetails.line} - {step.transitDetails.vehicle}
                    </Text>
                    <Text style={styles.transitDetails}>
                      To: {step.transitDetails.headsign}
                    </Text>
                    <Text style={styles.transitStop}>
                      Stop: {step.transitDetails.stopName}
                    </Text>
                  </View>
                )}
                {step.distance && (
                  <Text style={styles.stepDetails}>
                    Distance: {Math.round(step.distance)} meters
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <Text style={styles.errorText}>Location not available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 25,
    textAlign: "center",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  map: {
    width: "100%",
    height: "65%",
  },
  input: {
    height: 50,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a90e2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  stepsContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  step: {
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 8,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  stepText: {
    fontSize: 16,
    color: "#2c3e50",
    lineHeight: 22,
  },
  transitInfo: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  transitText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "700",
  },
  transitDetails: {
    fontSize: 15,
    color: "#34495e",
    marginTop: 5,
  },
  transitStop: {
    fontSize: 15,
    color: "#7f8c8d",
    fontStyle: "italic",
    marginTop: 5,
  },
  stepDetails: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    marginTop: 20,
    textAlign: "center",
    padding: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previousDestinationsContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  previousDestinationsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
  },
  previousDestinationItem: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  previousDestinationText: {
    fontSize: 16,
    color: "#34495e",
  },
});
