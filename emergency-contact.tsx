import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground } from "react-native";

export default function EmergencyContact() {
  return (
    <ImageBackground
      source={require("../assets/myappimages/background_image.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Emergency Contacts (UK)</Text>

        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>Emergency Services (Police, Fire, Ambulance)</Text>
            <Text style={styles.contact}>Dial 999</Text>
            <Text style={styles.description}>
              For all emergencies requiring police, fire, or ambulance services. Available 24/7.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Non-Emergency Police</Text>
            <Text style={styles.contact}>Dial 101</Text>
            <Text style={styles.description}>
              For non-urgent police matters. For example, reporting a crime that has already happened or
              reporting suspicious activity.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>NHS Non-Emergency Medical Helpline</Text>
            <Text style={styles.contact}>Dial 111</Text>
            <Text style={styles.description}>
              For medical advice or if you are unsure whether to seek medical attention. You can call 111 for
              guidance on where to get medical help.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Child Protection Services</Text>
            <Text style={styles.contact}>Dial 0808 800 5000</Text>
            <Text style={styles.description}>
              Available for reporting concerns about child welfare or protection issues.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Domestic Violence Helpline</Text>
            <Text style={styles.contact}>Dial 0808 2000 247</Text>
            <Text style={styles.description}>
              Support for individuals facing domestic abuse or violence. Available 24/7.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Samaritans (Mental Health Support)</Text>
            <Text style={styles.contact}>Dial 116 123</Text>
            <Text style={styles.description}>
              Free and confidential mental health support for anyone in need. Available 24/7.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>UK Anti-Terrorist Hotline</Text>
            <Text style={styles.contact}>Dial 0800 789 321</Text>
            <Text style={styles.description}>
              To report suspicious activity related to terrorism.
            </Text>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => Linking.openURL("tel:999")}
        >
          <Text style={styles.contactButtonText}>Call Emergency Services (999)</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
    width: "90%",
    marginTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    width: "100%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contact: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  contactButton: {
    backgroundColor: "#ff4f4f",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
    width: "80%",
    alignItems: "center",
  },
  contactButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
