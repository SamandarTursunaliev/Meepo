import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import axios from "axios";
//https://openweathermap.org/api
const WeatherScreen = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert("Error", "Please enter a city name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch current weather
      const currentResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2192611c3a5114f92ffd9e92e67c43ce&units=metric`
      );

      // Fetch 5-day forecast (3-hour intervals)
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=2192611c3a5114f92ffd9e92e67c43ce&units=metric`
      );

      if (currentResponse.data.cod === 200 && forecastResponse.data.cod === "200") {
        setWeatherData(currentResponse.data);
        
        // Process forecast data to get daily forecasts
        const dailyForecasts = processForecastData(forecastResponse.data.list);
        setForecastData(dailyForecasts.slice(0, 2)); // Get next 2 days
      } else {
        setError("Could not fetch weather data. Please try again.");
      }
    } catch (err) {
      setError("Could not fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process 3-hour interval forecasts into daily forecasts
  const processForecastData = (forecastList) => {
    const dailyData = {};
    
    forecastList.forEach(item => {
      const date = item.dt_txt.split(' ')[0]; // Get date part only
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temps: [],
          descriptions: [],
          icons: [],
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].descriptions.push(item.weather[0].description);
      dailyData[date].icons.push(item.weather[0].icon);
    });
    
    // Convert to array and calculate daily averages
    return Object.values(dailyData).map(day => ({
      date: day.date,
      avgTemp: (day.temps.reduce((a, b) => a + b, 0) / day.temps.length).toFixed(1),
      description: mostFrequent(day.descriptions),
      icon: mostFrequent(day.icons),
    }));
  };

  // Helper function to find most frequent value in array
  const mostFrequent = (arr) => {
    const counts = {};
    arr.forEach(val => counts[val] = (counts[val] || 0) + 1);
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Format date to be more readable (e.g., "Mon, Mar 27")
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/draw1.webp",
      }}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            onChangeText={setCity}
            value={city}
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={fetchWeather}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Get Weather</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="large" color="#fff" />}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {weatherData && (
            <View style={styles.card}>
              <Text style={styles.cityName}>
                {weatherData.name}, {weatherData.sys.country}
              </Text>
              <Text style={styles.temperature}>{weatherData.main.temp}°C</Text>
              <Text style={styles.weatherDescription}>
                {weatherData.weather[0].description}
              </Text>

              <Image
                style={styles.weatherIcon}
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                }}
              />

              <Text style={styles.feelsLike}>
                Feels Like: {weatherData.main.feels_like}°C
              </Text>
            </View>
          )}

          {forecastData && (
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>2-Day Forecast</Text>
              {forecastData.map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <Text style={styles.forecastDate}>{formatDate(day.date)}</Text>
                  <View style={styles.forecastDetails}>
                    <Image
                      style={styles.forecastIcon}
                      source={{
                        uri: `https://openweathermap.org/img/wn/${day.icon}.png`,
                      }}
                    />
                    <View style={styles.forecastText}>
                      <Text style={styles.forecastTemp}>{day.avgTemp}°C</Text>
                      <Text style={styles.forecastDesc}>{day.description}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  container: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginVertical: 10,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  temperature: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
  },
  weatherDescription: {
    fontSize: 20,
    color: "#ddd",
    textTransform: 'capitalize',
  },
  weatherIcon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  feelsLike: {
    fontSize: 18,
    color: "#fff",
  },
  forecastContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 20,
    padding: 15,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  forecastDay: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  forecastDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  foreCastDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  forecastText: {
    flex: 1,
  },
  forecastTemp: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  forecastDesc: {
    fontSize: 16,
    color: "#ddd",
    textTransform: 'capitalize',
  },
});

export default WeatherScreen;