const axios = require('axios');
const { faker } = require('@faker-js/faker/locale/en'); 

const API_URL = 'http://192.168.0.231:5000/api/jobs';
//Generating the jobs dataset for our finding the jobs functionality
const jobCategories = [
    { title: "Software Engineer", skills: ["JavaScript", "React", "Node.js", "MongoDB"] },
    { title: "Data Scientist", skills: ["Python", "TensorFlow", "Pandas", "SQL"] },
    { title: "Marketing Manager", skills: ["SEO", "Google Analytics", "Content Marketing"] },
    { title: "Financial Analyst", skills: ["Excel", "Financial Modeling", "Risk Assessment"] },
    { title: "HR Specialist", skills: ["Recruitment", "Employee Relations", "HR Policies"] },
    { title: "Mechanical Engineer", skills: ["AutoCAD", "SolidWorks", "MATLAB"] },
    { title: "Cleaner", skills: ["Time Management", "Attention to Detail", "Physical Stamina"] },
    { title: "Construction Worker", skills: ["Manual Labor", "Safety Procedures", "Basic Carpentry"] },
    { title: "Delivery Driver", skills: ["Navigation", "Customer Service", "Vehicle Maintenance"] },
    { title: "Warehouse Worker", skills: ["Inventory Management", "Forklift Operation", "Teamwork"] }
];

// Predefined list of meaningful English sentences
const englishSentences = [
    "We are looking for a talented individual to join our team.",
    "This role requires strong communication skills and attention to detail.",
    "The ideal candidate will have experience in a fast-paced environment.",
    "You will be responsible for managing projects and collaborating with cross-functional teams.",
    "We offer competitive salaries and opportunities for career growth.",
    "This position requires a proactive approach and the ability to work independently.",
    "Join our team and make a difference in a dynamic and innovative company.",
    "We value creativity, teamwork, and a passion for excellence.",
    "This role offers the chance to work on exciting projects with a talented team.",
    "We are committed to fostering a diverse and inclusive workplace."
];

// Function to generate a meaningful English sentence
function generateEnglishSentence() {
    return faker.helpers.arrayElement(englishSentences); // Randomly select a sentence
}

async function createJob() {
    const category = faker.helpers.arrayElement(jobCategories);
    const job = {
        title: category.title,
        description: generateEnglishSentence(), 
        company: faker.company.name(),
        location: 'London',
        salary: faker.number.int({ min: 20000, max: 120000 }),
        experience: faker.number.int({ min: 0, max: 10 }),
        skills: category.skills,
        jobType: faker.helpers.arrayElement(["remote", "hybrid", "onsite"]),
    };

    try {
        const response = await axios.post(API_URL, job);
        console.log(`✅ Job Created: ${response.data.title}`);
    } catch (error) {
        console.error('❌ Error creating job:', error.response ? error.response.data : error.message);
    }
}

async function generateJobs(count) {
    for (let i = 0; i < count; i++) {
        await createJob();
    }
}

generateJobs(100);