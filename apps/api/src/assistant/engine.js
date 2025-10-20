// src/assistant/engine.js

const { classifyIntent } = require('./intent-classifier');
const registry = require('./function-registry');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');
const yaml = require('js-yaml');
const AssistantLog = require('../models/AssistantLog');

// 📝 Load assistant configuration
const config = yaml.load(
  fs.readFileSync(path.join(__dirname, '../../../../docs/prompts.yaml'), 'utf-8')
);

// 📚 Load knowledge base
const knowledgeBase = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../../../docs/ground-truth.json'), 'utf-8')
);

// 🧠 LLM Connection (Week 3 Colab)
const LLM_URL = process.env.LLM_URL + '/generate'; 

async function callLLM(prompt) {
  try {
    const res = await axios.post(LLM_URL, { 
      prompt, 
      max_tokens: 300 
    }, {
      timeout: 10000 // 10 second timeout
    });
    return res.data.text || res.data.response || 'No response';
  } catch (err) {
    console.error('LLM Error:', err.message);
    return null; // Return null on failure
  }
}

// 🔍 Find relevant policies by keyword matching
function findRelevantPolicies(query) {
  const q = query.toLowerCase();
  
  const categoryKeywords = {
    returns: ['return', 'refund', 'exchange', 'money back'],
    shipping: ['shipping', 'delivery', 'carrier', 'ship', 'deliver', 'track'],
    warranty: ['warranty', 'guarantee', 'defect', 'broken'],
    privacy: ['privacy', 'data', 'personal', 'information'],
    security: ['security', 'safe', 'secure', 'payment'],
  };

  // Find matching category
  let matchedCategory = null;
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => q.includes(kw))) {
      matchedCategory = category;
      break;
    }
  }

  return matchedCategory 
    ? knowledgeBase.filter(p => p.category === matchedCategory)
    : [];
}

// ✅ Validate citations in response
function validateCitations(responseText) {
  const regex = /\[(Policy\d+\.\d+|Shipping\d+\.\d+|Warranty\d+\.\d+|Privacy\d+\.\d+|Security\d+\.\d+|Returns\d+\.\d+)\]/g;
  const matches = [...responseText.matchAll(regex)].map(m => m[1]);
  
  const validCitations = matches.filter(id => 
    knowledgeBase.some(p => p.id === id)
  );
  
  const invalidCitations = matches.filter(id => 
    !validCitations.includes(id)
  );

  return {
    isValid: invalidCitations.length === 0,
    valid: validCitations,
    invalid: invalidCitations
  };
}

// 🔢 Extract order ID from user input
function extractOrderId(text) {
  // Match MongoDB ObjectId pattern (24 hex characters)
  const match = text.match(/[a-f0-9]{24}/i);
  return match ? match[0] : null;
}

// Helper function for status messages
function getStatusMessage(status) {
  const messages = {
    'PENDING': 'We\'re preparing your order now!',
    'PROCESSING': 'Your order is being processed.',
    'SHIPPED': 'Your order is on its way!',
    'DELIVERED': 'Your order has been delivered. Enjoy!'
  };
  return messages[status] || '';
}

