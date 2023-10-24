document.addEventListener("DOMContentLoaded", () => {
  let listGroup = document.querySelector(".list-group");
  let allItems, allContent, activeItemIndex;

  chrome.storage.local.get(["copiedValues"]).then((result) => {
    if (result.copiedValues.length == 0) {
      let fallbackItem = document.createElement("div");
      fallbackItem.textContent = "No copied values stored.";
      listGroup.appendChild(fallbackItem);
    }

    for (let i = 0; i < result.copiedValues.length; i++) {
      let listItem = document.createElement("a");
      listItem.setAttribute("data-bs-toggle", "list");
      listItem.className = "list-group-item list-group-item-action";

      let listItemHtml = `
        <div class="row">
          <div class="col text-truncate content"></div>
          <div class="col-auto p-0" style="height: 35px;">
            <img style="height: 100%;" src="../bootstrap/icons/${i}-square.svg" />
            <img class="btn delete-item" style="height: 100%;" src="../bootstrap/icons/x-circle.svg" />
          </div>
        </div>`;

      if (i == 0) {
        listItem.classList.add("active");
      }

      listItem.innerHTML = listItemHtml;
      let itemContent = listItem.querySelector(".content");
      itemContent.textContent = result.copiedValues[i];
      listGroup.appendChild(listItem);
    }

    allItems = document.querySelectorAll(".list-group-item");
    allContent = document.querySelectorAll(".list-group-item .content");
  });

  document.addEventListener("keydown", (event) => {
    activeItemIndex = searchActiveIndex(allItems);

    if (event.key == "Enter") {
      pasteToContentScript(allContent[activeItemIndex].innerText.trim());
    } else if (
      event.key === "ArrowDown" &&
      activeItemIndex < allContent.length - 1
    ) {
      allItems[activeItemIndex].classList.remove("active");
      allItems[activeItemIndex + 1].classList.add("active");
    } else if (event.key === "ArrowUp" && activeItemIndex > 0) {
      allItems[activeItemIndex].classList.remove("active");
      allItems[activeItemIndex - 1].classList.add("active");
    } else if (Array.from("0123456789").includes(event.key)) {
      pasteToContentScript(allContent[event.key].innerText.trim());
    }
  });

  listGroup.addEventListener("click", (event) => {
    activeItemIndex = searchActiveIndex(allItems);

    if (event.target.classList.contains("delete-item")) {
      event.target.parentElement.parentElement.parentElement.remove();
      chrome.storage.local.get(["copiedValues"]).then((result) => {
        let copied = result.copiedValues;
        copied.splice(activeItemIndex, 1);
        chrome.storage.local.set({ copiedValues: copied });
      });
      return;
    }
    pasteToContentScript(allContent[activeItemIndex].innerText.trim());
  });
});

const searchActiveIndex = (items) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains("active")) {
      return i;
    }
  }
};

const pasteToContentScript = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "paste", data: content });
  });
  window.close();
};
