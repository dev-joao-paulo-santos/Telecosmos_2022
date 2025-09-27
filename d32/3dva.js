document.getElementById("button1").addEventListener("click", function(){exit=false,space();});
document.getElementById("button2").addEventListener("click", function(){exit=true,celestialSphere();});
var exit = false;

// Screen  
const renderer = new THREE.WebGLRenderer({antialias: true}); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
var rendersize = new THREE.Vector2();                                                             
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera     
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000000000000000);                                                              
camera.position.set(400, 300, 400);
camera.up.set(0, 1, 0);
const watcher = new THREE.Scene();

// Função responsavel por calcular a posição do objeto na tela.
function toScreenPosition(obj, camera){
var vector = new THREE.Vector3();
renderer.getSize(rendersize);
var widthHalf = 0.5*rendersize.x;
var heightHalf = 0.5*rendersize.y;

obj.updateMatrixWorld();
vector.setFromMatrixPosition(obj.matrixWorld);
vector.project(camera);

vector.x = ( vector.x * widthHalf ) + widthHalf;
vector.y = - ( vector.y * heightHalf ) + heightHalf;
let v = new THREE.Vector2(vector.x,vector.y);
return (v)
}
const FinalPosition = new THREE.Vector3();
const FirstPosition = new THREE.Vector3();
var hoverStar=0;

function createSelection(){
    let pts = new THREE.Path().absarc(0, 0, 1, 0, Math.PI * 2).getPoints(90);
    let g = new THREE.BufferGeometry().setFromPoints(pts);
    let m = new THREE.LineBasicMaterial( { color: 0xffffff} );
    let l = new THREE.Line(g, m);

    return(l)
};
// Cria-se circulo usado como seleção visual
const selection = createSelection();
selection.scale.set(100,100,100);

const mousePos = new THREE.Vector2();
document.onmousemove = function(e){
mousePos.x = e.pageX;
mousePos.y = e.pageY;
}
let loader = new THREE.RGBELoader()

// controls
const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = true;
controls.maxPolarAngle = 90;
var activeStar = 1;

// ESFERA CELESTE

function celestialSphere(){
    const scene = new THREE.Scene();
    scene.add(selection);

    selection.position.set(0,0,0);
    selection.visible = false;


    // Gerar Linhas
    function createWireframe(){
        const geometry = new THREE.SphereGeometry(100, 24, 12);
        const material = new THREE.LineBasicMaterial({ color: 0x444444 });

        const wireframe = new THREE.EdgesGeometry(geometry);
        line = new THREE.LineSegments(wireframe, material);

        return(line)
    };
    const sphere = createWireframe();
    scene.add(sphere);
    selection.getWorldPosition(watcher.position);

    function createStars(dec, ra, mag) {
        const dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0,0,0]), 3));
        const map = new THREE.TextureLoader().load("./glowing.png");
        const dotMaterial = new THREE.PointsMaterial( { map: map, size: 10-mag, color: 0xffff00, transparent: true } );
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        dot.rotation.y = ra * Math.PI/180;
        dot.rotation.z = dec * Math.PI/180;
        dot.translateX(100);
        scene.add(dot);
        return(dot);
    }
    var star = [];

    for(var i=0;i<starData.length;i++){
        star.push(createStars(starData[i].dec,starData[i].ra,starData[i].mag));
    }
    var starPos = [];

