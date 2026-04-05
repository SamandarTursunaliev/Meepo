const express = require('express');
const router = express.Router();
const LanguageExercise = require('../models/LanguageExercise');
const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Constants
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const MAX_ANSWER_LENGTH = 500;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const SIMILARITY_THRESHOLD = 0.8;

// Logging middleware
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Validation middleware
const validateMongoId = (idParam) => {
  return param(idParam)
    .notEmpty()
    .withMessage('ID is required')
    .isMongoId()
    .withMessage('Invalid ID format');
};

const validateDifficulty = [
  param('difficulty')
    .isString()
    .toLowerCase()
    .isIn(VALID_DIFFICULTIES)
    .withMessage(`Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`)
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${MAX_LIMIT}`)
];

const validateSubmission = [
  body('exerciseId')
    .notEmpty()
    .withMessage('Exercise ID is required')
    .isMongoId()
    .withMessage('Invalid exercise ID format'),
  body('userAnswer')
    .notEmpty()
    .withMessage('Answer cannot be empty')
    .trim()
    .isLength({ max: MAX_ANSWER_LENGTH })
    .withMessage(`Answer must be less than ${MAX_ANSWER_LENGTH} characters`)
];

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        param: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Helper functions  https://www.geeksforgeeks.org/introduction-to-levenshtein-distance/
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Swap to save memory if one string is much longer
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const previousRow = Array(a.length + 1).fill(0).map((_, i) => i);
  const currentRow = Array(a.length + 1).fill(0);

  for (let j = 1; j <= b.length; j++) {
    currentRow[0] = j;
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currentRow[i] = Math.min(
        previousRow[i] + 1,    // Deletion
        currentRow[i - 1] + 1, // Insertion
        previousRow[i - 1] + cost // Substitution
      );
    }
    [previousRow, currentRow] = [currentRow, previousRow];
  }

  return previousRow[a.length];
}

function calculateSimilarity(str1, str2) {
  if (!str1 && !str2) return 1.0;
  if (!str1 || !str2) return 0.0;
  
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  // Quick check for containment
  if (longer.includes(shorter)) {
    return shorter.length / longer.length;
  }
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / parseFloat(longer.length);
}

function checkAnswer(userAnswer, exercise) {
  // Input validation
  if (!userAnswer || !exercise?.correctAnswer) {
    console.warn('Missing answer data:', { userAnswer, exercise: !!exercise });
    return { isCorrect: false, details: { reason: 'Missing data' } };
  }

  if (typeof userAnswer !== 'string' || typeof exercise.correctAnswer !== 'string') {
    return { 
      isCorrect: false, 
      details: { reason: 'Invalid input types for comparison' } 
    };
  }

  // First, try exact match (case-insensitive)
  if (userAnswer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase()) {
    return { isCorrect: true, details: { matchType: 'exact-case-insensitive' } };
  }

  // Normalize function - more lenient for punctuation and spacing
  const normalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase()
      .trim()
      .replace(/[.,\/#!$%^&*;:{}=\-_`~()?]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/['"`]/g, ''); // Handle quotes
  };

  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(exercise.correctAnswer);

  // Check normalized exact match
  if (normalizedUser === normalizedCorrect) {
    return { isCorrect: true, details: { matchType: 'normalized-exact' } };
  }

  // Check acceptable answers
  if (exercise.acceptableAnswers?.length > 0) {
    for (let i = 0; i < exercise.acceptableAnswers.length; i++) {
      const acceptableAnswer = exercise.acceptableAnswers[i];
      
      // Try exact match with acceptable answer
      if (userAnswer.trim().toLowerCase() === acceptableAnswer.trim().toLowerCase()) {
        return { isCorrect: true, details: { matchType: 'acceptable-exact' } };
      }
      
      // Try normalized match with acceptable answer
      const normalizedAcceptable = normalize(acceptableAnswer);
      if (normalizedUser === normalizedAcceptable) {
        return { isCorrect: true, details: { matchType: 'acceptable-normalized' } };
      }
    }
  }

  // Special handling for translation/phrase exercises with similarity check
  if (exercise.exerciseType === 'translation' || exercise.exerciseType === 'phrase') {
    try {
      if (!normalizedUser || !normalizedCorrect) {
        return { 
          isCorrect: false, 
          details: { reason: 'Normalization failed' } 
        };
      }

      const similarity = calculateSimilarity(normalizedUser, normalizedCorrect);
      
      if (similarity >= SIMILARITY_THRESHOLD) {
        return { 
          isCorrect: true, 
          details: { 
            matchType: 'similarity', 
            score: similarity,
            threshold: SIMILARITY_THRESHOLD
          } 
        };
      }
      
      return { 
        isCorrect: false, 
        details: { 
          matchType: 'similarity-failed', 
          score: similarity,
          threshold: SIMILARITY_THRESHOLD
        } 
      };
    } catch (error) {
      console.error('Similarity check error:', error);
      return {
        isCorrect: false,
        details: { reason: 'Similarity comparison failed' }
      };
    }
  }

  // Check if only difference is punctuation
  const userWithoutPunctuation = userAnswer.replace(/[.,\/#!$%^&*;:{}=\-_`~()?]/g, '').trim();
  const correctWithoutPunctuation = exercise.correctAnswer.replace(/[.,\/#!$%^&*;:{}=\-_`~()?]/g, '').trim();
  
  if (userWithoutPunctuation.toLowerCase() === correctWithoutPunctuation.toLowerCase()) {
    return { isCorrect: true, details: { matchType: 'punctuation-difference' } };
  }

  return { isCorrect: false, details: { matchType: 'no-match' } };
}

function handleServerError(err, req, res) {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Server operation failed',
    errorDetails: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack,
      query: req.params
    } : undefined
  });
}

