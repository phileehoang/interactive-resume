// Main JavaScript file for the resume website

document.addEventListener("DOMContentLoaded", function () {
    // Email obfuscation
    const user = "philiphoang8";
    const domain = "gmail.com";
    const emailElement = document.getElementById("email-link");

    if (emailElement) {
        const emailLink = document.createElement("a");
        emailLink.href = `mailto:${user}@${domain}`;
        emailLink.innerText = `${user}@${domain}`;
        emailElement.appendChild(emailLink);
    }
    
    // Initialize Custom Cursor
    initCustomCursor();
    
    // Initialize Hero Background Particles
    initHeroBackgroundParticles();
    
    // Initialize WOW Factor Animation
    initWowFactorAnimation();
    
    // Initialize Section Loading Animations with staggered timing
    initSectionAnimations();
    
    // Initialize Parallax Effects
    initParallaxEffects();
    
    // Ensure scroll indicator is visible
    initScrollIndicator();
});

// Initialize the typewriter effect for the hero section
function initTypewriterEffect() {
    const heroText = document.getElementById('hero-text');
    const subtext = document.getElementById('subtext');
    
    if (!heroText || !subtext) return;
    
    // Force clear session storage to ensure animation runs
    sessionStorage.removeItem('typewriterAnimationShown');
    
    // Store the original text
    const originalText = "Hey, I'm Philip Hoang";
    
    // Create a wrapper for the text content
    const textWrapper = document.createElement('span');
    textWrapper.className = 'typewriter-text';
    
    // Create a cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    cursor.style.position = 'absolute';
    cursor.style.display = 'inline-block';
    cursor.style.marginLeft = '2px';
    
    // Ensure subtitle is completely hidden initially
    subtext.style.opacity = '0';
    subtext.style.transform = 'translateY(10px)';
    subtext.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    subtext.style.display = 'block'; // Make sure it's in the flow
    
    // Clear the hero text and add our elements
    heroText.textContent = '';
    heroText.appendChild(textWrapper);
    heroText.appendChild(cursor);
    
    // Make sure the element is visible
    heroText.style.opacity = '1';
    heroText.style.transform = 'translateY(0)';
    heroText.style.animation = 'none';
    
    let charIndex = 0;
    const typingSpeed = 45; // milliseconds per character
    
    // Type out the text character by character
    function typeNextChar() {
        if (charIndex < originalText.length) {
            textWrapper.textContent += originalText.charAt(charIndex);
            charIndex++;
            
            // If this is the last character, show the subtitle
            if (charIndex === originalText.length) {
                // Show subtitle immediately as the last character is typed
                subtext.style.opacity = '1';
                subtext.style.transform = 'translateY(0)';
                
                // Remove cursor after a short delay
                setTimeout(() => {
                    cursor.style.opacity = '0';
                    // Mark as shown once completed
                    sessionStorage.setItem('typewriterAnimationShown', 'true');
                }, 500);
            } else {
                // Continue typing
                setTimeout(typeNextChar, typingSpeed);
            }
        }
    }
    
    // Start typing after a brief delay to ensure everything is loaded
    setTimeout(typeNextChar, 300);
}

// Initialize the typewriter effect when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Immediately hide the subtitle to prevent flashing
    const subtext = document.getElementById('subtext');
    if (subtext) {
        subtext.style.opacity = '0';
        subtext.style.transform = 'translateY(10px)';
        subtext.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
    
    // Initialize typewriter with a slight delay to ensure DOM is ready
    setTimeout(initTypewriterEffect, 100);
    
    // Other initialization code
    initScrollIndicator();
    initSkillsAnimation();
});

// Custom Cursor Implementation
function initCustomCursor() {
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    document.body.appendChild(cursorDot);
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
    
    // Enhanced cursor feedback for different element types
    
    // Interactive elements (links, buttons, cards)
    const interactiveElements = document.querySelectorAll('a, button, .timeline-event, .timeline-item, .skill-card, #tech-stack li, .cta-button');
    
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() {
            cursorDot.classList.add('expand');
            cursorDot.classList.add('hover-link');
        });
        
        el.addEventListener('mouseleave', function() {
            cursorDot.classList.remove('expand');
            cursorDot.classList.remove('hover-link');
        });
    });
    
    // Hero section cube interaction
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', function() {
            cursorDot.classList.add('hero-cursor');
        });
        
        heroSection.addEventListener('mouseleave', function() {
            cursorDot.classList.remove('hero-cursor');
        });
    }
    
    // Section hover effect
    const sections = document.querySelectorAll('section, header, footer');
    
    sections.forEach(function(section) {
        section.addEventListener('mouseenter', function() {
            cursorDot.classList.add('hover-section');
            
            // Special handling for contact section
            if (section.id === 'contact') {
                cursorDot.classList.add('contact-cursor');
            }
        });
        
        section.addEventListener('mouseleave', function() {
            cursorDot.classList.remove('hover-section');
            
            // Remove contact section special cursor
            if (section.id === 'contact') {
                cursorDot.classList.remove('contact-cursor');
            }
        });
    });
}

