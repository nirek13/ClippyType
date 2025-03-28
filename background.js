const State = {
  Start: "0",
  Stop: "1",
};

chrome.contextMenus.create({ id: State.Start, title: "Start typing", contexts: ["all"] });
chrome.contextMenus.create({ id: State.Stop, title: "Stop typing", contexts: ["all"] });

const tasks = {};

chrome.contextMenus.onClicked.addListener(async ({ menuItemId }, tab) => {
  const tabId = tab.id;
  if (menuItemId === State.Start) {
    if (tasks[tabId]) stopTyping(tabId);
    startTyping(tabId);
  } else {
    stopTyping(tabId);
  }
});

const startTyping = async (tabId) => {
  const taskId = (tasks[tabId] = Math.random());

  try {
    await chrome.debugger.attach({ tabId }, "1.3");
  } catch {
    return stopTyping(tabId);
  }

  const text = await readClipboard(tabId);
  if (!text) return stopTyping(tabId);

  for (let i = 0; i < text.length && tasks[tabId] === taskId; i++) {
    const char = text[i];

    if (char === "\n") {
      await pressKey(tabId, "Enter", 13);  // VK_RETURN
    } else if (char === "\t") {
      await pressKey(tabId, "Tab", 9);      // VK_TAB
    } else {
      await chrome.debugger.sendCommand({ tabId }, "Input.insertText", { text: char });
    }

    await wait(randomNumber(10, 30));  // Faster typing speed
  }

  stopTyping(tabId);
};

const pressKey = async (tabId, key, keyCode) => {
  await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyDown",
    key: key,
    code: key,
    windowsVirtualKeyCode: keyCode,
  });

  await chrome.debugger.sendCommand({ tabId }, "Input.dispatchKeyEvent", {
    type: "keyUp",
    key: key,
    code: key,
    windowsVirtualKeyCode: keyCode,
  });
};

const stopTyping = (tabId) => {
  if (tasks[tabId]) {
    chrome.debugger.detach({ tabId }).catch(() => {});
    delete tasks[tabId];
  }
};

const readClipboard = (tabId) =>
  chrome.scripting
    .executeScript({ target: { tabId }, func: () => navigator.clipboard.readText() })
    .then(([res]) => res?.result || "");

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
