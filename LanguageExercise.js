const mongoose = require('mongoose');

const languageExerciseSchema = new mongoose.Schema({
  language: { type: String, required: true },
  difficulty: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    required: true 
  },
  exerciseType: { 
    type: String, 
    enum: ['vocabulary', 'phrase', 'grammar', 'listening', 'translation'], // Added 'translation'
    required: true 
  },
  prompt: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  acceptableAnswers: { type: [String], default: [] },
  options: { type: [String] },
  explanation: { type: String },
  requiresTextInput: { type: Boolean, default: false }, // Added this field
  createdAt: { type: Date, default: Date.now },
  requiresTextInput: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('LanguageExercise', languageExerciseSchema);