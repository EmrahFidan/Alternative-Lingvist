// Weighted Random Selection System for Dynamic Word Practice
// Session-based mastery tracking with coefficient weighting

class WeightedSelectionEngine {
  constructor() {
    // Mastery level coefficients (how often words appear)
    this.MASTERY_COEFFICIENTS = {
      0: 10,  // New word - appears very frequently
      1: 8,   // 1 correct - appears frequently
      2: 6,   // 2 correct - appears moderately
      3: 4,   // 3 correct - appears less frequently
      4: 2,   // 4 correct - appears rarely (last chance)
      5: 0    // 5 correct - MASTERED, removed from practice
    };

    this.lastSelectedWord = null; // Anti-repeat mechanism
  }

  // Calculate coefficient based on mastery level
  getCoefficient(masteryLevel) {
    return this.MASTERY_COEFFICIENTS[masteryLevel] || 10;
  }

  // Filter out mastered words (progress >= 5)
  getActiveCards(cards) {
    const activeCards = cards.filter(card => {
      const masteryLevel = card.masteryLevel || 0;
      const isActive = masteryLevel < 5;

      // Debug log
      if (!isActive) {
        console.log(`🚫 MASTERED CARD FILTERED: ${card.missingWord} (mastery: ${masteryLevel})`);
      }

      return isActive;
    });

    console.log(`📊 ACTIVE CARDS COUNT: ${activeCards.length}/${cards.length}`);
    return activeCards;
  }

  // Get mastered words (progress = 5)
  getMasteredCards(cards) {
    return cards.filter(card => (card.masteryLevel || 0) >= 5);
  }

  // Calculate total weight for all active cards
  calculateTotalWeight(activeCards) {
    return activeCards.reduce((total, card) => {
      const masteryLevel = card.masteryLevel || 0;
      return total + this.getCoefficient(masteryLevel);
    }, 0);
  }

  // Weighted random selection algorithm
  selectWeightedRandom(activeCards) {
    if (activeCards.length === 0) {
      return null;
    }

    // Single card scenario
    if (activeCards.length === 1) {
      return activeCards[0];
    }

    // Filter out last selected word to prevent consecutive repeats
    let availableCards = activeCards;
    if (this.lastSelectedWord) {
      const filteredCards = activeCards.filter(card =>
        card.missingWord !== this.lastSelectedWord.missingWord
      );
      // If we have alternatives, use filtered list
      if (filteredCards.length > 0) {
        availableCards = filteredCards;
      }
    }

    const totalWeight = this.calculateTotalWeight(availableCards);
    if (totalWeight === 0) {
      return availableCards[0]; // Fallback
    }

    // Generate random number between 0 and totalWeight
    const randomValue = Math.random() * totalWeight;
    let currentWeight = 0;

    // Select card based on weighted probability
    for (const card of availableCards) {
      const masteryLevel = card.masteryLevel || 0;
      currentWeight += this.getCoefficient(masteryLevel);

      if (randomValue <= currentWeight) {
        this.lastSelectedWord = card;
        return card;
      }
    }

    // Fallback (shouldn't reach here)
    const selected = availableCards[availableCards.length - 1];
    this.lastSelectedWord = selected;
    return selected;
  }

  // Update session progress based on correct/incorrect answer
  updateSessionProgress(card, isCorrect) {
    const currentProgress = card.sessionProgress || 0;

    if (isCorrect) {
      // Correct answer - increment session progress
      const newProgress = Math.min(currentProgress + 1, 5);
      console.log(`✅ CORRECT: ${card.missingWord} sessionProgress ${currentProgress} → ${newProgress}`);
      return newProgress;
    } else {
      // Wrong answer - checkpoint system based on session progress
      let newProgress;
      if (currentProgress < 2) {
        // Checkpoint yok (0, 1) - tamamen sıfırlan
        newProgress = 0;
        console.log(`❌ WRONG (NO CHECKPOINT): ${card.missingWord} sessionProgress ${currentProgress} → ${newProgress}`);
      } else {
        // Checkpoint var (2+) - checkpoint 2'ye dön
        newProgress = 2;
        console.log(`❌ WRONG (CHECKPOINT): ${card.missingWord} sessionProgress ${currentProgress} → ${newProgress}`);
      }
      return newProgress;
    }
  }

  // Get selection statistics for debugging
  getSelectionStats(cards) {
    const activeCards = this.getActiveCards(cards);
    const masteredCards = this.getMasteredCards(cards);
    const totalWeight = this.calculateTotalWeight(activeCards);

    const stats = {
      total: cards.length,
      active: activeCards.length,
      mastered: masteredCards.length,
      totalWeight: totalWeight,
      distribution: {}
    };

    // Calculate probability distribution
    activeCards.forEach(card => {
      const level = card.masteryLevel || 0;
      const coefficient = this.getCoefficient(level);
      const probability = totalWeight > 0 ? (coefficient / totalWeight * 100).toFixed(1) : 0;

      if (!stats.distribution[level]) {
        stats.distribution[level] = {
          count: 0,
          coefficient: coefficient,
          totalProbability: 0
        };
      }

      stats.distribution[level].count++;
      stats.distribution[level].totalProbability += parseFloat(probability);
    });

    return stats;
  }

  // Reset last selected word (useful for new session)
  resetLastSelected() {
    this.lastSelectedWord = null;
  }

  // Get next card for practice using weighted selection
  getNextCard(cards) {
    const activeCards = this.getActiveCards(cards);

    if (activeCards.length === 0) {
      console.log('No active cards available for practice');
      return null;
    }

    const selectedCard = this.selectWeightedRandom(activeCards);

    // Log selection for debugging
    console.log('Card selected:', selectedCard?.missingWord,
                'Mastery Level:', selectedCard?.masteryLevel || 0,
                'Coefficient:', this.getCoefficient(selectedCard?.masteryLevel || 0));

    return selectedCard;
  }

  // Batch update multiple cards
  batchUpdateMastery(cards, updates) {
    return cards.map(card => {
      const update = updates.find(u => u.id === card.id || u.missingWord === card.missingWord);
      if (update) {
        return {
          ...card,
          sessionProgress: this.updateSessionProgress(card, update.isCorrect),
          lastPracticed: new Date().toISOString()
        };
      }
      return card;
    });
  }
}

// Session Progress Manager - Removed, functionality moved to WeightedSelectionEngine
class SessionProgressManager {
  constructor() {
    this.MAX_SESSION_PROGRESS = 5;
  }

  // Check if card session is completed (5 means mastered)
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

export { WeightedSelectionEngine, SessionProgressManager };