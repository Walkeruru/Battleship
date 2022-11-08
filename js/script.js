class Ship{
    constructor(largo){
        this.largo = largo;
        this.hits = 0;
        this.sunk = this.isSunk();
    }
    hit(){
        this.hits += 1;
    }
    isSunk(){
        return this.sunk = this.largo<=this.hits;
    }
}
class Gameboard{
    constructor(){
        this.board = Array(10).fill(null).map(x=> Array(10).fill('x'));
        this.ships = [];
    }
    addBarco(x,y,largo){
        let lugarOcupado;
        this.ships.forEach(barco=>{
            barco.coords.forEach(par =>{
                if(par.toString()===[x,y].toString()){
                    lugarOcupado=true;
                }
            })
        })
        if(!lugarOcupado && (y+largo)<=10 && !vertical){
        let barco = new Ship(largo);
        let coords = [];
        for(let i=0; i<largo; i++){
            this.board[x][y] = 'BARCO';
            coords.push([x,y]);
            y++;
        }
        this.ships.push({coords, barco});
        }else if(!lugarOcupado && vertical && x+largo<=10){
            let barco = new Ship(largo);
            let coords = [];
            for(let i=0; i<largo; i++){
                this.board[x][y] = 'BARCO';
                coords.push([x,y]);
                x++;
            }     
        this.ships.push({coords, barco});
        }
        else {
            if(this.board === cpu.tabla.board){
            this.addBarco(Math.floor(Math.random()*(10-largo)),Math.floor(Math.random()*9),largo);
            }else alert('NO PUEDES COLOCAR ESTE BARCO AHI');
        }
    }
    receiveAttack([x,y]){
        let miss = true;
       this.ships.forEach(barco=>{
        barco.coords.forEach(par =>{
            if(par.toString()===[y,x].toString()){
                barco.barco.hit()
                barco.barco.isSunk()
                this.board[x][y] = 'HIT'
                miss = false;
            }
            if(miss){
                this.board[x][y] = 'FAIL';
            }
        })
       })
    }
    GameOver(){
        let barcosHundidos = 0;
        this.ships.forEach(barco =>{
            if(barco.barco.sunk){
                barcosHundidos++;
            }
        })
        return this.ships.length == barcosHundidos;
    }
}
class Player{
    constructor(){
        this.tabla = new Gameboard();
        this.played = [];
        this.turno = true;
        this.lastHit;
        this.lastHitFailed;
    }
    Attack(enemigo,x,y){
        let wasPlayed = false;
        if(this.turno){
            //si es el turno de la computadora genera coordenadas randoms
            if(enemigo!==cpu){
                if(this.lastHit){
                    if(this.lastHit.x<9){
                    x = this.lastHit.x++;
                    y = this.lastHit.y;
                    }else{
                    x = Math.floor(Math.random()*9);
                    y = Math.floor(Math.random()*9);
                }
                }else if(this.lastHitFailed){
                    if(this.lastHitFailed.x>5){
                    x = this.lastHitFailed.x-5;
                    y = this.lastHitFailed.y;
                    }else{
                    x = Math.floor(Math.random()*9);
                    y = Math.floor(Math.random()*9);
                    }
                }
                else{
                x = Math.floor(Math.random()*10);
                y = Math.floor(Math.random()*10);
                }
            }
            // analiza si las coordenadas elegidas ya se jugaron
            this.played.forEach(coords => {
                if(JSON.stringify(coords)===JSON.stringify({x,y})){
                    wasPlayed = true;
                }
            })
            if(!wasPlayed){
                enemigo.tabla.receiveAttack([x,y]);
                this.turno = false;
                enemigo.turno = true;
                this.played.push({x,y});
                if(enemigo!==cpu){
                    if(playerOne.tabla.board[x][y] == 'HIT'){
                        this.lastHit = {x,y};
                        this.lastHitFailed = undefined;
                        if(y == 0){
                            document.querySelector(`.player${x}`).classList.add("hit");
                        }else document.querySelector(`.player${y}${x}`).classList.add("hit");
                    }else if(playerOne.tabla.board[x][y] == 'FAIL'){
                        this.lastHitFailed = undefined;
                        if(this.lastHit){
                            this.lastHitFailed = {x,y}
                        }
                        this.lastHit = undefined;
                        if(y == 0){
                            document.querySelector(`.player${x}`).classList.add("fail");
                        }else document.querySelector(`.player${y}${x}`).classList.add("fail");
                    }
                }
            }else {
                if(enemigo == playerOne){
                this.lastHitFailed = undefined;
                this.Attack(enemigo,x,y);}
            }
    }
    }
}
let playerOne;
let cpu;
let vertical = false;
function gameLoop(){
    playerOne = new Player();
    cpu = new Player();
    let contenedor = document.querySelector(".container");
    let computadoraContendor = document.querySelector(".computadora");
    let boats = document.querySelector(".boats");
    boats.innerHTML=`
    <div class="text-white align-self-center">Selecciona y arrastra tus barcos:</div>
    <div class="BARCO d-flex align-items-center justify-content-center" draggable="true" ondragstart="drag(event)" id="drag1" data-barco="5" data-placed=false><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-5-square-fill" viewBox="0 0 16 16">
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm5.994 12.158c-1.57 0-2.654-.902-2.719-2.115h1.237c.14.72.832 1.031 1.529 1.031.791 0 1.57-.597 1.57-1.681 0-.967-.732-1.57-1.582-1.57-.767 0-1.242.45-1.435.808H5.445L5.791 4h4.705v1.103H6.875l-.193 2.343h.064c.17-.258.715-.68 1.611-.68 1.383 0 2.561.944 2.561 2.585 0 1.687-1.184 2.806-2.924 2.806Z"/>
  </svg></div>
    <div class="BARCO d-flex align-items-center justify-content-center" draggable="true" ondragstart="drag(event)" id="drag2" data-barco="4" data-placed=false><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-4-square-fill" viewBox="0 0 16 16">
    <path d="M6.225 9.281v.053H8.85V5.063h-.065c-.867 1.33-1.787 2.806-2.56 4.218Z"/>
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm5.519 5.057c.22-.352.439-.703.657-1.055h1.933v5.332h1.008v1.107H10.11V12H8.85v-1.559H4.978V9.322c.77-1.427 1.656-2.847 2.542-4.265Z"/>
  </svg></div>
    <div class="BARCO d-flex align-items-center justify-content-center" draggable="true" ondragstart="drag(event)" id="drag3" data-barco="3" data-placed=false><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-3-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm5.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318Z"/>
</svg></div>
    <div class="BARCO d-flex align-items-center justify-content-center" draggable="true" ondragstart="drag(event)" id="drag4" data-barco="3" data-placed=false><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-3-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm5.918 8.414h-.879V7.342h.838c.78 0 1.348-.522 1.342-1.237 0-.709-.563-1.195-1.348-1.195-.79 0-1.312.498-1.348 1.055H5.275c.036-1.137.95-2.115 2.625-2.121 1.594-.012 2.608.885 2.637 2.062.023 1.137-.885 1.776-1.482 1.875v.07c.703.07 1.71.64 1.734 1.917.024 1.459-1.277 2.396-2.93 2.396-1.705 0-2.707-.967-2.754-2.144H6.33c.059.597.68 1.06 1.541 1.066.973.006 1.6-.563 1.588-1.354-.006-.779-.621-1.318-1.541-1.318Z"/>
</svg></div>
    <div class="BARCO d-flex align-items-center justify-content-center" draggable="true" ondragstart="drag(event)" id="drag5" data-barco="2" data-placed=false><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-2-square-fill" viewBox="0 0 16 16">
    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2Zm4.646 6.24v.07H5.375v-.064c0-1.213.879-2.402 2.637-2.402 1.582 0 2.613.949 2.613 2.215 0 1.002-.6 1.667-1.287 2.43l-.096.107-1.974 2.22v.077h3.498V12H5.422v-.832l2.97-3.293c.434-.475.903-1.008.903-1.705 0-.744-.557-1.236-1.313-1.236-.843 0-1.336.615-1.336 1.306Z"/>
  </svg></div>
    <button class="btn btn-primary" id="boton">Cambiar a Vertical</button>
    `
    contenedor.innerHTML = '';
    computadoraContendor.innerHTML = '';
    document.getElementById('gameOver').innerHTML='';
/*     
No.	Class of ship	Size
1	Carrier	        5
2	Battleship  	4
3	Destroyer	    3
4	Submarine	    3
5	Patrol Boat	    2
 */
    // add Ships to computer
    cpu.tabla.addBarco(Math.floor(Math.random()*4),Math.floor(Math.random()*9),5);
    cpu.tabla.addBarco(Math.floor(Math.random()*5),Math.floor(Math.random()*9),4);
    cpu.tabla.addBarco(Math.floor(Math.random()*6),Math.floor(Math.random()*9),3);
    cpu.tabla.addBarco(Math.floor(Math.random()*6),Math.floor(Math.random()*9),3);
    cpu.tabla.addBarco(Math.floor(Math.random()*7),Math.floor(Math.random()*9),2);
    let numero = 0;
    let playerNum = 0;
    let p1Y =-1;
    playerOne.tabla.board.forEach(array =>{
        let p1X = 0;
        p1Y++
        array.forEach(box =>{
            contenedor.innerHTML +=`<div class="player${playerNum} ${box}" data-x="${p1X}" data-y="${p1Y}" ondrop="drop(event)" ondragover="allowDrop(event)"></div>`
            playerNum++;
            p1X++;
        })
    })
    let y= -1;
    cpu.tabla.board.forEach(array =>{
        let x = 0
        y++;
        array.forEach(box =>{
            computadoraContendor.innerHTML +=`<div class="box${numero}" data-x="${x}" data-y="${y}"></div>`
            x++;
            numero++;
        })
    })
    //makes cpu table clickeable
    for(let i=0; i<100; i++){
        document.querySelector(`.box${i}`).addEventListener("click",()=>{
            let cordX=document.querySelector(`.box${i}`).dataset.x;
            let cordY=document.querySelector(`.box${i}`).dataset.y;
            playerOne.Attack(cpu,cordX,cordY);
            cpu.Attack(playerOne,0,0); // hardcode coordeanadas [0,0] porque  elige random en la funcion attack
            if(cpu.tabla.board[cordX][cordY] == 'HIT'){
                document.querySelector(`.box${i}`).classList.add("hit");
            }else if(cpu.tabla.board[cordX][cordY] == 'FAIL'){
                document.querySelector(`.box${i}`).classList.add("fail");
            }
            if(cpu.tabla.GameOver() || playerOne.tabla.GameOver()){
                document.getElementById('gameOver').innerHTML=`
                <div class="modal d-block" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <h1 class="text-center mt-5">Game Over!</h1>
                <div class="modal-footer">
                  <button class="btn btn-primary" data-bs-toggle="modal" onclick="gameLoop()">Play Again!</button>
                </div>
                </div>
              </div>
</div>
                `
            }
        })
    }
};
// functions drag and drop;
function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.dataTransfer.setData("largo", ev.target.dataset.barco);
}
    
