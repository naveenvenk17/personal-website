// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// ==============================================
// STARFIELD BACKGROUND SYSTEM
// ==============================================
class Starfield {
    constructor() {
        this.canvas = document.getElementById('starfield');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'starfield';
            document.body.insertBefore(this.canvas, document.body.firstChild);
        }
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.starCount = 800;
        this.rotationSpeed = 0.0001;
        this.angle = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createStars();
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }
    
    createStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            // Create stars in a circular distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * Math.max(this.canvas.width, this.canvas.height);
            this.stars.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                z: Math.random() * 1000,
                size: Math.random() * 1.5 + 0.5,
                baseOpacity: Math.random() * 0.5 + 0.5,
                twinkleSpeed: Math.random() * 0.05 + 0.02,
                twinkleOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createStars();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.targetX = (e.clientX - this.centerX) * 0.02;
            this.targetY = (e.clientY - this.centerY) * 0.02;
        });
    }
    
    animate() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Smooth mouse parallax
        this.mouseX += (this.targetX - this.mouseX) * 0.05;
        this.mouseY += (this.targetY - this.mouseY) * 0.05;
        
        // Rotate the starfield
        this.angle += this.rotationSpeed;
        
        const time = Date.now() * 0.001;
        
        // Draw stars
        this.stars.forEach(star => {
            // Apply rotation
            const rotatedX = star.x * Math.cos(this.angle) - star.y * Math.sin(this.angle);
            const rotatedY = star.x * Math.sin(this.angle) + star.y * Math.cos(this.angle);
            
            // Project to 2D with perspective
            const perspective = 500 / (500 + star.z);
            const screenX = this.centerX + rotatedX * perspective + this.mouseX;
            const screenY = this.centerY + rotatedY * perspective + this.mouseY;
            
            // Twinkle effect
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
            const opacity = star.baseOpacity * twinkle * perspective;
            const size = star.size * perspective;
            
            // Only draw if on screen
            if (screenX >= 0 && screenX <= this.canvas.width && 
                screenY >= 0 && screenY <= this.canvas.height) {
                
                // Draw glow
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, size * 2, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
                this.ctx.fill();
                
                // Draw star
                this.ctx.beginPath();
                this.ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                this.ctx.fill();
            }
            
            // Move star closer (for depth effect)
            star.z -= 0.1;
            if (star.z <= 0) {
                star.z = 1000;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize starfield when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Starfield();
});

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in class to elements and observe them
    const fadeElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item, .about-content, .section-header, .experience-card');

    fadeElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Add fade-in-up class to experience cards
    const experienceCards = document.querySelectorAll('.experience-card');
    experienceCards.forEach((card, index) => {
        card.classList.add('fade-in-up');
        card.style.transitionDelay = `${index * 100}ms`;
    });

    // Initialize carousel functionality
    initializeCarousels();

    // Make project cards clickable
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // Don't trigger if clicking on a link
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }

            // Find the first GitHub link in the card and click it
            const githubLink = this.querySelector('a[href*="github.com"]');
            if (githubLink) {
                githubLink.click();
            }
        });
    });
});

// Skill bars animation
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target;
            const width = progressBar.style.width;
            progressBar.style.width = '0%';

            setTimeout(() => {
                progressBar.style.width = width;
            }, 500);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Contact form handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelectorAll('input[type="text"]')[1].value;
        const message = this.querySelector('textarea').value;

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Sending message...', 'info');

        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
        }, 2000);
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;

    // Add to page
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Portfolio item click handlers
document.querySelectorAll('.portfolio-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const projectTitle = this.closest('.portfolio-info').querySelector('h3').textContent;
        showNotification(`Opening ${projectTitle} project...`, 'info');

        // Here you would typically open a modal or navigate to the project page
        // For now, we'll just show a notification
        setTimeout(() => {
            showNotification('Project details would open here in a real implementation', 'info');
        }, 1000);
    });
});

