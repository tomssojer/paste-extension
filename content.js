let port = chrome.runtime.connect({ name: "background" });
let focusedElement;

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.code === "KeyC") {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      port.postMessage({ message: "copy", data: selectedText });
    }
  }
});
