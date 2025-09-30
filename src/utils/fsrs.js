// FSRS-4.5 JavaScript Implementation for Alternative Lingvist
// Free Spaced Repetition Scheduler - Optimized for vocabulary learning

class FSRSEngine {
  constructor() {
    // FSRS-4.5 default parameters (can be optimized with user data)
    this.w = [
      0.4072, 1.1829, 3.1262, 15.4722, 7.2102,
      0.5316, 1.0651, 0.0234, 1.616, 0.1544,
      1.0824, 1.9813, 0.0953, 0.2975, 2.2042,
      0.2407, 2.9466, 0.5034, 0.6567
    ];

    // Grade definitions
    this.GRADE = {
      AGAIN: 1,  // Wrong answer, needs relearning
      HARD: 2,   // Correct but difficult
      GOOD: 3,   // Correct with normal effort
      EASY: 4    // Correct with ease
    };

    // Card states
    this.STATE = {
      NEW: 0,        // New card, never studied
      LEARNING: 1,   // Currently being learned
      REVIEW: 2,     // In review phase (mastered)
      RELEARNING: 3  // Forgotten, relearning
    };
  }

  // Create new card with default FSRS values
  createNewCard() {
    return {
      due: new Date(),
      stability: 1.0,
      difficulty: 5.0,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 0,
      lapses: 0,
      state: this.STATE.NEW,
      last_review: null
    };
  }

  // Calculate stability for a card based on grade
  calculateStability(card, grade) {
    if (card.state === this.STATE.NEW) {
      return this.w[grade - 1];
    }

    if (card.state === this.STATE.REVIEW) {
      if (grade === this.GRADE.AGAIN) {
        return this.w[11] * Math.pow(card.difficulty, -this.w[12]) * (Math.pow(card.stability + 1, this.w[13]) - 1) * Math.exp(-this.w[14] * card.elapsed_days);
      } else {
        return card.stability * (Math.exp(this.w[8]) * (11 - card.difficulty) * Math.pow(card.stability, -this.w[9]) * (Math.exp(this.w[10] * (1 - card.elapsed_days / card.scheduled_days)) - 1) + 1);
      }
    }

    if (card.state === this.STATE.LEARNING || card.state === this.STATE.RELEARNING) {
      return this.w[grade - 1];
    }

    return card.stability;
  }

  // Calculate difficulty for a card based on grade
  calculateDifficulty(card, grade) {
    if (card.state === this.STATE.NEW) {
      return Math.max(1, Math.min(10, this.w[4] - this.w[5] * (grade - 3)));
    }

    if (card.state === this.STATE.REVIEW && grade === this.GRADE.AGAIN) {
      return Math.max(1, Math.min(10, card.difficulty + this.w[6]));
    }

    if (card.state === this.STATE.REVIEW) {
      return Math.max(1, Math.min(10, card.difficulty - this.w[7] * (grade - 3)));
    }

    return card.difficulty;
  }

  // Calculate interval from stability
  calculateInterval(stability) {
    return Math.max(1, Math.round(stability * 0.9));
  }

  // Main scheduling function
  schedule(card, grade) {
    const now = new Date();
    const elapsed_days = card.last_review
      ? Math.floor((now - new Date(card.last_review)) / (1000 * 60 * 60 * 24))
      : 0;

    const new_stability = this.calculateStability({
      ...card,
      elapsed_days: elapsed_days
    }, grade);

    const new_difficulty = this.calculateDifficulty(card, grade);
    const interval = this.calculateInterval(new_stability);

    let new_state;
    if (card.state === this.STATE.NEW) {
      new_state = grade === this.GRADE.AGAIN ? this.STATE.LEARNING : this.STATE.REVIEW;
    } else if (card.state === this.STATE.LEARNING) {
      new_state = grade === this.GRADE.AGAIN ? this.STATE.LEARNING : this.STATE.REVIEW;
    } else if (card.state === this.STATE.REVIEW) {
      new_state = grade === this.GRADE.AGAIN ? this.STATE.RELEARNING : this.STATE.REVIEW;
    } else { // RELEARNING
      new_state = grade === this.GRADE.AGAIN ? this.STATE.RELEARNING : this.STATE.REVIEW;
    }

    return {
      due: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
      stability: new_stability,
      difficulty: new_difficulty,
      elapsed_days: elapsed_days,
      scheduled_days: interval,
      reps: card.reps + 1,
      lapses: grade === this.GRADE.AGAIN ? card.lapses + 1 : card.lapses,
      state: new_state,
      last_review: now
    };
  }

