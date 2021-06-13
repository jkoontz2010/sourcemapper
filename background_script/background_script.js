let tabId;

/**
 * Hash map of the URLs to inject source maps for.
 * The key will be a regex which matches some URL and
 * the value is a source-map to ineject for that resource.
 */
let urls = new Map();

/**
 * Message Types
 */
ACTIVATE_REQUEST_MAPPING = "activateRequestMapping";


/**
 * This enables source map header injections for all URLs listed
 * in the current urls Map. It runs while the extension is initializing
 * and after any mutation to the urls Map.
 */
function setupRequestMapping() {
  const requestUrls = Array.from(urls.keys());
  console.log('req', requestUrls);
  chrome.webRequest.onHeadersReceived.addListener(
    injectSourceMap,
    {
      urls: requestUrls
      // // tabId,
      // types: ["scripts", "stylesheets"]
      // windowId: window.id
    },
    ["blocking", "responseHeaders"]
  );
}

function handleMessages(request, sender, sendResponse) {
  const { name } = request;

  console.log("mesage");
  switch(name) {
  case ACTIVATE_REQUEST_MAPPING:
    tabId = request.tabId;
    // setupRequestMapping();
    return "ok";
  default:
    throw new Error("Background request undefined", JSON.stringify(request, null, 2));
  }
}

/**
 * Loads the background script by fetching the source map
 * URLs from indexedDB.
 */
function init() {
  // TODO: get from indexeddb
  urls.set("*", "foo");
  urls.set("https://localhost:8000/browser-polyfill.min.js", "http://localhost:3000/browser-polyfill.min.js.map");
  chrome.runtime.sendMessage({ name: "init", urls });
}

chrome.runtime.onConnect.addListener(init);
chrome.runtime.onMessage.addListener(handleMessages);


/**
 * Adds a source map header to the request when it's in the user supplied
 * list of URLs to get source maps for.
 */
function injectSourceMap(e) {
  console.log('map', e);
  const { originUrl } = e;
  // const sourceMapUrl = urls.get(originUrl);
  const sourceMapUrl = "http://localhost:3000/browser-polyfill.min.js.map";
  // const sourceMapUrl = "https://localhost:8000/source-map/foo.min.js.map";
  e.responseHeaders = [
    ...e.responseHeaders,
    { name: "SourceMap", value: sourceMapUrl }
  ];
  return { responseHeaders: e.responseHeaders };
}

chrome.webRequest.onHeadersReceived.addListener(
  injectSourceMap,
  {
    urls: [
      "http://localhost:8000/browser-polyfill.min.js"
    ],
    tabId,
    // types: ["scripts", "stylesheets"],
    windowId: window.id
  },
  ["blocking", "responseHeaders"]
);

chrome.webRequest.onResponseStarted.addListener(
  ({ responseHeaders }) => console.log("resp ", responseHeaders),
  {
    urls: [
      "http://localhost:8000/browser-polyfill.min.js"
    ]
  },
  ["responseHeaders"]
);