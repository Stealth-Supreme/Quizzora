// Quiz Engine Core Module for Quizzora_v2
// Handles scoring, correctness validation, and question tracking

import { questions } from "../Data/Questions.js";
import { State } from "./State.js";

class QuizEngineCore {
  constructor() {
    this.questions = questions;
  }

  /**
   * Retrieves the current question object
   * @returns {object}
   */
  getCurrentQuestion() {
    return this.questions[State.currentQuestionIndex];
  }

  /**
   * Submits an answer choice and updates scores
   * @param {number} selectedIndex 
   * @returns {boolean} True if answer was correct
   */
  submitAnswer(selectedIndex) {
    const currentQ = this.getCurrentQuestion();
    const isCorrect = currentQ.correctIndex === selectedIndex;

    const newAnswer = {
      questionIndex: State.currentQuestionIndex,
      selectedIndex,
      isCorrect
    };

    const updatedAnswers = [...State.userAnswers, newAnswer];
    const newScore = isCorrect ? State.score + 1 : State.score;

    State.update({
      score: newScore,
      userAnswers: updatedAnswers
    });

    return isCorrect;
  }

  /**
   * Advances the quiz index
   * @returns {boolean} True if there is a next question, False if completed
   */
  advance() {
    const nextIdx = State.currentQuestionIndex + 1;
    if (nextIdx < this.questions.length) {
      State.update({
        currentQuestionIndex: nextIdx
      });
      return true;
    } else {
      State.update({
        isCompleted: true,
        isPerfectRun: State.score === this.questions.length
      });
      return false;
    }
  }

  /**
   * Checks if the quiz has completed all nodes
   * @returns {boolean}
   */
  isCompleted() {
    return State.isCompleted;
  }
}

export const QuizEngine = new QuizEngineCore();
export default QuizEngine;
