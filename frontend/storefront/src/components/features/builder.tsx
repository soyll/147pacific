import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import truckModel from '/assets/models/truck.glb?url';
import { ProductRow } from '@/components/features/product_row';

export interface AccessoryItem {
    id: string;
    name: string;
    model: string;
    price: number;
    image: string;
    description: string;
    type: 'accessory';
}

export interface SubAccessoryItem {
    id: string;
    name: string;
    model: string;
    price: number;
    image: string;
    description: string;
    type: 'subAccessory';
    compatibleWith: string[]; // IDs of accessories this sub-accessory works with
}

export type ProductItem = AccessoryItem | SubAccessoryItem;

export interface BuilderProps {
    modelPath?: string;
    accessories: AccessoryItem[];
    subAccessories: SubAccessoryItem[];
    colors: { name: string; value: string; }[];
}

export const Builder: React.FC<BuilderProps> = React.memo(({
    modelPath = truckModel,
    accessories,
    subAccessories,
    colors
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const controlsRef = useRef<OrbitControls>();
    const modelRef = useRef<THREE.Group>();

    const [selectedAccessories, setSelectedAccessories] = useState<Set<string>>(new Set());
    const [selectedSubAccessories, setSelectedSubAccessories] = useState<Set<string>>(new Set());
    const [selectedColor, setSelectedColor] = useState(colors[0]?.value || '#6d6d6d');
    const [totalPrice, setTotalPrice] = useState(0);
    const [modelName] = useState('Bed Rack Grey');
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingError, setLoadingError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Initializing 3D scene...');
        console.log('Canvas ref:', canvasRef.current);
        console.log('Model path:', modelPath);

        if (!canvasRef.current) {
            console.error('Canvas ref is null!');
            return;
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111214);
        sceneRef.current = scene;
        console.log('Scene created');

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            canvasRef.current.clientWidth / canvasRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(-8, 5, 6); // Позиция для обзора левой стороны
        cameraRef.current = camera;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });

        // Получаем размеры родительского контейнера
        const parentElement = canvasRef.current.parentElement;
        const canvasWidth = parentElement?.clientWidth || 800;
        const canvasHeight = parentElement?.clientHeight || 600;
        console.log('Canvas dimensions:', canvasWidth, 'x', canvasHeight);

        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;
        console.log('Renderer created');

        // Controls setup
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enablePan = true;
        controls.maxDistance = 20;
        controls.minDistance = 2;

        // Настройка для лучшего обзора левой стороны
        controls.target.set(0, 0, 0); // Центр вращения
        controls.autoRotate = false;
        controls.autoRotateSpeed = 0.5;

        controlsRef.current = controls;

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        scene.add(directionalLight);

        // Load model
        const loader = new GLTFLoader();

        // Setup DRACO loader for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({ type: 'js' });
        loader.setDRACOLoader(dracoLoader);

        setIsLoading(true);
        setLoadingProgress(0);
        setLoadingError(null);

        loader.load(
            modelPath,
            (gltf: any) => {
                console.log('Model loaded successfully:', gltf);
                const model = gltf.scene;

                // Set up model
                model.traverse((child: any) => {
                    console.log('Processing child:', child);
                    if (child instanceof THREE.Mesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;

                        // Apply initial color
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach((mat: any) => {
                                    if (mat instanceof THREE.MeshStandardMaterial) {
                                        mat.color.setHex(parseInt(selectedColor.replace('#', '0x')));
                                    }
                                });
                            } else if (child.material instanceof THREE.MeshStandardMaterial) {
                                child.material.color.setHex(parseInt(selectedColor.replace('#', '0x')));
                            }
                        }
                    }
                });

                // Position and scale model to fill canvas
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                console.log('Model size:', size, 'Max dimension:', maxDim);

                // Масштабируем модель так, чтобы она заполняла большую часть экрана
                const scale = 6 / maxDim; // Увеличиваем масштаб для заполнения canvas
                model.scale.setScalar(scale);

                // Center model
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center.multiplyScalar(scale));

                // Настраиваем камеру для обзора левой стороны модели (как на чертеже)
                const distance = maxDim * 0.5; // Расстояние от модели
                camera.position.set(distance * 1.5, distance * 0.2, -distance + 2.75); // Левая перспектива
                camera.lookAt(model.position);

                console.log('Model positioned at:', model.position);
                console.log('Model scale:', model.scale);

                scene.add(model);
                modelRef.current = model;

                setIsLoading(false);
                setLoadingProgress(100);
                console.log('Model added to scene');
            },
            (progress: any) => {
                if (progress.lengthComputable) {
                    const percentComplete = (progress.loaded / progress.total) * 100;
                    setLoadingProgress(percentComplete);
                } else {
                    // If not computable, show incremental progress
                    setLoadingProgress(prev => Math.min(prev + 10, 90));
                }
            },
            (error: any) => {
                console.error('Error loading 3D model:', error);
                console.error('Model path attempted:', modelPath);
                setLoadingError(`Failed to load 3D model: ${error.message || 'Unknown error'}`);
                setIsLoading(false);

                // Create fallback geometry
                console.log('Creating fallback geometry...');
                const geometry = new THREE.BoxGeometry(2, 1, 4);
                const material = new THREE.MeshStandardMaterial({
                    color: selectedColor,
                    metalness: 0.7,
                    roughness: 0.3
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scene.add(mesh);
                modelRef.current = mesh as any;
                console.log('Fallback geometry created and added to scene');
            }
        );

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        console.log('Starting animation loop...');
        animate();

        // Handle resize
        const handleResize = () => {
            if (!canvasRef.current || !camera || !renderer) return;

            const parentElement = canvasRef.current.parentElement;
            const width = parentElement?.clientWidth || 800;
            const height = parentElement?.clientHeight || 600;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (controlsRef.current) controlsRef.current.dispose();
            if (rendererRef.current) rendererRef.current.dispose();
            if (sceneRef.current) {
                sceneRef.current.clear();
            }
            // Clean up DRACO loader
            dracoLoader.dispose();
        };
    }, [modelPath, selectedColor]);

    // Update model color when color changes
    useEffect(() => {
        if (!modelRef.current) return;

        modelRef.current.traverse((child: any) => {
            if (child instanceof THREE.Mesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((mat: any) => {
                        if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.color.setHex(parseInt(selectedColor.replace('#', '0x')));
                        }
                    });
                } else if (child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.color.setHex(parseInt(selectedColor.replace('#', '0x')));
                }
            }
        });
    }, [selectedColor]);

    // Calculate total price
    useEffect(() => {
        let total = 18563; // Base price
        selectedAccessories.forEach(id => {
            const accessory = accessories.find(a => a.id === id);
            if (accessory) total += accessory.price;
        });
        selectedSubAccessories.forEach(id => {
            const subAccessory = subAccessories.find(s => s.id === id);
            if (subAccessory) total += subAccessory.price;
        });
        setTotalPrice(total);
    }, [selectedAccessories, selectedSubAccessories, accessories, subAccessories]);

    const handleAccessoryToggle = useCallback((accessoryId: string) => {
        setSelectedAccessories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accessoryId)) {
                newSet.delete(accessoryId);
                // Remove dependent sub-accessories
                setSelectedSubAccessories(subPrev => {
                    const newSubSet = new Set(subPrev);
                    subAccessories.forEach(sub => {
                        if (sub.compatibleWith.includes(accessoryId)) {
                            newSubSet.delete(sub.id);
                        }
                    });
                    return newSubSet;
                });
            } else {
                newSet.add(accessoryId);
            }
            return newSet;
        });
    }, [subAccessories]);

    const handleSubAccessoryToggle = useCallback((subAccessoryId: string) => {
        setSelectedSubAccessories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(subAccessoryId)) {
                newSet.delete(subAccessoryId);
            } else {
                newSet.add(subAccessoryId);
            }
            return newSet;
        });
    }, []);

    const isSubAccessoryEnabled = useCallback((subAccessory: SubAccessoryItem) => {
        return subAccessory.compatibleWith.some(accessoryId =>
            selectedAccessories.has(accessoryId)
        );
    }, [selectedAccessories]);

    const getSelectedAccessoryNames = () => {
        const accessoryNames = Array.from(selectedAccessories)
            .map(id => accessories.find(a => a.id === id)?.name + ' | ' + accessories.find(a => a.id === id)?.model)
            .filter(Boolean);

        const subAccessoryNames = Array.from(selectedSubAccessories)
            .map(id => subAccessories.find(s => s.id === id)?.name + ' | ' + subAccessories.find(s => s.id === id)?.model)
            .filter(Boolean);

        return [...accessoryNames, ...subAccessoryNames];
    };

    return (
        <div className="builder">
            <div className="builder__wrapper">
                <div className="builder-main">
                    <div className="builder-main__wrapper">
                        <div className="builder-canvas">
                            {isLoading && (
                                <div className="builder-progress">
                                    <div className="builder-progress__text">
                                        {loadingError ? 'Loading Error' : 'Loading 3D Model...'}
                                    </div>
                                    <div className="builder-progress__bar">
                                        <div
                                            className="builder-progress__bar-fill"
                                            style={{ width: `${loadingProgress}%` }}
                                        />
                                    </div>
                                    <div className="builder-progress__text">
                                        {loadingError ? loadingError : `${Math.round(loadingProgress)}%`}
                                    </div>
                                </div>
                            )}
                            <canvas
                                ref={canvasRef}
                                className="builder-canvas__3d"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: isLoading ? 'none' : 'block'
                                }}
                            />
                        </div>
                        <div className='container builder-canvas__container'>
                            <div className="builder-canvas__360">
                                <svg className="builder-canvas__360-icon" width="55" height="42" viewBox="0 0 55 42" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7002 32.7766L25.8313 37.4829L17.7002 42V38.4666C13.1025 37.8004 9.14632 36.6834 6.27913 35.2704C2.92832 33.6189 0.960938 31.4903 0.960938 29.0787C0.960938 26.0503 4.13573 23.4365 9.26805 21.6583C14.0072 20.0166 20.5197 19 27.6819 19C34.8441 19 41.3565 20.0166 46.0957 21.6583C51.228 23.4365 54.4028 26.0503 54.4028 29.0787C54.4028 31.5955 52.2545 33.8064 48.6257 35.4908C45.2584 37.0536 40.5126 38.2264 35.0382 38.7874C34.3506 38.8581 33.7354 38.358 33.6646 37.6688C33.5939 36.9812 34.094 36.366 34.7832 36.2952C39.9797 35.7639 44.4474 34.6651 47.5762 33.2142C50.2871 31.9558 51.8926 30.5164 51.8926 29.0771C51.8926 27.2314 49.3659 25.4335 45.2814 24.0188C40.8055 22.4676 34.5842 21.5086 27.6819 21.5086C20.7796 21.5086 14.5583 22.4676 10.0823 24.0188C5.99784 25.4351 3.47116 27.2331 3.47116 29.0771C3.47116 30.4391 4.92039 31.8061 7.38784 33.0234C9.94907 34.2851 13.5137 35.2984 17.7018 35.93V32.7766H17.7002Z" fill="currentColor" />
                                    <path d="M36.5092 0.423828C39.0212 0.423828 40.1892 2.66383 40.1892 5.71983C40.1892 9.07983 38.8772 11.1758 36.3812 11.1758C33.9972 11.1758 32.7172 8.99983 32.7012 5.83183C32.7012 2.58383 34.0772 0.423828 36.5092 0.423828ZM36.4612 1.92783C35.4212 1.92783 34.6852 3.22383 34.6852 5.81583C34.6852 8.35983 35.3732 9.67183 36.4452 9.67183C37.6132 9.67183 38.2052 8.26383 38.2052 5.76783C38.2052 3.35183 37.6452 1.92783 36.4612 1.92783Z" fill="currentColor" />
                                    <path d="M30.5858 0.456154V2.00815C30.2978 1.99215 29.9778 2.00815 29.5938 2.05615C27.4018 2.31215 26.3618 3.64015 26.1058 5.08015H26.1538C26.6658 4.48815 27.4498 4.07215 28.4898 4.07215C30.2818 4.07215 31.6738 5.35215 31.6738 7.46415C31.6738 9.44815 30.2178 11.1762 28.0098 11.1762C25.4818 11.1762 24.0898 9.25616 24.0898 6.68016C24.0898 4.68016 24.8098 3.06415 25.8978 2.04015C26.8418 1.12815 28.1058 0.616154 29.5938 0.504155C30.0258 0.440155 30.3458 0.440155 30.5858 0.456154ZM28.0098 9.70416C29.0178 9.70416 29.6738 8.82416 29.6738 7.57616C29.6738 6.36016 29.0178 5.51215 27.8658 5.51215C27.1298 5.51215 26.4738 5.96015 26.1698 6.58415C26.0898 6.74415 26.0418 6.93616 26.0418 7.20816C26.0738 8.58416 26.7138 9.70416 28.0098 9.70416Z" fill="currentColor" />
                                    <path d="M15.6406 10.4558L16.0886 8.96783C16.4886 9.20783 17.4646 9.60783 18.4566 9.60783C19.9606 9.60783 20.5526 8.75983 20.5526 7.94383C20.5526 6.71183 19.3846 6.18383 18.1846 6.18383H17.2886V4.74383H18.1846C19.0806 4.74383 20.2326 4.32783 20.2326 3.30383C20.2326 2.58383 19.7206 1.99183 18.5686 1.99183C17.7206 1.99183 16.8726 2.35983 16.4406 2.64783L15.9926 1.22383C16.5846 0.823828 17.7526 0.423828 18.9846 0.423828C21.1446 0.423828 22.2326 1.60783 22.2326 2.96783C22.2326 4.05583 21.5926 4.95183 20.3126 5.39983V5.43183C21.5766 5.67183 22.5846 6.61583 22.6006 8.02383C22.6006 9.78383 21.1286 11.1758 18.5526 11.1758C17.2886 11.1758 16.2006 10.8238 15.6406 10.4558Z" fill="currentColor" />
                                    <path d="M43.7229 0.012207C44.5929 0.012207 45.1749 0.624207 45.1749 1.51221C45.1749 2.58621 44.4189 3.06621 43.6749 3.06621C42.8529 3.06621 42.2109 2.50221 42.2109 1.56021C42.2109 0.600207 42.8409 0.012207 43.7229 0.012207ZM43.7049 0.546207C43.1829 0.546207 42.9729 1.05621 42.9729 1.54221C42.9729 2.10621 43.2549 2.53221 43.6989 2.53221C44.1189 2.53221 44.4129 2.12421 44.4129 1.53021C44.4129 1.07421 44.2089 0.546207 43.7049 0.546207Z" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="builder-colors">
                                <div className="builder-colors__wrapper">
                                    <p className="text text--base text--opacity">
                                        Color {colors.find(c => c.value === selectedColor)?.name || 'Dark grey metal'}
                                    </p>
                                    <div className="builder-colors__list">
                                        {colors.map((color) => (
                                            <label
                                                key={color.value}
                                                className="builder-color"
                                                style={{ '--builder-color': color.value } as React.CSSProperties}
                                            >
                                                <input
                                                    type="radio"
                                                    name="builder-color"
                                                    className="builder-color__input"
                                                    checked={selectedColor === color.value}
                                                    onChange={() => setSelectedColor(color.value)}
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="builder-result">
                                <div className="builder-result__wrapper">
                                    <div className="builder-result__header">
                                        <p className="text text--big text--semibold">
                                            {modelName}
                                        </p>
                                        <p className="text text--big text--semibold">
                                            {totalPrice.toLocaleString()} $
                                        </p>
                                    </div>
                                    <a href="#" className="button button--base button--accent builder-result__button">
                                        Add to Cart
                                        <svg className="button__icon">
                                            <use xlinkHref="/assets/images/sprite.svg#shop"></use>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div className="builder-footer">
                                <div className="builder-footer__wrapper">
                                    <p className="text text--middle text--grey--dark text--semibold">
                                        R G822-PXXX
                                    </p>
                                    {getSelectedAccessoryNames().length > 0 && (
                                        <div className="builder-footer__row">
                                            <p className="text text--semibold text--small text--grey--dark">
                                                Add:
                                            </p>
                                            <p className="text text--semibold text--small builder-footer__text">
                                                {getSelectedAccessoryNames().join(', ')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product-list">
                    {accessories.map((accessory) => (
                        <ProductRow
                            key={accessory.id}
                            product={accessory}
                            isSelected={selectedAccessories.has(accessory.id)}
                            showCheckbox={true}
                            showBuildButton={false}
                            onChange={handleAccessoryToggle}
                        />
                    ))}

                    {subAccessories.map((subAccessory) => (
                        <ProductRow
                            key={subAccessory.id}
                            product={subAccessory}
                            isSelected={selectedSubAccessories.has(subAccessory.id)}
                            isDisabled={!isSubAccessoryEnabled(subAccessory)}
                            showCheckbox={true}
                            showBuildButton={false}
                            onChange={handleSubAccessoryToggle}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});

Builder.displayName = 'Builder';