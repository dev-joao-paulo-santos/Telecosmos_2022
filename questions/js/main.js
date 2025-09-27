import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#container").appendChild(renderer.domElement);

const cubeSize = .01;
const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, 1);
const material = new THREE.MeshBasicMaterial();


function generateRandomCube() {
  const cube = new THREE.Mesh(geometry, material);
  const cameraDistance = 1;
  const cameraPosition = camera.position.z;

  cube.position.x = Math.random() * 100 - 50;
  cube.position.y = Math.random() * 100 - 50;
  cube.position.z = cameraPosition - cameraDistance - (Math.random() * 12);




  scene.add(cube);
}




for (let i = 0; i < 10000; i++) {
  generateRandomCube();
}




function animate() {
    requestAnimationFrame(animate);
  

    scene.traverse(function (object) {
      if (object instanceof THREE.Mesh) {
        object.position.z += 0.2; 

        camera.rotation.z += .0000003

        
        // Verifica se os cubos estão fora da câmera
        if (object.position.z > camera.position.z) {
          object.position.z = camera.position.z - 17; 
        }
      }
    });
  
    renderer.render(scene, camera);
  }

  
  animate();
  
function resize(){
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)
}
  //Responsividade
document.addEventListener('resize', resize())
