# K2 Communication System — Tutorial and User Guide

**For:** Kay  
**Prepared by:** Phil Chou  
**Version:** 2026-08-22  
**Status:** Working draft

---

## Table of Contents

1. [Welcome to K2](#1-welcome-to-k2)
2. [The K2 Screen](#2-the-k2-screen)
   - 2.1 [Overview of the Five Panels](#21-overview-of-the-five-panels)
   - 2.2 [Opening and Closing Panels](#22-opening-and-closing-panels)
   - 2.3 [How to Click a Button](#23-how-to-click-a-button)
3. [Example Usage](#3-example-usage)
   - 3.1 [Immediate Text-to-Speech](#31-immediate-text-to-speech)
   - 3.2 [Edited Text-to-Speech](#32-edited-text-to-speech)
   - 3.3 [Composed Text-to-Speech](#33-composed-text-to-speech)
   - 3.4 [Dictation](#34-dictation)
   - 3.5 [Action Categories — Flat vs. Deep Hierarchy](#35-action-categories--flat-vs-deep-hierarchy)
   - 3.6 [Conversing with Your Agent, Cloud AI](#36-conversing-with-your-agent-cloud-ai)
   - 3.7 [Composing Text Messages](#37-composing-text-messages)
   - 3.8 [Composing Email](#38-composing-email)
   - 3.9 [Controlling Home Automation](#39-controlling-home-automation)
   - 3.10 [Using Cloud AI for K2 Help](#310-using-cloud-ai-for-k2-help)
4. [Detailed Descriptions of Panels](#4-detailed-descriptions-of-panels)
   - 4.1 [Chat Log Panel](#41-chat-log-panel)
   - 4.2 [Actions Panel](#42-actions-panel)
   - 4.3 [Editor Panel](#43-editor-panel)
   - 4.4 [Predictor Panel](#44-predictor-panel)
   - 4.5 [Keyboard Panel](#45-keyboard-panel)
5. [Settings](#5-settings)
6. [FAQ](#6-faq)

---

## 1. Welcome to K2

K2 is your personal assistive communication system. It is designed to let you communicate, control your environment, and access information — using only your eyes and a click, if needed.

K2 runs in your web browser (on your tablet, laptop, or desktop) and does not require anything to be installed. It connects to a cloud AI assistant (the K2 AI) that can answer questions, help you compose messages, control your smart home, and much more.

K2 was designed specifically for you. It knows who you are, remembers your preferences, stores your frequently-used phrases, and learns from your conversations over time.

**What K2 lets you do:**

- **Speak** — Type or choose a phrase, and K2 says it out loud in your own cloned voice (or another voice of your choice)
- **Chat with an AI assistant** — Ask K2 anything, get information, have it compose text for you, or just have a conversation
- **Use your phrase library** — Keep a collection of phrases and words you use often, organized into categories, accessible with a single tap
- **Type with a smart keyboard** — An on-screen keyboard highlights the most likely next letters so you can find them faster
- **Get word and phrase suggestions** — K2 predicts what you are about to type and lets you choose completions with one tap
- **Send messages** — Compose emails and text messages; K2 can draft them for you
- **Control your home** — K2 connects to your Home Assistant smart home system to control lights, thermostats, and other devices
- **Dictate** — Speak (or whisper) into the microphone to enter text, when that is easier than typing

---

## 2. The K2 Screen

### 2.1 Overview of the Five Panels

When you open K2, you will see a screen divided into five panels. From top to bottom, they are:

```
┌──────────────────────────────────────────────────────┐
│ CHAT LOG                │ ACTIONS                    │
│ (left half)             │ (right half)               │
├──────────────────────────────────────────────────────┤
│ EDITOR                                               │
├──────────────────────────────────────────────────────┤
│ PREDICTOR                                            │
├──────────────────────────────────────────────────────┤
│ KEYBOARD                                             │
└──────────────────────────────────────────────────────┘
```

**Chat Log** (top-left) shows the conversation between you and the K2 AI assistant. Every message you send and every response you receive appears here. System messages (such as confirmations of actions taken) also appear here.

**Actions** (top-right) is your phrase library — a collection of buttons representing phrases, words, or sentences you have saved. Clicking a button in the Actions panel can speak the phrase, insert it into the editor, send it to the AI, or copy it, depending on which mode is active. Actions can be organized into folders called categories.

**Editor** (middle) is the text composition area. It is where you assemble what you want to say before saying it. You can type into the editor using the Keyboard, click words and phrases into it from the Actions panel, or dictate into it. Once your text is ready, you can speak it, send it to the AI, copy it, or save it as a new action button.

**Predictor** (below the editor) shows suggested words and phrases as you type. There are two rows:
- **WORDS** — completions for the word you are currently typing
- **PHRASES** — complete multi-word phrases to continue with

Clicking any suggestion inserts it into the editor.

**Keyboard** (bottom) is a virtual QWERTY keyboard you can use to type. The keys are color-coded: bright green keys are the most likely next letters given what you have already typed, while red/dark keys are less likely. This helps you find the right key faster. The keyboard has Shift (for uppercase), Space, and Backspace keys in addition to the standard QWERTY letters and numbers.

K2 is designed so that you can use any combination of these panels. You might type most of a phrase using the Keyboard, then click a word from the Predictor, then pick another word from the Actions panel — all going into the same Editor text box.

### 2.2 Opening and Closing Panels

Each of the five panels has a vertical label on its left side: **CHAT LOG**, **ACTIONS**, **EDITOR**, **PREDICTOR**, and **KEYBOARD**, respectively.

**Clicking (or tapping) the label closes (minimizes) the panel**, replacing it with a thin horizontal bar showing just the label name. **Clicking the bar again opens the panel**.

This is useful when you want to give more screen space to the panels you are actively using. For example, if you are composing a long message and don't need to see the chat history right now, you can close the Chat Log panel to give the Editor and Keyboard more room.

> **Note:** At least one of the three panels — Chat Log, Actions, and Editor — must always remain open. K2 will not let you close the last remaining one; if you try, an already-closed panel will automatically reopen.

### 2.3 How to Click a Button

In K2, "clicking" a button means any of these:

- **Touch screen** (iPad, tablet): Tap the button with your finger
- **Mouse**: Move the mouse pointer over the button (it will highlight to show it is selected) and press the mouse button
- **Eye gaze tracker**: Look at the button (it will highlight as your gaze lands on it) and then click the mouse button or activate your dwell click

The minimum size of all buttons in K2 is adjustable in Settings (see [Section 5](#5-settings)). If you find a button too small to hit reliably with your eye gaze, the minimum size can be increased.

---

## 3. Example Usage

### 3.1 Immediate Text-to-Speech

Sometimes you just want to say something quickly — for example, to call out to someone in the room.

**How to do it:**

1. In the **Actions** panel toolbar, click the **@CloudTTS** mode button. The button highlights to show it is active.
2. Navigate to the action button you want. For example, click on "Pete" to say Pete's name.
3. K2 immediately speaks "Pete" out loud in your voice.
4. You can continue clicking more action buttons in sequence: "I would like", then "water". K2 speaks each one as you click it.

> **Tip:** If you use a sequence of phrases together often, you can store them as a single action button: "Pete, I would like water." One click, and K2 says the whole sentence without any pauses between the parts.

### 3.2 Edited Text-to-Speech

A more common usage pattern is to assemble your full sentence in the Editor before speaking it. This way, you can review it, edit it, and send it as one coherent message.

**How to do it:**

1. In the **Actions** panel toolbar, make sure **Edit** mode is selected (it is the default).
2. Click action buttons to build up your message in the Editor. For example, clicking "Pete", then "I would like", then "water" fills the Editor with "Pete I would like water ".
3. Review the text in the Editor. Edit it if needed (see [Section 4.3](#43-editor-panel)).
4. When the text is ready, click the **@CloudTTS** button in the Editor toolbar. K2 speaks the full sentence at once.

**Why use Edit mode instead of immediate @CloudTTS mode?**

- The message goes out as a single, coherent sentence rather than in separate pieces
- You can confirm the message looks right before it is spoken
- You can edit it — insert, replace, or delete words — before speaking
- You can use action buttons as templates and customize them for each specific situation

For most things you want to say, **Edit mode is the recommended approach**. It is the default for this reason.

### 3.3 Composed Text-to-Speech

You don't need to use the Actions panel at all. You can type your message entirely using the Keyboard and Predictor.

**How to do it:**

1. If the Editor already has text in it, click **Del All** to clear it.
2. Type your message using the Keyboard. As you type, the Predictor shows word completions — click any word to insert it and save keystrokes.
3. When done, click **@CloudTTS** in the Editor toolbar to speak your message.

### 3.4 Dictation

If speaking (or whispering) is easier than typing at a given moment, you can dictate text into the Editor.

**How to do it:**

1. Click in the Editor text box where you want the dictated text to appear. (You can set the cursor position by pointing or gazing at a location in the text and clicking.)
2. Click the **Dictate** button in the Editor toolbar. The button turns red and shows "Listening..." to indicate K2 is recording.
3. Speak (or whisper) your words.
4. When you are done, click the **Dictate** button again. K2 processes your speech and inserts the transcribed text at the cursor position.

> **Note:** Dictation uses K2's cloud AI for speech recognition. It requires a working internet connection. If your voice is not recognized well, try speaking more slowly or whispering closer to the microphone.

### 3.5 Action Categories — Flat vs. Deep Hierarchy

Your action buttons can be organized in two ways:

**Flat (no categories):** All action buttons appear directly in the grid. Good for a small number of actions (up to about 30) that you can scan at a glance.

**Hierarchical (categories):** Actions are grouped into folders. The top level shows category folders. Clicking a folder "opens" it and shows the actions inside. You navigate back with the breadcrumb bar at the top of the Actions panel (the 🏠 home button returns to the top level).

**Example hierarchy:**
```
🏠 Home
  ├── 📁 Greetings
  │     ├── Hello
  │     ├── Goodbye
  │     └── How are you?
  ├── 📁 Needs
  │     ├── I need water
  │     ├── I need a break
  │     └── I am cold
  └── Pete
```

You can have up to many levels of nesting (though 2–3 levels is usually enough). Categories are shown in amber/folder style, while leaf action buttons are shown in their chosen color.

**To navigate:** Click a category folder to enter it. Click the 🏠 button or a breadcrumb name to go back.

**To save a new action into a category:** When saving, name the action with the category path and a separator. For example, `Greetings|Hello` places "Hello" inside the "Greetings" category. The default separator is `|` (the pipe character).

### 3.6 Conversing with Your Agent, Cloud AI

K2 includes a built-in AI assistant (powered by Google Gemini) that can answer questions, help you compose messages, control your smart home, and remember things about you.

**How to chat:**

1. Type your question or request in the Editor. For example: "What is the weather like today?"
2. Click the **@CloudAI** button in the Editor toolbar (or press Enter on a physical keyboard).
3. Your message appears in the Chat Log as a "user" message. The AI responds in a few seconds.
4. The AI's response appears in the Chat Log.
5. Below the response, three **suggestion buttons** appear — these are follow-up actions the AI thinks you might want to take. Click one to send it immediately, or ignore them and type your own follow-up.

**What the AI can do:**

- Answer questions on any topic (science, history, current events via web search, etc.)
- Help you compose messages (emails, texts, announcements)
- Search the web for current information (weather, news, sports scores)
- Control your smart home (lights, thermostat)
- Remember facts about you and your contacts
- Create and manage your action buttons
- Generate or find images
- Perform calculations and data analysis

**Example conversations:**

> *You:* What is the weather today in San Jose?  
> *K2:* It is currently 72°F and sunny in San Jose, with a high of 78°F today...

> *You:* Turn on the living room lights  
> *K2:* Done — I've turned on the living room lights. Do you want me to: 1. Adjust the brightness, 2. Change the color, or 3. Turn them off?

> *You:* Help me write a text to Pete saying I need water  
> *K2:* Here's a message to Pete: "Pete, could you bring me some water please? Thanks." Do you want me to: 1. Send it as an SMS, 2. Read it aloud for you to confirm, or 3. Edit the message?

### 3.7 Composing Text Messages

K2 can help you compose and send SMS text messages.

**Method 1 — Via Cloud AI:**

1. Ask the AI: "Text Pete: I need water"
2. The AI composes the message and shows it to you for confirmation.
3. Click the suggestion "Send it as an SMS" (or ask "Send it").
4. K2 opens your device's messaging app (or Phone Link on Windows) with the message pre-filled. It also copies the message text to your clipboard as a backup.

**Method 2 — Direct:**

1. Compose your message in the Editor.
2. Ask the AI: "Send this as a text to Pete" — or — Ask the AI to extract Pete's number from your contacts.

> **Note:** K2 opens your device's SMS app for you, but you will need to confirm and send from within that app. K2 cannot send messages entirely on its own (this is a security limitation of web browsers).

### 3.8 Composing Email

K2 can help you compose and send emails.

**Via Cloud AI:**

1. Ask the AI: "Email my doctor to ask about my next appointment"
2. The AI drafts an email subject and body.
3. K2 opens your default email application (e.g., Outlook, Gmail) with the To, Subject, and Body pre-filled.
4. Confirm and send from within your email app.

You can also ask the AI to address the email to someone in your contacts directory by name: "Email Pete that I'm thinking of him."

### 3.9 Controlling Home Automation

K2 connects to your Home Assistant smart home system. You can control lights, thermostats, and other devices by just asking the AI.

**Examples:**

> "Turn off the bedroom lights"  
> "Set the thermostat to 70 degrees"  
> "Turn on the fan in the living room"  
> "Lock the front door"

K2 will perform the action and confirm it in the Chat Log.

**Setup:** Your Home Assistant URL and access token must be configured in K2's Settings (see [Section 5](#5-settings)). Ask Phil to help set this up if needed.

### 3.10 Using Cloud AI for K2 Help

The K2 AI assistant knows about K2 itself and can help you manage it.

**Examples of K2 management via AI:**

> "Create a new action button called 'I'm tired' in the Needs category"  
> "Change the color of the Greetings category to green"  
> "Delete the action button 'Hello there'"  
> "What macros do I have in the Greetings category?"  
> "Remember that my doctor's name is Dr. Smith and her phone is 555-1234"

The AI can add, update, and delete action buttons, update your profile, add contacts, and change some settings — all through natural language conversation.

---

## 4. Detailed Descriptions of Panels

### 4.1 Chat Log Panel

The **Chat Log** records all communication between you and the K2 AI, as well as system notifications.

**Message types:**
- **Your messages** — shown in blue, on the left
- **AI responses** — shown in green, on the left; formatted with text highlighting, links, and sometimes images
- **System messages** — shown in gray/muted, full width; these confirm actions (e.g., "Speaking (CloudTTS): 'Pete'", "Copied to clipboard", "Alarm set for 3:00 PM")

**Suggestion pills:** Below each AI response, three buttons appear showing suggested follow-up actions. Click any to send that suggestion immediately.

**Images and charts:** When the AI generates or finds an image, it appears as an image card directly in the Chat Log. Click the image to open it full-size in a new tab.

**Active Timers:** When you set a countdown timer (by asking the AI "Set a timer for 5 minutes"), a timer chip appears at the top of the Chat Log showing the remaining time and a ✖ cancel button.

**Scrolling:** If there are more messages than fit on screen, you can scroll the Chat Log by:
- Dragging with your finger or mouse
- Hovering your gaze (or mouse) near the top or bottom edge of the panel — it will scroll automatically (this is called "dwell scroll")

### 4.2 Actions Panel

The **Actions** panel is your phrase library. It contains a grid of buttons (called **actions** or **macros**) representing phrases, words, or sentences you've saved.

#### The Toolbar

At the top of the Actions panel is a toolbar with mode buttons. The **active mode** determines what happens when you click an action button:

| Mode | What it does when you click an action |
|------|---------------------------------------|
| **Edit** *(default)* | Inserts the action's text into the Editor at the cursor position |
| **@CloudTTS** | Speaks the action's text aloud immediately (using your cloned voice) |
| **@LocalTTS** | Speaks the action's text using the device's built-in voice |
| **Copy** | Copies the action's text to your clipboard |
| **@CloudAI** | Sends the action's text directly to the AI as your message |
| **Delete** | Deletes the action button (asks you to confirm first) |
| **Recolor** | Changes the color of the action button to the selected color |

To change the mode, click the mode button you want. The active mode button is highlighted with a white border and glow.

At the right end of the toolbar: the **color picker** (for Recolor mode) and the **⚙️ Settings** button.

**Scrolling the toolbar:** If the toolbar buttons don't all fit in one row, you can scroll it horizontally by dragging or by hovering near the left/right edges.

#### The Breadcrumb Bar

Below the toolbar is the **breadcrumb navigation bar**. It shows where you are in the action folder hierarchy:

🏠 → Needs → Daily

Click 🏠 to return to the top level. Click any breadcrumb name to jump to that level.

#### The Action Grid

The main area of the Actions panel is the **grid** of action buttons.

- **Category buttons** (amber/folder style, with a chamfered corner): Clicking opens that category
- **Action buttons** (colored, rectangular): Clicking performs the current mode's action on that button's text

Hovering over a button (or holding your gaze on it) shows a preview of its full text in the **preview bar** at the bottom of the panel.

**Scrolling the grid:** If there are more buttons than fit on screen, hover near the top or bottom of the grid to scroll, or drag with your finger/mouse.

#### Creating a New Action Button

**Method 1 — Using the Editor:**
1. Type or compose the text you want to save in the Editor (e.g., "I am feeling very tired right now.").
2. Click **Save As...** in the Editor toolbar.
3. A small dialog asks for a tag (name). Type the name — for example "Needs|I'm Tired" to put an action button with the label "I'm Tired" in the "Needs" category. The label on the button will be the same as the text after the vertical bar (`|`).
4. Click **Save** (or press Enter).

**Method 2 — Using the AI:**
Ask the AI: "Create an action button called I'm tired in the Needs category with the text I am feeling very tired right now."

#### Editing an Action Button

1. Set the Actions panel to **Edit** mode.
2. Click the action button you want to edit. Its text is inserted into the Editor.
3. Make your changes in the Editor.
4. Click **Save** in the Editor toolbar. K2 saves the changes back to the same action button (because it remembers which one you loaded).

#### Deleting an Action Button

1. Set the Actions panel to **Delete** mode.
2. Click the action button you want to delete.
3. A confirmation message appears. Click **Yes** to delete, or **No** to cancel.

#### Deleting a Category

1. Set the Actions panel to **Delete** mode.
2. Click the category folder button.
3. A confirmation asks if you want to delete the category and **all actions inside it**.
4. Click **Yes, Delete All** to confirm.

> **Warning:** Deleting a category deletes all actions inside it permanently. Make sure you want to delete everything in that category.

#### Changing Button Colors

1. Click the **color picker** dropdown (next to the mode buttons). Select a color: Blue, Green, Red, Orange, Purple, Yellow, Teal, Pink, or Gray.
2. This automatically sets the Actions panel to **Recolor** mode.
3. Click any action button to change it to the selected color.
4. To recolor an entire category at once, click the category folder button in Recolor mode — a confirmation will ask if you want to recolor everything in the category.

### 4.3 Editor Panel

The **Editor** is the text composition area — the central hub of K2. Most text you want to say, send, or save passes through here.

#### The Toolbar

| Button | Color | What it does |
|--------|-------|--------------|
| **Del All** | Gray | Clears all text from the Editor |
| **Del Word** | Gray | Deletes the word before the cursor (or the selected text) |
| **Del Char** | Gray | Deletes the character before the cursor (or the selected text) |
| **Dictate** | Purple | Starts/stops audio recording for speech-to-text |
| **@CloudTTS** | Green | Speaks the Editor content using your cloned (ElevenLabs) voice |
| **@LocalTTS** | Green | Speaks the Editor content using the device's built-in voice |
| **Copy** | Green | Copies the Editor content to the clipboard |
| **@CloudAI** | Blue | Sends the Editor content to the K2 AI as your message |
| **Save** | Orange | Saves the Editor content as an action button (overwrites the current one if loaded) |
| **Save As...** | Orange | Saves the Editor content as a new action button (always prompts for a name) |

**Speaking with @CloudTTS vs. @LocalTTS:**
- **@CloudTTS** uses ElevenLabs to speak in your cloned voice — it sounds like *you*. It requires an internet connection and takes about 1–3 seconds to start.
- **@LocalTTS** uses the voice built into your device's operating system — available instantly, but the voice quality is different. Use this as a backup if cloud TTS is unavailable.

To stop speaking mid-sentence, click **@CloudTTS** or **@LocalTTS** again while it is speaking. The button will say "Speaking..." while active.

#### Editing Text in the Editor

You can edit the text in the Editor in several ways:

- **Click to place the cursor**: Click at any position in the text box to place the blinking cursor there
- **Keyboard keys**: Type using the on-screen Keyboard (or a physical keyboard)
- **Delete Character**: Removes the character just before the cursor
- **Delete Word**: Removes the entire word before the cursor
- **Delete All**: Clears everything

> **Tip:** To replace a word, double-click it to select it (or click-drag), then type the replacement. The selected text will be deleted and replaced.

#### The Save and Save As Buttons

These buttons save the current Editor text as a reusable action button.

**Save** — If you previously clicked an action button in Edit mode, K2 knows which macro you loaded. Clicking **Save** overwrites that macro with the current Editor text — no questions asked. This is the fast way to edit an existing macro.

**Save As...** — Always prompts you to enter a name (tag). Use this when saving a new macro, or when you want to save to a different name than the one you loaded.

When the name prompt appears, the current category path is pre-filled. For example, if you navigated into the "Needs" category before saving, the prompt shows "Needs|" and you type the action name after it: "Needs|I need water".

### 4.4 Predictor Panel

The **Predictor** panel shows suggested words and phrases as you type. It has two rows:

**WORDS row** (top): Shows completions for the word you are currently typing.
- Example: You've typed "wa" → the WORDS row might show: **water**, **want**, **was**, **watch**, **way**
- The prefix you've typed is shown in gray; the completion is shown normally
- Click any word to complete it (inserting the full word + a space)

**PHRASES row** (bottom): Shows complete multi-word phrase suggestions to continue with.
- These appear when you've just finished a word (after typing a space) or at the start of a message
- Example: After "I need ", phrases might be: **some water**, **a break**, **help with something**
- Click any phrase to insert it
- "Thinking..." appears briefly while K2 fetches phrase suggestions from the cloud

Both rows can be scrolled horizontally if there are more suggestions than fit on screen — hover near the left/right edge to scroll, or click-drag.

**How the suggestions work:**

Word suggestions come from two sources blended together:
1. A built-in vocabulary list (common English words, weighted by frequency)
2. The K2 AI's prediction of what you are likely to type next, based on your personal profile and recent conversation

The AI's predictions are weighted more heavily because they are more relevant to your specific context. The vocabulary list provides instant backup suggestions while the AI prediction is loading.

### 4.5 Keyboard Panel

The **Keyboard** is a virtual QWERTY keyboard for typing into the Editor.

**Layout:**
```
1  2  3  4  5  6  7  8  9  0
q  w  e  r  t  y  u  i  o  p
a  s  d  f  g  h  j  k  l
z  x  c  v  b  n  m  ,  .
SHIFT        SPACE        BACKSPACE
```

**Color coding:** Each letter key is colored on a spectrum from **dark red** (unlikely next letter) to **bright green** (most likely next letter), based on what you've typed so far. This helps you find the right key quickly — your eye is drawn naturally to the green keys.

For example, if you've just typed "qu", the letter "e" will be bright green (because "que" and "qui" are common), while "x" will be dark (very unlikely after "qu").

**Shift:** Clicking Shift capitalizes the next letter you type. After you type a letter, Shift turns off automatically. (It is a one-shot shift, not a caps lock.)

**Backspace:** Deletes the character before the cursor (same as clicking "Del Char" in the Editor toolbar).

**Keyboard options (in Settings):**
- **K2 Keyboard** (default): The on-screen keyboard shown above is always visible
- **OS Keyboard**: Uses your device's built-in virtual keyboard (appears when you focus the Editor). The K2 keyboard is hidden.
- **Auto-Hide**: The K2 keyboard is hidden until you click in the Editor, then it slides up. It hides again when you click elsewhere.

---

## 5. Settings

To open Settings, click the **⚙️ Settings** button in the Actions panel toolbar (at the far right of the toolbar row).

The Settings panel covers all of K2's configurable options. Click **Close & Save** at the bottom when you are done — all changes take effect immediately.

### Personal Profile

At the top of Settings is a large text area where you can write free-form notes about yourself: your name, your relationships, your interests, your routines, your medical preferences, your smart home setup, and anything else you'd like K2 to know.

This is your **biography** — K2's AI reads it to understand you better and give more personalized responses.

After writing (or updating) your biography, click **Compile Profile from Text** to have the AI organize the text into structured categories. Once compiled, the AI will use this structured profile in every conversation.

> **Tip:** You don't have to write in any particular format. Just write naturally, as if you were describing yourself to a friend. The Compile function will organize it.

### Data Operations

This section lets you import and export your K2 data.

| Button | What it does |
|--------|--------------|
| **Import Profile (Text)** | Load a text/Markdown file as your biography, then compile it |
| **Update Profile from Chat Log** | Scan your recent conversations and automatically extract new facts to add to your profile |
| **Import Contacts (CSV)** | Import a contacts file (from Google, Outlook, iPhone, etc.) |
| **Export Contacts (CSV)** | Export your K2 contacts as a CSV file |
| **Import Actions (CSV)** | Import a list of action buttons from a CSV file |
| **Export Actions (CSV)** | Export all your action buttons to a CSV file |
| **Import Config (JSON)** | Restore a full K2 backup (settings, actions, chat history, contacts, profile) |
| **Export Config (JSON)** | Create a full K2 backup as a JSON file |

> **Important:** K2 stores all your data in your browser. If you switch to a different browser or device, use **Export Config (JSON)** on the old device and **Import Config (JSON)** on the new one to transfer everything.

### Display Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **Editor Font Size** | 32 px | Size of text in the Editor text box |
| **Keyboard Font Size** | 24 px | Size of letters on the keyboard keys |
| **Button Gap Horizontal** | 4 px | Space between buttons side-by-side |
| **Button Gap Vertical** | 4 px | Space between button rows |
| **Hover Brightness** | 1.2 | How much brighter buttons get when hovered (1.0 = no change) |
| **Min Target Width** | 50 px | Minimum width of any button (increase if buttons are hard to hit) |
| **Min Target Height** | 40 px | Minimum height of any button (increase if buttons are hard to hit) |

### Advanced: Grid Column Penalties

These three settings (A, B, C) control how the Actions grid chooses how many columns to display. In most cases the defaults (1.0, 1.0, 1.0) work well. You can adjust them if you prefer a more compact or more spacious grid layout.

### Smart Home (Home Assistant)

| Setting | Description |
|---------|-------------|
| **Home Assistant URL** | The web address of your Home Assistant server (e.g., `https://xxxx.ui.nabu.casa`) |
| **Home Assistant Token** | Your long-lived access token from Home Assistant |

Ask Phil to help configure these settings.

### Keyboard Settings

| Setting | Default | Description |
|---------|---------|-------------|
| **Basins of Attraction** | Off | *(Coming soon)* Makes keys feel larger for eye gaze by attracting your aim |
| **Use OS Keyboard** | Off | Use the device's built-in keyboard instead of the K2 keyboard |
| **Auto-Hide K2 Keyboard** | Off | K2 keyboard only shows when the Editor is focused |

### Voice Settings

| Setting | Description |
|---------|-------------|
| **ElevenLabs Voice** | Choose which voice K2 speaks in. Your cloned voices are listed first. Click to hear a preview. |
| **Local TTS Voice** | Choose which device voice to use for @LocalTTS. |

### Action Tag Separator

The character used to separate levels in action category names. Default is `|`. Change only if `|` conflicts with text in your action labels.

---

## 6. FAQ

### How do I create a new action?

**Using the Editor:**
1. Type the text you want to save in the Editor (or load and edit an existing action).
2. Click **Save As...** in the Editor toolbar.
3. Enter a name (tag) in the dialog. Use `|` to put it in a category: `Greetings|Good morning`.
4. Click **Save**.

**Using the AI:**
Ask K2: "Create an action button called 'Good morning' in the Greetings category that says 'Good morning, how are you today?'"

---

### How do I edit an existing action?

1. In the Actions panel, make sure **Edit** mode is selected.
2. Click the action button you want to edit. Its text appears in the Editor.
3. Make your changes in the Editor.
4. Click **Save** (not Save As). K2 saves back to the same button.

---

### How do I delete an action?

1. In the Actions panel toolbar, click the **Delete** mode button.
2. Click the action button you want to delete.
3. Confirm by clicking **Yes** in the dialog that appears.

---

### How do I create a new category?

Categories are created automatically when you save an action with a category prefix. For example, saving an action with the tag `Travel|Hotels` creates a "Travel" category (if it doesn't already exist) and places "Hotels" inside it.

You can also ask the AI: "Create a new action category called Travel and put Hotels inside it."

---

### How do I delete a category?

1. In the Actions panel toolbar, click the **Delete** mode button.
2. Click the category folder button you want to delete.
3. A confirmation message warns you that all actions inside will also be deleted. Click **Yes, Delete All** to confirm.

---

### How do I change the color of an action button or category?

1. Click the **color picker** in the Actions toolbar. Select the color you want (Blue, Green, Red, Orange, Purple, Yellow, Teal, Pink, or Gray).
2. Click the **Recolor** mode button (the color trigger button acts as the Recolor mode selector).
3. Click the action button or category folder to apply the color.

---

### How can I speak or whisper to enter text?

1. Place your cursor in the Editor where you want the text to appear.
2. Click the **Dictate** button (purple, in the Editor toolbar).
3. Speak or whisper your words.
4. Click **Dictate** again when you are done.
5. The transcribed text is inserted at the cursor.

---

### How does K2 know about me?

K2's AI reads your **Personal Profile** before every conversation. The profile is a structured set of facts about you (your name, your family, your interests, your routines, your medical preferences, etc.) that you provide in Settings.

Additionally, the AI can pick up new facts from your conversations automatically. After each chat exchange, K2 scans the conversation for new information and adds it to your profile silently in the background.

---

### How do I get K2 to know more about me?

**Method 1 — Write or update your biography:**
Go to Settings, update the biography text area, and click **Compile Profile from Text**.

**Method 2 — Tell the AI directly:**
Just tell K2 during a conversation: "Remember that my physical therapist is Sarah and she visits on Thursdays."
K2 will add this to your profile automatically.

**Method 3 — Import a profile file:**
In Settings, click **Import Profile (Text)** and select a text file containing your biography.

---

### What does K2 know about me?

Your profile is stored in Settings. You can see what the AI has compiled by looking at the biography section in Settings. You can also ask the AI directly: "What do you know about me?"

---

### How can I import my contacts?

In Settings, click **Import Contacts (CSV)**. You can import a contacts file exported from:
- **Google Contacts** (export as CSV)
- **iPhone/iCloud** (export as vCard or CSV via iCloud.com)
- **Outlook** (export as CSV)

K2 will ask whether to **Replace** your existing contacts or **Merge** the new ones with them. Choose Merge if you want to keep your existing contacts and add the new ones.

You can also add a contact by telling the AI: "Add Pete to my contacts. His phone number is 555-1234 and his email is pete@example.com."

---

### How do I back up my K2 data?

In Settings, click **Export Config (JSON)**. This creates a backup file (`k2_web_config_YYYY-MM-DD.json`) that contains:
- All your settings
- All your action buttons (macros)
- Your personal profile
- Your contacts
- Your full chat history

Save this file somewhere safe (OneDrive, a USB drive, etc.).

---

### How do I restore my K2 data?

In Settings, click **Import Config (JSON)** and select your backup file. K2 will ask whether to Replace (overwrite everything) or Merge (combine with what's already there). For a full restore, choose **Replace**.

> **Warning:** Replace overwrites all your current data. Make a fresh backup first if you want to preserve your current state.

---

### I've started using a different browser or device. How do I get K2 to look the same as before?

K2 stores your data in the browser's local storage on each device. When you switch to a new browser or device:

1. On your **old** device/browser: Go to Settings → **Export Config (JSON)** → save the file.
2. Transfer the file to your new device (email it to yourself, put it in OneDrive, use a USB drive, etc.).
3. On your **new** device/browser: Open K2 → Go to Settings → **Import Config (JSON)** → select the file → choose **Replace**.

Your action buttons, profile, contacts, and settings will all be restored.

---

### How do I set up K2 for the first time?

1. Open K2 in your browser.
2. Go to **⚙️ Settings**.
3. Write a short biography in the Personal Profile area (your name, a few key facts about yourself). Click **Compile Profile from Text**.
4. If you use Home Assistant for smart home control, enter your **Home Assistant URL** and **Token**.
5. Select your preferred **ElevenLabs Voice** (you should see your cloned voices at the top of the list).
6. Add some action buttons by typing phrases in the Editor and clicking **Save As...**.
7. Close Settings. K2 is ready to use.

---

### Can I use K2 on an iPad?

Yes. K2 works in Safari on iPad and iPhone. It also works in Chrome on Android. 

On a touch device, you can tap buttons directly. The K2 keyboard is optimized for touch as well as eye gaze — tapping a key feels responsive (there is no delay). The layout adjusts for portrait and landscape orientations.

---

### What happens if the internet is not available?

K2 requires an internet connection for:
- Sending and receiving messages with the Cloud AI (@CloudAI)
- Cloud TTS (@CloudTTS — ElevenLabs)
- Fetching word and phrase predictions

If the internet is unavailable:
- **@LocalTTS** still works (it uses your device's built-in speech engine, which is offline)
- The Keyboard and Editor still work for composing text
- Your saved action buttons are still accessible
- The basic word prediction dictionary (local, built into K2) still provides some suggestions

---

*End of K2 Tutorial and User Guide*  
*For technical documentation, see `master_specification_implemented.md` in the documents folder.*
