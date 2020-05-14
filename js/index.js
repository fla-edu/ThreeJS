
// ================================================================================================
// Inicializa as variáveis e anexa o canvas a div
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth  / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
let canvas = document.getElementById('canvas');

// ================================================================================================
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
canvas.appendChild(renderer.domElement);
camera.position.z = 5;

// ================================================================================================
// Controle do objeto
controls = new THREE.OrbitControls(camera, renderer.domElement);

// ================================================================================================
// Cria a forma do objeto
let geometry = new THREE.BoxGeometry(1,1,1);
// Cria a textura do objeto
let texture = new THREE.TextureLoader().load('img/2.jpg');
// Array contendo as 6 faces do cubo
let cubeMaterials = [
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), //Right 
    new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}), // Left
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Top
    new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}), // Bottom
    new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Front
    new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) // Back
];

// Adiciona a geomtria, as texturas de cada face ao ambiente
let cube = new THREE.Mesh(geometry, cubeMaterials);
// scene.add(cube);

/*
    let geometry2 = new THREE.SphereBufferGeometry(1,4,10);
    let material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, wireframe: true});
    let sphere = new THREE.Mesh(geometry2, material);
    scene.add(sphere);
*/
// ================================================================================================
/* Lights
    - MeshBasicMaterial não é afetado por luz
    - AmbientLight ilumina todo o objeto
    - PointLight ilumina de acordo com um ponto, que está a uma determinada distância do objeto
*/

const addLight = () => {
    let ambientLight = new THREE.AmbientLight(0xFFFFFF , 0.5);
    // scene.add(ambientLight);
    let pointLight = new THREE.PointLight(0xAAAAAA, 5, 100);
    pointLight.position.set(0, 0, 1);
    // scene.add(pointLight);
    
    let directionalLight = new THREE.DirectionalLight(0xAAAAAA, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);
}

// ================================================================================================
/* Object Loader
*/

const loadOBJ = (filePath) => {
    let loader = new THREE.OBJLoader();
    loader.load(filePath, function(object){
        scene.add(object);
    },
    function(xhr){
        console.log((xhr.loaded/xhr.total * 100) + '% loaded');
    },
    function(error){
        console.log(`Houve um erro ao carregar o objeto: ${error}`)
    }
    );
}


// ================================================================================================
// Atualiza a altura e a largura do objeto e o aspecto da câmera, quando o tamanho da tela muda
window.addEventListener(('resize'), function() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

window.onload = () => {
    let btn_loadOBJ = document.getElementById('btn_loadOBJ');
    let input_OBJ = document.getElementById('input_OBJ');
    
    // Ao clicar no botão "Carregar", dispara o click do Input File
    btn_loadOBJ.addEventListener('click', () => {
        document.getElementById('input_OBJ').click();
    });

    // Ao selecionar um arquivo no input, dispara o evento para carregar o arquivo selecionado
    input_OBJ.addEventListener('change', (event) => {

        let selectedFile = event.target.files[0];
        let reader = new FileReader();

        reader.onload = (event) => {
            loadOBJ(event.target.result);
            addLight();
        }

        reader.readAsDataURL(selectedFile);
    });
};

// game logic
let update = function() {
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.005;
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
// ================================================================================================
