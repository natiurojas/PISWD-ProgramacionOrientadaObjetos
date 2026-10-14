
let img;
let x=100;
let y=200;
let x1=300
let y1=200;
let tam=50;
let miObjeto;

let vectorN=[];

function preload() {
  img = loadImage ('imagen.png'); // carga imagen
}

function setup() {
  createCanvas(600, 400);
  imageMode(CENTER);
  miObjeto = new Objeto(img,x1,y1,tam,tam);
  for(let i=0;i<10;i++){
    vectorN[i]= new Objeto(img,50,100,tam,tam);
  }
}

function draw() {
  background(220);
  image(img,x,y,tam,tam);

if(mouseX > (x -25) && mouseX < (x+25) && mouseY > (y-25) && mouseY < (y+25) ){
  x=random(600 - tam/2);
  y=random(400 - tam/2);
}
miObjeto.mostrar();
miObjeto.escapar();

for(let i=0;i<10;i++){
vectorN[i].mostrar();
vectorN[i].escapar();
}
}
//-----------------------------
class Objeto{
  constructor(img,x1,y1,ancho,alto){
    this.img = img;
    this.x1 = x1;
    this.y1 = y1;
    this.ancho = ancho;
    this.alto= alto;
  }
mostrar(){
  image(this.img,this.x1,this.y1,this.ancho,this.alto);
}

escapar(){
  if(mouseX > (this.x1 -25) && mouseX < (this.x1+25) && mouseY > (this.y1-25) && mouseY < (this.y1+25) ){
  this.x1=random(600 - tam/2);
 this.y1=random(400 - tam/2);
}
}


}
  





  

