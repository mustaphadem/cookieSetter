let cookieName = document.getElementById("cookie-name");
let cookieValue = document.getElementById("cookie-value");
let save = document.getElementById("cookie-save");
let shouldSave = document.getElementById("cookie-save").checked;
let savedOptions = document.getElementById("saved-cookies");
let savedItems = [];

chrome.storage.sync.get("savedCookiePairs", (data) => {
  if(!(Object.values(data)[0]==undefined)){
    savedItems = Object.values(data)[0];
  }
 });

save.addEventListener("click", () => {
  shouldSave = save.checked;
});

savedOptions.addEventListener("change", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let name = savedOptions.options[savedOptions.selectedIndex].dataset.name;
  let value = savedOptions.options[savedOptions.selectedIndex].dataset.value;
  setCookies(name, value, tab);
})

applyChanges.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let name = cookieName.value;
  let value = cookieValue.value;
  if(shouldSave && !isEmpty([name, value])){
    savedItems.push({[name]:value});
    chrome.storage.sync.set({"savedCookiePairs": savedItems}, () => {
      console.log(`Cookie name-value has been saved in storage as ${name} : ${value}`);
    });
  };
  setCookies(name, value, tab);
});

function isEmpty(values){
  let flag = false;
  for (let i = 0; i < values.length; i++) {
      if(values[i].trim().length == 0){
          flag = true;
          break;
        }
      
  }
  return flag;
}

function setCookies(name, val, tab) {
  chrome.cookies.remove({name:name, url: tab.url}, (d) => {
    console.log(`Existing cookie ${d.name} has been removed.`);
  });
  chrome.cookies.set({ name: name, url: tab.url, value: val }, (c) => {
    console.log(`New cookie ${c.name} has been set as ${c.value}.`);
  });
  chrome.tabs.reload();
};

async function constructSavedItems() {
  await chrome.storage.sync.get("savedCookiePairs", (data) => {
    if(!(Object.values(data)[0]==undefined)){
      savedItems = Object.values(data)[0];
      for (let cookiePair of savedItems){
        let option = document.createElement("option");
        option.dataset.name = Object.keys(cookiePair)[0];
        option.dataset.value = Object.values(cookiePair)[0];
        option.label = Object.keys(cookiePair)[0] + " : " + Object.values(cookiePair)[0];
        savedOptions.appendChild(option);
      }
    };
   });
};

constructSavedItems();