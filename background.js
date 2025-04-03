const State = {
  Start: "0",
  Stop: "1",
};

// Create context menu items
chrome.contextMenus.create({
  id: State.Start,
  title: "Start typing",
  contexts: ["all"],
});

chrome.contextMenus.create({
  id: State.Stop,
  title: "Stop typing",
  contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) => {
  if (menuItemId == State.Start) {
    startTyping(tab.id);
  } else {
    stopTyping(tab.id);
  }
});

// Track current task for each tab to prevent running multiple tasks on the same tab
let tasks = {};

const startTyping = async (tabId) => {
  const taskId = Math.random();
  tasks[tabId] = taskId;

  try {
    await chrome.debugger.attach({ tabId }, "1.3");

    const text = [...(await readClipboard(tabId))];
    let i = 0;

    while (tasks[tabId] === taskId && i < text.length) {
      await typeCharacter(tabId, text[i]);
      await wait(randomNumber(50, 200)); // Adjust speed with delay between characters
      i++;
    }

    // Show notification when typing is complete
    showNotification("Typing task completed!");
  } catch (error) {
    console.error("Error during typing task:", error);
    showNotification("Typing task failed.");
  } finally {
    // Cleanup
    stopTyping(tabId);
  }
};

const stopTyping = (tabId) => {
  delete tasks[tabId];
};

const typeCharacter = async (tabId, character) => {
  try {
    await chrome.debugger.sendCommand({ tabId }, "Input.insertText", { text: character });
  } catch (error) {
    console.error("Failed to type character:", error);
  }
};

const readClipboard = async (tabId) => {
  return chrome.scripting
    .executeScript({
      target: { tabId },
      func: () => navigator.clipboard.readText(),
    })
    .then(([{ result }]) => result);
};

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Show a notification on completion
const showNotification = (message) => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icon.png", // Add your icon image here
    title: "Typing Task",
    message: message,
  });
};

// Add event listener for notifications click (optional)
chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({ url: "https://docs.google.com" });
});

// Ensure compatibility with Google Docs and other websites
const isGoogleDocsPage = (url) => {
  return url.includes("docs.google.com");
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (isGoogleDocsPage(tab.url) && changeInfo.status === "complete") {
    console.log("Google Docs loaded. Ready for typing.");
    // Ensure typing task is initialized properly
    // Optionally check and fix specific elements to target Google Docs inputs
  }
});
