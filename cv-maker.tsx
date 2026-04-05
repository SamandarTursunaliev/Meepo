import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function CVMakerScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [experience, setExperience] = useState("");

  // Function to generate and share PDF
  const generatePDF = async () => {
    const html = `
      <html>
        <head>
          <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow&family=Julius+Sans+One&family=Open+Sans&family=Source+Sans+Pro&display=swap" rel="stylesheet">
          <style>
            ${styles}
          </style>
        </head>
        <body>
          <page size="A4">
            <div class="container">
              <div class="leftPanel">
                <div class="details">
                  <div class="item bottomLineSeparator">
                    <h2>CONTACT</h2>
                    <div class="smallText">
                      <p><i class="fa fa-phone contactIcon" aria-hidden="true"></i> ${phone}</p>
                      <p><i class="fa fa-envelope contactIcon" aria-hidden="true"></i> <a href="mailto:${email}">${email}</a></p>
                      <p><i class="fa fa-map-marker contactIcon" aria-hidden="true"></i> ${address}</p>
                      <p><i class="fa fa-linkedin-square contactIcon" aria-hidden="true"></i> <a href="${linkedin}">${linkedin}</a></p>
                    </div>
                  </div>
                  <div class="item bottomLineSeparator">
                    <h2>SKILLS</h2>
                    <div class="smallText">
                      ${skills.split(",").map(skill => `
                        <div class="skill">
                          <div><span>${skill.trim()}</span></div>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                  <div class="item">
                    <h2>EDUCATION</h2>
                    <div class="smallText">
                      <p class="bolded white">${education}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="rightPanel">
                <div>
                  <h1>${name}</h1>
                  <div class="smallText">
                    <h3>Accountant</h3>
                  </div>
                </div>
                <div>
                  <h2>About Me</h2>
                  <div class="smallText">
                    <p>${aboutMe}</p>
                  </div>
                </div>
                <div class="workExperience">
                  <h2>Work Experience</h2>
                  <ul>
                    <li>
                      <div class="jobPosition">
                        <span class="bolded">Accountant</span>
                        <span>Jun 2014 - Sept 2015</span>
                      </div>
                      <div class="projectName bolded">
                        <span>Accounting project name | Company name</span>
                      </div>
                      <div class="smallText">
                        <p>${experience}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </page>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });

      // Check if sharing is available
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing not available on this device.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <View style={nativeStyles.container}>
      <Text style={nativeStyles.header}>Create Your CV</Text>

      <TextInput style={nativeStyles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={nativeStyles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={nativeStyles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
      <TextInput style={nativeStyles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={nativeStyles.input} placeholder="LinkedIn Profile" value={linkedin} onChangeText={setLinkedin} />
      <TextInput style={nativeStyles.input} placeholder="Skills (comma separated)" value={skills} onChangeText={setSkills} />
      <TextInput style={nativeStyles.input} placeholder="Education" value={education} onChangeText={setEducation} />
      <TextInput style={nativeStyles.input} placeholder="About Me" value={aboutMe} onChangeText={setAboutMe} multiline />
      <TextInput style={nativeStyles.input} placeholder="Work Experience" value={experience} onChangeText={setExperience} multiline />

      <Button title="Generate & Share CV" onPress={generatePDF} />
    </View>
  );
}


const styles = `
  /* Fonts */

/* Family */
h1 { 
  font-family: 'Julius Sans One', sans-serif;
}

h2 { /* Contact, Skills, Education, About me, Work Experience */
  font-family: 'Archivo Narrow', sans-serif;
}

h3 { /* Accountant */
  font-family: 'Open Sans', sans-serif;
}

.jobPosition span, 
.projectName span {
  font-family: 'Source Sans Pro', sans-serif;
}

.upperCase {
  text-transform: uppercase; 
}

.smallText, 
.smallText span, 
.smallText p, 
.smallText a {
  font-family: 'Source Sans Pro', sans-serif;
  text-align: justify;
}

/* End Family */

/* Colors */
h1 { 
  color: #111; 
}

.leftPanel, 
.leftPanel a {
  color: #bebebe;
  text-decoration: none;
}

.leftPanel h2 {
  color: white;
}

/* End Colors */

/* Sizes */
h1 { 
  font-weight: 300; 
  font-size: 1.2cm;
  transform:scale(1,1.15); 
  margin-bottom: 0.2cm;
  margin-top: 0.2cm;
  text-transform: uppercase; 
}

h2 {
  margin-top: 0.1cm;
  margin-bottom: 0.1cm;
}

.leftPanel, 
.leftPanel a {
  font-size: 0.38cm;
}

.projectName span, 
.jobPosition span {
  font-size: 0.35cm;
}

.smallText, 
.smallText span, 
.smallText p, 
.smallText a {
  font-size: 0.35cm;
}

.leftPanel .smallText, 
.leftPanel .smallText, 
.leftPanel .smallText span, 
.leftPanel .smallText p, 
.smallText a {
  font-size: 0.45cm;
}

.contactIcon {
  width: 0.5cm;
  text-align: center;
}

p {
  margin-top: 0.05cm;
  margin-bottom: 0.05cm;
}
/* End Sizes */

.bolded {
  font-weight: bold;
}

.white {
  color: white;
}
/* End Fonts */

/* Layout */
body {
  background: rgb(204,204,204); 
  width: 21cm;
  height: 29.7cm;
  margin: 0 auto;
}

/* Printing */
page {
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
}

page[size="A4"] {  
  width: 21cm;
  height: 29.7cm; 
}

@page {
   size: 21cm 29.7cm;
   padding: 0;
   margin: 0mm;
   border: none;
   border-collapse: collapse;
}
/* End Printing */

.container {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
}

.leftPanel {
  width: 27%;
  background-color: #484444;
  padding: 0.7cm;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rightPanel {
  width: 73%;
  padding: 0.7cm;
}

.leftPanel img {
  width: 4cm;
  height: 4cm;
  margin-bottom: 0.7cm;
  border-radius: 50%;
  border: 0.15cm solid white;
  object-fit: cover;
  object-position: 50% 50%;
}

.leftPanel .details {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.skill {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.bottomLineSeparator {
  border-bottom: 0.05cm solid white;
}

.yearsOfExperience {
  width: 1.6cm;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.alignleft {
  text-align: left !important;
  width: 1cm;
}

.alignright {
  text-align: right !important;
  width: 0.6cm;
  margin-right: 0.1cm
}

.workExperience>ul {
  list-style-type: none;
  padding-left: 0;
}

.workExperience>ul>li {
  position: relative;
  margin: 0;
  padding-bottom: 0.5cm;
  padding-left: 0.5cm;
}

.workExperience>ul>li:before {
  background-color: #b8abab;
  width: 0.05cm;
  content: '';
  position: absolute;
  top: 0.1cm;
  bottom: -0.2cm; /* change this after border removal */
  left: 0.05cm;
}

.workExperience>ul>li::after {
  content: '';
  position: absolute;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='true' viewBox='0 0 32 32' focusable='false'%3E%3Ccircle stroke='none' fill='%23484444' cx='16' cy='16' r='10'%3E%3C/circle%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-size: contain;
  left: -0.09cm;
  top: 0;
  width: 0.35cm;
  height: 0.35cm;
}

.jobPosition {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.item {
  padding-bottom: 0.7cm;
  padding-top: 0.7cm;
}

.item h2{
  margin-top: 0;
}

.lastParagrafNoMarginBottom {
  margin-bottom: 0;
}

.workExperience>ul>li ul {
  padding-left: 0.5cm;
  list-style-type: disc;
}
/*End Layout*/
  
`;


const nativeStyles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
});