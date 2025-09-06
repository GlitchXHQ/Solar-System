import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let isPaused = false;
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const rotationInput = document.getElementById('rotationSpeed');

window.solarSystemPaused = false;

pauseBtn.addEventListener('click', () => {
  window.solarSystemPaused = true;
  isPaused = true;
  pauseBtn.style.display = 'none';
  playBtn.style.display = '';
});

playBtn.addEventListener('click', () => {
  window.solarSystemPaused = false;
  isPaused = false;
  playBtn.style.display = 'none';
  pauseBtn.style.display = '';
});

// Orbit distances
let mercury_orbit_radius = 70;
let venus_orbit_radius = 95;
let earth_orbit_radius = 110;
let mars_orbit_radius = 130;
let jupiter_orbit_radius = 145;
let saturn_orbit_radius = 160;
let uranus_orbit_radius = 180;
let neptune_orbit_radius = 200;

// Rotation speed control
let SpeedofRev = 0.01;
rotationInput.addEventListener('input', () => {
  const val = parseFloat(rotationInput.value);
  SpeedofRev = isNaN(val) ? 0.01: val;
});

// Revolution speeds
let mercury_revolution_speed = 2;
let venus_revolution_speed = 1.8;
let earth_revolution_speed = 1.5;
let mars_revolution_speed = 0.8;
let jupiter_revolution_speed = 0.7;
let saturn_revolution_speed = 0.6;
let uranus_revolution_speed = 0.5;
let neptune_revolution_speed = 0.4;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("space"), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight); 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  '../img/skybox/space_rt.png',
  '../img/skybox/space_lf.png',
  '../img/skybox/space_up.png',
  '../img/skybox/space_dn.png',
  '../img/skybox/space_ft.png',
  '../img/skybox/space_bk.png'
]);
scene.background = texture;

// Load planet with texture
function LoadPlanetTexture(texture, radius, width, height, meshType) { 
  const geometry = new THREE.SphereGeometry(radius, width, height);
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material = meshType === 'standard'
    ? new THREE.MeshStandardMaterial({ map: planetTexture })
    : new THREE.MeshBasicMaterial({ map: planetTexture });
  return new THREE.Mesh(geometry, material);
}

// Create orbit rings
function createRing(innerRadius) {
  const outerRadius = innerRadius - 0.1;
  const thetaSegments = 100;
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI / 2;
  scene.add(mesh);
}

// Load celestial bodies
const sun = LoadPlanetTexture("../img/sun_hd.jpg", 15, 32, 32, 'basic');
const mercury = LoadPlanetTexture("../img/mercury_hd.jpg", 8, 32, 32, 'standard');
const venus = LoadPlanetTexture("../img/venus_hd.jpg", 10, 32, 32, 'standard');
const earth = LoadPlanetTexture("../img/earth_hd.jpg", 10, 32, 32, 'standard');
const mars = LoadPlanetTexture("../img/mars_hd.jpg", 8, 32, 32, 'standard');
const jupiter = LoadPlanetTexture("../img/jupiter_hd.jpg", 13, 32, 32, 'standard');
const saturn = LoadPlanetTexture("../img/saturn_hd.jpg", 8, 32, 32, 'standard');
const uranus = LoadPlanetTexture("../img/uranus_hd.jpg", 8, 32, 32, 'standard');
const neptune = LoadPlanetTexture("../img/neptune_hd.jpg", 8, 32, 32, 'standard');

scene.add(sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune);

// Add rings for each planet orbit
createRing(mercury_orbit_radius);
createRing(venus_orbit_radius);
createRing(earth_orbit_radius);
createRing(mars_orbit_radius);
createRing(jupiter_orbit_radius);
createRing(saturn_orbit_radius);
createRing(uranus_orbit_radius);
createRing(neptune_orbit_radius);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 100;
controls.maxDistance = 1000;
camera.position.set(0,100,400)
controls.update();

// Revolution logic
function Revolution(time, speed, planet, orbitRadius) {
  let orbitSpeed = 0.001;
  const angle = time * speed * orbitSpeed;
  planet.position.x = sun.position.x + orbitRadius * Math.cos(angle);
  planet.position.z = sun.position.z + orbitRadius * Math.sin(angle);
}

// Animation loop
function animate(time) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  let speed=0.01

  if (!window.solarSystemPaused) {
    sun.rotation.y += speed;
    mercury.rotation.y += speed;
    venus.rotation.y += speed;
    earth.rotation.y += speed;
    mars.rotation.y += speed;
    jupiter.rotation.y += speed;
    saturn.rotation.y += speed;
    uranus.rotation.y += speed;
    neptune.rotation.y += speed;

    Revolution(time, mercury_revolution_speed+SpeedofRev, mercury, mercury_orbit_radius);
    Revolution(time, venus_revolution_speed+SpeedofRev, venus, venus_orbit_radius);
    Revolution(time, earth_revolution_speed+SpeedofRev, earth, earth_orbit_radius);
    Revolution(time, mars_revolution_speed+SpeedofRev, mars, mars_orbit_radius);
    Revolution(time, jupiter_revolution_speed+SpeedofRev, jupiter, jupiter_orbit_radius);
    Revolution(time, saturn_revolution_speed+SpeedofRev, saturn, saturn_orbit_radius);
    Revolution(time, uranus_revolution_speed+SpeedofRev, uranus, uranus_orbit_radius);
    Revolution(time, neptune_revolution_speed+SpeedofRev, neptune, neptune_orbit_radius);
  }

  controls.update();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

