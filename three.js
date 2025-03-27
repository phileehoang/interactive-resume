import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

let scene, camera, renderer, shapeMesh, particles, gridScene, gridCamera, gridRenderer, gridHelper;
let animationFrameId; // For cleanup
let morphProgress = 0; // Progress of morphing (0 to 1)
let morphStartTime = null; // When to start first morphing (cube to sphere)
let nextMorphTime = null; // When to perform the next shape change
let isMorphingActive = false; // Flag to track if morphing is in progress
let currentMorphStage = 0; // Current stage of morphing
let firstCycleCompleted = false; // Flag to track if first cycle is completed
let currentShape = 'cube'; // Current shape being displayed
let shapeSequence = ['cube', 'sphere', 'octahedron']; // Sequence of shapes to cycle through
let currentShapeIndex = 0; // Current index in the shape sequence

// Mouse position tracking for cube interaction
let mouse = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
};

// Cursor position for cube-cursor interaction
let cursorPosition = {
    x: 0,
    y: 0
};

// Default cube rotation
let defaultRotation = {
    x: 0.005,
    y: 0.005
};

// Interaction settings
const interactionSettings = {
    maxDistance: 200, // Max distance for interaction in pixels
    maxRotationInfluence: 0.1, // Maximum rotation influence - increased for more noticeable effect
    easing: 0.05, // Easing factor for smooth transitions
    active: false, // Flag to track if interaction is active
    cursorInfluence: 0.15 // Influence of cursor on cube movement
};

// Define the refined gradient color palette
const brandColors = {
    blue: new THREE.Color("#0077FF"),
    teal: new THREE.Color("#00AA88"),
    green: new THREE.Color("#00CC66")
};

function init() {
    // Initialize main scene for cube
    initMainScene();
    
    // Initialize grid scene for experience section
    initGridScene();

    // Create floating particles with reduced count
    createParticles();

    // Add mouse move listener for cube interaction
    initMouseInteraction();

    // Start animation
    animate();
    
    // Schedule the first morphing to start after 4 seconds
    morphStartTime = Date.now() + 4000;
    
    // Add event listener for cleanup
    window.addEventListener('beforeunload', cleanup);
}

function initMouseInteraction() {
    document.addEventListener('mousemove', (event) => {
        // Calculate mouse position relative to the center of the screen
        mouse.targetX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouse.targetY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        
        // Store cursor position for cube-cursor interaction
        cursorPosition.x = event.clientX;
        cursorPosition.y = event.clientY;
        
        // Check if mouse is within interaction distance
        const distance = Math.sqrt(mouse.targetX * mouse.targetX + mouse.targetY * mouse.targetY);
        
        // Set interaction active flag based on distance
        interactionSettings.active = distance < interactionSettings.maxDistance;
    });
    
    // Track custom cursor for cube interaction
    document.addEventListener('mousemove', updateCursorInteraction);
}

function updateCursorInteraction() {
    // Get hero section and canvas
    const heroSection = document.getElementById('hero');
    const heroCanvas = document.getElementById('heroCanvas');
    
    if (!heroSection || !heroCanvas || !shapeMesh) return;
    
    // Get cursor element
    const cursorDot = document.querySelector('.cursor-dot');
    if (!cursorDot) return;
    
    // Get cursor and canvas positions
    const cursorRect = cursorDot.getBoundingClientRect();
    const canvasRect = heroCanvas.getBoundingClientRect();
    
    // Calculate distance between cursor and canvas center
    const canvasCenterX = canvasRect.left + canvasRect.width / 2;
    const canvasCenterY = canvasRect.top + canvasRect.height / 2;
    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const cursorCenterY = cursorRect.top + cursorRect.height / 2;
    
    const distanceX = cursorCenterX - canvasCenterX;
    const distanceY = cursorCenterY - canvasCenterY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    
    // Only apply effect if cursor is within the hero section
    if (isElementInViewport(heroSection) && 
        cursorCenterX >= canvasRect.left && 
        cursorCenterX <= canvasRect.right && 
        cursorCenterY >= canvasRect.top && 
        cursorCenterY <= canvasRect.bottom) {
        
        // Normalize distances for rotation influence
        const normalizedX = distanceX / (canvasRect.width / 2);
        const normalizedY = distanceY / (canvasRect.height / 2);
        
        // Apply direct influence to cube position (subtle movement)
        shapeMesh.position.x = normalizedX * interactionSettings.cursorInfluence;
        shapeMesh.position.y = -normalizedY * interactionSettings.cursorInfluence;
        
        // Increase rotation speed based on cursor proximity
        const proximityFactor = 1 - Math.min(distance / (canvasRect.width / 2), 1);
        defaultRotation.x = 0.005 + (proximityFactor * 0.01);
        defaultRotation.y = 0.005 + (proximityFactor * 0.01);
    } else {
        // Reset position and rotation when cursor is outside
        shapeMesh.position.x = 0;
        shapeMesh.position.y = 0;
        defaultRotation.x = 0.005;
        defaultRotation.y = 0.005;
    }
}

