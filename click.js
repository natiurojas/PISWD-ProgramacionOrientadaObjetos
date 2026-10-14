// ============================================================
// Ejercicios de POO en p5.js (1 a 10)
// ============================================================

let juego;
let interfaz;
let menu;
let pelota;

function setup() {
  createCanvas(600, 400);
  menu = new Menu();
  juego = new Juego();
  interfaz = new Interfaz(juego.jugador);
  pelota = new Circulo(width / 2, 150, 35);
}

function draw() {
  background(20, 24, 38);

  if (juego.estado === "menu") {
    pelota.mover();
    pelota.dibujar();
    menu.dibujar();
  } else if (juego.estado === "instrucciones") {
    dibujarInstrucciones();
  } else if (juego.estado === "jugando") {
    juego.actualizar();
    juego.dibujar();
    interfaz.actualizar(juego.jugador);
    interfaz.dibujar();
  } else if (juego.estado === "pausa") {
    juego.dibujar();
    interfaz.dibujar();
    dibujarOverlay("PAUSA", "Presiona P para continuar");
  } else if (juego.estado === "terminado") {
    juego.dibujar();
    interfaz.dibujar();
    dibujarOverlay("GAME OVER", "Presiona R para reiniciar o ENTER para el menu");
  } else if (juego.estado === "salir") {
    dibujarOverlay("Hasta luego", "Gracias por jugar");
  }
}

function keyPressed() {
  if (juego.estado === "menu") {
    if (keyCode === UP_ARROW) menu.navegar(-1);
    else if (keyCode === DOWN_ARROW) menu.navegar(1);
    else if (keyCode === ENTER) {
      const opcion = menu.seleccionar();
      if (opcion === "Iniciar Juego") {
        juego.iniciar();
        interfaz.actualizar(juego.jugador);
      } else if (opcion === "Instrucciones") {
        juego.estado = "instrucciones";
      } else if (opcion === "Salir") {
        juego.estado = "salir";
      }
    }
  } else if (juego.estado === "instrucciones") {
    if (keyCode === ENTER || keyCode === ESCAPE) juego.estado = "menu";
  } else if (juego.estado === "jugando") {
    if (keyCode === 32) juego.disparar();
    if (key === "p" || key === "P") juego.pausar();
  } else if (juego.estado === "pausa") {
    if (key === "p" || key === "P") juego.pausar();
  } else if (juego.estado === "terminado") {
    if (key === "r" || key === "R") juego.reiniciar();
    else if (keyCode === ENTER) juego.estado = "menu";
  }
  return false;
}

function dibujarInstrucciones() {
  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(28);
  text("Instrucciones", width / 2, 70);
  textSize(15);
  textAlign(LEFT, TOP);
  fill(210);
  text("- Mueve al jugador con las flechas o WASD.", 80, 140);
  text("- Dispara hacia el mouse con la barra espaciadora.", 80, 170);
  text("- Pausa / reanuda con la tecla P.", 80, 200);
  text("- Los enemigos te quitan vida al tocarte.", 80, 230);
  text("- Suma puntos eliminando enemigos.", 80, 260);
  textAlign(CENTER, CENTER);
  fill(150);
  textSize(13);
  text("Presiona ENTER o ESC para volver", width / 2, height - 40);
  pop();
}

function dibujarOverlay(titulo, subtitulo) {
  push();
  noStroke();
  fill(0, 0, 0, 170);
  rectMode(CORNER);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  text(titulo, width / 2, height / 2 - 15);
  fill(200);
  textSize(15);
  text(subtitulo, width / 2, height / 2 + 30);
  pop();
}

// ---------------------- EJERCICIO 1: Circulo ----------------------
class Circulo {
  constructor(x, y, radio) {
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.velX = random(-2, 2);
    this.velY = random(-2, 2);
  }

  mover() {
    this.x += this.velX;
    this.y += this.velY;
    if (this.x < this.radio || this.x > width - this.radio) this.velX *= -1;
    if (this.y < this.radio || this.y > 170) this.velY *= -1;
  }

  dibujar() {
    push();
    noStroke();
    fill(90, 200, 255, 90);
    ellipse(this.x, this.y, this.radio * 2);
    pop();
  }
}

// ---------------------- EJERCICIO 2: Rectangulo ----------------------
class Rectangulo {
  constructor(x, y, ancho, alto) {
    this.x = x;
    this.y = y;
    this.ancho = ancho;
    this.alto = alto;
  }

