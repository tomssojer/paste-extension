let focusedElement;

const inputEvent = new Event("input", {
  bubbles: true,
  cancelable: true,
});

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.code === "KeyC") {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      chrome.runtime.sendMessage({ message: "copy", data: selectedText });
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  focusedElement = document.activeElement;
  if (request.message === "paste") {
    focusedElement.value = request.data;
    focusedElement.dispatchEvent(inputEvent);
  }
});
