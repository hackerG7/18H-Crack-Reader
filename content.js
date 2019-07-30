inject("inject.js")
// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
          inject("startCollect.js")
      }
    }
  );
function inject(url){
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(url);
    (document.head||document.documentElement).appendChild(s);
    s.onload = function() {
        s.parentNode.removeChild(s);
    };
}