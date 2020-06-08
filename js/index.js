
// ================================================================================================
// Inicializa as variáveis e anexa o canvas a div
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth  / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({alpha: true});
let canvas = document.getElementById('canvas');

// ================================================================================================
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
canvas.appendChild(renderer.domElement);
// camera.position.x = 5;
camera.position.z = 10;
// camera.position.y = 10
// camera.poi

// renderer.setClearColor(0x111111, 1);
// ================================================================================================
// Controle do objeto
controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.minDistance = 40;
// controls.maxDistance = 50;
// controls = new THREE.PointerLockControls(camera, renderer.domElement);

controls.enableKeys = false;


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
    
    // let directionalLight = new THREE.DirectionalLight(0xAAAAAA, 1);
    // directionalLight.position.set(0, 0, 1);
    // scene.add(directionalLight);
}

const addDirectionalLight = () => {
    let directionalLight = new THREE.DirectionalLight(0xAAAAAA, 1);
    let x = document.getElementById('slide_x').value;
    let y = document.getElementById('slide_y').value;
    let z = document.getElementById('slide_z').value;

    directionalLight.position.set(x, y, z);
    scene.add(directionalLight);
}

const removeDirectionalLight = () => {
    scene.children.forEach((element, index) => {
        if(element.type === 'DirectionalLight'){
            scene.children.splice(index)
        }
    });
}

// ================================================================================================
/* Object Loader
*/

const loadOBJ = (filePath) => {
    let loader = new THREE.OBJLoader();
    loader.load(filePath, function(object){
        scene.add(object);
        console.log(`Objeto adicionado`);
    },
    function(xhr){
        console.log((xhr.loaded/xhr.total * 100) + '% loaded');
    },
    function(error){
        console.log(`Houve um erro ao carregar o objeto: ${error}`)
    }
    );
}

const loadImg360 = () => {
    let loader = new THREE.TextureLoader();

    loader.load('img/miami_panorama.jpeg', (texture) => {
        let sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
        let sphereMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        sphereGeometry.scale(-1, 1, 1);
        
        let mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        scene.add(mesh);
        mesh.position.set(0,0,0);
    })
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
    let chk_Light = document.getElementById('chk_light');
    let slider_range = document.querySelectorAll('.slider_range');
    let canvas_div = document.getElementById('canvas');
    
    // Ao clicar no botão "Carregar", dispara o click do Input File
    btn_loadOBJ.addEventListener('click', () => {
        document.getElementById('input_OBJ').click();
        //loadImg360();
    });

    // Ao selecionar um arquivo no input, dispara o evento para carregar o arquivo selecionado
    input_OBJ.addEventListener('change', (event) => {

        let selectedFile = event.target.files[0];
        let reader = new FileReader();

        reader.onload = (event) => {
            loadOBJ(event.target.result);
        }

        reader.readAsDataURL(selectedFile);
    });

    // Qualquer mudança no checkbox de Light, muda o status da luz do projeto
    chk_Light.addEventListener('change', (event) => {
        let checked = event.target.checked;

        if(checked) addDirectionalLight();
        else removeDirectionalLight();

    });

    // Evento nos Sliders, que altera o valor que está na label, baseado no input
    slider_range.forEach(element => element.addEventListener('input', (event) => {
        let value = event.target.value;
        let id = event.target.id;
        let value_element = document.getElementById(`${id}_value`);

        value_element.innerHTML = value;
        
    }));

    canvas_div.addEventListener( 'click', function () {
        //lock mouse on screen
        // controls.lock();
    }, false );

    controls.addEventListener('change', (event) =>{
        //console.log(event);
       // console.log(controls);
       console.log('Mouse ', camera.position);
    });

    camera.addEventListener('change', (event) => {
        // console.log(camera.position);
    })
        
};

const onKeyDown = (event) => {
    event.preventDefault();
    switch(event.keyCode){
        case 38: //up
        case 87: //w
            camera.position.y += 0.3;
            break;
        case 37: //left
        case 65: //a
            camera.position.z -= 0.3;
            break;
        case 40: //down
        case 83: //s
            camera.position.y -= 0.3;
            break;
        case 39: //right
        case 68: //d
            camera.position.z += 0.3;
            break;
        case 32: // space
            console.log('space');
            break;
    }
    
    console.log('Tecla ', camera.position);
}

document.addEventListener('keydown', onKeyDown, false);

// ================================================================================================
  


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
let animate = function() {
    requestAnimationFrame(animate);

    update();
    render();
};

animate();
// ================================================================================================
