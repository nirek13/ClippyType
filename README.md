# 📋 Clipboard Typer

**Clipboard Typer** is a Chrome extension that emulates typing text directly from your clipboard. It simplifies pasting by mimicking a natural typing effect—handy for situations where manual typing is preferable (e.g., bypassing certain paste restrictions).

---

## 🚀 Installation

1. Clone this repository or [download the ZIP](#).
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (toggle at the top-right).
4. Click **Load unpacked** and select the extension directory.

---

## 🔐 Permissions

- **`debugger`**: Required to emulate typing via the Chrome Debugger API (needed for compatibility with sites like Google Docs).
- **`scripting`** and **`activeTab`**: Used to inject scripts that access clipboard contents from the current tab. Service workers can't directly access the clipboard otherwise.

---

## ✨ Usage

1. **Copy** text to your clipboard.
2. Right-click anywhere on a page and choose **Start typing**  
   or  
   Click the extension icon and choose **Start typing**.
3. To **stop typing**, repeat the same process and choose **Stop typing**.

---

## 📜 License

MIT License
