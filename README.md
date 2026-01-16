# SparkLink AI - LinkedIn Reply Extension ✨

A free, open-source Chrome Extension that helps you generate intelligent, engaging, and human-like replies on LinkedIn using your own Google Gemini API Key.

![Extension Icon](icons/icon128.png)

## Features
- **Floating Sparkle Button**: A clean, unobtrusive "Sparkle" icon (✨) appears inside LinkedIn comment boxes.
- **Contextual Awareness**: Reads the post content to generate relevant replies.
- **Multiple Tones**: Choose from `Positive`, `Thoughtful`, `Question`, or `Controversial` replies.
- **Privacy First**: Your API key is stored locally in your browser. No data is sent to any third-party server (except Google's API directly).
- **Free to Use**: Works with the free tier of Google Gemini API.

## Installation Guide (Developer Mode)

Since this extension is custom-built, you need to load it manually into Chrome.

1.  **Download the Code**:
    - Clone this repository or download the ZIP file and extract it.
    ```bash
    git clone https://github.com/noruzzamans/sparklink-ai.git
    ```

2.  **Open Chrome Extensions**:
    - Go to `chrome://extensions/` in your browser.

3.  **Enable Developer Mode**:
    - Toggle the **"Developer mode"** switch in the top-right corner.

4.  **Load the Extension**:
    - Click the **"Load unpacked"** button (top-left).
    - Select the folder wherever you downloaded/cloned this repository.

## 🔑 Configuration (Required)

To make the AI work, you need a free API Key from Google.

1.  **Get your Key**:
    - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Click **"Create API Key"**.
    - Select **"Create API key in new project"**.
    - Copy the key (it starts with `AIza...`).

2.  **Save in Extension**:
    - Click the **SparkLink AI** icon (✨) in your Chrome toolbar.
      *(If you don't see it, click the 🧩 Puzzle icon and Pin it)*.
    - Paste the key into the box.
    - Click **"Save Key"**.

> **Note:** This extension uses the `Gemini 2.0 Flash` model which is free of charge (within rate limits).

## How to Use

1.  Go to your LinkedIn Feed.
2.  Click on **Comment** under any post.
3.  You will see a small **Blue Sparkle (✨)** floating in the bottom-right of the comment box.
4.  **Click the Sparkle** to open the menu.
5.  **Select a Tone** (e.g., "Thoughtful").
6.  Wait a second, and the AI will type the reply for you! 🚀

## License
MIT License. Feel free to modify and improve!