const earth = new THREE.Mesh(new THREE.SphereGeometry(6, 32,32), new THREE.MeshBasicMaterial({color: 0xffffff, map: new THREE.TextureLoader().load('./celestial_textures/earth/low/Earth_Diffuse_3K.jpg' )}))
scene.add(earth)

    animate();
    function animate() {
        watcher.getWorldPosition(FirstPosition);

        for(i=0;i<star.length;i++){
            starPos[i]=toScreenPosition(star[i],camera);
            if(starPos[i].distanceTo(mousePos)<10+star[i].scale.x*1480/star[i].position.distanceTo(camera.position) && starPos[i].distanceTo(mousePos)<=starPos[hoverStar].distanceTo(mousePos)){
                selection.visible = true;
                hoverStar = i, star[i].getWorldScale(selection.scale), selection.scale.multiplyScalar(1.1);
            }
        }
        star[hoverStar].getWorldPosition(selection.position);
        selection.lookAt(camera.position);

        watcher.getWorldPosition(FinalPosition);// Armazena a posição final do alvo da camera
        controls.target.copy(FinalPosition.clone());
        FinalPosition.sub(FirstPosition);// Subtrai o valor final pelo inicial
        camera.position.add(FinalPosition.clone());// posição da camera é atualizada.
        renderer.render(scene, camera);
        controls.update();
        if(exit==false){
            while (scene.children.length-1){
                scene.remove(scene.children[1]);
            }
            return 0;
        }
        requestAnimationFrame(animate);
    }

}

// SOLAR SYSTEM

