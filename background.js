let selectedText;
const MAX_VALUES = 10;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "copy") {
    chrome.storage.local.get(["copiedValues"]).then((result) => {
      let copied = result.copiedValues || [];
      copied.unshift(request.data);

      if (copied.length > MAX_VALUES) {
        copied.pop();
      }
      chrome.storage.local.set({ copiedValues: copied });
    });
  }
});
