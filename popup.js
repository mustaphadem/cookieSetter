let form = document.getElementById("cookie-form");
let inputFields = document.querySelectorAll("input");
let cookieName = document.getElementById("cookie-name");
let cookieValue = document.getElementById("cookie-value");
let cookieDescription = document.getElementById("cookie-description");
let save = document.getElementById("cookie-save");
let reset = document.getElementById("reset");
let shouldSave = document.getElementById("cookie-save").checked;
let savedOptions = document.getElementById("saved-cookies");
let savedItems = [];

save.addEventListener("click", () => {
  shouldSave = save.checked;
  if(shouldSave){
    cookieDescription.disabled = false;
  } else {
    cookieDescription.disabled = true;
  }
});

reset.addEventListener("click", () => {
  resetInputs();
})

savedOptions.addEventListener("change", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let name = savedOptions.options[savedOptions.selectedIndex].dataset.name;
  let value = savedOptions.options[savedOptions.selectedIndex].dataset.value;
  let description = savedOptions.options[savedOptions.selectedIndex].dataset.description;
  cookieName.value = name;
  cookieValue.value = value;
  cookieDescription.value = description;
  disableInputs();
});

async function getSavedItems(){
  await chrome.storage.sync.get("savedCookiePairs", (data) => {
    if(!(Object.values(data)[0]==undefined)){
      savedItems = Object.values(data)[0];
    } else {
      console.log("No saved items are found.")
    }
   });
};

function disableInputs (){
  cookieName.disabled = true;
  cookieValue.disabled = true;
  cookieDescription.disabled = true;
  save.disabled = true;
};

function resetInputs (){
  cookieName.disabled = false;
  cookieName.value = "";
  cookieValue.disabled = false;
  cookieValue.value = "";
  cookieDescription.disabled = false;
  cookieDescription.value = "";
  save.disabled = false;
  savedOptions.value = "Select one";
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await getSavedItems();
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let name = cookieName.value;
  let value = cookieValue.value;
  let description = cookieDescription.value;
  if(shouldSave && !isEmpty([name, value]) && !isDuplicate(name, value, savedItems)){
    savedItems.push({[name]:[value, description]});
    chrome.storage.sync.set({"savedCookiePairs": savedItems}, () => {
      console.log(`New cookie has been saved as ${name} : ${value} with description ${description}`);
    });
    constructSavedItems();
  };
  setCookies(name, value, tab);
});

inputFields.forEach(el => el.addEventListener("input", async (e) => {
  if(cookieName.value.trim().length > 0 || cookieValue.value.trim().length > 0 || cookieDescription.value.trim().length > 0){
    reset.disabled = false;
  } else {
    reset.disabled = true;
  }
}));

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

function isDuplicate(name, value, items){
  let flag = false;
  for (let i = 0; i < items.length; i++) {
    let hasKey = items[i].hasOwnProperty(name);
    let hasValue = false;
    if(hasKey){
      hasValue = items[i][name][0] == value;
    };
    if(hasKey && hasValue){
        flag = true;
        break;
      };  
};
return flag;
};

function setCookies(name, val, tab) {
  chrome.cookies.remove({name:name, url: tab.url}, () => {});
  chrome.cookies.set({ name: name, url: tab.url, value: val }, (c) => {
    console.log(`Cookie ${c.name} has been set as ${c.value}.`);
  });
  chrome.tabs.reload();
};

async function constructSavedItems() {
  await chrome.storage.sync.get("savedCookiePairs", (data) => {
    if(!(Object.values(data)[0]==undefined)){
      savedItems = Object.values(data)[0];
      for (let cookie of savedItems){
        let name = Object.keys(cookie)[0];
        let value = Object.values(cookie)[0][0];
        let description = Object.values(cookie)[0][1];
        let option = document.createElement("option");
        option.dataset.name = name;
        option.dataset.value = value;
        option.dataset.description = description;
        option.label = name + " : " + value;
        savedOptions.appendChild(option);
      }
    };
   });
};

constructSavedItems();