// 💬 Main assistant handler
async function handleAssistantQuery(userInput, context = {}) {
  const startTime = Date.now(); // ⏱️ Start timing
  const intent = classifyIntent(userInput);
  let response = '';
  let functionsCalled = [];
  const assistantName = config.identity.name || 'Luna';
  const companyName = config.identity.company || 'Shoplite';

  console.log(`🤖 Intent detected: ${intent}`);

  try {
    switch (intent) {
      // 1️⃣ POLICY QUESTIONS
      case 'policy_question': {
        const policies = findRelevantPolicies(userInput);
        
        if (policies.length > 0) {
          // Use the first matching policy
          const policy = policies[0];
          response = `${policy.answer} [${policy.id}]`;
        } else {
          // Fallback to generic response if no policy found
          response = `I don't have specific information on that policy right now, but I'd be happy to connect you with a specialist who can help. Is there anything else I can assist you with?`;
        }
        break;
      }

      // 2️⃣ ORDER STATUS
      case 'order_status': {
        // Try to extract order ID or email
        const orderId = extractOrderId(userInput) || context.orderId;
        const emailMatch = userInput.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        const email = emailMatch ? emailMatch[0] : null;

        if (email) {
          // 📨 Case 1: User provided an email — get all their orders
          const orders = await registry.execute('getCustomerOrders', { email });
          functionsCalled.push('getCustomerOrders');

          if (!orders || orders.length === 0) {
            response = `I couldn't find any orders linked to ${email}. Please make sure you used this email when placing your order.`;
          } else {
            const orderList = orders
              .map(o => `#${o._id} (${o.status}, $${o.total})`)
              .join(', ');
            response = `Here are your recent orders for ${email}: ${orderList}. Would you like details on any specific order?`;
          }
        } 
        else if (orderId && mongoose.Types.ObjectId.isValid(orderId)) {
          // 📦 Case 2: User provided an order ID — check single order
          const status = await registry.execute('getOrderStatus', { orderId });
          functionsCalled.push('getOrderStatus');

          if (status === 'Order not found') {
            response = `I couldn't find an order with ID ${orderId}. Please double-check the order number.`;
          } else {
            response = `Your order ${orderId} is currently **${status}**. ${getStatusMessage(status)}`;
          }
        } 
        else {
          // 🆘 Case 3: Missing both email and order ID
          response = `I'd be happy to help you track your order! Could you please provide your **order ID** or the **email address** you used when placing the order?`;
        }
        break;
      }

      // 3️⃣ PRODUCT SEARCH
      case 'product_search': {
        const products = await registry.execute('searchProducts', { 
          query: userInput, 
          limit: 5 
        });
        functionsCalled.push('searchProducts');

        if (products.length > 0) {
          const productList = products.map(p => 
            `${p.name} ($${p.price})`
          ).join(', ');
          response = `Here are some products I found: ${productList}. Would you like more details on any of these?`;
        } else {
          response = `I couldn't find any products matching "${userInput}". Could you try different keywords or browse our categories?`;
        }
        break;
      }

      // 4️⃣ COMPLAINT
      case 'complaint': {
        response = `I'm so sorry to hear you're experiencing this issue. Your satisfaction is really important to us. I'm escalating this to our support team right away, and someone will follow up with you within 24 hours. Is there anything else I can help you with in the meantime?`;
        break;
      }

      // 5️⃣ CHITCHAT
      case 'chitchat': {
        // Respond to common greetings naturally
        if (/who are you|what.*name|your name/i.test(userInput)) {
          response = `I'm ${assistantName}, your ${config.identity.role} here at ${companyName}! I'm here to help with orders, products, and store policies. What can I do for you today?`;
        } else if (/are you (a )?robot|are you (an )?ai|are you human/i.test(userInput)) {
          response = `I'm ${assistantName}, part of the ${companyName} support team! I'm here to help you with any questions about your orders, our products, or store policies. How can I assist you?`;
        } else if (/who created you|who made you/i.test(userInput)) {
          response = `I work for ${companyName}'s customer support team! My job is to make your shopping experience as smooth as possible. What can I help you with today?`;
        } else if (/how are you|how're you|how r u/i.test(userInput)) {
          response = `I'm doing great, thanks for asking! How can I assist you with your shopping today?`;
        } else if (/thank|thanks/i.test(userInput)) {
          response = `You're very welcome! Let me know if you need anything else. 😊`;
        } else if (/^(hi|hello|hey|greetings)/i.test(userInput)) {
          response = `Hi there! I'm ${assistantName} from ${companyName}. I can help you with orders, products, or any questions about our policies. What would you like to know?`;
        } else if (/help|can you help|need help/i.test(userInput)) {
          response = `Absolutely! I can help you with tracking orders, finding products, or answering questions about our policies. What do you need assistance with?`;
        } else {
          response = `Hi! I'm ${assistantName}, your support specialist at ${companyName}. I'm here to help with orders, products, and store policies. What can I do for you?`;
        }
        break;
      }

      // 6️⃣ VIOLATION
      case 'violation': {
        response = `I appreciate you reaching out, but let's keep our conversation respectful. I'm here to help you with your ${companyName} experience. How can I assist you today?`;
        break;
      }

      // 7️⃣ OFF-TOPIC / DEFAULT
      default: {
        response = `That's a bit outside my area of expertise, but I'm great at helping with orders, products, and store policies at ${companyName}! What can I help you with today?`;
        break;
      }
    }
  } catch (error) {
    console.error('Error in assistant logic:', error);
    response = `I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact our support team directly if this continues.`;
  }

  // ✅ Validate citations
  const citationReport = validateCitations(response);
  
  if (!citationReport.isValid) {
    console.warn('⚠️ Invalid citations detected:', citationReport.invalid);
  }

  // 📊 LOG THE QUERY
  const responseTime = Date.now() - startTime;
  try {
    const logEntry = await AssistantLog.create({
      intent,
      userInput,
      functionsCalled: functionsCalled.length > 0 ? functionsCalled : [],
      responseTime,
      timestamp: new Date()
    });
    console.log(`✅ Logged assistant query: ${intent} (${responseTime}ms)`);
  } catch (err) {
    console.error('❌ Failed to log assistant query:', err);
  }

  return {
    text: response,
    intent,
    functionsCalled,
    citations: citationReport.valid,
    citationValidation: citationReport,
    responseTime
  };
}

module.exports = { handleAssistantQuery, validateCitations };