// Parallax Scrolling Effects
function initParallaxEffects() {
    // Hero section parallax
    const heroCanvas = document.getElementById('heroBackgroundCanvas');
    const gridCanvas = document.getElementById('gridCanvas');
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const parallaxSpeed = 0.4; // Lower value = slower movement
        
        if (heroCanvas) {
            const translateY = scrollPosition * parallaxSpeed;
            heroCanvas.style.transform = `translateY(${translateY}px)`;
        }
        
        if (gridCanvas) {
            const translateY = scrollPosition * 0.2;
            gridCanvas.style.transform = `translateY(${translateY}px)`;
        }
    });
}

// Section Loading Animations
function initSectionAnimations() {
    // Add fade-in-section class to all major sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id !== 'hero') { // Don't add to hero section
            section.classList.add('fade-in-section');
        }
    });
    
    // Add fade-in-section class to timeline events with staggered delay
    const timelineEvents = document.querySelectorAll('.timeline-event');
    timelineEvents.forEach((event, index) => {
        event.classList.add('fade-in-section');
        // Add data attribute for staggered animations
        event.setAttribute('data-delay', (index * 0.2).toString());
    });
    
    // Add fade-in-section class to skill cards with staggered delay
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('fade-in-section');
        // Add data attribute for staggered animations
        card.setAttribute('data-delay', (index * 0.15).toString());
    });
    
    // Function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll and reveal elements
    function handleScroll() {
        const elements = document.querySelectorAll('.fade-in-section:not(.is-visible)');
        elements.forEach(element => {
            if (isElementInViewport(element)) {
                // Apply staggered delay if data-delay attribute exists
                const delay = element.getAttribute('data-delay');
                if (delay) {
                    setTimeout(() => {
                        element.classList.add('is-visible');
                    }, delay * 1000);
                } else {
                    element.classList.add('is-visible');
                }
            }
        });
    }
    
    // Initial check for elements in viewport
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Make sure hero section is visible immediately
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.classList.add('is-visible');
    }
}

