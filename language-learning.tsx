import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

type Exercise = {
  _id: string;
  language: string;
  difficulty: string;
  exerciseType: string;
  prompt: string;
  correctAnswer: string;
  acceptableAnswers: string[];
  options?: string[];
  explanation?: string;
  requiresTextInput?: boolean;
};

type Result = {
  isCorrect?: boolean;
  correctAnswer?: string;
  explanation?: string;
  matchDetails?: any;
};

const API_BASE_URL = 'http://192.168.0.231:5000/api';
const TIMEOUT_DURATION = 15000;

const LanguageLearningPage = () => {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState({
    exercises: true,
    submission: false
  });
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ correct: 0, attempted: 0 });

  const fetchWithTimeout = useCallback(async (url: string, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.text();  
        try {
          const jsonError = JSON.parse(errorData);  
          throw new Error(jsonError.message || `HTTP ${response.status}`);
        } catch (jsonError) {
          throw new Error(`Error: ${errorData}`);  
        }
      }

      return await response.json(); 
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Error in fetchWithTimeout:", error);
      throw error;
    }
  }, []);

  const fetchExercises = useCallback(async (language: string, difficulty: string) => {
    try {
      setLoading(prev => ({ ...prev, exercises: true }));
      setError(null);
      setResult(null);
      setUserAnswer('');
      
      const data = await fetchWithTimeout(
        `${API_BASE_URL}/language/exercises/${language.toLowerCase()}/${difficulty.toLowerCase()}`
      );
      
      if (!data.success || !data.data?.length) {
        Alert.alert('Info', 'No exercises available');
        return;
      }

      setExercises(data.data);
      setCurrentExercise(data.data[0]);
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
      Alert.alert('Error', `Failed to load exercises: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, exercises: false }));
    }
  }, [fetchWithTimeout]);

  useFocusEffect(
    useCallback(() => {
      fetchExercises('english', 'beginner');
    }, [fetchExercises])
  );

  const submitAnswer = async () => {
    if (!currentExercise || !userAnswer.trim()) {
      Alert.alert('Error', 'Please enter an answer');
      return;
    }

    try {
      Keyboard.dismiss();
      setLoading(prev => ({ ...prev, submission: true }));

      const response = await fetchWithTimeout(`${API_BASE_URL}/language/submit-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId: currentExercise._id,
          userAnswer: userAnswer.trim(),
        }),
      });

      if (response && response.isCorrect !== undefined) {
        setResult(response);
        setProgress(prev => ({
          correct: response.isCorrect ? prev.correct + 1 : prev.correct,
          attempted: prev.attempted + 1,
        }));
      } else {
        throw new Error("Unexpected response structure");
      }

    } catch (error) {
      console.error('Submission error:', {
        message: error.message,
        exerciseId: currentExercise?._id,
        userAnswer,
        stack: error.stack,
      });

      setError(error.message);
      setResult({
        isCorrect: false,
        correctAnswer: currentExercise.correctAnswer,
        explanation: error.message || 'Error checking your answer',
      });
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  const nextExercise = useCallback(() => {
    setUserAnswer('');
    setResult(null);
    setError(null);
    
    if (!currentExercise || !exercises.length) return;

    const currentIndex = exercises.findIndex(ex => ex._id === currentExercise._id);
    if (currentIndex < exercises.length - 1) {
      setCurrentExercise(exercises[currentIndex + 1]);
    } else {
      Alert.alert(
        'Completed!',
        'You finished all exercises!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }
  }, [currentExercise, exercises, navigation]);

  const renderAnswerInput = () => {
    if (!currentExercise) return null;

    if (currentExercise.requiresTextInput || !currentExercise.options) {
      return (
        <TextInput
          style={[styles.input, loading.submission && styles.disabledInput]}
          value={userAnswer}
          onChangeText={setUserAnswer}
          placeholder="Type your answer here..."
          placeholderTextColor="#999"
          onSubmitEditing={submitAnswer}
          autoCapitalize="sentences"
          autoCorrect={true}
          editable={!loading.submission}
          returnKeyType="done"
          blurOnSubmit={true}
        />
      );
    }

    return (
      <View style={styles.optionsContainer}>
        {currentExercise.options?.map((option, index) => (
          <TouchableOpacity
            key={`${option}-${index}`}
            style={[ 
              styles.optionButton, 
              userAnswer === option && styles.selectedOption, 
              loading.submission && styles.disabledOption 
            ]}
            onPress={() => !loading.submission && setUserAnswer(option)}
            disabled={loading.submission}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <View style={[ 
        styles.resultContainer, 
        result.isCorrect ? styles.correctResult : styles.incorrectResult 
      ]}>
        <Text style={styles.resultText}>
          {result.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </Text>

        {!result.isCorrect && (
          <>
            <Text style={styles.correctAnswerText}>
              Correct answer: {result.correctAnswer}
            </Text>
            {result.explanation && (
              <Text style={styles.explanationText}>{result.explanation}</Text>
            )}
            {result.matchDetails && process.env.NODE_ENV === 'development' && (
              <Text style={styles.debugText}>
                Match details: {JSON.stringify(result.matchDetails)}
              </Text>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={nextExercise}
          disabled={loading.submission}
        >
          <Text style={styles.nextButtonText}>
            {loading.submission ? 'Loading...' : 'Next Exercise'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading.exercises && !currentExercise) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading exercises...</Text>
      </View>
    );
  }

  if (error || !currentExercise) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'No exercises available'}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchExercises('english', 'beginner')}
          disabled={loading.exercises}
        >
          {loading.exercises ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.retryButtonText}>Try Again</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Progress: {progress.correct}/{progress.attempted}
          </Text>
          <View style={styles.progressBar}>
            <View style={[ 
              styles.progressFill, 
              { 
                width: `${progress.attempted > 0 ? 
                  Math.min(100, (progress.correct / progress.attempted) * 100) : 0}%` 
              } 
            ]} />
          </View>
        </View>

        <View style={styles.exerciseContainer}>
          <Text style={styles.prompt}>{currentExercise.prompt}</Text>
          {renderAnswerInput()}
        </View>

        {result ? renderResult() : (
          <TouchableOpacity
            style={[ 
              styles.submitButton, 
              (!userAnswer.trim() || loading.submission) && styles.disabledButton 
            ]}
            onPress={submitAnswer}
            disabled={!userAnswer.trim() || loading.submission}
          >
            {loading.submission ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EA4335',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 25,
  },
  progressText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
  },
  exerciseContainer: {
    marginBottom: 30,
  },
  prompt: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4285F4',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 8,
  },
  correctResult: {
    backgroundColor: '#a8e6a0',
  },
  incorrectResult: {
    backgroundColor: '#f8d7da',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  correctAnswerText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    textAlign: 'center',
  },
  explanationText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  debugText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LanguageLearningPage;
