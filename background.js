chrome.commands.onCommand.addListener(async (command) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (command === "start_clicking") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: startClicking,
      args: [10] // Default clicks per second, you can modify this as needed
    });
  } else if (command === "stop_clicking") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: stopClicking
    });
  }
});

function startClicking(cps) {
  function triggerClick(x, y) {
    const element = document.elementFromPoint(x, y);
    if (element) {
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
  }

  intervalId = setInterval(() => {
    const { clientX: x, clientY: y } = window.lastMousePosition;
    triggerClick(x, y);
  }, 1000 / cps);

  window.intervalId = intervalId; // Store intervalId in global window object

  window.addEventListener('mousemove', (e) => {
    window.lastMousePosition = { clientX: e.clientX, clientY: e.clientY };
  });
}

function stopClicking() {
  clearInterval(window.intervalId);
}
