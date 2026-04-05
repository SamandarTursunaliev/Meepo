import React from "react";
import { View, Text, ImageBackground, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const topics = [
  { id: "1", title: "Travel Tips", image: require("../assets/myappimages/travel_tips.jpg") },
  { id: "2", title: "Local Culture", image: require("../assets/myappimages/local_culture.jpg") },
  { id: "3", title: "Emergency Contacts", image: require("../assets/myappimages/emergency.jpg") },
  { id: "4", title: "Public Transport", image: require("../assets/myappimages/transport.jpg") },
];

export default function UsefulInfoScreen() {
  const router = useRouter();

  const renderItem = ({ item }) => {
    const handlePress = () => {
      if (item.id === "4") {
        router.push("/transport-screen"); 



      } 
      else if(item.id=="3"){
        router.push("/emergency-contact");
      }

      else if(item.id=="1"){
        router.push("/travel-tips");
      }


      else if(item.id=="2"){
        router.push("/local-culture");
      }


      else {
        router.push(`/info/${item.id}`); 
      }
    };

    return (
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <ImageBackground source={item.image} style={styles.image} imageStyle={{ borderRadius: 15 }}>
          <View style={styles.overlay}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.container}>
      <Text style={styles.header}>Useful Information</Text>
      <FlatList data={topics} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} />
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  list: {
    alignItems: "center",
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