function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    let barco = document.getElementById(data);
    if(barco.dataset.placed == 'false'){
    barco.dataset.placed = true;
    let largo = ev.dataTransfer.getData("largo");
    playerOne.tabla.addBarco(Number(ev.target.dataset.y),Number(ev.target.dataset.x),Number(largo));
    for(let i=1; i<largo; i++){
    if(Number(ev.target.dataset.y)+Number(largo)<=10 && Number(ev.target.dataset.x)+Number(largo)<=10){
        ev.target.appendChild(barco);
        if(!vertical){
        document.querySelector(`.player${Number(ev.target.classList[0].split("player")[1])+i}`).appendChild(barco.cloneNode());
        }else {
        document.querySelector(`.player${Number(ev.target.classList[0].split("player")[1])+(10*i)}`).appendChild(barco.cloneNode());
        }
    }else if(vertical && Number(ev.target.dataset.y)+Number(largo)<=10){
        ev.target.appendChild(barco);
        document.querySelector(`.player${Number(ev.target.classList[0].split("player")[1])+(10*i)}`).appendChild(barco.cloneNode());
    }else if(!vertical && Number(ev.target.dataset.x)+Number(largo)<=10 ){
        ev.target.appendChild(barco);
        document.querySelector(`.player${Number(ev.target.classList[0].split("player")[1])+i}`).appendChild(barco.cloneNode());
    }
    else barco.dataset.placed = false;
    }
    }else alert('ya colocaste este barco');
}
//-------end drop functions----//
document.addEventListener("DOMContentLoaded",()=>{
gameLoop();
const boton = document.getElementById("boton");
boton.addEventListener("click",()=>{
    if(!vertical){
        vertical = true;
        boton.innerText = 'Cambiar a horizontal'
    }else{
        vertical = false;
        boton.innerText = 'Cambiar a vertical'
    }
});
})