function initMainScene() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer with optimized settings
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#heroCanvas'),
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'mediump' // Use medium precision for better performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

    // Create material with wireframe for better visibility
    const material = new THREE.MeshBasicMaterial({
        color: brandColors.teal,
        wireframe: true,
        wireframeLinewidth: 2 // Increase line thickness (note: may not work in all browsers)
    });
    
    // Start with a cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    shapeMesh = new THREE.Mesh(cubeGeometry, material);
    scene.add(shapeMesh);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
}

function initGridScene() {
    // Scene setup for grid
    gridScene = new THREE.Scene();
    gridCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    gridCamera.position.z = 5;

    // Create renderer with optimized settings
    gridRenderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#gridCanvas'),
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        precision: 'mediump' // Use medium precision for better performance
    });
    gridRenderer.setSize(window.innerWidth, window.innerHeight);
    gridRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

    // Create grid background
    createGridBackground();
}

function createGridBackground() {
    // Create grid with fewer lines for better performance and branded colors
    gridHelper = new THREE.GridHelper(20, 15, brandColors.blue, brandColors.green);
    gridHelper.position.y = -5;
    gridHelper.position.z = -5;
    gridScene.add(gridHelper);

    // Add subtle ambient light for better visibility with less performance impact
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    gridScene.add(ambientLight);
}

function createParticles() {
    // Create particles with reduced count for better performance
    const particleCount = 100; // Reduced from 200
    const particleGeometry = new THREE.BufferGeometry();
    
    // Use brand color for particles
    const particlesMaterial = new THREE.PointsMaterial({
        color: brandColors.blue,
        size: 0.05,
        transparent: true,
        opacity: 0.8
    });

    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 10;
        particlePositions[i + 1] = (Math.random() - 0.5) * 10;
        particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particles = new THREE.Points(particleGeometry, particlesMaterial);
    scene.add(particles);
}

// Function to smoothly transition between shapes
function transitionToShape(newShape) {
    // Store current rotation
    const currentRotation = {
        x: shapeMesh.rotation.x,
        y: shapeMesh.rotation.y,
        z: shapeMesh.rotation.z
    };
    
    // Remove current mesh
    scene.remove(shapeMesh);
    
    // Create new geometry based on shape
    let newGeometry;
    
    if (newShape === 'sphere') {
        newGeometry = new THREE.SphereGeometry(1.5, 36, 36);
    } else if (newShape === 'octahedron') {
        newGeometry = new THREE.OctahedronGeometry(1.5, 0);
    } else {
        // Default to cube
        newGeometry = new THREE.BoxGeometry(2, 2, 2);
    }
    
    // Create new mesh with same material
    const material = new THREE.MeshBasicMaterial({
        color: brandColors.teal,
        wireframe: true,
        wireframeLinewidth: 2
    });
    
    shapeMesh = new THREE.Mesh(newGeometry, material);
    
    // Apply stored rotation
    shapeMesh.rotation.x = currentRotation.x;
    shapeMesh.rotation.y = currentRotation.y;
    shapeMesh.rotation.z = currentRotation.z;
    
    // Add to scene
    scene.add(shapeMesh);
    
    // Update current shape
    currentShape = newShape;
}

