import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
// refer three.js docs

// we are using dat for gui
const gui = new dat.GUI();
// console.log(gui);
// create objects to add to gui
const world = {
    plane : {
        width: 10 ,      // 10 by default
        height: 10,
        widthSegments:10,
        heightSegments:10
    }
}
// add object and property whose value i want to change
// we add slider ranging 1 - 20
// we got a slider at top right
gui.add(world.plane,'width', 1, 20).onChange(generatePlane);

// to alter on height
gui.add(world.plane,'height', 1, 20).onChange(generatePlane);

gui.add(world.plane,'widthSegments', 1, 20).onChange(generatePlane);

gui.add(world.plane,'heightSegments', 1, 20).onChange(generatePlane);


// create function to clean code
function generatePlane(){

    // onchange slider change plane size
    mesh.geometry.dispose();    // dispose existing one
    mesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments);    //add new one
    // console.log(world.plane.width);

    // now changes the values for all the coordinates to get the spikes effect
    var { array } = mesh.geometry.attributes.position;

    // we are incrementing by 3 as we need x,y,z
    for (let i = 0; i < array.length; i += 3) {
        
        const z = array[i + 2];
        
        array[i+2] = z + Math.random(); 
    }
    
}



// create scene
const scene = new THREE.Scene();
// initialize camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// width, height, widthsegment, heightsegment

// with this size the plane will be so small and even if we try to increase we will be able to do that manually until and unless we use DAT gui
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);


// to see both the sides add doubleside
// const material = new THREE.MeshMaterial({color: 0xFF0000,side:THREE.DoubleSide});    // color: hexa-representation(2dig)red(2dig)green(2-dig)blue(2-dig)

// to add luminiousity and light to the geometry we can use meshPhongMaterial and then we'll be able to add lights
const material = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading
}); // flat shading will give us the required texture -> it is associated with depth i.e. z-direction

const mesh = new THREE.Mesh(planeGeometry, material);


scene.add(mesh);


// if we go to planeGeometry in console and then to position, we'll found
// an array with a lot of values
// those values are coordinated of the plane
// three indexes define x,y and z coord
// eg: 0-> x, 1-> y, 2-> z , 3-> x , 4-> y, 5-z and so one....

// we need to changes these oordinated to get plane of our choice

// array element of position
var { array } = mesh.geometry.attributes.position;

// we are incrementing by 3 as we need x,y,z
for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];
    // console.log(array[i]);

    // array[i] = x - 3;  // shifts everything to the left
    array[i+2] = z + Math.random(); // crazy structure 



}

// creating a light with white color and highest intensity as 1
const light = new THREE.DirectionalLight(0xffffff, 1);

// position of light with x, y, and z
light.position.set(0, 0, 1);

scene.add(light);


// add animation
function animate() {


    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    mesh.rotation.x += 0.01;

}

// call animate
animate();
