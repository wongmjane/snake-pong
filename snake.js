var defaults = {
  gridScale: 10,
  gridWidth: 75,
  gridHeight: 45,
  tickSpeed: 50
};

var KeyMaps = {
  keySet1: { // ARROW KEYS : LEFT, UP, RIGHT, DOWN
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    INFO: 'ARROW-KEYS (LEFT, UP, RIGHT, DOWN)'
  },
  keySet2: {
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    DOWN: 83,
    INFO: 'KEYS: A, W, D, S'
  }
};


function Coordinate(x, y) {
  this.x = x;
  this.y = y;
}

Coordinate.prototype.equals = function(c) {
  return this.x === c.x && this.y === c.y;
};

var eventBus = new Vue();



// GameScreen Component
Vue.component("gamescreen", {
  template: "\n<div>\n  <div><canvas ref=\"cnvs\"></canvas>\n    <snake v-for=\"p in players\" :key=\"p.name\" :keys=\"p.controls\" :name=\"p.name\" :color=\"p.color\" :ctx=\"ctx\" ref=\"snakes\"></snake>\n  </div>\n</div>",
  data: function() {
    return {
      msg: 'Snake Pong',
      keyMaps: KeyMaps,
      ctx: undefined,
      timer: undefined,
      tickNum: 0,
      foodMovement: { x: 1, y: 1 },
      players: [
        { name: 'Player 1', color: 'red', controls: KeyMaps.keySet1 },
        { name: 'Player 2', color: 'blue', controls: KeyMaps.keySet2 }
      ]
    }
  },
  mounted: function() {
    // get 2D rendering context
    var cnvs = this.$refs.cnvs;
    this.ctx = cnvs.getContext("2d");
    cnvs.height = defaults.gridHeight * defaults.gridScale;
    cnvs.width = defaults.gridWidth * defaults.gridScale;

    // draw canvas
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.fillRect(0, 0, cnvs.width, cnvs.height);
    this.timer = setInterval(this.gameLoop, defaults.tickSpeed);
  },
  methods: {
    drawFood: function() {

      var foodLocation = store.state.foodLocation;

      this.ctx.fillStyle = "rgba(255,255,0,0.8)";
      this.ctx.fillRect(defaults.gridScale * foodLocation.x, defaults.gridScale * foodLocation.y, defaults.gridScale, defaults.gridScale);

      if (foodLocation.x + this.foodMovement.x < 0)
        this.foodMovement.x = 1;

      if (foodLocation.x + this.foodMovement.x > defaults.gridWidth)
        this.foodMovement.x = -1;

      if (foodLocation.y + this.foodMovement.y < 0)
        this.foodMovement.y = 1;

      if (foodLocation.y + this.foodMovement.y > defaults.gridHeight)
        this.foodMovement.y = -1;

      if (this.tickNum % 6 === 0) {
        foodLocation.x += this.foodMovement.x;
        foodLocation.y += this.foodMovement.y;
      }
    },
    gameLoop: function() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      this.ctx.fillRect(0, 0, this.$refs.cnvs.width, this.$refs.cnvs.height);
      this.drawFood();
      for (var i = 0; i < this.$refs.snakes.length; i++) {
        this.$refs.snakes[i].move();
      }
      this.tickNum++;


      this.ctx.fillStyle = "white";
      this.ctx.font = "20px monospace";
      this.ctx.fillText("Snake Pong", 10, 20);

      this.ctx.font = "12px Arial";
      this.ctx.fillText("By @ w o n g m j a n e", 10, this.$refs.cnvs.height - 30);

      this.ctx.font = "12px Arial";
      this.ctx.fillText("vue-ified By @ M r C l a n", 10, this.$refs.cnvs.height - 5);
    }
  }
});


