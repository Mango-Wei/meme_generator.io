// Replace this with your actual Heroku backend URL
const backendUrl = "http://127.0.0.1:5000";

let numUsers = localStorage.getItem('numUsers') ? parseInt(localStorage.getItem('numUsers')) : 2;
let chatHistory = localStorage.getItem('chatHistory') ? JSON.parse(localStorage.getItem('chatHistory')) : [];
let typingBubbleVisible = false;

// Define a unique color for each user
const userColors = ["#ff5733", "#33c1ff", "#85e085", "#ffd633"]; // Add more colors if needed

if (localStorage.getItem('chatPageVisible')) {
document.getElementById('landing-page').classList.add('hidden');
document.getElementById('chat-page').classList.remove('hidden');
displayChatHistory();
}

function selectNumUsers(users) {
numUsers = users;
localStorage.setItem('numUsers', numUsers);
document.getElementById('landing-page').classList.add('hidden');
document.getElementById('chat-page').classList.remove('hidden');
localStorage.setItem('chatPageVisible', true);
}

function handleEnter(event) {
if (event.key === 'Enter') {
    submitChat();
}
}

function showTyping() {
if (!typingBubbleVisible) {
    const chatHistoryDiv = document.getElementById('chat-history');
    const typingBubble = document.createElement('div');
    typingBubble.className = 'typing-bubble';
    typingBubble.id = 'typing-bubble';

    const userIndex = chatHistory.length % numUsers + 1;
    typingBubble.innerHTML = `User ${userIndex} is typing <span class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></span>`;
    chatHistoryDiv.appendChild(typingBubble);
    typingBubbleVisible = true;
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}
}

function hideTyping() {
const typingBubble = document.getElementById('typing-bubble');
if (typingBubble) {
    typingBubble.remove();
    typingBubbleVisible = false;
}
}

function submitChat() {
const chatInput = document.getElementById('chat-input');
if (chatInput.value.trim() !== '') {
    hideTyping();
    const userIndex = chatHistory.length % numUsers;
    const isSent = userIndex === 0; // First user (User1) is considered as the sender
    const chatBubbleClass = isSent ? 'sent' : 'received';
    chatHistory.push({ text: chatInput.value, class: chatBubbleClass, userIndex: userIndex });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    chatInput.value = '';
    displayChatHistory();
}
}

function displayChatHistory() {
const chatHistoryDiv = document.getElementById('chat-history');
chatHistoryDiv.innerHTML = '';
chatHistory.forEach(entry => {
    const chatRow = document.createElement('div');
    chatRow.className = `chat-row ${entry.class}`;

    // Create a profile bubble for the user with a unique color
    const profileBubble = document.createElement('div');
    profileBubble.className = 'profile-bubble';
    profileBubble.style.backgroundColor = userColors[entry.userIndex];

    // Create the chat bubble
    const chatBubble = document.createElement('div');
    chatBubble.className = `chat-bubble ${entry.class}`;
    chatBubble.textContent = entry.text;

    // Append profile bubble and chat bubble based on sent/received status
    if (entry.class === 'sent') {
    chatRow.appendChild(chatBubble); // Sent bubble on right
    chatRow.appendChild(profileBubble);
    } else {
    chatRow.appendChild(profileBubble); // Received bubble on left
    chatRow.appendChild(chatBubble);
    }

    chatHistoryDiv.appendChild(chatRow);
});
chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

function analyzeChat() {
fetch(`${backendUrl}/generate_meme_options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_history: chatHistory })
})
    .then(response => response.json())
    .then(data => {
    const memeOptionsDiv = document.getElementById('meme-options');
    memeOptionsDiv.innerHTML = '';
    data.meme_options.forEach((memeUrl, index) => {
        const img = document.createElement('img');
        img.src = memeUrl;
        img.alt = `Meme Option ${index + 1}`;
        img.onclick = () => selectMeme(memeUrl);
        memeOptionsDiv.appendChild(img);
    });

    document.getElementById('chat-page').classList.add('hidden');
    document.getElementById('meme-selection-page').classList.remove('hidden');
    })
    .catch(error => {
    console.error('Error fetching meme options:', error);
    });
}

function selectMeme(selectedMemeUrl) {
fetch(`${backendUrl}/generate_final_meme`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selected_meme: selectedMemeUrl })
})
    .then(response => response.json())
    .then(data => {
    document.getElementById('final-meme').src = data.final_meme_url;
    document.getElementById('meme-selection-page').classList.add('hidden');
    document.getElementById('meme-display-page').classList.remove('hidden');
    })
    .catch(error => {
    console.error('Error generating final meme:', error);
    });
}

function restart() {
localStorage.clear();
chatHistory = [];
numUsers = 2;
document.getElementById('chat-history').innerHTML = '';

document.getElementById('chat-page').classList.add('hidden');
document.getElementById('meme-selection-page').classList.add('hidden');
document.getElementById('meme-display-page').classList.add('hidden');
document.getElementById('landing-page').classList.remove('hidden');
}

if (localStorage.getItem('finalMeme')) {
document.getElementById('meme-display-page').classList.remove('hidden');
document.getElementById('final-meme').src = localStorage.getItem('finalMeme');
}




function analyzeChat() {
// Send chat history to the backend
fetch(`${backendUrl}/generate_meme_options`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ chat_history: chatHistory })
})
.then(response => response.json())
.then(data => {
    // Display meme options returned from backend
    const memeOptionsDiv = document.getElementById('meme-options');
    memeOptionsDiv.innerHTML = '';
    data.meme_options.forEach((memeUrl, index) => {
    const img = document.createElement('img');
    img.src = memeUrl;
    img.alt = `Meme Option ${index + 1}`;
    img.onclick = () => selectMeme(memeUrl);
    memeOptionsDiv.appendChild(img);
    });

    // Show meme selection page
    document.getElementById('chat-page').classList.add('hidden');
    document.getElementById('meme-selection-page').classList.remove('hidden');
})
.catch(error => {
    console.error('Error fetching meme options:', error);
});
}

function selectMeme(selectedMemeUrl) {
// Send selected meme URL to the backend to generate the final meme
fetch(`${backendUrl}/generate_final_meme`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ selected_meme: selectedMemeUrl })
})
.then(response => response.json())
.then(data => {
    // Display the final generated meme image
    document.getElementById('final-meme').src = data.final_meme_url;
    document.getElementById('meme-selection-page').classList.add('hidden');
    document.getElementById('meme-display-page').classList.remove('hidden');
})
.catch(error => {
    console.error('Error generating final meme:', error);
});
}
