chrome.tabs.onActivated.addListener((info) => {
  chrome.tabs.get(info.tabId, function (tab) {
    if(tab.url){
      chrome.cookies.get({name:"gdid", url:tab.url}, (cookie) => {
        if(cookie != null){
          console.log(`gdid is set as ${cookie.value}`);
        } else {
          console.log("gdid is not set.");
        } 
    });
    }
  });
});

