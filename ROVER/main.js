import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'
import {OrbitControls} from 'OrbitControls'
import {GLTFLoader} from 'GLTFLoader'

//variaveis 

let scene, camera, renderer
let world, cannondebug
let timeStep = 1 / 60
var rover

let chaseCam, chaseCamPivot
let view = new THREE.Vector3()


chaseCam = new THREE.Object3D()
chaseCam.position.set(0, 0, 0)

chaseCamPivot = new THREE.Object3D()
chaseCamPivot.position.set(0, 5, -20)


chaseCam.add(chaseCamPivot)

chaseCam.add(chaseCam)


const txloader = new THREE.TextureLoader()           



	scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc1440e)
	camera = new THREE.PerspectiveCamera( 
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000 
        );

        scene.fog = new THREE.FogExp2( 0xc1440e, 0.025 );
        

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );


world = new CANNON.World()
world.gravity.set(0, -3.721, 0)
cannondebug = new CannonDebugger(scene, world, {
    color: 0xffffff,
    scale: 1
})

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update()

//camera.position.set(0, 10, -30)



const groundMat = new CANNON.Material("groundMaterial")
const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({mass: 0, shape: groundShape, material: groundMat})

groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI / 2)

world.addBody(groundBody)

const groundTex = txloader.load("./textures/diff_8k.png")
groundTex.wrapS = THREE.RepeatWrapping
groundTex.wrapT = THREE.RepeatWrapping
groundTex.repeat.set(2, 2)

const groundM = new THREE.MeshStandardMaterial({
    map: groundTex
})

const groudGeo = new THREE.BoxGeometry(1000, 2, 1000)

const groundMesh = new THREE.Mesh(groudGeo, groundM)
scene.add(groundMesh)
groundMesh.position.set(0, -1, 0)



const roverphysicMat = new CANNON.Material("SpeederMaterial")
const slippery = new CANNON.ContactMaterial(groundMat, roverphysicMat, {
    
friction: 1,
restitution: 0,
//contactEquationStiffness: 1e9,
//contactEquationRelaxation: 3,
frictionEquationStiffness: 1e5,
//frictionEquationRelaxation: 3
})

world.addContactMaterial(slippery)


const roverbodyshape = new CANNON.Box(new CANNON.Vec3(1.4, 0.5, 1.5))
const roverBody = new CANNON.Body({mass: 50000, material: roverphysicMat, shape: roverbodyshape})
roverBody.position.set(0,0,0)
world.addBody(roverBody)


const cube = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0}))
scene.add(cube)

const cubecam = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0}))
cube.add(cubecam)
cubecam.position.set(0, 3, -10)
cubecam.add(camera)

cube.position.copy(roverBody.position)
cube.quaternion.copy(roverBody.quaternion)

const glbloader = new GLTFLoader()



glbloader.load("./space_rover/scene.gltf", (gltf)=>{
    rover = gltf.scene
   
    rover.scale.set(0.0003, 0.0003, 0.0003)
    
   
    scene.add(rover)

    
})



const rampa = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 20), new THREE.MeshBasicMaterial({color:0xffffff, map: groundTex}))
scene.add(rampa)

const rampashape = new CANNON.Box(new CANNON.Vec3(5, 1,10))
const rampaBody = new CANNON.Body({mass:0, shape: rampashape, material: groundMat})
rampaBody.position = new CANNON.Vec3(0, 1, 15)
rampaBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI /12)
world.addBody(rampaBody)
rampa.position.copy(rampaBody.position)
rampa.quaternion.copy(rampaBody.quaternion)


let vel = 0, max = 1, acl = 0.05, ang = 0


document.onkeydown = (event)=>{
    console.log(event)
    switch(event.key){
        case "A", "a":
        ang += (Math.PI/30)

        break


        case "D", "d":
            ang -= (Math.PI/30)

        break

        
        case "W", "w":
        vel += acl

        break


        case "S", "s":
            vel -= acl

        break

        case "F", "f":
            camera.position.z = 20

        break

        case "B", "b":
            camera.position.z = 0

        break
    }
    roverBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), ang)
}


function move(){
if(vel > max) vel = max

if(vel < 0) vel = 0


roverBody.position.x += vel * Math.sin(ang)
roverBody.position.z += vel * Math.cos(ang)

if (rover){
    rover.position.copy(roverBody.position)
    rover.quaternion.copy(roverBody.quaternion)

    camera.lookAt(rover.position)
}

}



const light = new THREE.AmbientLight(0xffffff)
scene.add(light)

function animate(){
   // cannondebug.update()
    move()

    world.step(timeStep)
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
    cube.position.copy(rover.position)
    cube.quaternion.copy(rover.quaternion)

}
animate()

function resizeWindow(){
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', resizeWindow)
