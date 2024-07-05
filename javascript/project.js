const toggleImage = document.getElementById('flexImages');
const returnBack = document.getElementById('returnText');

const frontFrame = document.getElementById('Front_Frame');

toggleImage.addEventListener('click', () => {
    frontFrame.style.display = 'flex';
});

returnBack.addEventListener('click', () => {
    frontFrame.style.display = 'none';
});