let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.cookies.get({name:"gdid", url:"https://www.gofundme.com"}, (cookie) => {
      if(cookie != null){
        console.log(`gdid is set as ${cookie.value}`);
      } else {
        console.log("gdid is not set.");
      }
      
  });
  // chrome.storage.sync.set({ color });
  // console.log('Default background color set to %cgreen', `color: ${color}`);
});

