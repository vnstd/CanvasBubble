(() => {
  const config = {
    dotMinRad: 6,
    dotMaxRad: 20,
    sphereRad: 350,
    bigDotRad: 35,
    mouseSize: 120,
    massFactor: 0.002,
    defColor: `rgba(0, 60, 190, 0.9)`,
    smooth: 0.85,
  }

  const tPI = 2 * Math.PI;
  const canvas = document.querySelector(`canvas`);
  const cCont    = canvas.getContext(`2d`);

  let w, h, mouse, dots;

  class Dot {
    constructor(r) {
      this.pos   = {x: mouse.x, y: mouse.y}
      this.vel   = {x: 0, y: 0}
      this.rad   = r || random(config.dotMinRad, config.dotMaxRad);
      this.mass  = this.rad * config.massFactor;
      this.color = config.defColor;
    }

    draw(x, y) {
      this.pos.x = x || this.pos.x + this.vel.x;
      this.pos.y = y || this.pos.y + this.vel.y;
      createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
      createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor);
    }
  }

  function updateDots() {
    for (let i = 1; i < dots.length; i++) {
      let acc = {x: 0, y: 0}

      for (let j = 0; j < dots.length; j++) {
        if (i == j) continue;
        let [a, b] = [dots[i], dots[j]];

        let delta  = {x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y}
        let dist   = Math.sqrt( delta.x * delta.x + delta.y * delta.y) || 1;
        let force  = (dist - config.sphereRad) / dist * b.mass;

        if (j == 0) {
          let alpha = config.mouseSize / dist;
          a.color   = `rgba(0, 60, 190, ${alpha})`;

          dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
        }

        acc.x     += delta.x * force;
        acc.y     += delta.y * force;
      }

      dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
      dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
    }
    
    dots.map(e => e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw());
  }

  function createCircle(x, y, rad, fill, color) {
    cCont.fillStyle = cCont.strokeStyle = color;
    cCont.beginPath();
    cCont.arc(x, y, rad, 0, tPI);
    cCont.closePath();
    fill ? cCont.fill() : cCont.stroke();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    w     = canvas.width  = innerWidth;
    h     = canvas.height = innerHeight;

    mouse = {x: w / 2, y: h / 2, down: false}
    dots  = [];

    dots.push(new Dot(config.bigDotRad));
  }

  function loop() {
    cCont.clearRect(0, 0, w, h);

    if (mouse.down) { dots.push(new Dot()); }
    updateDots();

    window.requestAnimationFrame(loop);
  }

  function line(x,y,x2,y2) {
    cCont.lineWidth = 3;
    cCont.strokeStyle = `white`;
    cCont.beginPath();
    cCont.moveTo(x, y);
    cCont.lineTo(x2, y2);
    cCont.stroke();
  }

  init();
  loop();

  function setPos({layerX, layerY}) {
    [mouse.x, mouse.y] = [layerX, layerY];
  }

  function isDown() {
    mouse.down = !mouse.down;
  }

  canvas.addEventListener(`mousemove`, setPos);
  window.addEventListener(`mousedown`, isDown);
  window.addEventListener(`mouseup`  , isDown);
})();