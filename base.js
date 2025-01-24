import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

class ThreeScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.controls = null;
        this.objects = [];
        
        this.init();
    }

    init() {
        // Renderer setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(this.renderer.domElement);

        // Camera positioning
        this.camera.position.set(0, 5, 10);

        // Orbit Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;

        // Lighting
        this.setupLighting();

        // Environment
        this.loadEnvironment();

        // Create scene objects
        this.createScene();

        // Event Listeners
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start animation
        this.animate();
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);
    }

    loadEnvironment() {
        new RGBELoader()
            .setDataType(THREE.UnsignedByteType)
            .load('environment.hdr', (texture) => {
                const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
                const envMap = pmremGenerator.fromEquirectangular(texture).texture;

                this.scene.background = envMap;
                this.scene.environment = envMap;

                texture.dispose();
                pmremGenerator.dispose();
            });
    }

    createScene() {
        // Geometric shapes with complex materials
        const geometries = [
            new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
            new THREE.SphereGeometry(1.5, 32, 32),
            new THREE.BoxGeometry(2, 2, 2)
        ];

        const materials = [
            new THREE.MeshStandardMaterial({ 
                color: 0x49ef4, 
                metalness: 0.7, 
                roughness: 0.3 
            }),
            new THREE.MeshPhysicalMaterial({
                color: 0xff6600,
                metalness: 0.5,
                roughness: 0.2,
                clearcoat: 1.0,
                clearcoatRoughness: 0.1
            }),
            new THREE.MeshPhongMaterial({
                color: 0x00ff00,
                specular: 0x111111,
                shininess: 100
            })
        ];

        geometries.forEach((geometry, index) => {
            const mesh = new THREE.Mesh(geometry, materials[index]);
            mesh.position.x = (index - 1) * 4;
            this.scene.add(mesh);
            this.objects.push(mesh);
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Rotate objects
        this.objects.forEach((obj, index) => {
            obj.rotation.x += 0.01 * (index + 1);
            obj.rotation.y += 0.01 * (index + 1);
        });

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize scene
const threeScene = new ThreeScene();