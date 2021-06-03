
// create scene
const scene = new THREE.Scene();
// initialize camera 
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

console.log(scene);
console.log(camera);
console.log(renderer);    

// this will create a black box of the default height or we may set the height and width
// it will render on complete screen with some default padding which we can remove in css
renderer.setSize(window.innerWidth,window.innerHeight);
// just set pixel ratio else it will display jaggy lines on sides
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);


// we need a geometry to start drawing 
// then material is something that fills that geometry
// both geometry and material create a mesh which can be inserted to our scene now

// boxgeometry take len , width, height
const boxGeometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 0x00FF00});    // color: hexa-representation(2dig)red(2dig)green(2-dig)blue(2-dig)

const mesh = new THREE.Mesh(boxGeometry,material);
console.log(boxGeometry);
console.log(material);
console.log(mesh);

// now add mesh to scene
scene.add(mesh);

//adjust camera (for the time being it just creates a simple box )
camera.position.z = 5;      // lesser the z more will be its size

// add animation
function animate(){
    
    //recurring function 
    requestAnimationFrame(animate);
    // and continuosly render it 
    renderer.render(scene, camera);
    // add how it will spin
    // less the numbers lesser will be the speed
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

}

// call animate
animate();
// now call render function who can render scene
//renderer.render(scene, camera);