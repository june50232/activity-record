
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const startButton = document.querySelector("button");
const microphone = document.querySelector(".fa-microphone");
const keywords = document.querySelectorAll(".keyword");
const output = document.querySelector(".output");
const loading = document.querySelector(".lds-ripple");
const historyList = document.querySelector(".history-list");
const clear = document.getElementById('clear')

const localStorageKey = 'historyListLocalStorage'
let historyListLocalStorage = JSON.parse(localStorage.getItem(localStorageKey)) || []
function updateLocalStorage() {
  localStorage.setItem(localStorageKey, JSON.stringify(historyListLocalStorage))
}
const historyAddDelete = (ele) => {
  ele.addEventListener('click', (e) => {
    const { innerText } = e.target
    if (Boolean(confirm(`確定刪除 ${innerText} ?`))) {
      historyListLocalStorage = historyListLocalStorage.filter(o => o !== innerText)
      updateLocalStorage()
      e.target.remove()
    }
  })
}
historyListLocalStorage.forEach(value => {
  let history = document.createElement('li');
  history.setAttribute('class', 'record-item')
  historyAddDelete(history)
  history.innerText = value
  historyList.insertAdjacentElement("afterbegin", history)
})
clear.addEventListener('click', (e) => {
  if (Boolean(historyListLocalStorage.length) && confirm('確認清空？')) {
    localStorage.removeItem(localStorageKey)
    historyList.innerHTML = ''
    historyListLocalStorage = []
  }
})
recognition.lang = "zh-TW";
recognition.interimResults = false;
recognition.continuous = true;
let listening = false;
const start = () => {
  recognition.start();
  loading.classList.add("reveal");
  microphone.classList.add("hide");
};

const stop = () => {
  recognition.stop();
  loading.classList.remove("reveal");
  microphone.classList.remove("hide");
};

startButton.addEventListener("click", () => {
  listening ? stop() : start();
  listening = !listening;
});

recognition.addEventListener("speechend", () => {
  listening ? stop() : null;
  listening = !listening;
});

recognition.addEventListener("error", (e) => {
  console.log(e.error);
  stop();
});

const recordMsg = (msg) => {
  let history = document.createElement('li');
  history.setAttribute('class', 'record-item')
  historyAddDelete(history)
  const month = new Date().getMonth() + 1;
  const date = new Date().getDate();
  const hour = new Date().getHours();
  const min = new Date().getMinutes();
  const sec = new Date().getSeconds();
  const time = `${month}/${date} ${hour}:${min}:${sec}`;
  const value = `${msg} ${time}`
  history.innerText = value
  historyList.insertAdjacentElement("afterbegin", history)

  historyListLocalStorage.push(value)
  updateLocalStorage()
}

function throttled(delay, fn) {
  let lastCall = 0;
  return function wrapper(...args) {
    const now = (new Date).getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  }
}

keywords.forEach(item => {
  const clickEvent = (e) => {
    const { innerText } = e.target
    recordMsg(innerText)
  }

  const throttledFunc = throttled(1000, clickEvent);

  item.addEventListener("click", throttledFunc)
})

recognition.addEventListener("result", (e) => {
  console.log(e.results); // e.results :SpeechRecognitionResult object
  const last = e.results.length - 1;
  const msg = e.results[last][0].transcript;
  if (msg) {
    stop();
    recordMsg(msg)
  }
});
