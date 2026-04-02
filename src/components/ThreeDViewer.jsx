import React, { useEffect } from 'react'
import '../styles/ThreeDViewer.css'

export default function ThreeDViewer({ modelUrl, project }) {
  const containerRef = React.useRef(null)
  const sceneRef = React.useRef(null)

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return

    const loadThreeJS = async () => {
      try {
        const THREE = await import('three')
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

        initScene(THREE, OrbitControls, GLTFLoader)
      } catch (error) {
        console.error('Failed to load Three.js:', error)
        containerRef.current.innerHTML = '<div class="viewer-error"><p>Failed to load 3D viewer</p></div>'
      }
    }

    const initScene = (THREE, OrbitControls, GLTFLoader) => {
      const container = containerRef.current
      const width = container.clientWidth
      const height = container.clientHeight

      // Scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x111111)

      // Camera
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
      camera.position.set(0, 2, 5)

      // Renderer
      const canvas = document.createElement('canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.outputEncoding = THREE.sRGBEncoding
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.0
      container.innerHTML = ''
      container.appendChild(canvas)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
      directionalLight.position.set(5, 10, 7.5)
      directionalLight.castShadow = true
      directionalLight.shadow.camera.left = -10
      directionalLight.shadow.camera.right = 10
      directionalLight.shadow.camera.top = 10
      directionalLight.shadow.camera.bottom = -10
      directionalLight.shadow.mapSize.width = 2048
      directionalLight.shadow.mapSize.height = 2048
      scene.add(directionalLight)

      const fillLight = new THREE.DirectionalLight(0xffffff, 0.3)
      fillLight.position.set(-5, 5, -5)
      scene.add(fillLight)

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.screenSpacePanning = false
      controls.minDistance = 0.5
      controls.maxDistance = 50
      controls.autoRotate = false
      controls.autoRotateSpeed = 1.0

      // Load model
      const loader = new GLTFLoader()
      loader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())

          model.position.x = -center.x
          model.position.y = -center.y
          model.position.z = -center.z
          model.rotation.y = Math.PI / 2

          scene.add(model)

          const maxDim = Math.max(size.x, size.y, size.z)
          const fov = camera.fov * (Math.PI / 180)
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
          cameraZ *= 1.5
          camera.position.z = cameraZ
          camera.updateProjectionMatrix()

          controls.target.set(0, 0, 0)
          controls.update()
        },
        undefined,
        (error) => {
          console.error('Error loading model:', error)
          containerRef.current.innerHTML = '<div class="viewer-error"><p>Failed to load 3D model</p></div>'
        }
      )

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      // Handle resize
      const handleResize = () => {
        const w = container.clientWidth
        const h = container.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
      }

      window.addEventListener('resize', handleResize)
      sceneRef.current = { scene, camera, renderer, controls }

      return () => {
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
      }
    }

    loadThreeJS()
  }, [modelUrl])

  return <div ref={containerRef} className="three-d-viewer" />
}
