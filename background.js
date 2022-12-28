chrome.tabs.onActivated.addListener(retrieveSavedItems());

async function retrieveSavedItems() {
  await chrome.storage.sync.get("savedCookiePairs", (data) => {
    if(!(Object.values(data)[0]==undefined)){
      let savedItems = Object.values(data)[0];
      console.log("Saved entries are:");
      savedItems.forEach(element => {
        console.log(`Name: ${Object.keys(element)[0]}, Value: ${Object.values(element)[0][0]}, Description: ${Object.values(element)[0][1]}`);
      });   
    }else {
      console.log("No saved items are found.")
    }
   });
};


