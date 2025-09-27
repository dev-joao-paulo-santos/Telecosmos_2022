import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
 import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js'

const scene = new THREE.Scene();
scene.background = new THREE.TextureLoader().load("./bkgscene.jpg")
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 1000 );
scene.add(camera)
const renderer = new THREE.WebGLRenderer({canvas: document.querySelector("#scenecanvas")});
renderer.setSize( window.innerWidth, window.innerHeight );

const star = new THREE.Mesh(
    new THREE.SphereGeometry(0.05),
    new THREE.MeshPhysicalMaterial({color: 0x005500, emissive: 0xffffaa, emissiveIntensity: 1})
)
scene.add(star);
star.position.set(2, 4, -10)
const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(), 
    new THREE.MeshBasicMaterial({transparent: true, map: new THREE.TextureLoader().load("textures/glowing.png")})
    )
scene.add(glow)
glow.position.set(2, 4, -10)
const light = new THREE.PointLight(0xffffff, 10, 100)
star.add(light);

const planet = new THREE.Mesh(
    new THREE.SphereGeometry(2, 124, 124),
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("./textures/gas.png")})
)
scene.add( planet );

const lia = new THREE.AmbientLight(0x101010)
scene.add(lia)

const planet2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 124, 124),
    new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("./textures/volcanic.png")})
)
scene.add( planet2 );
const ring = new THREE.Mesh(new THREE.RingGeometry(1.3, 1.35, 64), new THREE.MeshLambertMaterial({color: 0x808080, side: THREE.DoubleSide , transparent: true, opacity: 0.5}))
planet2.add(ring)
const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.46, 64), new THREE.MeshLambertMaterial({color: 0x00ffff, side: THREE.DoubleSide , transparent: true, opacity: 0.5}))
planet2.add(ring2)

const ring3 = new THREE.Mesh(new THREE.RingGeometry(1.47, 1.49, 64), new THREE.MeshLambertMaterial({color: 0x808080, side: THREE.DoubleSide , transparent: true, opacity: 0.5}))
planet2.add(ring3)
ring.rotation.y = Math.PI / 3
ring2.rotation.y = Math.PI / 3
ring3.rotation.y = Math.PI / 3

planet.position.set(3, -1, -1)
planet2.position.set(-1, 0, -5)
planet.rotation.y = -Math.PI / 3.5
camera.position.set(0, 0, 5)


//criação de asteroides
// Criação de asteroides
const gltfloader = new GLTFLoader();

const asteroids = []; // Array para armazenar informações sobre os asteroides

gltfloader.load('./asteroid/scene.gltf', function(gltf){
    
    for (let x = -7; x < 8; x++) {
        for (let y = -2; y < 2; y++) {
            const asteroid = gltf.scene.clone();
            asteroid.scale.set(0.1, 0.1, 0.1);

            // Defina velocidades aleatórias para cada asteroide
            const speedX = Math.random() * 0.01 - 0.005; // Variação de velocidade no eixo X
            const speedY = Math.random() * 0.01 - 0.005; // Variação de velocidade no eixo Y

            asteroids.push({ asteroid, speedX, speedY });

            asteroid.position.set(Math.random() + x * 11, Math.random() / -0.17, Math.random() + y * 6);
            asteroid.rotation.set(Math.random() + x * 10, Math.random() / -0.2, Math.random() + y * 6);
            star.add(asteroid); // Adiciona o asteroide como filho do objeto 'star'
            renderer.render(scene, camera);  
        }
    }
});

function checkCollision(asteroid, objects) {
    const asteroidSphere = new THREE.Sphere(
        new THREE.Vector3().copy(asteroid.position),
        asteroid.scale.x * 0.4 // Raio do asteroide (ajuste conforme necessário)
    );

    for (const object of objects) {
        const objectSphere = new THREE.Sphere(
            new THREE.Vector3().copy(object.position),
            object.scale.x * 2 // Raio do objeto 3D (ajuste conforme necessário)
        );

        const distance = asteroidSphere.center.distanceTo(objectSphere.center);

        if (distance < asteroidSphere.radius + objectSphere.radius) {
            return true; // Colisão detectada
        }
    }

    return false; // Sem colisão
}

function animateAsteroids() {
    // Atualize as posições dos asteroides com base em suas velocidades
    asteroids.forEach(({ asteroid, speedX, speedY }) => {
        // Verifique se há colisões com objetos 3D
        if (!checkCollision(asteroid, [planet, planet2])) {
            asteroid.position.x += speedX;
            asteroid.position.y += speedY;

            // Define limites para os asteroides voltarem à tela
            const boundaryX = 15;
            const boundaryY = 6;

            if (asteroid.position.x > boundaryX) {
                asteroid.position.x = -boundaryX;
            } else if (asteroid.position.x < -boundaryX) {
                asteroid.position.x = boundaryX;
            }

            if (asteroid.position.y > boundaryY) {
                asteroid.position.y = -boundaryY;
            } else if (asteroid.position.y < -boundaryY) {
                asteroid.position.y = boundaryY;
            }
        }
    });
}

const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = event.clientY / window.innerHeight - 0.5

})
function animate() {
    requestAnimationFrame( animate );
    planet.rotation.y += 0.001
    planet2.rotation.x += 0.001
    glow.rotation.z += 0.1
    star.rotation.y += 0.0007 
    const cameraX = cursor.x
    const cameraY = cursor.y
    camera.position.x = cameraX
    camera.position.y = cameraY
    renderer.render( scene, camera );
    animateAsteroids()
}

addEventListener('resize', ()=> {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
})
animate()