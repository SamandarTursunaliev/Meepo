const mongoose = require('mongoose');
const LanguageExercise = require('./models/LanguageExercise');
require('dotenv').config();

const exercises = [
  // Vocabulary exercises
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'vocabulary',
    prompt: 'What do you call a place where you borrow books?',
    correctAnswer: 'library',
    options: ['library', 'school', 'office', 'store'],
    explanation: "A library is a place where you can borrow books and other materials."
  },
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'vocabulary',
    prompt: 'What do you call the meal you eat in the morning?',
    correctAnswer: 'breakfast',
    options: ['breakfast', 'lunch', 'dinner', 'snack'],
    explanation: "Breakfast is the first meal of the day, typically eaten in the morning."
  },

  // Grammar exercises
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'grammar',
    prompt: 'Complete: She ___ to school every day.',
    correctAnswer: 'goes',
    options: ['go', 'goes', 'going', 'gone'],
    explanation: "We use 'goes' for third person singular (he/she/it) in present simple tense."
  },
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'grammar',
    prompt: 'Complete: They ___ playing football.',
    correctAnswer: 'are',
    options: ['is', 'am', 'are', 'be'],
    explanation: "'Are' is used with plural subjects in present continuous tense."
  },

  // Phrase exercises (with unique explanations)
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'phrase',
    prompt: 'How do you greet someone in English?',
    correctAnswer: 'Hello',
    acceptableAnswers: ['Hi', 'Hey', 'Good morning', 'Good afternoon', 'Good evening'],
    explanation: "Common English greetings include 'Hello', 'Hi', or time-specific greetings like 'Good morning'.",
    requiresTextInput: true
  },
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'phrase',
    prompt: 'What would you say when you need help?',
    correctAnswer: 'Can you help me?',
    acceptableAnswers: [
      "I need help", 
      "Please help me", 
      "Could you assist me?",
      "I could use some help"
    ],
    explanation: "Polite ways to ask for help include 'Can you help me?' or 'Could you assist me?'",
    requiresTextInput: true
  },
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'phrase',
    prompt: 'How would you say "I am hungry" in a more polite way?',
    correctAnswer: 'I would like something to eat',
    acceptableAnswers: [
      "I'm feeling hungry", 
      "Could I get something to eat?",
      "I'd like to eat something",
      "May I have something to eat?"
    ],
    explanation: "Using 'I would like' is more polite than saying 'I want' in English.",
    requiresTextInput: true
  },
  {
    language: 'english',
    difficulty: 'beginner',
    exerciseType: 'phrase',
    prompt: 'How would you ask for the time politely?',
    correctAnswer: 'Could you tell me the time, please?',
    acceptableAnswers: [
      "What time is it?",
      "Do you have the time?",
      "May I know what time it is?"
    ],
    explanation: "Adding 'please' and using 'Could you' makes requests more polite.",
    requiresTextInput: true
  }
];
//creating the data and fetching it to the database
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await LanguageExercise.deleteMany({});
    console.log('🗑️ Deleted all existing exercises');

    // Insert new data
    await LanguageExercise.insertMany(exercises);
    console.log('🌱 Database seeded successfully!');
    console.log(`📊 Created ${exercises.length} exercises`);

    // Verify insertion
    const count = await LanguageExercise.countDocuments();
    console.log(`🔍 Total exercises in database: ${count}`);

    // Disconnect
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();