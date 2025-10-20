// src/assistant/intent-classifier.js

function classifyIntent(userInput) {
  const text = userInput.toLowerCase().trim();

  // ==========================================
  // PRIORITY 1: VIOLATION (check first)
  // ==========================================
  const violationWords = [
    'stupid', 'idiot', 'dumb', 'hate', 'shut up', 'useless', 
    'fuck', 'shit', 'damn', 'ass', 'bitch', 'crap'
  ];
  
  if (violationWords.some(word => text.includes(word))) {
    return 'violation';
  }

  // ==========================================
  // PRIORITY 2: POLICY QUESTIONS
  // ==========================================
  // Use regex for more flexible matching
  if (/return|refund|exchange|money back|send back|give back/i.test(text)) {
    return 'policy_question';
  }
  
  if (/ship|shipping|delivery|deliver|carrier|transport|freight/i.test(text)) {
    return 'policy_question';
  }
  
  if (/warranty|guarantee|defect|broken|faulty|malfunction/i.test(text)) {
    return 'policy_question';
  }
  
  if (/privacy|data|personal information|gdpr|ccpa/i.test(text)) {
    return 'policy_question';
  }
  
  if (/security|secure|safe|payment.*safe|fraud|encryption/i.test(text)) {
    return 'policy_question';
  }
  
  if (/policy|policies|terms|conditions|agreement/i.test(text)) {
    return 'policy_question';
  }

  // ==========================================
  // PRIORITY 3: ORDER STATUS
  // ==========================================
  // Check for email first (higher priority)
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    // If there's an email, it's likely asking for customer orders
    if (/order|orders/i.test(text)) {
      return 'order_status';
    }
  }
  
  // Check for order-related keywords
  if (/order|track|status|where.*my|shipped|delivery|arrived|package/i.test(text)) {
    // More specific patterns for order status
    if (/where.*order|track.*order|order.*status|my order|check.*order|all.*orders|my orders/i.test(text)) {
      return 'order_status';
    }
    if (/when.*arrive|when.*get|when.*deliver|estimated.*delivery/i.test(text)) {
      return 'order_status';
    }
    // Check if text contains a potential order ID (24 hex chars)
    if (/[a-f0-9]{24}/i.test(text)) {
      return 'order_status';
    }
  }

  // ==========================================
  // PRIORITY 4: PRODUCT SEARCH
  // ==========================================
  if (/find|search|show|looking for|want to buy|need|available|in stock/i.test(text)) {
    // Avoid false positives with policy questions
    if (!/policy|return|refund|warranty/i.test(text)) {
      return 'product_search';
    }
  }
  
  if (/product|item|price|cost|category|catalog|browse/i.test(text)) {
    return 'product_search';
  }
  
  if (/do you (have|sell)|what.*sell|what kind of/i.test(text)) {
    return 'product_search';
  }

  // ==========================================
  // PRIORITY 5: COMPLAINTS
  // ==========================================
  const complaintPatterns = [
    /not working/i,
    /doesn't work/i,
    /broken/i,
    /damaged/i,
    /problem/i,
    /issue/i,
    /didn't receive/i,
    /did not receive/i,
    /never (got|received|arrived)/i,
    /late/i,
    /delayed/i,
    /bad quality/i,
    /wrong (item|product|order)/i,
    /missing/i,
    /defective/i,
    /disappointed/i,
    /unhappy/i,
    /unsatisfied/i
  ];
  
  if (complaintPatterns.some(pattern => pattern.test(text))) {
    return 'complaint';
  }

  // ==========================================
  // PRIORITY 6: CHITCHAT
  // ==========================================
  // Greetings
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)($|[^a-z])/i.test(text)) {
    return 'chitchat';
  }
  
  
  // Thanks/gratitude
  if (/^(thank you|thanks|thank|appreciate|grateful)($|[^a-z])/i.test(text)) {
    return 'chitchat';
  }
  
// Identity questions
if (/who are you|what.*your name|your name|are you (a )?robot|are you (an )?ai|are you human|who created you/i.test(text)) {
  return 'chitchat';
}

  
  // How are you
  if (/how are you|how're you|how r u/i.test(text)) {
    return 'chitchat';
  }
  
  // Help requests (general)
  if (/^(help|can you help|help me|need help)($|[^a-z])/i.test(text)) {
    return 'chitchat';
  }

  // ==========================================
  // DEFAULT: OFF-TOPIC
  // ==========================================
  return 'off_topic';
}

module.exports = { classifyIntent };