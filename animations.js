import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.min.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.min.js";

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM content to be loaded
document.addEventListener("DOMContentLoaded", function() {
    // Hero section animations - optimized
    gsap.from("#hero-text", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });
    
    gsap.from("#subtext", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: "power2.out"
    });
    
    // Scroll indicator animation - more efficient than CSS animation
    gsap.from(".scroll-indicator", {
        opacity: 0,
        y: -10,
        duration: 1.5,
        delay: 1,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true
    });

    // About section animations - optimized
    gsap.from("#about h2", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
            trigger: "#about h2",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
    
    // About section timeline items - individual animations with staggered delay
    const aboutItems = document.querySelectorAll('#about .timeline-item');
    
    aboutItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            delay: index * 0.2, // Staggered delay for each item
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none" // Only plays once when scrolled into view
            }
        });
    });
    
    // Skills section animations - optimized with batch processing
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        gsap.from(card, {
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: index * 0.1, // Staggered but faster
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Experience section animations - optimized
    gsap.from(".experience-container h2", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
            trigger: ".experience-container h2",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
    
    // Timeline items in Experience section - batch processing with fewer animations
    const experienceItems = document.querySelectorAll('#experience .timeline-event');
    
    experienceItems.forEach((item, index) => {
        gsap.from(item, {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            duration: 0.8,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Contact section animations - optimized
    gsap.from("#wowEffectCanvas", {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#contact",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
    
    gsap.from(".contact-container h2", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
            trigger: ".contact-container h2",
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
    
    // Batch process paragraphs for better performance
    const contactParagraphs = document.querySelectorAll(".contact-container p:not(#email-link):not(.contact-name):not(.contact-location)");
    
    contactParagraphs.forEach((paragraph, index) => {
        gsap.from(paragraph, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: index * 0.1, // Reduced delay for better performance
            scrollTrigger: {
                trigger: ".contact-container",
                start: "top 70%",
                toggleActions: "play none none none"
            }
        });
    });
    
    // Combined animations for contact details to reduce number of animations
    const contactDetails = [".contact-name", ".contact-location", "#email-link"];
    
    contactDetails.forEach((selector, index) => {
        gsap.from(selector, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: 0.8 + (index * 0.1),
            scrollTrigger: {
                trigger: selector,
                start: "top 90%",
                toggleActions: "play none none none"
            }
        });
    });
});
