// Enhanced JavaScript for Clear Way Website with Accessibility

// DOM Elements
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarNavLinks = document.getElementById("sidebarNavLinks");
const sidebarNavItems = sidebarNavLinks ? sidebarNavLinks.querySelectorAll("a") : [];

// Sidebar Navigation with Accessibility
function toggleSidebar() {
  const isOpen = sidebar.classList.contains("active");
  sidebar.classList.toggle("active");
  document.body.style.overflow = sidebar.classList.contains("active") ? "hidden" : "";
  
  // Update ARIA attributes
  sidebarToggle.setAttribute("aria-expanded", !isOpen);
  sidebar.setAttribute("aria-hidden", isOpen);
  
  // Focus management
  if (!isOpen) {
    // Opening sidebar - focus first nav item
    const firstNavItem = sidebarNavItems[0];
    if (firstNavItem) {
      firstNavItem.focus();
    }
  } else {
    // Closing sidebar - return focus to toggle button
    sidebarToggle.focus();
  }
}

function closeSidebar() {
  sidebar.classList.remove("active");
  document.body.style.overflow = "";
  sidebarToggle.setAttribute("aria-expanded", "false");
  sidebar.setAttribute("aria-hidden", "true");
  sidebarToggle.focus();
}

// Event Listeners
if (sidebarToggle) {
  sidebarToggle.addEventListener("click", toggleSidebar);
}

if (sidebarClose) {
  sidebarClose.addEventListener("click", closeSidebar);
}

// Close sidebar when nav link is clicked
sidebarNavItems.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (sidebar && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
    closeSidebar();
  }
});

// Close sidebar on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar && sidebar.classList.contains("active")) {
    closeSidebar();
  }
});

// Keyboard navigation for sidebar
sidebarNavItems.forEach((item, index) => {
  item.addEventListener("keydown", (e) => {
    switch(e.key) {
      case "ArrowDown":
        e.preventDefault();
        const nextItem = sidebarNavItems[index + 1] || sidebarNavItems[0];
        nextItem.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        const prevItem = sidebarNavItems[index - 1] || sidebarNavItems[sidebarNavItems.length - 1];
        prevItem.focus();
        break;
      case "Home":
        e.preventDefault();
        sidebarNavItems[0].focus();
        break;
      case "End":
        e.preventDefault();
        sidebarNavItems[sidebarNavItems.length - 1].focus();
        break;
    }
  });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll(
  ".about-container, .services-container, .contact-container, .location-container"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { 
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  }
);

revealElements.forEach((el) => {
  el.classList.add("hidden");
  observer.observe(el);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Performance optimizations and loading states
const images = document.querySelectorAll('img');
images.forEach(img => {
  // Add loading state
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.3s ease';
  
  img.addEventListener('load', function() {
    this.style.opacity = '1';
  });
  
  img.addEventListener('error', function() {
    this.style.opacity = '1';
    console.warn('Image failed to load:', this.src);
  });
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  scrollTimeout = setTimeout(() => {
    // Any scroll-based functionality can go here
  }, 10);
}, { passive: true });

// Add focus management for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-navigation');
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    }
  });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Add loading states for buttons
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    if (this.href && this.href.startsWith('tel:') || this.href && this.href.startsWith('https://wa.me/')) {
      // Add loading state for call/WhatsApp buttons
      const originalText = this.innerHTML;
      this.innerHTML = '<span aria-hidden="true">⏳</span> Connecting...';
      this.style.pointerEvents = 'none';
      
      // Reset after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.pointerEvents = 'auto';
      }, 2000);
    }
  });
});

// Error handling for external resources
window.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    console.warn('Image failed to load:', e.target.src);
    e.target.style.display = 'none';
  }
}, true);
