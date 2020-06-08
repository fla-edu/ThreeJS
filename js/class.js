class Objeto {
    constructor() {
        // Inicializa as variáveis e anexa o canvas a div
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.canvas = document.getElementById('canvas');

        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.canvas.appendChild(this.renderer.domElement);

        this.camera.position.z = 3;

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;
        // controls.minDistance = 40;
        // controls.maxDistance = 50;
        // controls = new THREE.PointerLockControls(camera, renderer.domElement);

        this.btn_loadImg360 = document.getElementById('btn_loadImg360');
        this.btn_loadOBJ = document.getElementById('btn_loadOBJ');
        this.input_OBJ = document.getElementById('input_OBJ');
        this.chk_Light = document.getElementById('chk_light');
        this.slider_range = document.querySelectorAll('.slider_range');

        // this.loadImg360();
        this.resize();
        this.events();
        this.animate();
    }

    createCube () {
        const geometry = new THREE.BoxGeometry(1,1,1);
        // Cria a textura do objeto
        const texture = new THREE.TextureLoader().load('img/2.jpg');
        // Array contendo as 6 faces do cubo
        const cubeMaterials = [
            new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), //Right 
            new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}), // Left
            new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Top
            new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}), // Bottom
            new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide}), // Front
            new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}) // Back
        ];

        // Adiciona a geomtria, as texturas de cada face ao ambiente
        const cube = new THREE.Mesh(geometry, cubeMaterials);
        this.scene.add(cube);
    }

    addDirectionalLight() {
        let directionalLight = new THREE.DirectionalLight(0xAAAAAA, 1);
        let x = document.getElementById('slide_x').value;
        let y = document.getElementById('slide_y').value;
        let z = document.getElementById('slide_z').value;
    
        directionalLight.position.set(x, y, z);
        this.scene.add(directionalLight);
    }

    removeDirectionalLight() {
        this.scene.children.forEach((element, index) => {
            if(element.type === 'DirectionalLight'){
                this.scene.children.splice(index)
            }
        });
    }

    loadOBJ(filePath) {
        const loader = new THREE.OBJLoader();

        loader.load(filePath, (object) => {
            this.scene.add(object);
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

    loadImg360() {
        const loader = new THREE.TextureLoader();

        loader.load('img/miami_panorama.jpeg', (texture) => {
            const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
            let sphereMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide
            });
            sphereGeometry.scale(-1, 1, 1);
            
            let mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.scene.add(mesh);
            mesh.position.set(0,0,0);
        })
    }

    resize() {
        // Atualiza a altura e a largura do objeto e o aspecto da câmera, quando o tamanho da tela muda
        window.addEventListener(('resize'), () => {
            this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }

    events() {
        
        document.addEventListener('keydown', (event) => this.onKeyDown(event), false);

        this.btn_loadImg360.addEventListener('click', () => this.loadImg360());

        // Ao clicar no botão "Carregar", dispara o click do Input File
        this.btn_loadOBJ.addEventListener('click', () => {
            document.getElementById('input_OBJ').click();
            //loadImg360();
        });
    
        // Ao selecionar um arquivo no input, dispara o evento para carregar o arquivo selecionado
        this.input_OBJ.addEventListener('change', (event) => {
    
            let selectedFile = event.target.files[0];
            let reader = new FileReader();
    
            reader.onload = (event) => {
                this.loadOBJ(event.target.result);
            }
    
            reader.readAsDataURL(selectedFile);
        });
    
        // Qualquer mudança no checkbox de Light, muda o status da luz do projeto
        this.chk_Light.addEventListener('change', (event) => {
            let checked = event.target.checked;
    
            if(checked) this.addDirectionalLight();
            else this.removeDirectionalLight();
    
        });
    
        // Evento nos Sliders, que altera o valor que está na label, baseado no input
       this.slider_range.forEach(element => element.addEventListener('input', (event) => {
            let value = event.target.value;
            let id = event.target.id;
            let value_element = document.getElementById(`${id}_value`);
    
            value_element.innerHTML = value;
            
        }));
    
        this.canvas.addEventListener( 'click', () => {
            //lock mouse on screen
            // controls.lock();
        }, false );
    
        this.controls.addEventListener('change', (event) =>{
            //console.log(event);
           // console.log(controls);
           console.log('Mouse ', this.camera.position);
        });
    
       this.camera.addEventListener('change', (event) => {
            // console.log(camera.position);
        })
    }

    onKeyDown(event) {
        event.preventDefault();
        switch(event.keyCode){
            case 38: //up
            case 87: //w
                this.camera.position.y += 0.3;
                break;
            case 37: //left
            case 65: //a
                this.camera.position.z -= 0.3;
                break;
            case 40: //down
            case 83: //s
                this.camera.position.y -= 0.3;
                break;
            case 39: //right
            case 68: //d
                this.camera.position.z += 0.3;
                break;
            case 32: // space
                console.log('space');
                break;
        }
        
        // console.log('Tecla ', this.camera.position);
    }

    rotation() {
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.005;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        const object = this;
        requestAnimationFrame(() => object.animate());

        this.render();
    }


}