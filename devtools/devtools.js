/**
 * Creates a persistent port to pass messages between the devtool script
 * and the background script. This allows data to be persisted across the
 * browser sessions. Great for caching user supplied data like source map URLs.
 */
chrome.runtime.connect();

/**
 * Hash map of the URLs
 * TODO: better partial matching on strings later?
 */
let URLs = new Map();

/**
 * Message Types
 */
ACTIVATE_REQUEST_MAPPING = "activateRequestMapping";

function handleBackgroundMessages(message) {
  const { name } = message;
  console.log("dev tools msg", message);

  switch(name) {
  case "init":
    URLs = message.urls;
    return chrome.runtime.sendMessage({ name: ACTIVATE_REQUEST_MAPPING });
  default:
    throw new Error("Devtools message undefined", JSON.stringify(message, null, 2));
  };
}

chrome.runtime.onMessage.addListener(handleBackgroundMessages);

chrome.devtools.panels.create(
  "Source Mapper",
  "../icons/icon.png",
  "../panel/panel.html"
);
