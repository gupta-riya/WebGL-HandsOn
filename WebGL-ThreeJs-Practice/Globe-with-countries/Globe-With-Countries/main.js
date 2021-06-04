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
  specularMap: earthSpecMap,
  specular: new THREE.Color('grey')
});

const earth = new THREE.Mesh(
  earthGeometry,  
  earthMaterial
) 

scene.add(earth)
camera.position.z = 5;


// create variable to store array of lights
let lights = [];

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
  }


  addSceneObjects(scene);
//----------- add event listeners ----------

window.addEventListener("resize",onWindowResize,false);


function onWindowResize(){
  requestAnimationFrame(animate);
  render();
  controls.update();

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



