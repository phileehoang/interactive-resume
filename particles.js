import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

let scene, camera, renderer, particles;

// Mouse position tracking for particle interaction
let mouse = {
    x: undefined,
    y: undefined,
    radius: 200 // Increased interaction radius for better visibility
};

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Set up renderer
    const canvas = document.getElementById('skillsCanvas');
    if (!canvas) return; // Exit if canvas doesn't exist
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true
    });

    // Set the renderer size to match the skills section size
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const sectionRect = skillsSection.getBoundingClientRect();
        renderer.setSize(sectionRect.width, sectionRect.height);
    } else {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add mouse move event listener for particle interaction
    if (skillsSection) {
        // Use the skills section for mouse tracking
        skillsSection.addEventListener('mousemove', function(event) {
            // Get canvas position
            const rect = canvas.getBoundingClientRect();
            
            // Calculate mouse position relative to the canvas
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        });

        // Reset when mouse leaves
        skillsSection.addEventListener('mouseleave', function() {
            mouse.x = undefined;
            mouse.y = undefined;
        });
    }

    // Create particles
    createParticles();

    // Start animation
    animate();
}

function createParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const densities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Position
        positions[i] = (Math.random() - 0.5) * 15;      // x
        positions[i + 1] = (Math.random() - 0.5) * 15;  // y
        positions[i + 2] = (Math.random() - 0.5) * 15;  // z

        // Color (green to cyan gradient)
        colors[i] = 0;                                  // r
        colors[i + 1] = Math.random() * 0.5 + 0.5;     // g
        colors[i + 2] = Math.random() * 0.5;           // b
        
        // Density for varied movement response
        densities[i/3] = Math.random() * 15 + 5;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Store densities as user data for the geometry
    particleGeometry.userData = { densities: densities };

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        // Slow rotation for ambient movement
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0002;

        // Get particle positions and densities
        const positions = particles.geometry.attributes.position.array;
        const densities = particles.geometry.userData.densities;
        const time = Date.now() * 0.001;
        
        // Create a raycaster for mouse interaction
        const raycaster = new THREE.Raycaster();
        const mouseVector = new THREE.Vector2();
        
        // Update each particle position
        for (let i = 0; i < positions.length; i += 3) {
            // Apply wave animation
            positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.01;
            
            // Apply mouse interaction if mouse is defined
            if (mouse.x !== undefined && mouse.y !== undefined) {
                // Set mouse position for raycaster
                mouseVector.x = mouse.x;
                mouseVector.y = mouse.y;
                
                // Get particle position in world space
                const particlePos = new THREE.Vector3(
                    positions[i],
                    positions[i + 1],
                    positions[i + 2]
                );
                
                // Calculate distance between mouse and particle in normalized device coordinates
                const dx = mouse.x - (particlePos.x / 7.5);
                const dy = mouse.y - (particlePos.y / 7.5);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Apply repulsion if close enough (in normalized device coordinates)
                if (distance < 0.4) {
                    // Calculate repulsion force (stronger when closer)
                    const force = (0.4 - distance) / 0.4;
                    const particleIndex = i / 3;
                    const density = densities[particleIndex];
                    
                    // Apply repulsion (negative to push away)
                    positions[i] -= dx * force * 0.1 * (density / 10);
                    positions[i + 1] -= dy * force * 0.1 * (density / 10);
                }
            }
        }
        
        // Mark position attribute for update
        particles.geometry.attributes.position.needsUpdate = true;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer size to match the skills section
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const sectionRect = skillsSection.getBoundingClientRect();
            renderer.setSize(sectionRect.width, sectionRect.height);
        } else {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
});

// Clean up event listeners when page is unloaded
window.addEventListener('beforeunload', () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        skillsSection.removeEventListener('mousemove', () => {});
        skillsSection.removeEventListener('mouseleave', () => {});
    }
    window.removeEventListener('resize', () => {});
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    // Add a scroll event listener to update canvas position
    window.addEventListener('scroll', function() {
        const skillsSection = document.getElementById('skills');
        const canvas = document.getElementById('skillsCanvas');
        
        if (skillsSection && canvas) {
            const sectionRect = skillsSection.getBoundingClientRect();
            
            // Only render when the skills section is in view
            if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
                // Update canvas size if needed
                if (canvas.width !== sectionRect.width || canvas.height !== sectionRect.height) {
                    renderer.setSize(sectionRect.width, sectionRect.height);
                }
            }
        }
    });
});