// Typing animation for hero title that handles HTML
function typeWriterHTML(element, speed = 100) {
    const originalHTML = element.innerHTML;
    // Split by both text and HTML tags, preserving tags
    const parts = originalHTML.split(/(<br\s*\/?>)/gi);
    let charIndex = 0;
    let partIndex = 0;
    let displayedHTML = '';
    element.innerHTML = '';
    
    function typeNext() {
        if (partIndex < parts.length) {
            const part = parts[partIndex];
            
            // Check if this part is a <br> tag
            if (part.match(/<br\s*\/?>/i)) {
                displayedHTML += part;
                element.innerHTML = displayedHTML;
                partIndex++;
                setTimeout(typeNext, speed);
            } else {
                // It's text content
                if (charIndex < part.length) {
                    displayedHTML += part.charAt(charIndex);
                    element.innerHTML = displayedHTML;
                    charIndex++;
                    setTimeout(typeNext, speed);
                } else {
                    // Move to next part
                    charIndex = 0;
                    partIndex++;
                    setTimeout(typeNext, speed / 2);
                }
            }
        }
    }
    
    typeNext();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title.typing-animation');
    if (heroTitle) {
        typeWriterHTML(heroTitle, 80);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.floating-element');

    if (hero) {
        const rate = scrolled * -0.5;
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 50px; height: 50px; border: 3px solid #f3f3f3; border-top: 3px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
            <p>Loading...</p>
        </div>
    `;

    document.body.appendChild(loading);

    // Hide loading after page loads
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 500);
    }, 1000);
});

// Add CSS for loading animation
const loadingStyles = document.createElement('style');
loadingStyles.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(loadingStyles);

// Counter animation for statistics (if you want to add them later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

// Add scroll progress indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    z-index: 10001;
    transition: width 0.1s ease;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

// Add hover effects for service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click to copy email functionality
document.querySelectorAll('.contact-details p').forEach(p => {
    if (p.textContent.includes('@')) {
        p.style.cursor = 'pointer';
        p.title = 'Click to copy email';

        p.addEventListener('click', function () {
            const email = this.textContent;
            navigator.clipboard.writeText(email).then(() => {
                showNotification('Email copied to clipboard!', 'success');
            }).catch(() => {
                showNotification('Failed to copy email', 'error');
            });
        });
    }
});

// FIXED CAROUSEL FUNCTIONALITY FOR MOBILE
// Carousel functionality for YouTube videos and Strava runs with infinite loop
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const scrollAmount = 350; // Width of one card + gap
    // Calculate maxScroll excluding the cloned item
    const totalItems = carousel.children.length - 1; // Exclude cloned item
    const maxScroll = (totalItems - 1) * scrollAmount;

    if (direction === 1) {
        // Check if we're at the end
        if (carousel.scrollLeft >= maxScroll) {
            // Loop back to the beginning instantly
            carousel.scrollTo({
                left: 0,
                behavior: 'auto'
            });
        } else {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    } else {
        // Check if we're at the beginning
        if (carousel.scrollLeft <= 0) {
            // Loop to the end instantly
            carousel.scrollTo({
                left: maxScroll,
                behavior: 'auto'
            });
        } else {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        }
    }
}

// Auto-scroll carousels with infinite loop AND HOVER PAUSE
function autoScrollCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        let isScrolling = false;
        let isPaused = false; // NEW: track if paused by hover
        let autoScrollInterval;

        // Handle manual scrolling
        carousel.addEventListener('scroll', () => {
            isScrolling = true;
            clearTimeout(carousel.scrollTimeout);
            carousel.scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 150);
        });
        
        // NEW: Pause on mouse hover (desktop)
        carousel.addEventListener('mouseenter', () => {
            isPaused = true;
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        });
        
        // NEW: Resume on mouse leave (desktop)
        carousel.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoScroll();
        });

        // Auto-scroll function with better mobile support
        function autoScroll() {
            if (!isScrolling && !isPaused) {
                const itemWidth = 350; // Width of one card + gap
                const totalItems = carousel.children.length - 1; // Exclude cloned item
                const maxScrollLeft = (totalItems - 1) * itemWidth;
                const currentScroll = carousel.scrollLeft;

                // Check if we're at or near the end (with some tolerance for mobile)
                if (currentScroll >= maxScrollLeft - 10) {
                    // Loop back to the beginning instantly
                    carousel.scrollTo({ left: 0, behavior: 'auto' });
                } else {
                    carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }
            }
        }
        
        // Start auto-scroll function
        function startAutoScroll() {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
            }
            if (!isPaused) {
                autoScrollInterval = setInterval(autoScroll, 1500); // Faster auto-scroll (1.5 seconds)
            }
        }

        // Start auto-scroll
        startAutoScroll();

        // Store interval reference for cleanup
        carousel.autoScrollInterval = autoScrollInterval;
        carousel.startAutoScroll = startAutoScroll; // Store for reuse
    });
}

// Setup infinite loop for carousels with improved mobile support
function setupInfiniteCarousels() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        // Don't add duplicate clones
        if (carousel.dataset.infiniteSetup === 'true') return;

        // Clone the first item and append it to the end for seamless loop
        const firstItem = carousel.firstElementChild;
        if (firstItem) {
            const clonedItem = firstItem.cloneNode(true);
            clonedItem.classList.add('cloned-item');
            carousel.appendChild(clonedItem);
        }

        // Mark as setup
        carousel.dataset.infiniteSetup = 'true';

        // Improved scroll event handler with better mobile support
        let scrollTimeout;
        carousel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
                const currentScroll = carousel.scrollLeft;

                // Use a tolerance for mobile devices (they might not scroll to exact positions)
                if (currentScroll >= maxScrollLeft - 20) {
                    // When reaching near the end, instantly jump to the beginning
                    requestAnimationFrame(() => {
                        carousel.scrollTo({ left: 0, behavior: 'auto' });
                    });
                }
            }, 100); // Reduced timeout for more responsive handling
        });
    });
}

// Enhanced touch/swipe support for mobile carousels
function addTouchSupport() {
    const carousels = document.querySelectorAll('.carousel-container');

    carousels.forEach(carousel => {
        let startX = 0;
        let startY = 0;
        let scrollLeft = 0;
        let isDragging = false;
        let isHorizontalSwipe = false;

        // Disable auto-scroll when user is interacting
        function pauseAutoScroll() {
            if (carousel.autoScrollInterval) {
                clearInterval(carousel.autoScrollInterval);
            }
        }

        // Resume auto-scroll after user interaction
        function resumeAutoScroll() {
            // Wait a bit before resuming auto-scroll
            setTimeout(() => {
                if (carousel.autoScrollInterval) {
                    clearInterval(carousel.autoScrollInterval);
                }

                carousel.autoScrollInterval = setInterval(() => {
                    const itemWidth = 350;
                    const totalItems = carousel.children.length - 1;
                    const maxScrollLeft = (totalItems - 1) * itemWidth;
                    const currentScroll = carousel.scrollLeft;

                    if (currentScroll >= maxScrollLeft - 10) {
                        carousel.scrollTo({ left: 0, behavior: 'auto' });
                    } else {
                        carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
                    }
                }, 1000);
            }, 2000);
        }

        carousel.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.pageX - carousel.offsetLeft;
            startY = touch.pageY - carousel.offsetTop;
            scrollLeft = carousel.scrollLeft;
            isDragging = true;
            isHorizontalSwipe = false;
            pauseAutoScroll();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const touch = e.touches[0];
            const x = touch.pageX - carousel.offsetLeft;
            const y = touch.pageY - carousel.offsetTop;

            const deltaX = Math.abs(x - startX);
            const deltaY = Math.abs(y - startY);

            // Determine if this is a horizontal swipe
            if (deltaX > deltaY && deltaX > 10) {
                isHorizontalSwipe = true;
                e.preventDefault(); // Prevent vertical scrolling

                const walk = (x - startX) * 1.5; // Adjust sensitivity
                carousel.scrollLeft = scrollLeft - walk;
            }
        }, { passive: false });

        carousel.addEventListener('touchend', (e) => {
            if (isDragging && isHorizontalSwipe) {
                const touch = e.changedTouches[0];
                const endX = touch.pageX - carousel.offsetLeft;
                const deltaX = endX - startX;

                // Snap to nearest item if swipe was significant
                if (Math.abs(deltaX) > 50) {
                    const itemWidth = 350;
                    const currentItem = Math.round(carousel.scrollLeft / itemWidth);
                    const targetItem = deltaX > 0 ? Math.max(0, currentItem - 1) : currentItem + 1;

                    carousel.scrollTo({
                        left: targetItem * itemWidth,
                        behavior: 'smooth'
                    });
                }

                resumeAutoScroll();
            }

            isDragging = false;
            isHorizontalSwipe = false;
            startX = 0;
            startY = 0;
        });

        // Handle carousel boundary for touch interactions
        carousel.addEventListener('touchend', () => {
            setTimeout(() => {
                const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
                const currentScroll = carousel.scrollLeft;

                if (currentScroll >= maxScrollLeft - 20) {
                    carousel.scrollTo({ left: 0, behavior: 'auto' });
                }
            }, 300);
        });
    });
}

// Initialize all carousel functionality
function initializeCarousels() {
    setupInfiniteCarousels();
    autoScrollCarousels();
    addTouchSupport();
}

// Clean up intervals when page unloads
window.addEventListener('beforeunload', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(carousel => {
        if (carousel.autoScrollInterval) {
            clearInterval(carousel.autoScrollInterval);
        }
    });
});

console.log('Portfolio website loaded successfully! 🚀');