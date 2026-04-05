import React from "react";
import { Text, View, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function JobTipsScreen() {
  return (
    <ImageBackground source={require("../assets/myappimages/jobs_image.webp")} style={styles.background}>
      <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>Job Tips</Text>

          <Text style={styles.subtitle}>1. Tailor Your Resume</Text>
          <Text style={styles.text}>
            Customize your resume to fit the job you are applying for. Highlight the skills and experience that are most relevant to
            the job description.
          </Text>

          <Text style={styles.subtitle}>2. Network, Network, Network</Text>
          <Text style={styles.text}>
            Networking is key. Attend job fairs, join LinkedIn groups, and try to connect with people working in your field of interest.
          </Text>

          <Text style={styles.subtitle}>3. Research the Company</Text>
          <Text style={styles.text}>
            Before applying, research the company you are interested in. Know their values, their mission, and their work culture.
          </Text>

          <Text style={styles.subtitle}>4. Prepare for Interviews</Text>
          <Text style={styles.text}>
            Prepare for interviews by practicing answers to common questions, researching the company, and dressing appropriately.
          </Text>

          <Text style={styles.subtitle}>5. Be Persistent</Text>
          <Text style={styles.text}>
            Don’t get discouraged if you don’t get the job immediately. Keep applying, follow up, and remain persistent.
          </Text>

        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  container: {
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    marginTop: 15,
    textAlign: "left",
    width: "100%",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    marginTop: 5,
    textAlign: "left",
    width: "100%",
    lineHeight: 22,
  },
});
