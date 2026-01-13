# EhCookWhat Chatbot UI Consistency Guide

## ✅ CHATBOT UI STRUCTURE (IDENTICAL ACROSS ALL PAGES)

All category pages (rice.html, noodles.html, soup.html, vegetables.html, dessert.html) use the **exact same chatbot UI structure**:

### HTML Structure
```html
<section class="chatbot-section">
    <div class="container">
        <div class="chatbot-header">
            <h2>[Category] Assistant AI Bot</h2>
        </div>
        <p class="chatbot-intro">[Category-specific intro text]</p>
        <div class="chatbot-container">
            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">
                    <div class="message-content">
                        [Welcome message]
                    </div>
                </div>
            </div>
            <div class="chat-input-wrapper">
                <input 
                    type="text" 
                    id="userInput" 
                    class="chat-input" 
                    placeholder="Type your question..."
                    autocomplete="off"
                />
                <button id="sendButton" class="chat-send-btn">Send</button>
            </div>
        </div>
    </div>
</section>
```

## 🎨 SHARED CSS STYLING

### Chatbot Container (Card-Style)
- **Max-width:** 900px
- **Background:** White
- **Border-radius:** 16px (rounded corners)
- **Border:** 2px solid #E8D4BE (beige)
- **Box-shadow:** 0 4px 20px rgba(201, 125, 96, 0.15)
- **Height:** 600px (500px on mobile)
- **Layout:** Flexbox column

### Chat Messages Area
- **Background:** #FFF8F0 (cream)
- **Padding:** 24px
- **Scroll:** Auto overflow-y
- **Gap between messages:** 16px
- **Border-radius:** 16px 16px 0 0 (top corners rounded)

### Message Bubbles
- **Bot messages:** 
  - White background
  - Border: 1px solid #E8D4BE
  - Left-aligned
  - Rounded: 18px 18px 18px 4px
- **User messages:**
  - Background: #C97D60 (terracotta)
  - White text
  - Right-aligned
  - Rounded: 18px 18px 4px 18px

### Input Area
- **Background:** White
- **Border-top:** 1px solid #E8D4BE
- **Padding:** 20px
- **Layout:** Flex row with 12px gap
- **Border-radius:** 0 0 16px 16px (bottom corners rounded)

### Input Field
- **Background:** #FFF8F0 (cream) → White on focus
- **Border:** 1px solid #E8D4BE
- **Border-radius:** 24px (fully rounded)
- **Padding:** 14px 18px
- **Focus state:** Border changes to #C97D60 with subtle shadow

### Send Button
- **Background:** #C97D60 (terracotta)
- **Hover:** #B3644D (darker terracotta)
- **Border-radius:** 24px
- **Padding:** 14px 28px
- **Color:** White
- **Font-weight:** 600
- **Transition:** Scale on hover (1.05)

## 🔄 JAVASCRIPT FUNCTIONALITY

All category pages use the same **chatbot.js** file:
- Flowise API integration via fetch()
- Markdown rendering (bold, italic, code)
- Typing indicators with animated dots
- Message bubble creation
- Auto-scroll to latest message
- Enter key support

## ✅ CONSISTENCY CHECKLIST

### Visual Consistency
- ✅ Card-style container with rounded corners
- ✅ Light cream background for chat area
- ✅ White background for input area
- ✅ Beige borders matching the site theme
- ✅ Soft shadow for depth
- ✅ Consistent spacing and padding

### Functional Consistency
- ✅ Same input/output behavior
- ✅ Same API endpoint
- ✅ Same error handling
- ✅ Same markdown rendering
- ✅ Same typing indicators

### Content Differences (Only These Vary)
- ❌ Page title (e.g., "Rice Assistant AI Bot" vs "Noodle Assistant AI Bot")
- ❌ Intro text (category-specific)
- ❌ Welcome message (category-specific)

## 🚀 RESULT

All chatbot UIs look **IDENTICAL** across all category pages, creating a consistent, professional user experience. Only the text content changes based on the category, while the entire layout, styling, and functionality remain the same.
