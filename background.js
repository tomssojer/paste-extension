// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: contentScriptFunc,
//     args: ["action"],
//   });
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    sendResponse(request);
  }

  return true;
});

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});
