import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  let isPaused = false;
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');

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

let mercury_orbit_radius = 70
let venus_orbit_radius = 95
let earth_orbit_radius = 110
let mars_orbit_radius = 130
let jupiter_orbit_radius = 145
let saturn_orbit_radius = 160
let uranus_orbit_radius = 180
let neptune_orbit_radius = 200

let mercury_revolution_speed = 2
let venus_revolution_speed = 1.8
let earth_revolution_speed = 1.5
let mars_revolution_speed = 0.8
let jupiter_revolution_speed = 0.7
let saturn_revolution_speed = 0.6
let uranus_revolution_speed = 0.5
let neptune_revolution_speed = 0.4


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({ antialias: false});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


function LoadPlanetTextue(texture, radius, width, height, meshType) {
  const geometry = new THREE.SphereGeometry(radius, width, height);
  const loader = new THREE.TextureLoader();
  const planetTexture = loader.load(texture);
  const material = meshType == 'standard' ? new THREE.MeshStandardMaterial({ map: planetTexture }) : new THREE.MeshBasicMaterial({ map: planetTexture });
  const planet = new THREE.Mesh(geometry, material);
  return planet
}

function createRing(innerRadius) {
  let outerRadius = innerRadius - 0.1
  let thetaSegments = 100
  const geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);
  const material = new THREE.MeshBasicMaterial({ color: '#ffffff', side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh)
  mesh.rotation.x = Math.PI / 2
  return mesh;
}
const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);


const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  '../img/skybox/space_rt.png',
  '../img/skybox/space_lf.png',
  '../img/skybox/space_up.png',
  '../img/skybox/space_dn.png',
  '../img/skybox/space_ft.png',
  '../img/skybox/space_bk.png'
]);
texture.magFilter=THREE.NearestFilter
texture.minFilter=THREE.NearestFilter
scene.background = texture;

const sun=LoadPlanetTextue("../img/sun_hd.jpg",10,10,10,'basic')
const mercury=LoadPlanetTextue("../img/mercury_hd.jpg",10,10,10,'basic')
const venus=LoadPlanetTextue("../img/venus_hd.jpg",10,10,10,'basic')
const earth=LoadPlanetTextue("../img/earth_hd.jpg",10,10,10,'basic')
const mars=LoadPlanetTextue("../img/mars_hd.jpg",10,10,10,'basic')
const jupiter=LoadPlanetTextue("../img/jupiter_hd.jpg",10,10,10,'basic')
const saturn=LoadPlanetTextue("../img/saturn_hd.jpg",10,10,10,'basic')
const uranus=LoadPlanetTextue("../img/uranus_hd.jpg",10,10,10,'basic')
const neptune=LoadPlanetTextue("../img/neptune_hd.jpg",10,10,10,"basic")
scene.add(sun)
scene.add(mercury)
scene.add(venus)
scene.add(earth)
scene.add(mars)
scene.add(jupiter)
scene.add(saturn)
scene.add(uranus)

  createRing(mercury_orbit_radius)
  createRing(venus_orbit_radius)
  createRing(earth_orbit_radius)
  createRing(mars_orbit_radius)
  createRing(jupiter_orbit_radius)
  createRing(saturn_orbit_radius)
  createRing(uranus_orbit_radius)
  createRing(neptune_orbit_radius)


const controls= new OrbitControls(camera,renderer.domElement)
controls.minDistance=100
controls.maxDistance=1000
camera.position.set(0,0,100)
controls.update();

function Revolution(time,speed,planet,orbitRadius){
  let orbitSpeed=0.001
  const planetAngle=time*speed*orbitSpeed
  planet.position.x=sun.position.x+orbitRadius*Math.cos(planetAngle)
  planet.position.z=sun.position.z+orbitRadius*Math.sin(planetAngle)
}

function animate(time) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (!window.solarSystemPaused) {
    const speed = 0.01;
    sun.rotation.y += speed;
    mercury.rotation.y += speed;
    venus.rotation.y += speed;
    earth.rotation.y += speed;
    mars.rotation.y += speed;
    jupiter.rotation.y += speed;
    uranus.rotation.y += speed;
    saturn.rotation.y += speed;
    neptune.rotation.y += speed;

    Revolution(time, mercury_revolution_speed, mercury, mercury_orbit_radius);
    Revolution(time, venus_revolution_speed, venus, venus_orbit_radius);
    Revolution(time, earth_revolution_speed, earth, earth_orbit_radius);
    Revolution(time, mars_revolution_speed, mars, mars_orbit_radius);
    Revolution(time, jupiter_revolution_speed, jupiter, jupiter_orbit_radius);
    Revolution(time, saturn_revolution_speed, saturn, saturn_orbit_radius);
    Revolution(time, uranus_revolution_speed, uranus, uranus_orbit_radius);
    Revolution(time, neptune_revolution_speed, neptune, neptune_orbit_radius);
  }

  controls.update();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();

