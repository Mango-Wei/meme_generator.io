function generateMeme() {
    const userInput = document.getElementById('userInput').value;

    fetch('/generate_meme', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: userInput })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('memeImage').src = data.image_url;
        document.getElementById('templateName').innerText = "Template used: " + data.template_name;
        document.getElementById('memeImage').style.display = "block";
    })
    .catch(error => console.error('Error:', error));
}