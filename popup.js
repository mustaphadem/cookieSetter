// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let cookieName = document.getElementById("cookie-name");
let cookieValue = document.getElementById("cookie-value");

applyChanges.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  setCookies(cookieName.value, cookieValue.value);
});

function setCookies(name, val) {
  chrome.cookies.get({ name: name, url: "https://www.gofundme.com" }, (cookie) => {

    if (cookie != null) {
      chrome.cookies.remove({ name: name, url: "https://www.gofundme.com" }, (removedCookie) => {
        console.log(`Removed previous cookie (name: ${removedCookie.name})`);
        chrome.cookies.set({ name: name, url: "https://www.gofundme.com", value: val }, (c) => {
          console.log(`Cookie ${c.name} has been set as ${c.value}`);
        });
      });
    } else {
      console.log(`${name} is not found.`);
      chrome.cookies.set({ name: name, url: "https://www.gofundme.com", value: val }, (c) => {
        console.log(`New cookie ${c.name} has been set as ${c.value}`);
      });
    };

  });
};