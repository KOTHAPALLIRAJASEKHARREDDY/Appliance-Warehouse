let slideIndex = 0;  // Start with the first slide

// Function to show the next slide
function moveSlide(n) {
    showSlides(slideIndex += n);
}

// Function to go to a specific slide
function currentSlide(n) {
    showSlides(slideIndex = n);
}

// Function to show the slides and manage active dots
function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");

    // If the index is out of bounds, wrap around
    if (n >= slides.length) {
        slideIndex = 0;
    } else if (n < 0) {
        slideIndex = slides.length - 1;
    }

    // Hide all slides and remove active class from all dots
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        dots[i].classList.remove("active");
    }

    // Show the current slide and add active class to the corresponding dot
    slides[slideIndex].style.display = "block";
    dots[slideIndex].classList.add("active");
}

// Initialize the slideshow by showing the first slide
showSlides(slideIndex);

// Set up automatic slide change every 30 seconds (30,000 milliseconds)
setInterval(function() {
    moveSlide(1); // Move to the next slide every 30 seconds
}, 30000);
