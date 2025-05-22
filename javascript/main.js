// Sets up the page with systems such as anti-image copy
function setupWebpage() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable right-click
        });
    });
}

const toggleButton = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

// Initial setup
toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

setupWebpage();