// Function to advance to the next shape in the sequence
function advanceToNextShape() {
    // Update shape index
    currentShapeIndex = (currentShapeIndex + 1) % shapeSequence.length;
    
    // Get next shape
    const nextShape = shapeSequence[currentShapeIndex];
    
    // Transition to next shape
    transitionToShape(nextShape);
    
    // Schedule next morphing
    const currentTime = Date.now();
    const morphInterval = firstCycleCompleted ? 5000 : 4000; // 5 seconds after first cycle, 4 seconds for first transition
    nextMorphTime = currentTime + morphInterval;
    
    // Mark first cycle as completed if we've gone through all shapes
    if (currentShapeIndex === 0 && !firstCycleCompleted) {
        firstCycleCompleted = true;
    }
}

function animate() {
    // Use requestAnimationFrame with ID for cleanup
    animationFrameId = requestAnimationFrame(animate);

    // Only animate if elements exist in DOM
    const heroCanvas = document.querySelector('#heroCanvas');
    const gridCanvas = document.querySelector('#gridCanvas');
    
    if (!heroCanvas && !gridCanvas) {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    const currentTime = Date.now();
    
    // Check if it's time to start first morphing
    if (morphStartTime && currentTime >= morphStartTime && !nextMorphTime) {
        // Set up first transition
        nextMorphTime = currentTime;
    }
    
    // Check if it's time for the next shape transition
    if (nextMorphTime && currentTime >= nextMorphTime) {
        advanceToNextShape();
    }
    
    // Update cursor interaction with the cube
    updateCursorInteraction();
    
    // Apply smooth rotation with mouse interaction
    if (shapeMesh) {
        // Base rotation speed
        const baseRotationX = defaultRotation.x;
        const baseRotationY = defaultRotation.y;
        
        // Apply mouse influence with easing
        mouse.x += (mouse.targetX - mouse.x) * interactionSettings.easing;
        mouse.y += (mouse.targetY - mouse.y) * interactionSettings.easing;
        
        if (interactionSettings.active) {
            // Apply mouse-influenced rotation when active
            shapeMesh.rotation.x += baseRotationX + mouse.y * 0.05;
            shapeMesh.rotation.y += baseRotationY + mouse.x * 0.05;
        } else {
            // Apply default rotation when not active
            shapeMesh.rotation.x += baseRotationX;
            shapeMesh.rotation.y += baseRotationY;
        }
    }

    // Optimize particle animation - slower movement
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.0005;
    }

    // Optimize grid animation - slower rotation
    if (gridHelper) {
        gridHelper.rotation.x += 0.0005;
        gridHelper.rotation.y += 0.001;
    }

    // Render scenes only if canvases are visible in viewport
    if (heroCanvas && isElementInViewport(heroCanvas) && renderer) {
        renderer.render(scene, camera);
    }
    
    if (gridCanvas && isElementInViewport(gridCanvas) && gridRenderer) {
        gridRenderer.render(gridScene, gridCamera);
    }
}

// Check if element is in viewport for performance optimization
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Update main scene
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        
        // Update grid scene
        if (gridCamera && gridRenderer) {
            gridCamera.aspect = window.innerWidth / window.innerHeight;
            gridCamera.updateProjectionMatrix();
            gridRenderer.setSize(window.innerWidth, window.innerHeight);
            gridRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    }, 100);
});

// Cleanup function to prevent memory leaks
function cleanup() {
    cancelAnimationFrame(animationFrameId);
    
    // Dispose of geometries and materials
    if (shapeMesh) {
        shapeMesh.geometry.dispose();
        shapeMesh.material.dispose();
    }
    
    if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
    }
    
    if (gridHelper) {
        gridHelper.geometry.dispose();
        gridHelper.material.dispose();
    }
    
    // Remove event listeners
    window.removeEventListener('resize', () => {});
    window.removeEventListener('beforeunload', cleanup);
    
    // Remove mouse interaction listeners
    document.removeEventListener('mousemove', () => {});
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', init);
