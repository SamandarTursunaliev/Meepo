import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, Linking } from "react-native";

export default function BritishCulture() {
  return (
    <ImageBackground
      source={require("../assets/myappimages/background_image.jpg")} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Understanding British Culture</Text>

        <ScrollView style={styles.scrollView}>
          <View style={styles.card}>
            <Text style={styles.title}>1. Politeness is Key</Text>
            <Text style={styles.description}>
              One of the most noticeable traits of British culture is the emphasis on politeness. Phrases like "Please," "Thank you," "Sorry," and "Excuse me" are essential in everyday conversation. Whether you're in a shop, on public transport, or just walking down the street, British people often say these expressions to maintain a courteous atmosphere.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>2. The British Sense of Humor</Text>
            <Text style={styles.description}>
              British humor is unique. It tends to be dry, sarcastic, and often self-deprecating. While humor is important, it's essential to understand the difference between playful teasing and being offensive. TV shows like "The Office" and "Monty Python" are great examples of British humor.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>3. Tea Culture</Text>
            <Text style={styles.description}>
              Tea is a quintessential part of British culture. The British drink tea at least three times a day, especially during mid-morning and mid-afternoon. When visiting someone's home, it’s common to be offered tea, and it’s considered polite to accept. You can learn more about British tea culture at [this link](https://www.britishheritage.com/british-culture/tea-time-the-importance-of-tea-in-britain/).
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>4. Respect for Queues</Text>
            <Text style={styles.description}>
              The British have a strong culture of "queuing." When waiting in line, whether at the bus stop or in a shop, it's expected that everyone waits their turn patiently. Jumping the queue is seen as rude.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>5. Pub Culture</Text>
            <Text style={styles.description}>
              Pubs are central to British social life. It's a place for friends and family to gather, relax, and enjoy a pint of beer. While there, it’s common to order drinks at the bar and pay for them as you go. Many pubs also serve traditional British food like fish and chips, pies, and Sunday roasts.
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://www.visitbritain.com/gb/en/things-to-do/culture-history/food-and-drink")}
            >
              <Text style={styles.linkButtonText}>Learn more about British Pub Culture</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>6. British Festivals and Events</Text>
            <Text style={styles.description}>
              Britain is home to many famous festivals, from music festivals like Glastonbury to cultural celebrations such as the Notting Hill Carnival. The UK also celebrates several public holidays like Christmas, Easter, and bank holidays, where many shops and offices close.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>7. The Royal Family</Text>
            <Text style={styles.description}>
              The British Royal Family is an integral part of the country’s identity. While the UK is a constitutional monarchy, the Royals play a symbolic role in British life. Major events like royal weddings and the Queen’s Birthday attract global attention. 
            </Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => Linking.openURL("https://www.royal.uk/")}
            >
              <Text style={styles.linkButtonText}>Visit the Royal Family Website</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>8. Sporting Culture</Text>
            <Text style={styles.description}>
              Sports play a significant role in British culture. Football (soccer) is the most popular, but rugby, cricket, and tennis also have a long-standing tradition. Iconic events like Wimbledon and the FA Cup final bring the nation together.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>9. British Weather</Text>
            <Text style={styles.description}>
              The British are famously obsessed with the weather, often using it as an icebreaker in conversation. While the weather can be unpredictable, it’s usually mild, with lots of rain. Be sure to carry an umbrella or a raincoat when out and about!
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
    alignItems: "center",
    paddingTop: 80,
    width: "90%",
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