// Background Particle Effect - Ensure All Particles Are Circles
function initHeroBackgroundParticles() {
    const heroCanvas = document.getElementById("heroBackgroundCanvas");
    if (!heroCanvas) return;
    
    const heroCtx = heroCanvas.getContext("2d");
    const heroSection = document.getElementById("hero");

    function resizeHeroCanvas() {
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = heroSection ? heroSection.offsetHeight : window.innerHeight;
    }
    
    resizeHeroCanvas();

    const heroParticlesArray = [];
    const maxHeroParticles = 50; // Limit particles for performance

    // Define consistent blue color for particles
    const heroParticleColor = "#0077FF"; // Bright Blue for a clean, professional look

    // Track mouse position
    let mouse = {
        x: undefined,
        y: undefined,
        radius: 120 // Interaction radius
    };

    // Add mouse move event listener
    heroSection.addEventListener('mousemove', function(event) {
        const rect = heroCanvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // Reset mouse position when mouse leaves canvas
    heroSection.addEventListener('mouseleave', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Ensure only circle particles are created
    class HeroParticle {
        constructor(x, y, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.baseSize = size; // Store original size
            this.speedX = speedX;
            this.speedY = speedY;
            this.color = heroParticleColor; // Uniform blue color
            this.alpha = Math.random() * 0.5 + 0.2; // Subtle transparency
            this.baseX = x; // Store original X position
            this.baseY = y; // Store original Y position
            this.density = (Math.random() * 10) + 5; // Random density for varied movement
        }

        update() {
            // Normal movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off walls
            if (this.x < 0 || this.x > heroCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > heroCanvas.height) this.speedY *= -1;

            // Mouse interaction
            if (mouse.x !== undefined && mouse.y !== undefined) {
                // Calculate distance between particle and mouse
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If mouse is close enough, create subtle repulsion
                if (distance < mouse.radius) {
                    // Calculate repulsion force (stronger when closer)
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    
                    // Apply subtle repulsion (negative to push away)
                    const directionX = forceDirectionX * force * this.density * -0.5;
                    const directionY = forceDirectionY * force * this.density * -0.5;
                    
                    this.x += directionX;
                    this.y += directionY;
                }
            }
        }

        draw() {
            heroCtx.globalAlpha = this.alpha;
            heroCtx.fillStyle = this.color;
            heroCtx.beginPath();
            heroCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // **Ensures only circles**
            heroCtx.closePath();
            heroCtx.fill();
            heroCtx.globalAlpha = 1;
        }
    }

    // Initialize Particles
    function createHeroParticles() {
        heroParticlesArray.length = 0; // Clear existing particles
        
        for (let i = 0; i < maxHeroParticles; i++) {
            let size = Math.random() * 5 + 2;
            let x = Math.random() * heroCanvas.width;
            let y = Math.random() * heroCanvas.height;
            let speedX = (Math.random() - 0.5) * 0.5;
            let speedY = (Math.random() - 0.5) * 0.5;

            heroParticlesArray.push(new HeroParticle(x, y, size, speedX, speedY));
        }
    }

    // Animate Particles
    function animateHeroParticles() {
        if (!heroCanvas.isConnected) return; // Stop animation if canvas is removed
        
        requestAnimationFrame(animateHeroParticles);
        heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

        for (let i = 0; i < heroParticlesArray.length; i++) {
            heroParticlesArray[i].update();
            heroParticlesArray[i].draw();
        }
    }

    // Resize Canvas on Window Resize - with debouncing
    let resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeHeroCanvas, 100);
    });

    // Initialize and start animation
    createHeroParticles();
    animateHeroParticles();
    
    // Clean up function to prevent memory leaks
    function cleanup() {
        window.removeEventListener("resize", function(){});
        heroSection.removeEventListener('mousemove', function(){});
        heroSection.removeEventListener('mouseleave', function(){});
    }
    
    // Call cleanup if page is unloaded
    window.addEventListener("beforeunload", cleanup);
}

// WOW Factor Animation - Adjusted for a Professional Blue-to-Green Gradient
function initWowFactorAnimation() {
    const canvas = document.getElementById("wowEffectCanvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const contactSection = document.getElementById("contact");
    
    // Set canvas dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = contactSection ? contactSection.offsetHeight : window.innerHeight;
    }
    
    resizeCanvas();

    const particlesArray = [];
    const maxParticles = 100; // Limit max particles for performance

    // Define the refined gradient color palette
    const brandColors = ["#0077FF", "#00AA88", "#00CC66"]; // Smooth blue-to-green transition

    // Particle Class - optimized
    class Particle {
        constructor(x, y, size, speedX, speedY, color) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
            this.color = color;
            this.alpha = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.1;
            this.alpha -= 0.01;
        }

        draw() {
            ctx.globalAlpha = this.alpha > 0 ? this.alpha : 0;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // Create Particles on Mouse Move - with throttling for performance
    let lastMove = 0;
    const moveThrottle = 20; // ms between particle creation
    
    if (contactSection) {
        contactSection.addEventListener("mousemove", function (event) {
            const now = Date.now();
            if (now - lastMove < moveThrottle) return;
            lastMove = now;
            
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            // Limit particle creation based on current count
            if (particlesArray.length < maxParticles) {
                for (let i = 0; i < 3; i++) { // Reduced from 5 to 3 particles per move
                    particlesArray.push(
                        new Particle(
                            x,
                            y,
                            Math.random() * 4 + 2, // Slightly smaller particles
                            (Math.random() - 0.5) * 1.5,
                            (Math.random() - 0.5) * 1.5,
                            brandColors[Math.floor(Math.random() * brandColors.length)] // Uses the blue-to-green gradient colors
                        )
                    );
                }
            }
        });
    }

    // Animate Particles - optimized with request animation frame
    function animateParticles() {
        if (!canvas.isConnected) return; // Stop animation if canvas is removed
        
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
            
            // Remove particles that are too small or transparent
            if (particlesArray[i].size <= 0.2 || particlesArray[i].alpha <= 0) {
                particlesArray.splice(i, 1);
                i--;
            }
        }
    }

    animateParticles();

    // Resize Canvas on Window Resize - with debouncing
    let resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resizeCanvas, 100);
    });
    
    // Add initial particles - fewer for better performance
    function addInitialParticles() {
        const particleCount = Math.min(30, maxParticles); // Reduced from 50 to 30
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(
                new Particle(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 3 + 1,
                    (Math.random() - 0.5) * 1,
                    (Math.random() - 0.5) * 1,
                    brandColors[Math.floor(Math.random() * brandColors.length)] // Uses the blue-to-green gradient colors
                )
            );
        }
    }
    
    addInitialParticles();
    
    // Add automatic particle generation with longer interval
    let particleInterval;
    function startParticleInterval() {
        clearInterval(particleInterval); // Clear any existing interval
        particleInterval = setInterval(function() {
            if (particlesArray.length < maxParticles) {
                particlesArray.push(
                    new Particle(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        Math.random() * 3 + 1,
                        (Math.random() - 0.5) * 0.8, // Slower movement
                        (Math.random() - 0.5) * 0.8,
                        brandColors[Math.floor(Math.random() * brandColors.length)] // Uses the blue-to-green gradient colors
                    )
                );
            }
        }, 300); // Increased from 200ms to 300ms
    }
    
    startParticleInterval();
    
    // Clean up function to prevent memory leaks
    function cleanup() {
        clearInterval(particleInterval);
        if (contactSection) {
            contactSection.removeEventListener("mousemove", function(){});
        }
        window.removeEventListener("resize", function(){});
    }
    
    // Call cleanup if page is unloaded
    window.addEventListener("beforeunload", cleanup);
}

