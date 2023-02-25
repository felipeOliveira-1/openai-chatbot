const cache = {};

const OPENAI_API_KEY = "";
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/engines/text-davinci-003/completions";

const chatToggle = document.getElementById('chat-toggle');
const chatWidget = document.getElementById("chat-widget");
const chatContainer = document.getElementById("chat-container");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSendButton = document.getElementById("chat-send");

let chatVisible = false;
let introMessageSent = false;

chatToggle.addEventListener('click', () => {
chatVisible = !chatVisible;
chatWidget.classList.toggle('visible', chatVisible);
chatToggle.innerText = chatVisible ? 'Close' : 'Open Chat';
});

chatInput.addEventListener('keydown', (event) => {
if (event.key === 'Enter') {
event.preventDefault();
const userInput = chatInput.value.trim();
if (userInput) {
addChatMessage("You", userInput);
sendChatMessage(userInput);
chatInput.value = "";
}
}
});

chatSendButton.addEventListener("click", () => {
const userInput = chatInput.value.trim();
if (userInput) {
addChatMessage("You", userInput);
sendChatMessage(userInput);
chatInput.value = "";
}
});

function addChatMessage(sender, message) {
const messageContainer = document.createElement("div");
messageContainer.classList.add("chat-message-container");
const messageHeader = document.createElement("div");
messageHeader.classList.add("chat-message-header");
messageHeader.textContent = sender + ":";
const messageBody = document.createElement("div");
messageBody.classList.add("chat-message-body");
messageBody.textContent = message;
messageContainer.appendChild(messageHeader);
messageContainer.appendChild(messageBody);
chatMessages.appendChild(messageContainer);
chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendChatMessage(message) {
  if (!introMessageSent) {
    addChatMessage("Chat AI", "Hello! I'm Chat AI. I'm constantly improving and for that reason, from time to time I may not provide a very accurate answer! Please enter your message below.");
    introMessageSent = true;
  }

  const loadingElement = document.getElementById("loading");
  loadingElement.style.display = "block";

  fetch(OPENAI_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `Q: ${message}\nA: `,
      max_tokens: 600,
      temperature: 0.6,
      stop: ["\n"],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const chatbotResponse = data.choices[0].text.trim();
      addChatMessage("Chat IA", chatbotResponse);
      loadingElement.style.display = "none";
    })
    .catch((error) => {
      console.error(error);
      addChatMessage("Chat IA", "Sorry, I was unable to process your request.");
      loadingElement.style.display = "none";
    });
}