  calcularArea() {
    return this.ancho * this.alto;
  }

  dibujar() {
    push();
    noStroke();
    rectMode(CORNER);
    rect(this.x, this.y, this.ancho, this.alto);
    pop();
  }
}

// ---------------------- EJERCICIO 3: Jugador ----------------------
class Jugador {
  constructor(nombre, x, y) {
    this.nombre = nombre;
    this.puntuacion = 0;
    this.vida = 100;
    this.x = x;
    this.y = y;
    this.radio = 18;
    this.velocidad = 4;
    this.escala = 1;
    this.animacion = new Animacion(this);
  }

  aumentarPuntuacion(cantidad) {
    this.puntuacion += cantidad;
  }

  reducirVida(cantidad) {
    this.vida = constrain(this.vida - cantidad, 0, 100);
  }

  mover() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.velocidad;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.velocidad;
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.velocidad;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.velocidad;
    this.x = constrain(this.x, this.radio, width - this.radio);
    this.y = constrain(this.y, this.radio, height - this.radio);
  }

  dibujar() {
    push();
    noStroke();
    fill(60, 160, 255);
    ellipse(this.x, this.y, this.radio * 2 * this.escala);
    fill(255);
    ellipse(this.x, this.y, this.radio * this.escala);
    pop();
  }
}

// ---------------------- EJERCICIO 4: Enemigo ----------------------
class Enemigo extends Jugador {
  constructor(x, y) {
    super("Enemigo", x, y);
    this.vida = 30;
    this.dano = 15;
    this.velocidad = random(1.2, 2.6);
    this.radio = 15;
    this.color = color(235, 85, 85);
  }

  moverse(jugador) {
    const angulo = atan2(jugador.y - this.y, jugador.x - this.x);
    this.x += cos(angulo) * this.velocidad;
    this.y += sin(angulo) * this.velocidad;
  }

  dibujar() {
    push();
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.radio * 2 * this.escala);
    fill(255, 180, 180);
    ellipse(this.x, this.y, this.radio * this.escala);
    pop();
  }
}

// ---------------------- EJERCICIO 5: Proyectil ----------------------
class Proyectil {
  constructor(x, y, velocidad, direccion) {
    this.x = x;
    this.y = y;
    this.velocidad = velocidad;
    this.direccion = direccion;
    this.velX = cos(direccion) * velocidad;
    this.velY = sin(direccion) * velocidad;
    this.radio = 5;
    this.activo = true;
  }

  actualizar() {
    this.x += this.velX;
    this.y += this.velY;
  }

  fueraDePantalla() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }

  dibujar() {
    push();
    noStroke();
    fill(255, 230, 90);
    ellipse(this.x, this.y, this.radio * 2);
    pop();
  }
}

// ---------------------- EJERCICIOS 6 y 7: Juego + Colisiones ----------------------
class Juego {
  constructor() {
    this.estado = "menu";
    this.jugador = null;
    this.enemigos = [];
    this.proyectiles = [];
    this.temporizador = 0;
    this.crearJugador();
  }

  crearJugador() {
    this.jugador = new Jugador("Heroe", width / 2, height / 2);
  }

  iniciar() {
    this.crearJugador();
    this.enemigos = [];
    this.proyectiles = [];
    this.temporizador = 0;
    this.jugador.animacion.iniciar();
    this.estado = "jugando";
  }

  pausar() {
    if (this.estado === "jugando") this.estado = "pausa";
    else if (this.estado === "pausa") this.estado = "jugando";
  }

  reiniciar() {
    this.iniciar();
  }

  disparar() {
    if (this.estado !== "jugando") return;
    const angulo = atan2(mouseY - this.jugador.y, mouseX - this.jugador.x);
    this.proyectiles.push(new Proyectil(this.jugador.x, this.jugador.y, 8, angulo));
  }

  generarEnemigo() {
    const lado = floor(random(4));
    let x, y;
    if (lado === 0) { x = random(width); y = -20; }
    else if (lado === 1) { x = width + 20; y = random(height); }
    else if (lado === 2) { x = random(width); y = height + 20; }
    else { x = -20; y = random(height); }
    const enemigo = new Enemigo(x, y);
    enemigo.animacion.iniciar();
    this.enemigos.push(enemigo);
  }

  distancia(x1, y1, x2, y2) {
    return dist(x1, y1, x2, y2);
  }

