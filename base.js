// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbit Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create some 3D objects
const geometry = new THREE.TorusKnotGeometry(1, 0.4, 100, 16);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x49ef4, 
    metalness: 0.7, 
    roughness: 0.3 
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the object
    torusKnot.rotation.x += 0.01;
    torusKnot.rotation.y += 0.01;
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();