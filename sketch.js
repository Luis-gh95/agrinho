function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

let grid = [];
let cols = 10;
let rows = 6;
let cellSize = 60;

let tipoSelecionado = "urbano";

let populacao = 50;
let comida = 50;
let ecologia = 50;

let estado = "jogando";

function setup() {
  createCanvas(cols * cellSize, rows * cellSize + 100);
  for (let i = 0; i < cols * rows; i++) {
    grid.push("vazio");
  }
}

function draw() {
  background(240);

  drawGrid();
  drawHUD();

  if (estado !== "jogando") {
    drawGameOver();
  }
}

function drawGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let i = x + y * cols;
      let tipo = grid[i];

      let px = x * cellSize;
      let py = y * cellSize;

      stroke(180);
      fill(getColor(tipo));
      rect(px, py, cellSize, cellSize);

      if (tipo !== "vazio") {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(tipo[0].toUpperCase(), px + cellSize / 2, py + cellSize / 2);
      }
    }
  }
}

function drawHUD() {
  fill(0);
  textSize(16);
  textAlign(LEFT, CENTER);
  text("Selecionado: " + tipoSelecionado, 10, height - 80);
  text("🌆 População: " + populacao, 10, height - 60);
  text("🌽 Comida: " + comida, 10, height - 40);
  text("🌳 Ecologia: " + ecologia, 10, height - 20);

  // Botões
  drawButton("Urbano", 250, height - 80, "urbano");
  drawButton("Rural", 250, height - 50, "rural");
  drawButton("Natureza", 250, height - 20, "natureza");
}

function drawButton(label, x, y, tipo) {
  fill(tipoSelecionado === tipo ? "#aaa" : "#ddd");
  rect(x, y, 100, 25, 5);
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text(label, x + 50, y + 12);
}

function drawGameOver() {
  fill(estado === "colapso" ? "red" : "green");
  textSize(28);
  textAlign(CENTER, CENTER);
  text(estado === "colapso" ? "⚠️ Colapso!" : "✅ Cidade Sustentável!", width / 2, height / 2);
}

function mousePressed() {
  if (estado !== "jogando") return;

  // Botões de tipo
  if (mouseY > height - 100) {
    if (mouseX > 250 && mouseX < 350) {
      if (mouseY < height - 55) tipoSelecionado = "urbano";
      else if (mouseY < height - 25) tipoSelecionado = "rural";
      else tipoSelecionado = "natureza";
      return;
    }
  }

  // Colocar bloco no grid
  let x = floor(mouseX / cellSize);
  let y = floor(mouseY / cellSize);
  if (x >= cols || y >= rows) return;

  let i = x + y * cols;

  if (grid[i] === "vazio") {
    grid[i] = tipoSelecionado;
    atualizarIndicadores();
    verificarEstado();
  }
}

function atualizarIndicadores() {
  // Contagem de blocos
  let urbano = grid.filter(t => t === "urbano").length;
  let rural = grid.filter(t => t === "rural").length;
  let natureza = grid.filter(t => t === "natureza").length;

  populacao = 20 + urbano * 5;
  comida = 20 + rural * 5 - urbano * 2;
  ecologia = 50 + natureza * 3 - urbano * 3;

  comida = constrain(comida, 0, 100);
  ecologia = constrain(ecologia, 0, 100);
}

function verificarEstado() {
  if (comida <= 0 || ecologia <= 0) {
    estado = "colapso";
  }

  if (populacao >= 80 && comida >= 40 && ecologia >= 40) {
    estado = "sustentavel";
  }
}

function getColor(tipo) {
  switch (tipo) {
    case "urbano": return color(100, 100, 220);
    case "rural": return color(180, 255, 100);
    case "natureza": return color(50, 180, 80);
    default: return color(255);
  }
}