  // Get cards that are due for review
  getDueCards(cards, limit = 20) {
    const now = new Date();

    const newCards = cards.filter(card =>
      card.fsrs.state === this.STATE.NEW
    );

    const dueCards = cards.filter(card =>
      card.fsrs.due <= now && card.fsrs.state !== this.STATE.NEW
    );

    const learningCards = cards.filter(card =>
      card.fsrs.state === this.STATE.LEARNING || card.fsrs.state === this.STATE.RELEARNING
    );

    // Priority: due cards, learning cards, then new cards
    return [
      ...dueCards,
      ...learningCards,
      ...newCards
    ].slice(0, limit);
  }

  // Check if a card is due
  isDue(card) {
    return new Date(card.fsrs.due) <= new Date();
  }

  // Get grade based on session performance (5-step progress integration)
  getGradeFromSessionProgress(isCorrect, sessionProgress, difficulty = 5) {
    if (!isCorrect) {
      return this.GRADE.AGAIN;
    }

    // Map session progress to grade quality
    if (sessionProgress >= 4) {
      return this.GRADE.EASY;  // Mastered in session
    } else if (sessionProgress >= 2) {
      return this.GRADE.GOOD;  // Good progress
    } else if (difficulty > 7) {
      return this.GRADE.HARD;  // Correct but was difficult
    } else {
      return this.GRADE.GOOD;
    }
  }
}

// Session Progress Manager - Handles 5-step progress system
class SessionProgressManager {
  constructor() {
    this.MAX_SESSION_PROGRESS = 5;
  }

  // Update session progress based on answer
  updateProgress(card, isCorrect) {
    const currentProgress = card.sessionProgress || 0;

    if (isCorrect) {
      const newProgress = Math.min(currentProgress + 1, this.MAX_SESSION_PROGRESS);
      return {
        ...card,
        sessionProgress: newProgress,
        sessionCompleted: newProgress >= this.MAX_SESSION_PROGRESS
      };
    } else {
      // Wrong answer - reset or decrease progress
      const newProgress = Math.max(0, currentProgress - 1);
      return {
        ...card,
        sessionProgress: newProgress,
        sessionCompleted: false
      };
    }
  }

  // Check if card session is completed (5 correct answers)
  isSessionCompleted(card) {
    return (card.sessionProgress || 0) >= this.MAX_SESSION_PROGRESS;
  }

  // Reset session progress
  resetSessionProgress(card) {
    return {
      ...card,
      sessionProgress: 0,
      sessionCompleted: false
    };
  }
}

// Data Migration Helper - Convert old repeatCount to FSRS format
class DataMigrationHelper {
  static migrateOldData(cards, fsrsEngine) {
    return cards.map(card => {
      if (!card.fsrs) {
        // Create new FSRS data based on old repeatCount
        const fsrsData = fsrsEngine.createNewCard();

        if (card.repeatCount && card.repeatCount > 0) {
          // Simulate previous reviews based on repeatCount
          fsrsData.reps = card.repeatCount;
          fsrsData.state = fsrsEngine.STATE.REVIEW;
          fsrsData.stability = Math.max(1, card.repeatCount * 2); // Rough estimation
        }

        return {
          ...card,
          fsrs: fsrsData,
          sessionProgress: 0,
          sessionCompleted: false
        };
      }
      return card;
    });
  }
}

// Export main classes
export { FSRSEngine, SessionProgressManager, DataMigrationHelper };