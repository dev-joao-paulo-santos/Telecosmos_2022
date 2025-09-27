"use strict";
const renderer = new THREE.WebGLRenderer({antialias: true});
const camera = new THREE.PerspectiveCamera(30, 800 / 600, 1, 100000);
const scene = new THREE.Scene();

var terra = new THREE.Scene();
var sol = new THREE.Scene();

const FinalPosition = new THREE.Vector3();
const FirstPosition = new THREE.Vector3();
const CamPosition = new THREE.Vector3(800,0,0);

const domevents = new THREEx.DomEvents(camera, renderer.domElement)
domevents.addEventListener(terra, 'click', event =>{
    terra.position.y = 1000;  
}, false)

// simplified on three.js/examples/webgl_loader_fbx.html                        
function main() {
    // renderer                                                                 
    
    renderer.setSize(800, 600);
    document.body.appendChild(renderer.domElement);

    // camera                                                                   
    
    camera.position.set(400, 300, 400);
    camera.up.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // scene and lights                                                         
    
    //scene.add(new THREE.AmbientLight(0xcccccc));

    // load fbx model and texture                                               
    const objs = [];

    const loader = new THREE.FBXLoader();
    loader.load("./Terra.fbx", model => {
        // model is a THREE.Group (THREE.Object3D)                              
        const mixer = new THREE.AnimationMixer(model);
        // animations is a list of THREE.AnimationClip                          
        //mixer.clipAction(model.animations[0]).play();
        //scene.add(model);
        //objs.push({model, mixer});
    });
    const curva = new THREE.EllipseCurve(
        200, 400,
        5000, 8000, 
        0, 2*Math.PI,
    )
    
    const points = curva.getSpacedPoints(200)
    
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({color: 0x00ff00 })
    const orbit = new THREE.Line(geo, mat)

    scene.add(orbit);
    orbit.rotation.x = Math.PI/2;

    const loader2 = new THREE.GLTFLoader();
						loader2.load( './Terra.glb', function ( gltf ) {
                            terra.add(gltf.scene);
							scene.add( terra );
                            terra.scale.set(100,100,100);
                            terra.position.set(0,0,-1000);
                        });
                        loader2.load( './Sol.glb', function ( gltf ) {
                            sol = gltf.scene;
							scene.add( sol );
                            sol.scale.set(1000,1000,1000);
                        });

    const luzsolar = new THREE.PointLight( 0xffffff, 6, 100000 );
    luzsolar.position.set(0,0,10);
    scene.add( luzsolar );

    // animation rendering                                                      
    const clock = new THREE.Clock();

    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true
    controls.enablePan = true
    controls.maxPolarAngle = 90
    const loopTime = 1;
    const terraOspeed = 0.00001;

    function animate() {
        terra.getWorldPosition(FirstPosition);

        const time = terraOspeed * performance.now()
        const t = (time % loopTime) / loopTime
        const p = curva.getPoint(t)
        terra.position.x = p.x;
        terra.position.z = p.y;
        terra.rotation.y += 0.005;

        terra.getWorldPosition(FinalPosition);
        controls.target.copy(FinalPosition.clone());

        FinalPosition.sub(FirstPosition);
        camera.getWorldPosition(CamPosition);
        camera.position.add(FinalPosition.clone());

        // animation with THREE.AnimationMixer.update(timedelta)                
        //objs.forEach(({mixer}) => {mixer.update(clock.getDelta());});
        renderer.render(scene, camera);
        controls.update();
        requestAnimationFrame(animate);
    }
    animate();
    return objs;
}
const objs = main();
