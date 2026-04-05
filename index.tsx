import React from "react";
import { ImageBackground, Text, View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

const buttons = [
  { id: "1", title: "Navigation", link: "/navigation", image: require("../assets/myappimages/navigationimage.jpeg") },
  { id: "2", title: "Currency Converter", link: "/currency-converter", image: require("../assets/myappimages/currency_converterimage.webp") },
  { id: "3", title: "Language Translator", link: "/language-translator", image: require("../assets/myappimages/language_translatorimage.webp") },
  { id: "4", title: "Weather Forecast", link: "/weather-forecast", image: require("../assets/myappimages/weather_forecastimage.webp") },
  { id: "5", title: "Useful Information", link: "/useful-information", image: require("../assets/myappimages/useful_informationimage.jpeg") },
  { id: "6", title: "Job Help", link: "/job-help", image: require("../assets/myappimages/jobs_image.webp") },
  { id: "7", title: "Access to the Local Services", link: "/local-services", image: require("../assets/myappimages/local_services.webp") },
  { id: "8", title: "Language Learning Game", link: "/language-learning", image: require("../assets/myappimages/language_learning_game.jpg") },
  { id: "9", title: "About Us", link: "/about-us", image: require("../assets/myappimages/about_us.jpg") },
];

export default function HomeScreen() {
  const backgroundImage = require("../assets/myappimages/background_image.jpg");

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradient}>
        <View style={styles.container}>
          {/* Header */}
          <Text style={styles.header}>Welcome to Meepo</Text>

          {/* Buttons Grid */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {buttons.map((button) => (
              <Link key={button.id} href={button.link} asChild>
                <TouchableOpacity style={styles.card}>
                  <ImageBackground source={button.image} style={styles.image} imageStyle={{ borderRadius: 15 }}>
                    <View style={styles.overlay}>
                      <Text style={styles.title}>{button.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </Link>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  container: {
    width: "90%",
    alignItems: "center",
    marginTop: 100,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
    marginTop: 40,
  },
  scrollContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    width: 300,
    height: 150,
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});