let intervalId;

document.getElementById('startClicking').addEventListener('click', async () => {
  const width = parseInt(document.getElementById('width').value, 10);
  const height = parseInt(document.getElementById('height').value, 10);
  const clicksPerSecond = parseInt(document.getElementById('clicksPerSecond').value, 10);

  if (width > 0 && height > 0 && clicksPerSecond > 0) {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: startClicking,
      args: [width, height, clicksPerSecond]
    });
  }
});

document.getElementById('stopClicking').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: stopClicking
  });
});

function startClicking(width, height, cps) {
  function findElementBySize(width, height) {
    const elements = document.querySelectorAll('div');
    for (let element of elements) {
      if (element.offsetWidth === width && element.offsetHeight === height) {
        return element;
      }
    }
    return null;
  }

  function triggerClick(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    ['mousedown', 'mouseup', 'click'].forEach(eventType => {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y
      });
      element.dispatchEvent(event);
    });
  }

  const element = findElementBySize(width, height);

  if (!element) {
    alert('Element not found');
    return;
  }

  intervalId = setInterval(() => {
    triggerClick(element);
  }, 1000 / cps);

  window.intervalId = intervalId; // Store intervalId in global window object
}

function stopClicking() {
  clearInterval(window.intervalId);
}
