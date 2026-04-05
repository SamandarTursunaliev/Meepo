import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

export default function JobHelpScreen() {
  return (
    <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.container}>
      <Text style={styles.header}>Job Help</Text>

      {/* Job Tips Button with Image */}
      <Link href="/job-tips" asChild>
        <TouchableOpacity style={styles.card}>
          <ImageBackground
            source={require("../assets/myappimages/job_tipsimage.jpg")}
            style={styles.image}
            imageStyle={{ borderRadius: 15 }}
          >
            <Text style={styles.title}>Job Tips</Text>
          </ImageBackground>
        </TouchableOpacity>
      </Link>

      {/* CV Maker Button with Image */}
      <Link href="/cv-maker" asChild>
        <TouchableOpacity style={styles.card}>
          <ImageBackground
            source={require("../assets/myappimages/cv_makerimage.png")}
            style={styles.image}
            imageStyle={{ borderRadius: 15 }}
          >
            <Text style={styles.title}>CV Maker</Text>
          </ImageBackground>
        </TouchableOpacity>
      </Link>

      {/* Trending Jobs Button with Image */}
      <Link href="/trending-jobs" asChild>
        <TouchableOpacity style={styles.card}>
          <ImageBackground
            source={require("../assets/myappimages/trending_jobsimage.jpg")} 
            style={styles.image}
            imageStyle={{ borderRadius: 15 }}
          >
            <Text style={styles.title}>Trending Jobs for Migrants</Text>
          </ImageBackground>
        </TouchableOpacity>
      </Link>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 25,
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
