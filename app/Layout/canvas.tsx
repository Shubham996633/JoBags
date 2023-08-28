import React, { Component, RefObject } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import SwatchWrapper from "./swatchWrapper";
import gsap from 'gsap'
type CanvasProps = {
  activeData: any;
  swatchData: any;
  handleSwatchClick: any;
  handleLoading:any;
  condition:any
};
type MeshItem = {
  color: string;
  // ... other properties if present ...
};

class Canvas extends Component<CanvasProps> {
  private containerRef: RefObject<HTMLDivElement> = React.createRef();
  private camera: THREE.PerspectiveCamera | undefined;
  private sizes: { width: number; height: number } = { width: 0, height: 0 };
  private canvas: HTMLCanvasElement | null = null;
  private scene: THREE.Scene | undefined;
  private controls: OrbitControls | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private manager: THREE.LoadingManager = new THREE.LoadingManager();


  componentDidMount(): void {
    this.initialStep();
  }

  componentDidUpdate(prevProps: Readonly<CanvasProps>, prevState: Readonly<{}>, snapshot?: any): void {
    const {activeData} = this.props
    if(prevProps.activeData.id !== activeData.id){
      this.applyMaterial(activeData);
    }
  }
  
  initialStep = () => {
    const {handleLoading} = this.props
    if (this.containerRef.current) {
      const containerElement = this.containerRef.current;
      const item = containerElement.getBoundingClientRect();
      this.sizes = {
        width: item.width,
        height: item.height,
      };

      this.canvas = document.querySelector('canvas.webgl');

      if (this.canvas) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
          45,
          this.sizes.width / this.sizes.height,
          10,
          5000
        );

        this.camera.position.set(150, 20, 100);
        this.scene.add(this.camera);
        this.manager = new THREE.LoadingManager()
        this.manager.onProgress = (url, itemsLoaded,itemsTotal) => {
          const ProgressVal = (itemsLoaded/itemsTotal) * 100;
          if(ProgressVal === 100){
            handleLoading()
          }
        }

        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.touches = {
          ONE:THREE.TOUCH.ROTATE,
          TWO:THREE.TOUCH.DOLLY_PAN
        }

        this.controls.enableDamping = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 2,
        this.controls.enablePan = false;
        this.controls.enableZoom = false;
        this.controls.maxPolarAngle = Math.PI/1.9

        // this.controls.minDistance=100
        // this.controls.maxDistance=150
        // this.controls.minPolarAngle = -Math.PI/1.9

        // Add your further scene setup here

        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas,
          antialias: true,
          alpha: true,
        });

        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;  
        this.renderer.toneMappingExposure = 1;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        // this.renderer.shadowMap.enabled = true;

        this.loadHDR();
        this.addModel()
        window.addEventListener('resize', this.resize);
        const render = () => {
          if (this.scene && this.camera && this.renderer) {
            this.controls?.update();
            this.renderer.render(this.scene, this.camera);
          }
          requestAnimationFrame(render);
        };
        render()
        
      }
    }
  };
  loadHDR = () => {
    new RGBELoader(this.manager)
      .setDataType(THREE.HalfFloatType)
      .load('default.hdr', (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.needsUpdate = true;
        // this.scene.background = texture;
        if(this.scene){
          this.scene.environment = texture;
        }
        texture.dispose();
      });
  };
  addModel = () => {
    const THREE_PATH = `https://unpkg.com/three@0.${THREE.REVISION}.x`;
    const DRACO_LOADER = new DRACOLoader(this.manager).setDecoderPath(
      `${THREE_PATH}/examples/js/libs/draco/gltf/`
    );

    const bag = 'bag.glb'
    const GLtfLoader = new GLTFLoader(this.manager).setDRACOLoader(DRACO_LOADER);
    GLtfLoader.load(bag, (gltf) => {
      // gltf.scene.traverse((child) => {
      //   if (child instanceof THREE.Mesh) {
      //     child.castShadow = true;
      //     child.receiveShadow = true;
      //     child.material.needsUpadate = true
      //   }
      // });
    
      
      this.scene?.add(gltf.scene);
    });
  }
  resize = () => {
    this.sizes.width = this.containerRef.current?.offsetWidth || 0;
    this.sizes.height = this.containerRef.current?.offsetHeight || 0;
    if (this.camera) {
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();
    }
    this.renderer?.setSize(this.sizes.width, this.sizes.height);
  }

  applyMaterial = (data: any) => {
    this.scene?.traverse((element) => {
      if (element instanceof THREE.Mesh) {
        Object.entries(data.itemList).forEach((mesh) => {
          const [meshName, meshData] = mesh; // Destructure the array
          if (meshName === element.name) {
            const meshItem: MeshItem = meshData as MeshItem; // Type assertion
            const value = new THREE.Color(meshItem.color).convertSRGBToLinear();
            gsap.to(element.material.color, {
              r: value.r,
              g: value.g,
              b: value.b,
              ease: 'power3.inOut',
              duration: 0.8,
            });
  
            element.material.needsUpdate = true;
          }
        });
      }
    });

    gsap.to('.highlight',{
      backgroundColor:data.buttonColor.background,
      ease:'power3.inOut',
      duration:0.8
  
    })
  };


  render() {
    const { condition, activeData, swatchData, handleSwatchClick } = this.props;

    return (
      <div
      ref={this.containerRef}
      className="w-full h-3/5 relative z-10 lg:w-1/2 lg:h-full"
      id="container"
    >
 <canvas className="webgl w-full h-full relative z-10"></canvas>
 <SwatchWrapper
        activeData={activeData}
        swatchData={swatchData}
        handleSwatchClick={handleSwatchClick}
        condition={condition}
      />
      <div className="highlight w-2/5 h-1/2 bg-[#D7B172] absolute inset-x-40 top-0 -z-10 rounded-br-full rounded-bl-full md:inset-x-60  lg:inset-x-40"></div>
    </div>

    );
  }
}

export default Canvas;
