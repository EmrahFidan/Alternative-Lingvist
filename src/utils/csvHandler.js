// CSV Handler for Anki Integration
// Handles import/export of flashcard data in Anki-compatible CSV format

class CSVHandler {
  constructor() {
    // Anki CSV field mapping
    this.ANKI_FIELDS = {
      FRONT: 'Front',           // word
      BACK: 'Back',            // word_mean
      EXAMPLE: 'Example',      // sentence
      DUE: 'Due',             // FSRS due date
      STABILITY: 'Stability',  // FSRS stability
      DIFFICULTY: 'Difficulty' // FSRS difficulty
    };
  }

  // Export flashcard data to Anki-compatible CSV
  exportToAnkiCSV(cards) {
    if (!cards || cards.length === 0) {
      throw new Error('No cards to export');
    }

    // CSV headers
    const headers = [
      this.ANKI_FIELDS.FRONT,
      this.ANKI_FIELDS.BACK,
      this.ANKI_FIELDS.EXAMPLE,
      this.ANKI_FIELDS.DUE,
      this.ANKI_FIELDS.STABILITY,
      this.ANKI_FIELDS.DIFFICULTY
    ];

    // Convert cards to CSV rows
    const rows = cards.map(card => [
      this.escapeCSVField(card.missingWord || ''),
      this.escapeCSVField(card.translation || ''),
      this.escapeCSVField(card.sentence || ''),
      card.fsrs ? new Date(card.fsrs.due).toISOString() : new Date().toISOString(),
      card.fsrs ? card.fsrs.stability.toFixed(2) : '1.00',
      card.fsrs ? card.fsrs.difficulty.toFixed(1) : '5.0'
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }

  // Export only mastered words (sessionProgress >= 5)
  exportMasteredWordsCSV(cards) {
    if (!cards || cards.length === 0) {
      throw new Error('No cards to export');
    }

    // Filter mastered cards only
    const masteredCards = cards.filter(card => (card.sessionProgress || 0) >= 5);

    if (masteredCards.length === 0) {
      throw new Error('No mastered words to export');
    }

    // CSV headers for mastered words
    const headers = [
      this.ANKI_FIELDS.FRONT,
      this.ANKI_FIELDS.BACK,
      this.ANKI_FIELDS.EXAMPLE,
      'Mastered Date'
    ];

    // Convert mastered cards to CSV rows
    const rows = masteredCards.map(card => [
      this.escapeCSVField(card.missingWord || ''),
      this.escapeCSVField(card.translation || ''),
      this.escapeCSVField(card.sentence || ''),
      card.lastPracticed || new Date().toISOString()
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  }

  // Import CSV data and convert to flashcard format
  importFromCSV(csvContent) {
    if (!csvContent || csvContent.trim() === '') {
      throw new Error('Empty CSV content');
    }

    const lines = csvContent.split('\n').filter(line => line.trim() !== '');

    if (lines.length < 2) {
      throw new Error('CSV must have headers and at least one data row');
    }

    // Parse headers
    const headers = this.parseCSVLine(lines[0]);
    console.log('CSV Headers detected:', headers);

    // Validate required fields
    const requiredFields = ['Front', 'Back', 'Example'];
    const missingFields = requiredFields.filter(field => !headers.includes(field));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Parse data rows
    const cards = [];
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        if (values.length !== headers.length) {
          console.warn(`Row ${i + 1}: Column count mismatch. Expected ${headers.length}, got ${values.length}`);
          continue;
        }

        const card = this.createCardFromCSVRow(headers, values);
        if (card) {
          cards.push(card);
        }
      } catch (error) {
        console.warn(`Error parsing row ${i + 1}:`, error.message);
      }
    }

    console.log(`Successfully imported ${cards.length} cards from CSV`);
    return cards;
  }

  // Create flashcard object from CSV row
  createCardFromCSVRow(headers, values) {
    const getFieldValue = (fieldName) => {
      const index = headers.indexOf(fieldName);
      return index !== -1 ? values[index] : '';
    };

    const front = getFieldValue('Front');
    const back = getFieldValue('Back');
    const example = getFieldValue('Example');

    if (!front || !back || !example) {
      return null;
    }

    // Create FSRS data from CSV if available
    const due = getFieldValue('Due');
    const stability = getFieldValue('Stability');
    const difficulty = getFieldValue('Difficulty');

    const fsrsData = {
      due: due ? new Date(due) : new Date(),
      stability: stability ? parseFloat(stability) : 1.0,
      difficulty: difficulty ? parseFloat(difficulty) : 5.0,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 0,
      lapses: 0,
      state: 0, // NEW
      last_review: null
    };

    // Generate translationWithUnderline from back and example
    const translationWithUnderline = this.generateTranslationWithUnderline(back, example);

    return {
      sentence: example,
      missingWord: front,
      translation: back,
      translationWithUnderline: translationWithUnderline,
      repeatCount: 0,
      fsrs: fsrsData,
      sessionProgress: 0,
      sessionCompleted: false
    };
  }

  // Generate underlined translation (simple implementation)
  generateTranslationWithUnderline(back, example) {
    // Simple approach: underline the back translation in the example
    // This is a basic implementation - can be improved with NLP
    if (example.toLowerCase().includes(back.toLowerCase())) {
      return example.replace(
        new RegExp(back.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'),
        `<u>${back}</u>`
      );
    }
    return `<u>${back}</u> (${example})`;
  }

  // Parse CSV line handling quotes and commas
  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    let quoteStart = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (!inQuotes) {
          inQuotes = true;
          quoteStart = true;
        } else if (nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(quoteStart ? current : current.trim());
        current = '';
        quoteStart = false;
      } else {
        current += char;
      }
    }

    // Add last field
    result.push(quoteStart ? current : current.trim());
    return result;
  }

  // Escape field for CSV output
  escapeCSVField(field) {
    if (typeof field !== 'string') {
      field = String(field);
    }

    // If field contains comma, quote, or newline, wrap in quotes
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      // Escape quotes by doubling them
      field = field.replace(/"/g, '""');
      return `"${field}"`;
    }

    return field;
  }

  // Download CSV file
  downloadCSV(csvContent, filename = 'flashcards_export.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  // Read CSV file from input
  readCSVFile(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const csvContent = e.target.result;
          const cards = this.importFromCSV(csvContent);
          resolve(cards);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file, 'UTF-8');
    });
  }

  // Validate CSV format
  validateCSVFormat(csvContent) {
    try {
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');

      if (lines.length < 2) {
        return { valid: false, error: 'CSV must have headers and at least one data row' };
      }

      const headers = this.parseCSVLine(lines[0]);
      const requiredFields = ['Front', 'Back', 'Example'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));

      if (missingFields.length > 0) {
        return {
          valid: false,
          error: `Missing required fields: ${missingFields.join(', ')}`
        };
      }

      return { valid: true, headers, rowCount: lines.length - 1 };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

export default CSVHandler;