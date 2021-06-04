import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'


// data loading
let data = [];
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){
  if(this.readyState == 4 && this.status == 200){
    let response = JSON.parse(xhttp.responseText);
    let output = Object.values(response);
    for(let i = 0 ; i< output.length ; i++){
      data.push(output[i]);
    }
  }
};
xhttp.open("GET","./data/location.json",false);
xhttp.send();
console.log(data);

// THREE js code

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// creating sphere -> globe
// earth map
let earthMap = new THREE.TextureLoader().load('./img/earthmap4k.jpg');

// earth bump map
let earthBumpMap = new THREE.TextureLoader().load('./img/earthbump4k.jpg');

// earth space map -> gives shininess to earth surrounding
let earthSpaceMap = new THREE.TextureLoader().load('./img/earthspec4k.jpg');


// geometry

let earthGeometry = new THREE.SphereGeometry(5,50,50); //SphereGemoetry param -> radius, widthSegments, heightSegments 
let earthMaterial = new THREE.MeshPhongMaterial({
  map: earthMap,
  bumpMap: earthBumpMap,
  bumpScale : 0.10,
  specularMap: earthSpaceMap,
  specular: new THREE.Color('grey')
});

const earth = new THREE.Mesh(
  earthGeometry,  
  earthMaterial
) 

scene.add(earth)

// add clouds to the earth object
let cloudsGeometry = new THREE.SphereGeometry(5,50,50);

// add cloud textures
let cloudsTexture = new THREE.TextureLoader().load('./img/earthhiresclouds4K.jpg')

// add cloud material
let cloudsMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  map: cloudsTexture,
  transparent: true,
  opacity: 0.3
});

let earthClouds = new THREE.Mesh(cloudsGeometry,cloudsMaterial);

// scale above the earth sphere mesh
earthClouds.scale.set(1.015,1.015,1.015);

//make child of the earth
earth.add(earthClouds)

// create variable to store array of lights
let lights = [];

// create skyBox to add more attractiveness
function createSkyBox(scene)
{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    './img/space_right.png',
    './img/space_left.png',
    './img/space_top.png',
    './img/space_bot.png',
    './img/space_front.png',
    './img/space_back.png'    

  ])
  scene.background = texture;
}

// createLights is a function which creates the lights and adds them to the scene.
function createLights(scene){
  lights[0] = new THREE.PointLight("#004d99",.5,0);
  lights[1] = new THREE.PointLight("#004d99",.5,0);
  lights[2] = new THREE.PointLight("#004d99",.7,0);
  lights[3] = new THREE.AmbientLight("#ffffff");
 
  lights[0].position.set(200,0,-400);
  lights[1].position.set(200,200,400);
  lights[2].position.set(-200,-200,-50);

  scene.add(lights[0])
  scene.add(lights[1])
  scene.add(lights[2])
  scene.add(lights[3])
  }

  // add scene objects 
  function addSceneObjects(scene)
  {
    createLights(scene);
    createSkyBox(scene);
  }


addSceneObjects(scene);
  
camera.position.z = 15;

// disable control function so that user dont zoom in or zoom out too much
controls.minDistance = 12;
controls.maxDistance = 30;
controls.enablePen = false;
controls.update();
controls.saveState();


//----------- add event listeners ----------

window.addEventListener("resize",onWindowResize,false);


function onWindowResize(){
 
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth,window.innerHeight);

}


function animate()
{
    requestAnimationFrame(animate)
    render();
    controls.update();
    
}

function render(){

  renderer.render(scene,camera);
}




animate()



