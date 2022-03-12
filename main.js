import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import clouds from './assets/cloud.jpeg'
import fragmentShader from './shaders/fragment.frag?raw'
import vertexShader from './shaders/vertex.vert?raw'

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const mouse = {
  x: 0,
  y: 0,
}

const canvas = document.getElementById('webGL')

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
const controls = new OrbitControls(camera, canvas)
const renderer = new THREE.WebGLRenderer({ canvas })
const clock = new THREE.Clock()

controls.enableDamping = true

camera.fov = 75
camera.aspect = size.width / size.height
camera.far = 100
camera.near = 0.1
camera.position.set(0, 0, 3)

renderer.setClearColor(new THREE.Color(0xffe5fa))

scene.add(camera)

const planeGeometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1)
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: new THREE.TextureLoader().load(clouds) },
  },
  transparent: true,
  depthTest: false,
  depthWrite: false,
  blend: THREE.MultiplyBlending,
})

const instancedBufferGeometry = new THREE.InstancedBufferGeometry()
instancedBufferGeometry.attributes = planeGeometry.attributes
instancedBufferGeometry.index = planeGeometry.index

const number = 1000
const translateArray = new Float32Array(number * 3)
const rotateArray = new Float32Array(number)

const radius = 0.7
for (let i = 0; i < number; i++) {
  const theta = Math.random() * 2 * Math.PI
  rotateArray.set([Math.random() * 2 * Math.PI], i)
  translateArray.set(
    [radius * Math.sin(theta), radius * Math.cos(theta), -Math.random() * 5],
    i * 3
  )
}

instancedBufferGeometry.setAttribute(
  'translate',
  new THREE.InstancedBufferAttribute(translateArray, 3)
)
instancedBufferGeometry.setAttribute(
  'rotate',
  new THREE.InstancedBufferAttribute(rotateArray, 1)
)

const plane = new THREE.Mesh(instancedBufferGeometry, planeMaterial)

scene.add(plane)

function resizeHandler() {
  size.height = window.innerHeight
  size.width = window.innerWidth

  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
resizeHandler()

window.addEventListener('resize', resizeHandler)

function tick() {
  const elapsedTime = clock.getElapsedTime()

  planeMaterial.uniforms.uTime.value = elapsedTime

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()

const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches
const event = isTouch ? 'touchmove' : 'mousemove'
let timeoutId
window.addEventListener(event, e => {
  if (isTouch && e.touches?.[0]) {
    const touchEvent = e.touches[0]
    mouse.x = (touchEvent.clientX / size.width) * 2 - 1
    mouse.y = (-touchEvent.clientY / size.height) * 2 + 1
  } else {
    mouse.x = (e.clientX / size.width) * 2 - 1
    mouse.y = (-e.clientY / size.height) * 2 + 1
  }

  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    mouse.x = 0
    mouse.y = 0
  }, 1000)
})
