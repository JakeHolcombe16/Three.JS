import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DirectionalLightHelper } from 'three'


/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()



/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */

// scene.environment = enviromentMap does the same thing as this function but
// using this function we can use dat gui to control the intensity
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMap = enviromentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
            
        }
        
    })
}

/**
 *  Environment Map
 */
// If you can see image in folder use sRGBencoding, if you see normal map or a map use linearEncoding
const enviromentMap = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
    
])
enviromentMap.encoding = THREE.sRGBEncoding
scene.background = enviromentMap
scene.environment = enviromentMap


debugObject.envMapIntensity = 2.5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(() => {
    updateAllMaterials()
})

/**
 * Models
 */
gltfLoader.load(
    '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        // gltf arg is a group
        // See here
        // console.log(gltf);
        gltf.scene.scale.set(5, 5, 5)
        gltf.scene.position.set(0, -1, 0)
        // gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
    }
)
gltfLoader.load(
    '/models/hamburger.glb',
    (gltf) => {
        // gltf arg is a group
        // See here
        // console.log(gltf);
        gltf.scene.scale.set(0.3, 0.3, 0.3)
        gltf.scene.position.set(-5, -1, 0)
        // gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        gui.add(gltf.scene.rotation, 'y').min(- Math.PI).max(Math.PI).step(0.001).name('rotation')

        updateAllMaterials()
    }
)


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(0.25, 3, - 2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set (1024, 1024)
// for flat surfaces use bias instead of normalbias for the shadow acne
directionalLight.shadow.normalBias = 0.05
scene.add(directionalLight)

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(directionalLightCameraHelper)

gui.add(directionalLight, 'intensity').min(0).max(10).step(0.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001).name('LightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001).name('LightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001).name('LightZ')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmatic: THREE.ACESFilmicToneMapping,

}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()