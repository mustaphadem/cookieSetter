chrome.webNavigation.onCompleted.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    chrome.cookies.get({name:"gdid", url:tab.url}, (cookie) => {
      if(cookie != null){
        console.log(`gdid is set as ${cookie.value}`);
      } else {
        console.log("gdid is not set.");
      } 
  });
  });
});

