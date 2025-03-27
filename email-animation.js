// Email Animation with Three.js and GSAP
document.addEventListener("DOMContentLoaded", function() {
    // Get the email element
    const emailElement = document.getElementById("email-link");
    if (!emailElement) return;
    
    // Add a container for the particles
    const particleContainer = document.createElement("div");
    particleContainer.id = "email-particle-container";
    particleContainer.style.position = "absolute";
    particleContainer.style.pointerEvents = "none"; // Make sure it doesn't interfere with clicking
    particleContainer.style.zIndex = "-1"; // Place behind the text
    emailElement.style.position = "relative"; // Ensure the container is positioned relative to the email
    emailElement.appendChild(particleContainer);
    
    // Create a Three.js scene for the email particles
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Aspect ratio will be updated
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
    });
    
    // Set up the renderer
    renderer.setSize(300, 100); // Initial size, will be updated
    renderer.setClearColor(0x000000, 0); // Transparent background
    particleContainer.appendChild(renderer.domElement);
    
    // Position the camera
    camera.position.z = 5;
    
    // Create particles
    const particleCount = 80; // Increased particle count
    const particles = new THREE.Group();
    
    // Create different geometries for particles
    const geometries = [
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.BoxGeometry(0.08, 0.08, 0.08),
        new THREE.TetrahedronGeometry(0.06)
    ];
    
    // Create different materials for particles
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x4a90e2 }), // Blue
        new THREE.MeshBasicMaterial({ color: 0x2979ff }), // Brighter blue
        new THREE.MeshBasicMaterial({ color: 0x0d47a1 })  // Darker blue
    ];
    
    // Create particles and add them to the scene
    for (let i = 0; i < particleCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const particle = new THREE.Mesh(geometry, material);
        
        // Set initial positions (hidden)
        particle.position.x = 0;
        particle.position.y = 0;
        particle.position.z = 0;
        particle.scale.set(0, 0, 0); // Start with zero scale
        
        // Add to the group
        particles.add(particle);
    }
    
    // Add particles to the scene
    scene.add(particles);
    
    // Animation state
    let isHovering = false;
    let hasClicked = false;
    let animationFrame = null;
    
    // GSAP Timeline for hover effect
    const hoverTimeline = gsap.timeline({ paused: true });
    
    // Set up hover animation
    particles.children.forEach((particle, index) => {
        // Random positions within a sphere
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 2;
        
        // Add to timeline with staggered start
        hoverTimeline.to(particle.position, {
            x: x,
            y: y,
            z: z,
            duration: 0.8,
            ease: "power2.out",
            delay: index * 0.005 // Staggered start for wave effect
        }, 0);
        
        hoverTimeline.to(particle.scale, {
            x: 1 + Math.random() * 0.5,
            y: 1 + Math.random() * 0.5,
            z: 1 + Math.random() * 0.5,
            duration: 0.8,
            ease: "power2.out"
        }, 0);
        
        // Add subtle rotation
        hoverTimeline.to(particle.rotation, {
            x: Math.random() * Math.PI * 2,
            y: Math.random() * Math.PI * 2,
            z: Math.random() * Math.PI * 2,
            duration: 1.2,
            ease: "power1.inOut"
        }, 0);
        
        // Add pulsing effect
        if (index % 3 === 0) {
            hoverTimeline.to(particle.scale, {
                x: 0.5 + Math.random() * 1.5,
                y: 0.5 + Math.random() * 1.5,
                z: 0.5 + Math.random() * 1.5,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            }, 0.8);
        }
    });
    
    // Add a glow effect to the email link on hover
    const emailLink = emailElement.querySelector('a');
    if (emailLink) {
        hoverTimeline.to(emailLink, {
            textShadow: "0 0 10px rgba(74, 144, 226, 0.8), 0 0 20px rgba(74, 144, 226, 0.5)",
            color: "#ffffff",
            duration: 0.5
        }, 0);
    }
    
    // Click animation function
    function playClickAnimation() {
        hasClicked = true;
        
        // Reset all particles
        particles.children.forEach((particle) => {
            gsap.killTweensOf(particle.position);
            gsap.killTweensOf(particle.scale);
            gsap.killTweensOf(particle.rotation);
        });
        
        // Create a shockwave effect
        const shockwave = document.createElement('div');
        shockwave.className = 'email-shockwave';
        emailElement.appendChild(shockwave);
        
        // Animate shockwave
        gsap.fromTo(shockwave, 
            { scale: 0, opacity: 0.8 },
            { 
                scale: 2, 
                opacity: 0, 
                duration: 1, 
                ease: "power2.out",
                onComplete: () => {
                    shockwave.remove();
                }
            }
        );
        
        // Animate each particle
        particles.children.forEach((particle, index) => {
            // Explosive outward motion
            const angle = Math.random() * Math.PI * 2;
            const radius = 2 + Math.random() * 3;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 4;
            
            // Burst outward with staggered timing
            gsap.to(particle.position, {
                x: x,
                y: y,
                z: z,
                duration: 0.8,
                delay: index * 0.002, // Slight stagger for better visual
                ease: "power3.out",
                onComplete: function() {
                    // Return to hover state
                    gsap.to(particle.position, {
                        x: x * 0.3,
                        y: y * 0.3,
                        z: z * 0.3,
                        duration: 1,
                        ease: "elastic.out(1, 0.5)",
                        delay: 0.1 + Math.random() * 0.2
                    });
                }
            });
            
            // Scale up then down with different timing for each particle
            gsap.to(particle.scale, {
                x: 2 + Math.random(),
                y: 2 + Math.random(),
                z: 2 + Math.random(),
                duration: 0.4,
                delay: index * 0.002,
                ease: "power2.out",
                onComplete: function() {
                    gsap.to(particle.scale, {
                        x: 0.5 + Math.random() * 0.5,
                        y: 0.5 + Math.random() * 0.5,
                        z: 0.5 + Math.random() * 0.5,
                        duration: 0.8,
                        ease: "power1.inOut"
                    });
                }
            });
            
            // Spin with varied speeds
            gsap.to(particle.rotation, {
                x: Math.random() * Math.PI * 4,
                y: Math.random() * Math.PI * 4,
                z: Math.random() * Math.PI * 4,
                duration: 1 + Math.random() * 0.5,
                ease: "power1.inOut"
            });
        });
        
        // Pulse the email text
        if (emailLink) {
            gsap.to(emailLink, {
                scale: 1.1,
                color: "#ffffff",
                textShadow: "0 0 15px rgba(74, 144, 226, 1), 0 0 30px rgba(74, 144, 226, 0.8)",
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        }
        
        // Reset click state after animation completes
        setTimeout(() => {
            hasClicked = false;
            if (isHovering) {
                hoverTimeline.play();
            } else {
                hoverTimeline.reverse();
            }
        }, 2000);
    }
    
    // Add event listeners to the email link
    if (emailLink) {
        // Hover events
        emailLink.addEventListener('mouseenter', () => {
            if (!hasClicked) {
                isHovering = true;
                hoverTimeline.play();
            }
        });
        
        emailLink.addEventListener('mouseleave', () => {
            if (!hasClicked) {
                isHovering = false;
                hoverTimeline.reverse();
            }
        });
        
        // Click event
        emailLink.addEventListener('click', (e) => {
            // Don't prevent default - still allow the mailto: to work
            playClickAnimation();
        });
    }
    
    // Animation loop
    function animate() {
        // Rotate the entire particle group slightly
        particles.rotation.x += 0.003;
        particles.rotation.y += 0.005;
        
        // Update renderer and continue animation loop
        renderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle window resize and initial sizing
    function updateSize() {
        const rect = emailElement.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        
        // Position the particle container
        particleContainer.style.width = `${rect.width}px`;
        particleContainer.style.height = `${rect.height}px`;
    }
    
    // Initial size update
    updateSize();
    
    // Update on window resize
    window.addEventListener('resize', updateSize);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });
});
