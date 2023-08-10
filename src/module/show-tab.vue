<template>
  <div class="home">
    <div class="convas-container" ref="canvasDom"></div>
    <div class="home-content">
      <div class="header">
        <div class="logo"></div>
      </div>
      <div class="home-content-title">
        <h1>汽车展示台</h1>
      </div>
      <h2>请选择车身颜色</h2>
      <div class="select">
        <div class="select-item" v-for="(item, index) in colors" :key="index" @click="selectColor(index)">
          <div class="select-item-color" :style="{ backgroundColor: item }"></div>
        </div>
      </div>
      <h2>请选择贴膜材质</h2>
      <div class="select">
        <div class="select-item" v-for="(item, index) in materials" :key="index" @click="selectMaterial(index)">
          <button class="select-item-text">{{ item.name }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import * as THREE from "three";
import { onMounted, ref } from 'vue';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

let canvasDom = ref(null);
let controls;

// 搭建场景
const scene = new THREE.Scene();
// 添加相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 6);
// 添加渲染器
const renderer = new THREE.WebGLRenderer({
  // 设置抗锯齿
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

const render = () => {
  renderer.render(scene, camera);
  controls && controls.update();
  requestAnimationFrame(render);
};

// 实现车漆替换
let colors = ["white", "skyblue", "green", "gray", "pink", "purple"];

let selectColor = (index) => {
  bodyMaterial.color.set(colors[index]);
  outlinesMaterial.color.set(colors[index]);
  // glassMaterial.color.set(colors[index]);
};

let materials = [
  { name: "磨砂", value: 1 },
  { name: "冰晶", value: 0 },
];
let selectMaterial = (index) => {
  bodyMaterial.clearcoatRoughness = materials[index].value;
};

// 为汽车模型添加纹理
// 依次为车身，车轮轮毂，车轮胎，车轴，车身线条
let carBody, wheels12, wheels3, carAxle, outlines;
// 依次为前远光灯，转向灯,玻璃
let frontHighLight, turnLight, glasses;
// 依次为后下尾灯外围，后下尾灯内环，后大灯
let backcandle1, backcandle2, backLight;
// 依次为车牌照，座位，内饰，后排座椅外侧
let license, seats, inners, backseatout;

// 创建车身材质
const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x6d6d6d,
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
// 创建车轮毂材质
const wheels12Material = new THREE.MeshPhysicalMaterial({
  color: 0x848994,
  metalness: 0.9,
  roughness: 0.1,
  clearcoat: 1,
  clearcoatRoughness: 0,
});
// 创建车轮胎材质
const wheels3Material = new THREE.MeshPhysicalMaterial({
  color: 0x333333,
  metalness: 0.2,
  roughness: 0.6,
});
// 创建玻璃材质
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1,
  transparent: true,
});
// 创建车轴材质
const axleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x3f3f3f,
  metalness: 0.5,
  roughness: 0.5,
});
// 创建车身线条材质
const outlinesMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x5c5c5c,
  metalness: 1,
  roughness: 0.5,
  clearcoat: 0.8,
  clearcoatRoughness: 0,
});
// 创建前远光灯材质
const frontHighMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xbfbfbf,
  metalness: 0.6,
  roughness: 0.5,
});
// 创建转向灯材质
const turnLightMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xaa7333,
  metalness: 0,
  roughness: 0,
  transmission: 0.2,
  transparent: true,
});
// 创建后下尾灯外围材质
const backcandle1Material = new THREE.MeshPhysicalMaterial({
  color: 0x6d6d6d,
  metalness: 0.6,
  roughness: 0.5,
});
// 创建后下尾灯内环材质
const backcandle2Material = new THREE.MeshPhysicalMaterial({
  color: 0x5c5c5c,
  metalness: 1,
  roughness: 0.5,
});
// 创建后大灯材质
const backLightMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x6c3d3d,
  metalness: 0,
  roughness: 0,
  transmission: 0.3,
});
// 创建座位材质
const seatsMaterial = new THREE.MeshStandardMaterial({
  color: 0x686061,
  metalness: 0.9,
  roughness: 0.6,
});
// 创建内饰材质
const innersMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x685e5b,
  metalness: 0.2,
  roughness: 0.3,
});
// 创建后排座椅外侧材质
const backseatoutMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 1,
  roughness: 0,
  transmission: 1,
  transparent: false,
});
// 创建车牌照材质
const textureLoader = new THREE.TextureLoader()
let licenseMaterial = textureLoader.load("/assets/lisense.jpeg")


