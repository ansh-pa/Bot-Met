const userInput = document.getElementById("userInput");
const sendMsgBtn = document.getElementById("sendMsgBtn");
const chatContainer = document.getElementById("chatContainer");
const scrollButton = document.getElementById("scrollButton");


sendMsgBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});


async function scrollToBottom() {
    window.scrollTo(0, chatContainer.scrollHeight);
}

async function msgFromChatbot(userValue) {
    try {
        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userValue })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const botResponse = data.response;

        // Create and display the chatbot response
        let chatbotChatContainer = document.createElement("div");
        chatbotChatContainer.classList.add("msg-from-chatbot");
        chatContainer.appendChild(chatbotChatContainer);

        let labelChatbot = document.createElement("img");
        labelChatbot.src = "robot-assistant.png"; // Ensure this image path is correct
        labelChatbot.classList.add("chatbot-lable-img");
        chatbotChatContainer.appendChild(labelChatbot);

        let received = document.createElement("h2");
        received.textContent = botResponse;
        received.classList.add("chat-style-chatbot");
        chatbotChatContainer.appendChild(received);
        userInput.value = '';
        
        scrollToBottom();
        
    } catch (error) {
        console.error('Error:', error);
        alert("There was an error communicating with the chatbot.");
    }
}

async function sendMessage() {
    let userValue = userInput.value.trim();
    console.log("User input:", userValue); // Debugging line
    if (!userValue) return; // Prevent empty messages

    let userChatContainer = document.createElement("div");
    userChatContainer.classList.add("msg-to-chatbot");
    chatContainer.appendChild(userChatContainer);

    let send = document.createElement("h2");
    send.textContent = userValue;
    send.classList.add("chat-style-user");
    userChatContainer.appendChild(send);

    userInput.value = ''; // Clear input
    await msgFromChatbot(userValue);
    
}

// Scroll to the latest messages
scrollButton.addEventListener('click', scrollToBottom);





