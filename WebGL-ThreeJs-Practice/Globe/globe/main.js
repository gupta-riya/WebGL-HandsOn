import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// create sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5,50,50),  //SphereGemoetry param -> radius, widthSegments, heightSegments 
  new THREE.MeshBasicMaterial({
    // color: 0xFF0000,
    map: new THREE.TextureLoader().load('./img/earth.png')
  })
  ) 

scene.add(sphere)

camera.position.z = 10;


function animate()
{
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}

animate()