function space(){
    const scene = new THREE.Scene();
    scene.add(selection);
    hoverStar=0;
// ILUMINAÇÃO
(function createLight(){
    // luzes astrais
    const solarlight = new THREE.PointLight(  0xfffefe, 1, 1000000 );
    solarlight.position.set(0,0,10);
    scene.add( solarlight )
})();

loader.load('./galaxy.hdr', function(t){
    t.mapping = THREE.EquirectangularReflectionMapping
    scene.background = t
    scene.environment = t

})

// painel de configurações
const settings = {'scale':1,'timeScale':2}
const panel = new dat.GUI( { width: 310 } );
const folder1 = panel.addFolder( 'Scale' );
folder1.add( settings, 'scale', 0.001, 1, 0.001 ).listen().onChange( function ( scale ) {
    rescale(scale);
});

function rescale(scale){
    orbitas[0].scale.set(57894 * scale,57894 * scale,57894 * scale);
    orbitas[1].scale.set(149598 * scale, 149598 * scale, 149598 * scale);
    orbitas[2].scale.set(364.4 * scale + 20,364.4 * scale + 20,364.4 * scale + 20);
    orbitas[3].scale.set(108159 * scale, 108159 * scale, 108159 * scale);
    orbitas[4].scale.set(227987 * scale, 227987 * scale, 227987 * scale);
    orbitas[5].scale.set(778567 * scale, 778567 * scale, 778567 * scale);
    orbitas[6].scale.set(1433537 * scale, 1433537 * scale, 1433537 * scale);
    orbitas[7].scale.set(2875031 * scale, 2875031 * scale, 2875031 * scale);
    orbitas[8].scale.set(4504391 * scale, 4504391 * scale, 4504391 * scale);
    orbitas[9].scale.set(5869656 * scale, 5869656 * scale, 5869656 * scale);
    stars[0].scale.set(646.340*scale + 50,646.340*scale + 50,646.340*scale + 50);
}
const folder2 = panel.addFolder( 'Time' );
folder2.add( settings, 'timeScale', 0.001, 10, 0.001 ).listen().onChange( function ( scale ) {
    timescale(scale);
});
function timescale(scale){
    loopTime =scale;
}

// CRIAÇÃO DE CORPOS CELESTIAIS
var stars = [];
var planetPos = [];
(function createCelestialBodies(){
    // criação de corpos
    var sphere = new THREE.SphereGeometry( 1,40,20);
    // sol
        const albedoSun = new THREE.TextureLoader().load( './celestial_textures/sun/low/2K_sun.jpg ');
        const materialSun = new THREE.MeshPhongMaterial( {
        map: albedoSun,
        emissive: 0xffffff,
        emissiveMap: albedoSun,
        emissiveIntensity: 10
        } );
        var sun = new THREE.Mesh( sphere, materialSun);
        sun.scale.set(696.340,696.340,696.340);//696340 Km
        scene.add(sun);
        stars.push(sun);
    // mercurio
        const mapHeightMercury = new THREE.TextureLoader().load( './celestial_textures/mercury/low/2k_mercury_normal.jpg' );
        const albedoMercury = new THREE.TextureLoader().load( './celestial_textures/mercury/low/2k_mercury.jpg' );
        const materialMercury = new THREE.MeshStandardMaterial( {
            map: albedoMercury,
            normalMap: mapHeightMercury,
        } );
        materialMercury.normalScale.set(2, 2)
        var mercury = new THREE.Mesh( sphere, materialMercury );
        mercury.scale.set(1.7374,1.7374,1.7374);//1737.4 Km
        scene.add(mercury);
        stars.push(mercury);
    // venus
        const mapHeightVenus = new THREE.TextureLoader().load( './celestial_textures/venus/high/venus_normal_map_6k_by_fargetanik.jpg' );
        const albedoVenus = new THREE.TextureLoader().load( './celestial_textures/venus/high/6k_venus_surface.jpg' );
        const materialVenus = new THREE.MeshPhongMaterial( {
        map: albedoVenus,
        specular: 0x222222,
        shininess: 5,
        normalMap: mapHeightVenus
        } );
        materialVenus.normalScale.set(2.25, 2.25)
        var venus = new THREE.Mesh( sphere, materialVenus );
        venus.scale.set(3.3962,3.3962,3.3962);//1737.4 Km
        scene.add(venus);
        stars.push(venus);
    // terra
        const mapHeightEarth = new THREE.TextureLoader().load( './celestial_textures/earth/low/Earth_NormalNRM_3K.jpg' );
        const albedoEarth = new THREE.TextureLoader().load( './celestial_textures/earth/low/Earth_Diffuse_3K.jpg' );
        const glossinessEarth = new THREE.TextureLoader().load( './celestial_textures/earth/low/Earth_Glossiness_3K.jpg' );

        const materialEarth = new THREE.MeshStandardMaterial( {
            map: albedoEarth,
            roughnessMap: glossinessEarth,

            normalMap: mapHeightEarth,
        } );
        materialEarth.normalScale.set(2, 2)
        var earth = new THREE.Mesh( sphere, materialEarth);
        
        //nuvens da terra
        const albedoClouds = new THREE.TextureLoader().load( './celestial_textures/earth/low/Earth_Clouds_3K.jpg' );
        const emissiveClouds = new THREE.TextureLoader().load( './celestial_textures/earth/low/Earth_Illumination_3K.jpg' );
        const materialClouds = new THREE.MeshPhongMaterial( {
        map: albedoClouds,
        transparent: true,
        alphaMap: albedoClouds,
        emissive: 0xffffff,
        emissiveMap: emissiveClouds,
        emissiveIntensity: 2 
        } );
        var clouds = new THREE.Mesh( sphere, materialClouds);
        clouds.scale.set(1.01,1.01,1.01);
        earth.add(clouds);
        earth.scale.set(6.371,6.371,6.371);//6371 Km
        scene.add(earth);
        stars.push(earth);
    
    // lua
        const mapHeightMoon = new THREE.TextureLoader().load( './celestial_textures/moon/high/ldem_16_uint.jpg' );
        const albedoMoon = new THREE.TextureLoader().load( './celestial_textures/moon/high/lroc_color_poles_4k.jpg' );
        const materialMoon = new THREE.MeshPhongMaterial( {
        map: albedoMoon,
        specular: 0x222222,
        shininess: 5,
        bumpMap: mapHeightMoon,
        bumpScale: 0.05
        } );
        var moon = new THREE.Mesh( sphere, materialMoon );
        moon.scale.set(1.7374,1.7374,1.7374);//1737.4 Km
        scene.add(moon);
        stars.push(moon);

    // marte
        const mapHeightMars = new THREE.TextureLoader().load( './celestial_textures/mars/high/5672_mars_6K_normal.jpg' );
        const albedoMars = new THREE.TextureLoader().load( './celestial_textures/mars/high/5672_mars_6K_color.jpg' );
        const dispMars = new THREE.TextureLoader().load( './celestial_textures/mars/high/5672_mars_6k_topo.jpg' );
        const materialMars = new THREE.MeshStandardMaterial( {
            map: albedoMars,    
            normalMap: mapHeightMars,
            displacementMap: dispMars,
            displacementScale: 0.01
        } );
        materialMars.normalScale.set(2, 2)
        var mars = new THREE.Mesh( sphere, materialMars );
        mars.scale.set(3.3895,3.3895,3.3895);//1737.4 Km
        scene.add(mars);
        stars.push(mars);
    // jupiter
        const albedoJupiter = new THREE.TextureLoader().load( './celestial_textures/jupiter/low/2k_jupiter.jpg' );
        const materialJupiter = new THREE.MeshStandardMaterial( {
            map: albedoJupiter
        } );
        var jupiter = new THREE.Mesh( sphere, materialJupiter );
        jupiter.scale.set(58.232,58.232,58.232);//1737.4 Km
        scene.add(jupiter);
        stars.push(jupiter);

    // saturno
        const albedoSaturn = new THREE.TextureLoader().load( './celestial_textures/saturn/low/2k_saturn.jpg' );
        const materialSaturn = new THREE.MeshStandardMaterial( {
            map: albedoSaturn
        } );
        var saturn = new THREE.Mesh( sphere, materialSaturn );
        saturn.scale.set(58.232,58.232,58.232);//1737.4 Km
        saturn.castShadow = true;
        scene.add(saturn);
        stars.push(saturn);
        // anéis de saturno
        const texture = new THREE.TextureLoader().load(
            "./celestial_textures/saturn/low/saturn-rings-top.png"
          );
          const geometry = new THREE.RingBufferGeometry(3, 5, 86);
          var pos = geometry.attributes.position;
          var v3 = new THREE.Vector3();
          for (let i = 0; i < pos.count; i++){
            v3.fromBufferAttribute(pos, i);
            geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
          }
          // adjustRingGeometry(geometry);
        
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true
          });
          const saturnRing = new THREE.Mesh(geometry, material);
        saturnRing.rotation.x = Math.PI/2 + 0.1;
        saturnRing.scale.set(0.5,0.5,0.5);
        saturnRing.receiveShadow = true;
        saturn.add( saturnRing );
        
    // urano
        const albedoUrano = new THREE.TextureLoader().load( './celestial_textures/uranus/high/2k_uranus.jpg' );
        const materialUrano = new THREE.MeshStandardMaterial( {
            map: albedoUrano
        } );
        var urano = new THREE.Mesh( sphere, materialUrano );
        urano.scale.set(25.362,25.362,25.362);//1737.4 Km
        scene.add(urano);
        stars.push(urano);

    // netuno
        const albedoNetuno = new THREE.TextureLoader().load( './celestial_textures/neptune/high/2k_neptune.jpg' );
        const materialNetuno = new THREE.MeshStandardMaterial( {
            map: albedoNetuno
        } );
        var netuno = new THREE.Mesh( sphere, materialNetuno );
        netuno.scale.set(24.622,24.622,24.622);//1737.4 Km
        scene.add(netuno);
        stars.push(netuno);

    // plutão
        const albedoPluto = new THREE.TextureLoader().load( './celestial_textures/pluto/low/pluto_texture.jpg' );
        const normalPluto = new THREE.TextureLoader().load( './celestial_textures/pluto/low/pluto_normal.jpg' );
        const materialPluto = new THREE.MeshStandardMaterial( {
            map: albedoPluto,    
            normalMap: normalPluto,
        } );
        materialMars.normalScale.set(2, 2)
        var pluto = new THREE.Mesh( sphere, materialPluto );
        pluto.scale.set(11.883,11.883,11.883);//11.188,3 km
        scene.add(pluto);
        stars.push(pluto);

        //escala 1:1000
})();