// Ensure scroll indicator is visible
function initScrollIndicator() {
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        // Force the scroll indicator to be visible after a delay
        setTimeout(() => {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }, 1500);
        
        // Add click event to scroll down when clicked
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Get the hero section height to calculate fade threshold
        const heroSection = document.getElementById('hero');
        const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        
        // Add scroll event listener to handle fade effect
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            
            // Calculate opacity based on scroll position
            // Start fading immediately and complete by 30% of hero height for faster fade
            const fadeThreshold = heroHeight * 0.3;
            const opacity = Math.max(0, 1 - (scrollPosition / fadeThreshold));
            
            // Apply the calculated opacity
            scrollIndicator.style.opacity = opacity.toString();
            
            // Hide completely when opacity reaches 0 for better performance
            if (opacity <= 0) {
                scrollIndicator.style.visibility = 'hidden';
            } else {
                scrollIndicator.style.visibility = 'visible';
            }
        };
        
        // Add the scroll event listener
        window.addEventListener('scroll', handleScroll);
        
        // Initial check in case page is loaded at a scrolled position
        handleScroll();
        
        // Clean up event listener when needed
        document.addEventListener('beforeunload', () => {
            window.removeEventListener('scroll', handleScroll);
        });
    }
}

// Horizontal Timeline for Professional Experience
function initHorizontalTimeline() {
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineTrack = document.querySelector('.timeline-track');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineIndicator = document.querySelector('.timeline-indicator');
    
    if (!timelineContainer || !timelineTrack || timelineItems.length === 0) return;
    
    // Set initial state
    let currentIndex = 0;
    timelineItems[currentIndex].classList.add('active');
    
    // Show timeline indicator when in view
    const experienceSection = document.getElementById('experience');
    
    window.addEventListener('scroll', function() {
        const rect = experienceSection.getBoundingClientRect();
        const isInView = (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
        
        if (isInView) {
            timelineIndicator.classList.add('active');
            
            // Calculate which timeline item should be active based on scroll position
            const sectionProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const newIndex = Math.min(
                Math.floor(sectionProgress * timelineItems.length),
                timelineItems.length - 1
            );
            
            if (newIndex !== currentIndex && newIndex >= 0) {
                // Update active item
                timelineItems.forEach(item => item.classList.remove('active'));
                timelineItems[newIndex].classList.add('active');
                
                // Scroll timeline horizontally
                const translateX = -newIndex * 100;
                timelineTrack.style.transform = `translateX(${translateX}%)`;
                
                currentIndex = newIndex;
            }
        } else {
            timelineIndicator.classList.remove('active');
        }
    });
    
    // Handle click on timeline items
    timelineItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // Update active item
            timelineItems.forEach(item => item.classList.remove('active'));
            item.classList.add('active');
            
            // Scroll timeline horizontally
            const translateX = -index * 100;
            timelineTrack.style.transform = `translateX(${translateX}%)`;
            
            currentIndex = index;
        });
    });
}
