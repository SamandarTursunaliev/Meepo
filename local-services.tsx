import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground } from "react-native";

export default function LocalServices() {
  // England essential services
  const englandServices = [
    {
      id: 1,
      title: "NHS (Non-emergency)",
      contact: "111",
      description: "24/7 health advice and information. Call for non-urgent medical help.",
      url: "https://www.nhs.uk"
    },
    {
      id: 2,
      title: "NHS GP Services",
      contact: "Find local GP",
      description: "Find and register with a local GP surgery.",
      url: "https://www.nhs.uk/service-search/find-a-gp"
    },
    {
      id: 3,
      title: "School Admissions",
      contact: "Local council",
      description: "Information about applying for school places in England.",
      url: "https://www.gov.uk/schools-admissions"
    },
    {
      id: 4,
      title: "Council Services",
      contact: "Local council",
      description: "Find your local council for housing, bins, parking and more.",
      url: "https://www.gov.uk/find-local-council"
    },
    {
      id: 5,
      title: "Universal Credit",
      contact: "0800 328 5644",
      description: "Apply for benefits and financial support.",
      url: "https://www.gov.uk/universal-credit"
    },
    {
      id: 6,
      title: "Ofsted School Reports",
      contact: "0300 123 1231",
      description: "Check school inspection reports and ratings.",
      url: "https://reports.ofsted.gov.uk"
    },
    {
      id: 7,
      title: "Public Transport",
      contact: "Traveline",
      description: "Plan your journey by bus, train or tube.",
      url: "https://www.traveline.info"
    },
    {
      id: 8,
      title: "Report Crime (Non-emergency)",
      contact: "101",
      description: "Contact police for non-urgent matters.",
      url: "https://www.police.uk"
    },
  ];

  return (
    <ImageBackground
      source={require("../assets/myappimages/background_image.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Essential Services in England</Text>

        <ScrollView style={styles.scrollView}>
          {englandServices.map((service) => (
            <View key={service.id} style={styles.card}>
              <Text style={styles.title}>{service.title}</Text>
              <Text style={styles.contact}>{service.contact}</Text>
              <Text style={styles.description}>{service.description}</Text>
              <TouchableOpacity
                style={styles.serviceButton}
                onPress={() => {
                  if (service.contact.match(/^\d+$/)) {
                    Linking.openURL(`tel:${service.contact}`);
                  } else {
                    Linking.openURL(service.url);
                  }
                }}
              >
                <Text style={styles.serviceButtonText}>
                  {service.contact.match(/^\d+$/) ? `Call ${service.contact}` : 'Visit Website'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
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
  serviceButton: {
    backgroundColor: "#005EB8", // NHS blue color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  serviceButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
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