const orbitas = [];
function createOrbitas(eMaior, eMenor){
    // criação de órbitas

    //Terra - eixo maior: 152100 eixo menor: 147100
    //Lua - eixo maior: 384.4 eixo menor: 344.3885
    const Bcurva = new THREE.EllipseCurve(
        0, 0,
        1, eMenor/eMaior, 
        0, 2*Math.PI,
    )
    const points = Bcurva.getSpacedPoints(1000)
    
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({color: 0x00ff00 })
    const orbit = new THREE.Line(geo, mat)

    scene.add(orbit);
    orbitas.push(orbit);
    orbit.rotation.x = Math.PI/2;
    orbit.scale.set(eMaior,eMaior,eMaior);

    return Bcurva;
}

// this array contains all the orbits
const curvas = [createOrbitas(57894, 56652),createOrbitas(149598, 149577),createOrbitas(384.4, 383.82),createOrbitas(108159, 108156),createOrbitas(227987,226999),createOrbitas(778567,777639),createOrbitas(1433537,1431248),createOrbitas(2875031,2871935),createOrbitas(4504391,4504197),createOrbitas(5869656,5879200)]; //escala 1:1000
// stars orbit speed /100
const mercuryOspeed = 0.0001136363636;
const venusOspeed = 0.0000445037828
const earthOspeed = 0.0000273972602;
const moonOspeed = 0.0003571428571;
const marsOspeed = 0.0000145560407;
const jupiterOspeed = 0.0000023096661
const saturnOspeed = 0.0000009294354;
const uranusOspeed = 0.0000003246848;
const neptuneOspeed = 0.0000001661404;
const plutoOspeed = 0.000000110359;

