import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";

import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

export default function LanguageTranslator() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en");
  const [toLanguage, setToLanguage] = useState("es");
  const [loading, setLoading] = useState(false);

  const languageOptions = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    zh: "Chinese",
    ru: "Russian",
    ja: "Japanese",
    ar: "Arabic",
  };

  
  //https://mymemory.translated.net/
  // Fetch Translation
  const translateText = async () => {
    if (!inputText.trim()) {
      Alert.alert("Error", "Please enter text to translate.");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=${fromLanguage}|${toLanguage}`
      );
      const data = await response.json();
      if (data.responseData) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        Alert.alert("Translation Error", "Failed to translate text.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not fetch translation.");
    }

    setLoading(false);
  };

  // Speak Translated Text
  const speakTranslation = () => {
    if (translatedText) {
      Speech.speak(translatedText, { language: toLanguage });
    } else {
      Alert.alert("Error", "No translated text to speak.");
    }
  };

  return (
    <ImageBackground source={require("../assets/myappimages/background_image.jpg")} style={styles.background} resizeMode="cover">
      <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.header}>Language Translator</Text>

            {/* Input Text Box */}
            <TextInput
              style={styles.input}
              placeholder="Enter text to translate"
              placeholderTextColor="#ddd"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />

            {/* Language Selection */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>From:</Text>
              <Picker selectedValue={fromLanguage} onValueChange={setFromLanguage} style={styles.picker}>
                {Object.entries(languageOptions).map(([code, name]) => (
                  <Picker.Item key={code} label={`${name} (${code.toUpperCase()})`} value={code} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>To:</Text>
              <Picker selectedValue={toLanguage} onValueChange={setToLanguage} style={styles.picker}>
                {Object.entries(languageOptions).map(([code, name]) => (
                  <Picker.Item key={code} label={`${name} (${code.toUpperCase()})`} value={code} />
                ))}
              </Picker>
            </View>

            {/* Translate Button */}
            <TouchableOpacity style={styles.translateButton} onPress={translateText} disabled={loading}>
            <MaterialIcons name="translate" size={24} color="white" />
            <Text style={styles.buttonText}>{loading ? "Translating..." : "Translate"}</Text>
            </TouchableOpacity>

            {/* Display Translated Text */}
            {translatedText !== "" && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Translated Text:</Text>
                <Text style={styles.result}>{translatedText}</Text>

                {/* Speak Button */}
                <TouchableOpacity style={styles.speakButton} onPress={speakTranslation}>
                <MaterialIcons name="volume-up" size={24} color="white" />
                <Text style={styles.buttonText}>Listen</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
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
    paddingTop: 60,
  },
  container: {
    width: "94%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    alignItems: "center",
    elevation: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    padding: 20,
    fontSize: 18,
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    overflow: 'hidden',
  },
  label: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 15,
    marginTop: 10,
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#fff",
    backgroundColor: "transparent",
  },
  translateButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  speakButton: {
    backgroundColor: "#34C759",
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 25,
    padding: 25,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  result: {
    fontSize: 18,
    color: "#fff",
    lineHeight: 24,
    textAlign: "center",
  },
});