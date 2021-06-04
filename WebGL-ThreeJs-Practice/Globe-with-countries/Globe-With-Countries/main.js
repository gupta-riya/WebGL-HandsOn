import * as THREE from "https://unpkg.com/three@0.126.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";

// data loading
let data = [];
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    let response = JSON.parse(xhttp.responseText);
    let output = Object.values(response);
    for (let i = 0; i < output.length; i++) {
      data.push(output[i]);
    }
  }
};
xhttp.open("GET", "./data/location.json", true);
xhttp.send();
console.log(data);

// THREE js code

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// creating sphere -> globe
// earth map
let earthMap = new THREE.TextureLoader().load("./img/earthmap4k.jpg");

// earth bump map
let earthBumpMap = new THREE.TextureLoader().load("./img/earthbump4k.jpg");

// earth space map -> gives shininess to earth surrounding
let earthSpaceMap = new THREE.TextureLoader().load("./img/earthspec4k.jpg");

// geometry

let earthGeometry = new THREE.SphereGeometry(10, 32, 32); //SphereGemoetry param -> radius, widthSegments, heightSegments
let earthMaterial = new THREE.MeshPhongMaterial({
  map: earthMap,
  bumpMap: earthBumpMap,
  bumpScale: 0.1,
  specularMap: earthSpaceMap,
  specular: new THREE.Color("grey"),
});

const earth = new THREE.Mesh(earthGeometry, earthMaterial);

scene.add(earth);

// add clouds to the earth object
let cloudsGeometry = new THREE.SphereGeometry(10, 32, 32);

// add cloud textures
let cloudsTexture = new THREE.TextureLoader().load(
  "./img/earthhiresclouds4K.jpg"
);

// add cloud material
let cloudsMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  map: cloudsTexture,
  transparent: true,
  opacity: 0.3,
});

let earthClouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);

// scale above the earth sphere mesh
earthClouds.scale.set(1.015, 1.015, 1.015);

//make child of the earth
earth.add(earthClouds);

// create variable to store array of lights
let lights = [];

// create skyBox to add more attractiveness
function createSkyBox(scene) {
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    "./img/space_right.png",
    "./img/space_left.png",
    "./img/space_top.png",
    "./img/space_bot.png",
    "./img/space_front.png",
    "./img/space_back.png",
  ]);
  scene.background = texture;
}

// createLights is a function which creates the lights and adds them to the scene.
function createLights(scene) {
  lights[0] = new THREE.PointLight("#004d99", 0.5, 0);
  lights[1] = new THREE.PointLight("#004d99", 0.5, 0);
  lights[2] = new THREE.PointLight("#004d99", 0.7, 0);
  lights[3] = new THREE.AmbientLight("#ffffff");

  lights[0].position.set(200, 0, -400);
  lights[1].position.set(200, 200, 400);
  lights[2].position.set(-200, -200, -50);

  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);
  scene.add(lights[3]);
}

// add scene objects
function addSceneObjects(scene) {
  createLights(scene);
  createSkyBox(scene);
}

addSceneObjects(scene);

camera.position.z = 20;

// disable control function so that user dont zoom in or zoom out too much
controls.minDistance = 12;
controls.maxDistance = 30;
controls.enablePen = false;
controls.update();
controls.saveState();

//----------- add event listeners ----------

// window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}


// removes the points of interest freeing up memory and space to have better performance
function removeChildren(){
  let destroy = earthClouds.children.length;
  while(destroy--){
    earthClouds.remove(earthClouds.children[destroy].material.despose())
    earthClouds.remove(earthClouds.children[destroy].geometry.despose())
    earthClouds.remove(earthClouds.children[destroy])

  }
}

// setting up coordinates
function addCountryCode(earth,country,language,latitude,longitude,color,region,population,area_sq_mi,gdp_per_capita,climate)
{
  let pointOfInterest = new THREE.SphereGeometry(.1, 32,32);
  let lat = latitude * (Math.PI / 180);
  let lon = -longitude * (Math.PI / 180);
  const radius = 10;
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  let material = new THREE.MeshBasicMaterial({
    color: color,
  });
  let mesh = new THREE.Mesh(pointOfInterest, material);

  mesh.position.set(
    Math.cos(lat) * Math.cos(lon) * radius,
    Math.sin(lat) * radius,
    Math.cos(lat) * Math.sin(lon) * radius
  );

  mesh.rotation.set(0.0, -lon, lat - Math.PI * 0.5);
  
  mesh.userData.country = country;
  mesh.userData.language = language;
  mesh.userData.color = color;
  mesh.userData.region = region;
  mesh.userData.population = population;
  mesh.userData.area_sq_mi = area_sq_mi ;
  mesh.userData.gdp_per_capita = gdp_per_capita ;
  mesh.userData.climate = climate;
  
  earthClouds.add(mesh);



}

function changeToCountry() {
  //

    removeChildren();
  // Get the data from the JSON file
  for (let i = 0; i < data.length; i++) {
    if (data[i].Region == "ASIA (EX. NEAR EAST)") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "yellow",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    } else if (data[i].Region == "NEAR EAST") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "orange",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    } else if (data[i].Region == "NORTHERN AMERICA") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "light blue",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    } else if (data[i].Region == "WESTERN EUROPE") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "cyan",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    } else if (data[i].Region == "EASTERN EUROPE") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "red",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    } else if (data[i].Region == "BALTICS") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "purple",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    } else if (data[i].Region == "C.W. OF IND. STATES") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "orange",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    }else if (data[i].Region == "NORTHERN AFRICA") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "beige",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    }
    else if (data[i].Region == "SUB-SAHARN AFRICA") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "brown",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    }else if (data[i].Region == "LATIN AMER. & CARIB") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "gold",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    }else if (data[i].Region == "OCEANIA") {
      addCountryCode(
        earth,
        data[i].Country,
        data[i].Languages,
        data[i].latitude,
        data[i].longitude,
        "lightgreen",
        data[i].Region,
        data[i].Population,
        data[i].Area_sq_mi,
        data[i].GPD_per_capita,
        data[i].Climate
      );
    }
  }
}


animate();
changeToCountry();