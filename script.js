const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Toggle nav on hamburger click
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// 👉 Close menu when a nav link is clicked (mobile fix)
const navItems = navLinks.querySelectorAll('a');

navItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll(".about-container, .services-container, .contact-container");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Only reveal once
    }
  });
}, { threshold: 0.2 });

revealElements.forEach(el => {
  el.classList.add("hidden"); // Set initial hidden
  observer.observe(el);
});