// ORBIT
var loopTime = 1;
function orbitate(star, starOspeed, orbita){
    const time = starOspeed * performance.now()
    const t = (time % loopTime) / loopTime
    const p = curvas[orbita].getPoint(t)
    star.position.x = p.x*orbitas[orbita].scale.z + orbitas[orbita].position.x;
    star.position.z = p.y*orbitas[orbita].scale.z + orbitas[orbita].position.z;
    star.rotation.y += 0.005;
}
rescale(0.002); // Escala do modelo definida

// Events
const domevents = new THREEx.DomEvents(camera, renderer.domElement)
window.addEventListener('mousedown', () =>{
    if(selection.visible)activeStar = hoverStar, document.getElementById("infoi").innerHTML = getStarData(hoverStar),document.getElementById("infoi").style.visibility = 'visible';
});

animate();
    // LOOPING
function animate() {
    selection.lookAt(camera.position);
    watcher.getWorldPosition(FirstPosition);// Armazena a posição inicial do alvo da camera
    // EARTH'S ORBIT ANIMATION
    orbitate(stars[1], mercuryOspeed, 0); //mercurio
    orbitate(stars[2], venusOspeed, 3); //venus
    orbitate(stars[3], earthOspeed, 1); //terra
    stars[3].getWorldPosition(orbitas[2].position); //orbita lunar
    orbitate(stars[4], moonOspeed, 2); //lua
    stars[4].lookAt(stars[3].position);
    orbitate(stars[5], marsOspeed, 4);//marte
    orbitate(stars[6], jupiterOspeed, 5);//jupiter
    orbitate(stars[7], saturnOspeed, 6);//saturno
    orbitate(stars[8], uranusOspeed, 7);//urano
    orbitate(stars[9], neptuneOspeed, 8);//netuno
    orbitate(stars[10], plutoOspeed, 9);//pluto

    selection.visible = false;
    for(i=0;i<stars.length;i++){
        planetPos[i]=toScreenPosition(stars[i],camera);
        if(planetPos[i].distanceTo(mousePos)<10+stars[i].scale.x*1480/stars[i].position.distanceTo(camera.position) && planetPos[i].distanceTo(mousePos)<=planetPos[hoverStar].distanceTo(mousePos)){
            selection.visible = true;
            hoverStar = i, stars[i].getWorldScale(selection.scale), selection.scale.multiplyScalar(1.1);
        }
    }
    //console.log();
    stars[hoverStar].getWorldPosition(selection.position);

    stars[activeStar].getWorldPosition(watcher.position);
    watcher.getWorldPosition(FinalPosition);// Armazena a posição final do alvo da camera
    controls.target.copy(FinalPosition.clone());
    FinalPosition.sub(FirstPosition);// Subtrai o valor final pelo inicial
    camera.position.add(FinalPosition.clone());// posição da camera é atualizada.

    renderer.render(scene, camera);
    controls.update();
    if(exit==true){
        panel.destroy();
        return 0;
    }
    requestAnimationFrame(animate);
}
}