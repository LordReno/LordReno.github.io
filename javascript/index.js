const professions = ["Artificial Intelligence", "Computer Science", "Game Development", "Web Development", "Simulation"];
let index = 0;
const typingElement = document.getElementById('aboutProfession');

function animateText(text) {
    const chWidth = `${text.length}ch`;

    typingElement.style.setProperty('--text-width', chWidth);
    typingElement.style.animation = 'none';
    void typingElement.offsetWidth;

    typingElement.textContent = text;
    typingElement.style.animation = `typing 3s steps(${text.length}, end) forwards, blink 0.7s step-end infinite`;

    // Wait for typing to finish, then pause, then delete
    setTimeout(() => {
        typingElement.style.animation = 'none';
        void typingElement.offsetWidth;

        typingElement.style.animation = `deleting 2s steps(${text.length}, end) forwards, blink 0.7s step-end infinite`;

        setTimeout(() => {
            index = (index + 1) % professions.length;
            animateText(professions[index]);
        }, 2000); // Wait for delete to complete
        
    }, 4000); // 3s typing + 1s pause
}

// Start the first animation
animateText(professions[index]);
