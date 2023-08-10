<template>
    <div class="home">
        <div class="convas-container" ></div>
        <div class="pages" ref="pages">
            <div class="header">
                <div class="logo"></div>
            </div>
            <div class="page">
                <h2 class="title">选配您的爱车</h2>
                <router-link to="/model-tab" class="pl">逸兴遄飞的ThreeJS实验项目</router-link>
            </div>
        </div>
    </div>
</template>
  


<script setup>
import * as THREE from "three";
// import { ref } from "vue";

// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 5.5);

// 渲染器
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 加载纹理
const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load("/assets/cat.jpg");
// const depthTexture = textureLoader.load("/assets/cat_depth.jpg");

const texture = textureLoader.load("/assets/car-source.jpg");
const depthTexture = textureLoader.load("/assets/car.jpg");

// 创建平面
const geometry = new THREE.PlaneGeometry(19.2, 12.8);
// const material = new THREE.MeshBasicMaterial({map: texture });
// 鼠标坐标
const mouse = new THREE.Vector2();

// 着色器材质
const material = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uTexture: { value: texture },
        uDepthTexture: { value: depthTexture },
        uMouse: { value: mouse },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
        vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform sampler2D uTexture;
    uniform sampler2D uDepthTexture;
    uniform vec2 uMouse;
    varying vec2 vUv;
    uniform float uTime;
    void main() {
        vec4 color = texture2D(uTexture, vUv);
    vec4 depth = texture2D(uDepthTexture, vUv);
    float depthValue = depth.r;
    float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
    float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
    vec4 newColor = texture2D(uTexture, vec2(x, y));
    gl_FragColor = newColor;
    }
    `,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// 渲染
requestAnimationFrame(function animate() {
    material.uniforms.uMouse.value = mouse;
    material.uniforms.uTime.value = performance.now() / 1000;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
});

window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
</script>

<style>
* {
    margin: 0;
    padding: 0;
}

.header .logo {
    height: 100px;
    width: 300px;
    background-image: url("../assets/icon.png");
    background-size: 60%;
    background-position: center;
    background-repeat: no-repeat;
}

.pages {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
}

.pages .page {
    width: 100vw;
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    color: #000;
    padding: 5%;
    box-sizing: border-box;
    user-select: none;
}

.pages .page .title {
    font-size: 70px;
    font-weight: 900;
    margin-bottom: 20px;
    user-select: none;
}

.pages .page .pl {
    font-size: 30px;
    /* user-select: none; */
}
</style>
  