onMounted(() => {
  // 渲染模型页

  //渲染器插入到DOM中
  canvasDom.value.appendChild(renderer.domElement);

  // 初始化渲染器，渲染背景
  renderer.setClearColor("#000");
  scene.background = new THREE.Color("#ccc");
  scene.environment = new THREE.Color("#ccc");
  render();

  // 添加网格地面
  const gridHelper = new THREE.GridHelper(10, 10);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // 载入gltf汽车模型
  // 创建加载器，并初始化
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/gltf");
  loader.setDRACOLoader(dracoLoader);
  // 开始载入模型
  loader.load("./model/car.glb", (gltf) => {
    const car = gltf.scene;
    // 迭代找到所有车辆部件，开始材质渲染
    car.traverse((child) => {
      // console.log(child.name);
      // 渲染车身
      if (child.isMesh && child.name.includes("mesh_38")) {
        carBody = child;
        carBody.material = bodyMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_27")) {
        carBody = child;
        carBody.material = bodyMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_29")) {
        carBody = child;
        carBody.material = bodyMaterial;
      }
      // 渲染轮毂
      if (child.isMesh && child.name.includes("mesh_11")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_12")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_14")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_15")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_17")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_18")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_20")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }
      if (child.isMesh && child.name.includes("mesh_21")) {
        wheels12 = child;
        wheels12.material = wheels12Material;
      }

      // 渲染轮胎
      if (child.isMesh && child.name.includes("mesh_13")) {
        wheels3 = child;
        wheels3.material = wheels3Material;
      }
      if (child.isMesh && child.name.includes("mesh_16")) {
        wheels3 = child;
        wheels3.material = wheels3Material;
      }
      if (child.isMesh && child.name.includes("mesh_19")) {
        wheels3 = child;
        wheels3.material = wheels3Material;
      }
      if (child.isMesh && child.name.includes("mesh_22")) {
        wheels3 = child;
        wheels3.material = wheels3Material;
      }

      // 渲染挡风玻璃、前大灯、前雾灯
      if (child.isMesh && child.name.includes("mesh_46")) {
        glasses = child;
        glasses.material = glassMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_23")) {
        glasses = child;
        glasses.material = glassMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_30")) {
        glasses = child;
        glasses.material = glassMaterial;
      }

      // 渲染车轴
      if (child.isMesh && child.name.includes("axle13")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_7")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_24")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_26")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_28")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_31")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_39")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_43")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("mesh_51")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("Antenna3")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("Emblem14")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface2012")) {
        carAxle = child;
        carAxle.material = axleMaterial;
      }

      // 渲染转向灯
      if (child.isMesh && child.name.includes("mesh_37")) {
        outlines = child;
        outlines.material = outlinesMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface185")) {
        outlines = child;
        outlines.material = outlinesMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface196")) {
        outlines = child;
        outlines.material = outlinesMaterial;
      }

      // 渲染前远光
      if (child.isMesh && child.name.includes("mesh_48")) {
        frontHighLight = child;
        frontHighLight.material = frontHighMaterial;
      }

      // 渲染转向灯
      if (child.isMesh && child.name.includes("polySurface99")) {
        turnLight = child;
        turnLight.material = turnLightMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface1010")) {
        turnLight = child;
        turnLight.material = turnLightMaterial;
      }

      // 渲染尾部下尾灯外侧
      if (child.isMesh && child.name.includes("mesh_44")) {
        backcandle1 = child;
        backcandle1.material = backcandle1Material;
      }

      // 渲染尾部下尾灯内侧
      if (child.isMesh && child.name.includes("mesh_50")) {
        backcandle2 = child;
        backcandle2.material = backcandle2Material;
      }

      // 渲染尾灯
      if (child.isMesh && child.name.includes("mesh_47")) {
        backLight = child;
        backLight.material = backLightMaterial;
      }

      // 渲染座位
      if (child.isMesh && child.name.includes("polySurface2237")) {
        seats = child;
        seats.material = seatsMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface2429")) {
        seats = child;
        seats.material = seatsMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface2530")) {
        seats = child;
        seats.material = seatsMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface2631")) {
        seats = child;
        seats.material = seatsMaterial;
      }

      // 渲染内饰
      if (child.isMesh && child.name.includes("mesh_36")) {
        inners = child;
        inners.material = innersMaterial;
      }
      if (child.isMesh && child.name.includes("polySurface2835")) {
        inners = child;
        inners.material = innersMaterial;
      }

      if (child.isMesh && child.name.includes("mesh_40")) {
        backseatout = child;
        backseatout.material = backseatoutMaterial;
      }

      if (child.isMesh && child.name.includes("License_plate2")) {
        license = child;
        license.material = licenseMaterial;
      }
    });
    // 创建限制盒子，调整模型大小
    const box = new THREE.Box3().setFromObject(scene);
    const x = (box.max.x - box.min.x);
    const y = (box.max.y - box.min.y);
    const z = (box.max.z - box.min.z);
    const maxDim = Math.max(x, y, z);
    const scale = 1300 / maxDim;
    car.scale.set(scale, scale, scale);
    // 放置调整、渲染好的模型
    scene.add(car);
  });

  // 添加灯光
  // light1-4 为四周灯光
  const light1 = new THREE.DirectionalLight(0xffffff, 1);
  light1.position.set(0, 0, 10);
  scene.add(light1);
  const light2 = new THREE.DirectionalLight(0xffffff, 1);
  light2.position.set(0, 0, -10);
  scene.add(light2);
  const light3 = new THREE.DirectionalLight(0xffffff, 1);
  light3.position.set(10, 0, 0);
  scene.add(light3);
  const light4 = new THREE.DirectionalLight(0xffffff, 1);
  light4.position.set(-10, 0, 0);
  scene.add(light4);
  // light5-9 为顶部环绕灯光
  const light5 = new THREE.DirectionalLight(0xffffff, 1);
  light5.position.set(0, 10, 0);
  scene.add(light5);
  const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
  light6.position.set(5, 10, 0);
  scene.add(light6);
  const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
  light7.position.set(0, 10, 5);
  scene.add(light7);
  const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
  light8.position.set(0, 10, -5);
  scene.add(light8);
  const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
  light9.position.set(-5, 10, 0);
  scene.add(light9);

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

.home-content {
  position: fixed;
  top: 0;
  right: 20px;
}

.select-item-color {
  width: 50px;
  height: 50px;
  border: 1px solid #ccc;
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
}

.select {
  display: flex;
}
</style>
  