// Snake Component
Vue.component("snake", {
  template: "<div><p :style='styleObj'><u><b>{{name.toUpperCase()}}</b></u><br/>Score: <b>{{score}}</b><br/>Controls: {{keys.INFO}}</p><p></p></div>",
  props: {
    "ctx": {},
    "name": String,
    "color": String,
    "keys": {
      type: Object,
      required: true,
      validator: function(keyMap) {
        return keyMap.LEFT && keyMap.UP && keyMap.RIGHT && keyMap.DOWN && keyMap.INFO;
      }
    }
  },
  data: function() {
    return {
      snakeBody: [],
      snakeLength: 3,
      score: 0,
      direction: undefined,
      styleObj: {
        "color": this.color,
        "font-family": "calibri"
      }
    }
  },
  mounted: function() {
    eventBus.$on("globalKeyPress", this.captureDirection);
    this.direction = this.keys.RIGHT;
    this.snakeBody.push(
      new Coordinate(
        Math.floor(Math.random() * defaults.gridWidth),
        Math.floor(Math.random() * defaults.gridHeight)
      ));
  },
  methods: {
    captureDirection: function(ev) {
      if (ev.keyCode === this.keys.LEFT && this.direction !== this.keys.RIGHT ||
        ev.keyCode === this.keys.RIGHT && this.direction !== this.keys.LEFT ||
        ev.keyCode === this.keys.UP && this.direction !== this.keys.DOWN ||
        ev.keyCode === this.keys.DOWN && this.direction !== this.keys.UP) {
        this.direction = ev.keyCode;
      }
    },
    move: function() {
      var foodLocation = store.state.foodLocation;
      this.snakeBody.push(new Coordinate(
        this.snakeBody[this.snakeBody.length - 1].x + (this.direction === this.keys.RIGHT ? 1 : this.direction === this.keys.LEFT ? -1 : 0),
        this.snakeBody[this.snakeBody.length - 1].y + (this.direction === this.keys.DOWN ? 1 : this.direction === this.keys.UP ? -1 : 0)
      ));

      if (this.snakeBody.length > this.snakeLength)
        this.snakeBody.shift();

      if (this.snakeBody[this.snakeBody.length - 1].x < 0)
        this.snakeBody[this.snakeBody.length - 1].x = defaults.gridWidth - 1;

      if (this.snakeBody[this.snakeBody.length - 1].x > defaults.gridWidth)
        this.snakeBody[this.snakeBody.length - 1].x = 0;

      if (this.snakeBody[this.snakeBody.length - 1].y < 0)
        this.snakeBody[this.snakeBody.length - 1].y = defaults.gridHeight - 1;

      if (this.snakeBody[this.snakeBody.length - 1].y > defaults.gridHeight)
        this.snakeBody[this.snakeBody.length - 1].y = 0;

      for (var i = 0; i < this.snakeBody.length - 1; i++) {
        if (this.snakeBody[i].x === this.snakeBody[this.snakeBody.length - 1].x &&
          this.snakeBody[i].y === this.snakeBody[this.snakeBody.length - 1].y) {
          this.snakeBody = [this.snakeBody[this.snakeBody.length - 1]];
        }
      }

      if (this.snakeBody[this.snakeBody.length - 1].x === foodLocation.x &&
        this.snakeBody[this.snakeBody.length - 1].y === foodLocation.y) {
        store.commit('newFoodLocation');
        this.snakeLength++;
        this.score++;
      }

      this.ctx.fillStyle = this.color;
      for (i = 0; i < this.snakeBody.length; i++) {
        this.ctx.fillRect(defaults.gridScale * this.snakeBody[i].x, defaults.gridScale * this.snakeBody[i].y, defaults.gridScale, defaults.gridScale);
        this.ctx.strokeRect(defaults.gridScale * this.snakeBody[i].x, defaults.gridScale * this.snakeBody[i].y, defaults.gridScale, defaults.gridScale);
      }
      this.ctx.fillRect(defaults.gridScale * this.snakeBody[this.snakeBody.length - 1].x, defaults.gridScale * this.snakeBody[this.snakeBody.length - 1].y, defaults.gridScale, defaults.gridScale);
    }
  }
});




var app = new Vue({
  el: '#app',
  mounted: function() {
    window.addEventListener("keyup", function(e) {
      eventBus.$emit("globalKeyPress", e);
    });
  }
});

var store = new Vuex.Store({
  state: {
    count: 0,
    foodLocation: new Coordinate(
      Math.floor(Math.random() * defaults.gridWidth),
      Math.floor(Math.random() * defaults.gridHeight)
    )
  },
  mutations: {
    newFoodLocation(state) {
      state.foodLocation = new Coordinate(
        Math.floor(Math.random() * defaults.gridWidth),
        Math.floor(Math.random() * defaults.gridHeight)
      );
    }
  }
});
