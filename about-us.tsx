import React from "react";
import { View, Text, StyleSheet, ImageBackground, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';

const backgroundImage = require("../assets/myappimages/about_us.jpg"); 


const AboutUs = () => {
  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <MaterialIcons name="people" size={50} color="#fff" style={styles.icon} />
            <Text style={styles.header}>Our Mission</Text>
            
            <View style={styles.card}>
              <Text style={styles.bodyText}>
                In today's globalized world, many people are relocating to new countries in search of better
                opportunities and a fresh start. However, with this transition comes the challenge of
                integrating into a new culture, language, and environment. 
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.bodyText}>
                At Meepo, we understand the importance of proper integration. Our app is designed to assist newcomers
                by providing useful tools and services that help bridge the gap. Whether it's language translation,
                currency conversion, weather forecasts, or job assistance, Meepo is your one-stop solution to ease
                your transition and help you feel at home, no matter where you are in the world.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.bodyText}>
                Our goal is to empower individuals by ensuring they have the resources they need to integrate seamlessly
                into their new environments. With Meepo, you can navigate your new world with confidence and support.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  container: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 30,
  },
  header: {
    fontSize: 34,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bodyText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "left",
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});

export default AboutUs;