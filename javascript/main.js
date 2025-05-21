// Sets up the page with systems such as anti-image copy
function setupWebpage() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // Disable right-click
        });
    });
}

// Initial setup

setupWebpage();