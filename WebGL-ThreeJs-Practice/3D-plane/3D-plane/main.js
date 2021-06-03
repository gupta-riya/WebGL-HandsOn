import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
// refer three.js docs

// console.log(OrbitControls)
// we are using dat for gui
const gui = new dat.GUI();
// console.log(gui);
// create objects to add to gui
const world = {
    plane : {
        width: 19 ,      // 19 by default
        height: 19,
        widthSegments:17,
        heightSegments:17
    }
}
// add object and property whose value i want to change
// we add slider ranging 1 - 20
// we got a slider at top right
gui.add(world.plane,'width', 1, 30).onChange(generatePlane);

// to alter on height
gui.add(world.plane,'height', 1, 30).onChange(generatePlane);

gui.add(world.plane,'widthSegments', 1, 40).onChange(generatePlane);

gui.add(world.plane,'heightSegments', 1, 40).onChange(generatePlane);


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

    const colors = []
    for(let i = 0 ; i < mesh.geometry.attributes.position.count; i++)
    {
        // affecting every single vertex
        colors.push(0,0.19,0.4)
    }
    mesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))
    
}


// create raycaster for mouse event
const raycaster = new THREE.Raycaster();
// create scene
const scene = new THREE.Scene();
// initialize camera 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// orbital control will control movements of plane based on mouse movements
new OrbitControls(camera,renderer.domElement);
camera.position.z = 5;

// width, height, widthsegment, heightsegment

// with this size the plane will be so small and even if we try to increase we will be able to do that manually until and unless we use DAT gui
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments);


// to see both the sides add doubleside
// const material = new THREE.MeshMaterial({color: 0xFF0000,side:THREE.DoubleSide});    // color: hexa-representation(2dig)red(2dig)green(2-dig)blue(2-dig)

// to add luminiousity and light to the geometry we can use meshPhongMaterial and then we'll be able to add lights
const material = new THREE.MeshPhongMaterial({
    // color: 0xFF0000,   becoz manually we are adding colors to every vertex
    side: THREE.DoubleSide,
    flatShading: THREE.FlatShading,  // flat shading will give us the required texture -> it is associated with depth i.e. z-direction
    vertexColors: true  // to impart color to every vertex
}); 

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

// to set attribute in geometry (color)
// color is added with a buffer of float32 array 
// here parameter r g b -> color imparted is blue
const colors = []
for(let i = 0 ; i < mesh.geometry.attributes.position.count; i++)
{
    // affecting every single vertex
    colors.push(0,0.19,0.4)
}
mesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))




// creating a light with white color and highest intensity as 1
const light = new THREE.DirectionalLight(0xffffff, 1);

// position of light with x, y, and z
light.position.set(0, 0, 1);

scene.add(light);


// we should also create a backlight for other side
const backLight = new THREE.DirectionalLight(0xffffff, 1);

backLight.position.set(0, 0, -1);

scene.add(backLight);


const mouse = {
  x : undefined,
  y : undefined
}



// add mouse hover effect

addEventListener('mousemove',(event)=>{

  // to get center coordinate as 0 and if we move left we want to have coordinate in neg so we applied a formula 
  mouse.x = (event.clientX / innerWidth)*2 - 1;
  // reverse case in y (coz we want -ve in bottom)
  mouse.y = -(event.clientY / innerHeight)*2 + 1;


})

// add animation
function animate() {


  requestAnimationFrame(animate);

  renderer.render(scene, camera);

  // mesh.rotation.x += 0.01; 

  // mouse and camera movements 
  raycaster.setFromCamera(mouse,camera)
  // it will do movement on plane mesh
  const intersects = raycaster.intersectObject(mesh);
  if(intersects.length > 0)
  {
    //this will change color at we are pointing
    // change color attribute
    // intersects[0] reprsents a face we are hovering
    // intersects[0].object.geometry.attributes.color represents the colors of face
    // console.log(intersects[0].face)

    const {color} = intersects[0].object.geometry.attributes;
    
    
    intersects[0].object.geometry.attributes.color.needsUpdate = true

    // gsap is for animation
    const initialColor = {
      r : 0,
      g : 0.19,
      b: .4
    }

    const hoverColor = {
      r : 0.1,
      g : 0.5,
      b: 1
    }

    gsap.to(hoverColor,{
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration:1,
      onUpdate: ()=>{
       //vertice 1
        color.setX(intersects[0].face.a,hoverColor.r)  // for red
        color.setY(intersects[0].face.a,hoverColor.g)  // for green
        color.setZ(intersects[0].face.a,hoverColor.b) // for blue
        // vertice 2)
        color.setX(intersects[0].face.b,hoverColor.r)
        color.setY(intersects[0].face.b,hoverColor.g)
        color.setZ(intersects[0].face.b,hoverColor.b)
        
        // vertice 3
        color.setX(intersects[0].face.c,hoverColor.r)
        color.setY(intersects[0].face.c,hoverColor.g)
        color.setZ(intersects[0].face.c,hoverColor.b)

        color.needsUpdate = true
      }

    })

  }

}

// call animate
animate();
