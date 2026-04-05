import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, ImageBackground } from "react-native";

export default function TravelTips() {
  return (
    <ImageBackground
      source={require("../assets/myappimages/background_image.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Travel Tips for the UK</Text>

        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>1. Buy an Oyster Card for Cheaper Travel</Text>
            <Text style={styles.description}>
              Oyster Cards are the most cost-effective way to travel around London. You can buy one at the
              airport, train stations, or online. The card allows you to travel on buses, trains, and the Tube.
              It's cheaper than using a contactless bank card or buying paper tickets.
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://tfl.gov.uk/travel-information/tube-and-rail/ways-to-pay/oyster")}
            >
              <Text style={styles.linkButtonText}>Learn more about Oyster Cards</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>2. Use Contactless Payment</Text>
            <Text style={styles.description}>
              In addition to Oyster Cards, you can use your contactless bank card (like debit/credit cards, mobile
              payments like Apple Pay or Google Pay) to travel on public transport in London. It's fast and simple.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>3. Get a Visitor Oyster Card</Text>
            <Text style={styles.description}>
              If you're visiting London for a short period, a Visitor Oyster Card can offer you even more discounts.
              It can be purchased online before you arrive, and you can use it for transport, attractions, and
              restaurants. It's convenient for tourists!
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://tfl.gov.uk/travel-information/tube-and-rail/ways-to-pay/visitor-oyster-card")}
            >
              <Text style={styles.linkButtonText}>Learn more about Visitor Oyster Cards</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>4. Plan Your Route Using Google Maps or TfL App</Text>
            <Text style={styles.description}>
              Use apps like Google Maps or the TfL (Transport for London) app to plan your routes and check for
              delays on public transport. These apps are especially useful for real-time updates and alternative
              routes when there are disruptions. Our app also offers routing features to help you navigate the city
              quickly and efficiently.
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://www.google.com/maps")}
            >
              <Text style={styles.linkButtonText}>Google Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://tfl.gov.uk/apps")}
            >
              <Text style={styles.linkButtonText}>TfL App</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>5. Be Aware of Peak Travel Times</Text>
            <Text style={styles.description}>
              Public transport can get extremely crowded during peak hours, usually between 7:30 AM to 9:30 AM and
              5 PM to 7 PM. Try to avoid traveling during these times if you can, or plan your journey outside of
              rush hour for a more comfortable ride.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>6. Buy a Travelcard for Unlimited Travel</Text>
            <Text style={styles.description}>
              If you are staying in London for several days, a Travelcard might be a good option. It offers
              unlimited travel for a certain period on buses, trains, and the Tube, and can be purchased for one
              day, seven days, or longer.
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://tfl.gov.uk/fares-and-payments/travelcards-and-others")}
            >
              <Text style={styles.linkButtonText}>Learn more about Travelcards</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>7. Check for Discounts</Text>
            <Text style={styles.description}>
              There are many discounts available for tourists, students, and seniors. For example, you can get
              discounted fares on travel with a Student Oyster Card or a Senior Railcard. Make sure to check for
              discounts before buying your travel pass or ticket.
            </Text>
          </View>
        </ScrollView>
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
    alignItems: "flex-start",  
    paddingTop: 80,
    width: "95%", 
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
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  linkButton: {
    backgroundColor: "#5372F0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  linkButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
