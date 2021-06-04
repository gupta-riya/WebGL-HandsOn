import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';
import gsap from 'gsap';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(
  {
    antialias: true
  }
);

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// create first sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5,50,50),  //SphereGemoetry param -> radius, widthSegments, heightSegments 
  new THREE.ShaderMaterial({
    vertexShader, // same as vertexShader: vertexShader
    fragmentShader,
    uniforms:{
      globeTexture: {
        value: new THREE.TextureLoader().load('./img/earth.png')
      }
    }   
  })
  ) 

scene.add(sphere)

// create second sphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5.5,50,50),  //SphereGemoetry param -> radius, widthSegments, heightSegments 
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader, // same as vertexShader: vertexShader
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
  })
  ) 
atmosphere.scale.set(1.1,1.1,1.1)
scene.add(atmosphere)

const group = new THREE.Group()
group.add(sphere)
scene.add(group)

// stars
const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const starVertices = []
for(let i = 0 ; i < 10000; i++)
{
  const x = (Math.random() - 0.5)*2000
  const y = (Math.random() - 0.5)*2000
  const z = -(Math.random())*3000      // we only want stars at back
  starVertices.push(x,y,z)

}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
  starVertices,3))

const stars = new THREE.Points(
  starGeometry,starMaterial)

scene.add(stars)




camera.position.z = 15;


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

function animate()
{
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
    sphere.rotation.y += 0.002
    // group.rotation.x = mouse.x * 0.5
    gsap.to(group.rotation,{
      x:- mouse.y * 0.3,
      y: mouse.x * 0.5,
      duration:2
    })

}

animate()

