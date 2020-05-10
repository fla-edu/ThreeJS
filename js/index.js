// Inicializa as variáveis e anexa o canvas a div
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth  / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let canvas = document.getElementById('canvas');

camera.position.z = 3;
// Controle do objeto
controls = new THREE.OrbitControls(camera, renderer.domElement);

renderer.setSize(canvas.clientWidth, canvas.clientHeight);
canvas.appendChild(renderer.domElement);

// Cria a forma do objeto
let geometry = new THREE.BoxGeometry(1,1,1);
// Cria a textura do objeto
let texture = new THREE.TextureLoader().load('img/2.jpg');
// Array contendo as 6 faces do cubo
let cubeMaterials = [
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), //Right 
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Left
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Top
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Bottom
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Front
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}) // Back
];

let cube = new THREE.Mesh(geometry, cubeMaterials);
scene.add(cube);

// let geometry2 = new THREE.SphereBufferGeometry(1,4,10);
// let material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true});
// let sphere = new THREE.Mesh(geometry2, material);
// scene.add(sphere);

// Atualiza a altura e a largura do objeto e o aspecto da câmera, quando o tamanho da tela muda
window.addEventListener(('resize'), function() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// camera.position.z = 8;
// game logic
let update = function() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.005;
};

//draw Scene
let render = function() {
    renderer.render(scene, camera);
};

// run game loop (update, render, repeat)
let GameLoop = function() {
    requestAnimationFrame(GameLoop);

    update();
    render();
};

GameLoop();