// Public Routes
router.get('/exercises/:language/:difficulty', 
  validateDifficulty,
  validatePagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || DEFAULT_PAGE;
      const limit = parseInt(req.query.limit) || DEFAULT_LIMIT;
      const skip = (page - 1) * limit;

      const language = req.params.language.toLowerCase();
      const difficulty = req.params.difficulty.toLowerCase();

      const query = {
        language: { $regex: new RegExp(`^${language}$`, 'i') },
        difficulty: { $regex: new RegExp(`^${difficulty}$`, 'i') }
      };

      const [exercises, totalExercises] = await Promise.all([
        LanguageExercise.find(query)
          .skip(skip)
          .limit(limit)
          .select('-__v')
          .lean(),
        LanguageExercise.countDocuments(query)
      ]);

      if (exercises.length === 0) {
        const [availableLanguages, availableDifficulties] = await Promise.all([
          LanguageExercise.distinct('language'),
          LanguageExercise.distinct('difficulty')
        ]);
        
        return res.status(404).json({
          success: false,
          message: 'No exercises found matching your criteria',
          suggestions: {
            availableLanguages,
            availableDifficulties,
            tryThese: [
              `/exercises/english/beginner`,
              `/exercises/english/intermediate`
            ]
          }
        });
      }

      res.json({
        success: true,
        data: exercises,
        pagination: {
          page,
          limit,
          total: totalExercises,
          pages: Math.ceil(totalExercises / limit),
          hasMore: page * limit < totalExercises
        }
      });
    } catch (err) {
      handleServerError(err, req, res);
    }
  }
);

router.post('/submit-answer', 
  validateSubmission,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { exerciseId, userAnswer } = req.body;
      const exercise = await LanguageExercise.findById(exerciseId)
        .select('correctAnswer acceptableAnswers exerciseType explanation')
        .lean();

      if (!exercise) {
        return res.status(404).json({ 
          success: false,
          message: 'Exercise not found',
          suggestion: 'Try getting a new exercise first'
        });
      }

      const result = checkAnswer(userAnswer, exercise);
      const responseData = {
        success: true,
        isCorrect: result.isCorrect,
        correctAnswer: exercise.correctAnswer,
        exerciseType: exercise.exerciseType,
        userAnswer: userAnswer,
        matchDetails: process.env.NODE_ENV === 'development' ? result.details : undefined
      };

      if (!result.isCorrect && exercise.explanation) {
        responseData.explanation = exercise.explanation;
      }

      res.json(responseData);
    } catch (err) {
      handleServerError(err, req, res);
    }
  }
);

router.get('/exercise/:id', 
  validateMongoId('id'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const exercise = await LanguageExercise.findById(req.params.id)
        .select('-__v')
        .lean();

      if (!exercise) {
        return res.status(404).json({ 
          success: false,
          message: 'Exercise not found',
          suggestion: 'Check the ID or fetch new exercises'
        });
      }

      res.json({ 
        success: true,
        data: exercise 
      });
    } catch (err) {
      handleServerError(err, req, res);
    }
  }
);

router.get('/random', 
  validatePagination,
  handleValidationErrors,
  async (req, res) => {
    try {
      const filter = {};
      
      if (req.query.language) {
        filter.language = { $regex: new RegExp(`^${req.query.language}$`, 'i') };
      }
      
      if (req.query.difficulty && VALID_DIFFICULTIES.includes(req.query.difficulty.toLowerCase())) {
        filter.difficulty = { $regex: new RegExp(`^${req.query.difficulty}$`, 'i') };
      }
      
      if (req.query.exerciseType) {
        filter.exerciseType = { $regex: new RegExp(`^${req.query.exerciseType}$`, 'i') };
      }

      const count = await LanguageExercise.countDocuments(filter);
      
      if (count === 0) {
        return res.status(404).json({
          success: false,
          message: 'No exercises found matching your criteria',
          filter
        });
      }
      
      const random = Math.floor(Math.random() * count);
      const exercise = await LanguageExercise.findOne(filter)
        .skip(random)
        .select('-__v')
        .lean();

      res.json({
        success: true,
        data: exercise
      });
    } catch (err) {
      handleServerError(err, req, res);
    }
  }
);

// Debug endpoint for testing
router.post('/debug/test-answer-matching', async (req, res) => {
  try {
    const { userAnswer, correctAnswer, exerciseType = 'translation' } = req.body;
    
    if (!userAnswer || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Both userAnswer and correctAnswer are required'
      });
    }
    
    const mockExercise = {
      correctAnswer,
      exerciseType,
      acceptableAnswers: req.body.acceptableAnswers || []
    };
    
    const result = checkAnswer(userAnswer, mockExercise);
    
    const analysis = {
      userAnswer,
      correctAnswer,
      normalizedUser: userAnswer.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%^&*;:{}=\-_`~()?]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/['"`]/g, ''),
      normalizedCorrect: correctAnswer.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[.,\/#!$%^&*;:{}=\-_`~()?]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/['"`]/g, ''),
      levenshteinDistance: levenshteinDistance(
        userAnswer.toLowerCase().trim(),
        correctAnswer.toLowerCase().trim()
      ),
      similarity: calculateSimilarity(
        userAnswer.toLowerCase().trim(),
        correctAnswer.toLowerCase().trim()
      ),
      result
    };
    
    res.json({
      success: true,
      analysis,
      isCorrect: result.isCorrect
    });
  } catch (err) {
    handleServerError(err, req, res);
  }
});

module.exports = router;