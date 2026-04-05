import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

//https://www.postman.com/api-evangelist/exchange-rate-api/documentation/df2h3su/exchangerate-api
//exchangerate-api.com
const currencyDefinitions = {
  USD: "United States Dollar",
  EUR: "Euro",
  GBP: "British Pound Sterling",
  JPY: "Japanese Yen",
  AUD: "Australian Dollar",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  SEK: "Swedish Krona",
  NZD: "New Zealand Dollar",
  AED: "United Arab Emirates Dirham",
  AFN:"Afghan Afghani",
  ALL:"Albanian Lek",
  AMD:"Armenian Dram",
  ANG:"Netherlands Antillean Guilder",
  AOA:"Angolan Kwanza",
  ARS:"Argentine Peso",
  AWG:"Aruban Florin",
  AZN:"Azerbaijani Manat",
  BAM:"Bosnia-Herzegovina Convertible Mark",
  BBD:"Barbadian Dollar",
  BDT:"Bangladeshi Taka",
  BGN:"Bulgarian Lev",
  BHD:"Bahraini Dinar",
  BIF:"Burundian Franc",
  BMD:"Bermudan Dollar",
  BND:"Brunei Dollar",
  BOB:"Bolivian Boliviano",
  BRL:"Brazilian Real",
  BSD:"Bahamian Dollar",
  BTN:"The Bhutanese ngultrum",
  BWP:"Botswana pula",
  BYN:"Belarusian ruble",
  BZD:"Belize Dollar",
  CDF:"Congolese Franc",
  CLP:"Chilean Peso",
  COP:"Colombian Peso",
  CRC:"Costa Rican Colón",
  CUP:"Cuban Peso",
  CVE:"Cape Verdean Escudo",
  CZK:"Czech Korun",
  DJF:"Djiboutian Franc",
  DKK:"Danish Krone",
  DOP:"Dominican Peso",
  DZD:"Algerian Dinar",
  EGP:"Egyptian Pound",
  ERN:"Eritrean Nakfa",
  ETB:"Ethiopian Birr",
  FJD:"Fijian Dollar",
  FKP:"Falkland Islands Pound",
  FOK:"Faroese króna",
  GEL:"Georgian Lari",
  GGP:"Guernsey Pound",
  GHS:"Ghanaian Cedi",
  GIP:"Gibraltar Pound",
  GMD:"Gambian Dalasi",
  GNF:"Guinean Franc",
  GTQ:"Guatemalan Quetzal",
  GYD:"Guyanese dollar",
  HKD:"Hong Kong Dollar",
  HNL:"Honduran Lempira",
  HRK:"Croatian Kuna",
  HTG:"Haitian Gourde",
  HUF:"Hungarian Forint",
  IDR:"Indonesian Rupiah",
  ILS:"Israeli new shekel",
  IMP:"Manx pound",
  INR:"The Indian rupee",
  IQD:"Iraqi Dinar",
  IRR:"Iranian Rial",
  ISK:"Icelandic Króna",
  JEP:"Jersey pound",
  JMD:"Jamaican Dollar",
  JOD:"Jordanian Dinar",
  KES:"Kenyan Shilling",
  KGS:"Kyrgystani Som",
  KHR:"Cambodian riel",
  KID:"Kiribati dollar",
  KMF:"Comorian Franc",
  KRW:"South Korean won",
  KWD:"Kuwaiti Dinar",
  KYD:"Cayman Islands Dollar",
  KZT:"Kazakhstani Tenge",
  LAK:"Laotian Kip",
  LBP:"Lebanese pound",
  LKR:"Sri Lankan Rupee",
  LRD:"Liberian Dollar",
  LSL:"Lesotho Loti",
  LYD:"Libyan Dinar",
  MAD:"Moroccan Dirham",
  MDL:"Moldovan Leu",
  MGA:"Malagasy Ariary",
  MKD:"Macedonian Denar",
  MMK:"Myanmar Kyat",
  MNT:"Mongolian Tugrik",
  MOP:"Macanese Pataca",
  MRU:"Mauritanian ouguiya",
  MUR:"Mauritian Rupee",
  MVR:"Maldivian Rufiyaa",
  MWK:"Malawian Kwacha",
  MXN:"Mexican Peso",
  MYR:"Malaysian Ringgit",
  MZN:"Mozambican metical",
  NAD:"Namibian Dollar",
  NGN:"Nigerian Naira",
  NIO:"Nicaraguan Córdoba",
  NOK:"Norwegian Krone",
  NPR:"Nepalese Rupee",
  OMR:"Omani Rial",
  PAB:"Panamanian Balboa",
  PEN:"Sol",
  PGK:"Papua New Guinean Kina",
  PHP:"Philippine peso",
  PKR:"Pakistani Rupee",
  PLN:"Polish złoty",
  PYG:"Paraguayan Guarani",
  QAR:"Qatari Riyal",
  RON:"Romanian Leu",
  RSD:"Serbian Dinar",
  RUB:"Russian Ruble",
  RWF:"Rwandan Franc",
  SAR:"Saudi Riyal",
  SBD:"Solomon Islands Dollar",
  SCR:"Seychellois Rupee",
  SDG:"Sudanese pound",
  SGD:"Singapore Dollar",
  SHP:"St. Helena Pound",
  SLE:"Sierra Leonean Leone",
  SLL:"Sierra Leonean Leone",
  SOS:"Somali Shilling",
  SRD:"Surinamese Dollar",
  SSP:"South Sudanese Pound",
  STN:"São Tomé and Príncipe dobra",
  SYP:"Syrian Pound",
  SZL:"Swazi Lilangeni",
  THB:"Thai Baht",
  TJS:"Tajikistani Somoni",
  TMT:"Turkmenistani Manat",
  TND:"Tunisian Dinar",
  TOP:"The Kuwaiti dinar",
  TRY:"Turkish lira",
  TTD:"Trinidad & Tobago Dollar",
  TVD:"The Tuvaluan dollar",
  TWD:"New Taiwan dollar",
  TZS:"Tanzanian Shilling",
  UAH:"Ukrainian hryvnia",
  UGX:"Ugandan Shilling",
  UYU:"Uruguayan Peso",
  UZS:"Uzbekistani Som",
  VES:"Venezuelan Bolívar",
  VND:"Vietnamese dong",
  VUV:"Vanuatu Vatu",
  WST:"Samoan Tala",
  XAF:"Central African Frank",
  XCD:"East Caribbean Dollar",
  XDR:"Special Drawing Rights",
  XOF:"West African CFA franc",
  XPF:"CFP Franc",
  YER:"Yemeni Rial",
  ZAR:"South African Rand",
  ZMW:"Zambian Kwacha",
  ZWL:"Zimbabwean dollar",


};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch exchange rates.");
    }
  };

  const convertCurrency = () => {
    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      Alert.alert("Error", "Invalid currency selection.");
      return;
    }
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConvertedAmount(result);
  };

  const filteredCurrencies = Object.keys(exchangeRates).filter((currency) =>
    `${currency} - ${currencyDefinitions[currency] || "Unknown"}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const renderCurrencyItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        if (showFromDropdown) {
          setFromCurrency(item);
          setShowFromDropdown(false);
        } else if (showToDropdown) {
          setToCurrency(item);
          setShowToDropdown(false);
        }
        setSearchQuery("");
      }}
    >
      <Text style={styles.dropdownItemText}>
        {item} - {currencyDefinitions[item] || "Unknown"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require("../assets/myappimages/currency_exchange.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]} style={styles.gradient}>
          <View style={styles.container}>
            <Text style={styles.header}>Currency Converter</Text>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor="#ddd"
              value={amount}
              onChangeText={setAmount}
            />

            {/* From Currency Dropdown */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>From:</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowFromDropdown(!showFromDropdown);
                  setShowToDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {fromCurrency} - {currencyDefinitions[fromCurrency] || "Unknown"}
                </Text>
              </TouchableOpacity>
              {showFromDropdown && (
                <View style={styles.dropdown}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search currency..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <FlatList
                    data={filteredCurrencies}
                    renderItem={renderCurrencyItem}
                    keyExtractor={(item) => item}
                    style={styles.dropdownList}
                  />
                </View>
              )}
            </View>

            {/* To Currency Dropdown */}
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>To:</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => {
                  setShowToDropdown(!showToDropdown);
                  setShowFromDropdown(false);
                }}
              >
                <Text style={styles.dropdownButtonText}>
                  {toCurrency} - {currencyDefinitions[toCurrency] || "Unknown"}
                </Text>
              </TouchableOpacity>
              {showToDropdown && (
                <View style={styles.dropdown}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search currency..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <FlatList
                    data={filteredCurrencies}
                    renderItem={renderCurrencyItem}
                    keyExtractor={(item) => item}
                    style={styles.dropdownList}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.convertButton} onPress={convertCurrency}>
              <Text style={styles.buttonText}>Convert</Text>
            </TouchableOpacity>

            {convertedAmount !== null && (
              <Text style={styles.result}>
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </Text>
            )}
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
  },
  container: {
    width: "92%",
    padding: 25,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(10px)",
    alignItems: "center",
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
    width: "90%",
    height: 60,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 20,
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerContainer: {
    width: "90%",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
    marginLeft: 5,
  },
  dropdownButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
  },
  dropdown: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  searchInput: {
    height: 45,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    margin: 10,
    color: "#333",
    backgroundColor: "#fff",
  },
  dropdownList: {
    maxHeight: 250,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  convertButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  result: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 25,
    color: "#fff",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
  },
});