  verificarColisiones() {
    for (let i = this.proyectiles.length - 1; i >= 0; i--) {
      const p = this.proyectiles[i];
      for (let j = this.enemigos.length - 1; j >= 0; j--) {
        const e = this.enemigos[j];
        if (this.distancia(p.x, p.y, e.x, e.y) < p.radio + e.radio) {
          e.reducirVida(10);
          this.proyectiles.splice(i, 1);
          if (e.vida <= 0) {
            this.enemigos.splice(j, 1);
            this.jugador.aumentarPuntuacion(100);
          }
          break;
        }
      }
    }

    for (let j = this.enemigos.length - 1; j >= 0; j--) {
      const e = this.enemigos[j];
      if (this.distancia(e.x, e.y, this.jugador.x, this.jugador.y) < e.radio + this.jugador.radio) {
        this.jugador.reducirVida(e.dano);
        this.enemigos.splice(j, 1);
        if (this.jugador.vida <= 0) this.estado = "terminado";
      }
    }
  }

  actualizar() {
    this.jugador.mover();
    this.jugador.animacion.actualizar();

    this.temporizador++;
    if (this.temporizador > 55) {
      this.generarEnemigo();
      this.temporizador = 0;
    }

    for (const e of this.enemigos) {
      e.moverse(this.jugador);
      e.animacion.actualizar();
    }

    for (let i = this.proyectiles.length - 1; i >= 0; i--) {
      this.proyectiles[i].actualizar();
      if (this.proyectiles[i].fueraDePantalla()) this.proyectiles.splice(i, 1);
    }

    this.verificarColisiones();
  }

  dibujar() {
    for (const e of this.enemigos) e.dibujar();
    for (const p of this.proyectiles) p.dibujar();
    this.jugador.dibujar();
  }
}

// ---------------------- EJERCICIO 8: Interfaz ----------------------
class Interfaz {
  constructor(jugador) {
    this.jugador = jugador;
    this.fondoBarra = new Rectangulo(260, 11, 150, 18);
    this.barraVida = new Rectangulo(260, 11, 150, 18);
  }

  actualizar(jugador) {
    this.jugador = jugador;
  }

  dibujar() {
    if (!this.jugador) return;
    const ancho = 150;
    push();
    fill(15, 18, 30, 200);
    rectMode(CORNER);
    rect(0, 0, width, 40);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(16);
    text("Puntuacion: " + this.jugador.puntuacion, 15, 20);

    fill(220);
    text("Vida:", 200, 20);

    this.barraVida.ancho = ancho * (this.jugador.vida / 100);
    fill(70);
    this.fondoBarra.ancho = ancho;
    this.fondoBarra.dibujar();
    fill(80, 220, 120);
    this.barraVida.dibujar();
    pop();
  }
}

// ---------------------- EJERCICIO 9: Menu ----------------------
class Menu {
  constructor() {
    this.opciones = ["Iniciar Juego", "Instrucciones", "Salir"];
    this.seleccion = 0;
  }

  navegar(direccion) {
    this.seleccion = (this.seleccion + direccion + this.opciones.length) % this.opciones.length;
  }

  seleccionar() {
    return this.opciones[this.seleccion];
  }

  dibujar() {
    push();
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(40);
    text("POO p5.js", width / 2, 265);
    textSize(14);
    fill(150);
    text("Selecciona con las flechas y confirma con ENTER", width / 2, height - 30);

    for (let i = 0; i < this.opciones.length; i++) {
      if (i === this.seleccion) fill(120, 200, 255);
      else fill(200);
      textSize(22);
      const prefijo = i === this.seleccion ? ">  " : "";
      const sufijo = i === this.seleccion ? "  <" : "";
      text(prefijo + this.opciones[i] + sufijo, width / 2, 320 + i * 34);
    }
    pop();
  }
}

// ---------------------- EJERCICIO 10: Animacion ----------------------
class Animacion {
  constructor(objeto) {
    this.objeto = objeto;
    this.activa = false;
    this.cuadro = 0;
    this.velocidad = 0.15;
    this.amplitud = 0.12;
    this.escala = 1;
  }

  iniciar() {
    this.activa = true;
  }

  detener() {
    this.activa = false;
    this.cuadro = 0;
    this.escala = 1;
    if (this.objeto) this.objeto.escala = 1;
  }

  actualizar() {
    if (!this.activa) return;
    this.cuadro += this.velocidad;
    this.escala = 1 + sin(this.cuadro) * this.amplitud;
    if (this.objeto) this.objeto.escala = this.escala;
  }
}
