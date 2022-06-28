import * as THREE from 'three'
import { PointLightHelper } from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass';


const canvas = document.querySelector('#bg')
const audio = document.getElementById('audio')
audio.volume = 0.2
audio.play()
const { width , height } = canvas.getBoundingClientRect()

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75,width/height,0.1,1000)

const renderer = new THREE.WebGLRenderer({
  canvas,
})


renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(width,height)

camera.position.set(0,1,10)



const boxgeo = new THREE.BoxGeometry(500,0.11,500)
const boxmaterial = new THREE.MeshPhongMaterial({color:0x454545})
const box = new THREE.Mesh(boxgeo,boxmaterial)
//scene.add(box)


const loader = new GLTFLoader()
loader.load('/room/room.gltf',(gltf)=>{
  scene.add(gltf.scene)
})


// Lights
const pl1 = new THREE.PointLight(0xfff2d9,0.3)
pl1.target = box
pl1.position.set(0,1.8,4)
scene.add(pl1)

const pl2 = new THREE.PointLight(0xfff2d9,0.3)
pl2.target = box
pl2.position.set(0,1.8,-5)
scene.add(pl2)


const pl3 = new THREE.PointLight(0xfff2d9,2)
pl3.target = box
pl3.position.set(2,.9,-11)
//scene.add(pl3)





// Controlls

var isForward = false
var isBackward = false
// var isLeft = false
// var isRight = false

const speed = 0.05
document.onkeydown = function(e){
  console.log(camera.position.z);
  if(e.keyCode === 40 ){
    isForward = true
  }
  if(e.keyCode === 38){
    isBackward = true
  }
  // if(e.keyCode === 39){
  //   isRight = true
  // }
  // if(e.keyCode === 37){
  //   isLeft = true
  // }
}

document.onkeyup = function(e){
  console.log(e.keyCode);
  if(e.keyCode === 40 ){
    isForward = false
  }
  if(e.keyCode === 38){
    isBackward = false
  }
  // if(e.keyCode === 39){
  //   isRight = false
  // }
  // if(e.keyCode === 37){
  //   isLeft = false
  // }
}

// Post Processing
const composer = new EffectComposer( renderer );

const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

const imagePass = new UnrealBloomPass();
composer.addPass( imagePass );

const image2Pass = new AdaptiveToneMappingPass();
composer.addPass( image2Pass );

const image4Pass = new AfterimagePass(0.001);
composer.addPass( image4Pass );

const image3Pass = new GlitchPass(0);
composer.addPass( image3Pass );



const color = 0xff0000;
const density = 0.01;
scene.fog = new THREE.FogExp2(color, density);

function animate(){
  
  //controlls.update()

  if(isForward  && camera.position.z < 10){
    camera.position.z += speed;
  
  }
  if(isBackward  && camera.position.z > -7.5){
    camera.position.z-= speed;
    }
  // if(isRight){
  //   camera.position.x += speed;
  
  // }
  // if(isLeft){
  //   camera.position.x -= speed;
  
  // }

  
  composer.render();
  requestAnimationFrame(animate)
}
animate()


