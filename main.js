import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector('#webgl');

const sizes = {
    width:window.innerWidth,
    height:window.innerHeight,
}

//①シーンの作成
const scene = new THREE.Scene()

//⑥背景
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load('./bg/scene-bg.jpg')
scene.background = bgTexture;

//②カメラの作成
const camera = new THREE.PerspectiveCamera(40,sizes.width / sizes.height,0.1,1000)
camera.position.set(0,0,20);
// //③レンダラーの作成
const renderer = new THREE.WebGL1Renderer({
  canvas:canvas,
  alpha:true
});
//その領域(レンダラー)
renderer.setSize(sizes.width,sizes.height);
//粗さの軽減
renderer.setPixelRatio(window.devicePixelRatio);
const atai = sizes.width / 1000;
console.log(atai)
//⑦オブジェクト
const geometry = new THREE.BoxGeometry(5 * atai,5 * atai,5* atai);

let textures = new THREE.TextureLoader().load('./bg/christie.jpg') // 画像テクスチャ

const boxMaterial =  new THREE.MeshBasicMaterial({
  map: textures,
}) // 画像テクスチャのマテリアル
// const boxMaterial = new THREE.MeshNormalMaterial();

const box = new THREE.Mesh(geometry,boxMaterial)
box.position.set(0,0.5,0.15)
box.rotation.set(1,1,0)
scene.add(box);

//⑧オブジェクト②
const torusGeometry = new THREE.TorusGeometry(8 * atai,2 * atai,16 * atai,100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry,torusMaterial)
torus.position.set(0,1,1)
scene.add(torus);

//⑫線形補間でなめらかに移動させる
let lerp = (x,y,a) =>{
  return (1-a) * x + a * y;
}
//⑬線形補間でなめらかに移動させる
//→各区間におけるスクロール位置を算出
let scaleParcent = (start,end)=>{
  return (scrollParsent - start) / (end - start);
}

//⑨スクロールアニメーション
const animationcripts = [];

animationcripts.push({
  start:0,
  end:40,
  function(){
    //カメラはボックスの方向を向いていてほしい
    camera.lookAt(box.position);
    camera.position.set(0,1,10)
    box.position.z = lerp(-15,-11,scaleParcent(0,40))
    torus.position.z = lerp(10,-40,scaleParcent(0,40))
  }
})


animationcripts.push({
  start:40,
  end:60,
  function(){
    //カメラはボックスの方向を向いていてほしい
    camera.lookAt(box.position);
    camera.position.set(0,1,10)
    //box.rotation.z= lerp(1,Math.PI,scaleParcent(40,60))
    box.rotation.z= lerp(1,Math.PI,scaleParcent(40,60))
  }
})


animationcripts.push({
  start:60,
  end:80,
  function(){
    //カメラはボックスの方向を向いていてほしい
    camera.lookAt(box.position);
    camera.position.x = lerp(0,-15,scaleParcent(60,80))
    camera.position.y = lerp(1,-15,scaleParcent(60,80))
    camera.position.z = lerp(10,25,scaleParcent(60,80))
   
  }
})

animationcripts.push({
  start:80,
  end:100,
  function(){
    //カメラはボックスの方向を向いていてほしい
    camera.lookAt(box.position);
      box.rotation.x += 0.02
      box.rotation.y += 0.02
   
  }
})


//⑪スクロール率取得
let scrollParsent = 0;
document.body.onscroll = ()=>{
  scrollParsent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight )) * 100
  // console.log(scrollParsent);
}
//⑩アニメーション開始
let playScrollAnimation =() =>{
  animationcripts.forEach((animation)=>{
   
    if(scrollParsent >= animation.start && scrollParsent < animation.end){
      animation.function();
    }
  })
}

//④アニメーション
const tick = ()=>{
  window.requestAnimationFrame(tick)
  playScrollAnimation();
  renderer.render(scene,camera)
}
tick()

  //⑤ブラウザのりサイズ
  window.addEventListener('resize',()=>{
     //大きさのアプデ
     sizes.width = window.innerWidth;
     sizes.height = window.innerHeight;

      //レンダラーのアプデ
      renderer.setSize(sizes.width,sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio)

        //カメラのアプデ
        camera.aspect =  sizes.width / sizes.height;
        camera.updateProjectionMatrix();

  })
