var gridScale = 10;
var gridWidth = 61;
var gridHeight = 59;
var tickspeed = 50;
var snakeLength = 3;

var Direction = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
}

function Coordinate(x, y) {
	this.x = x;
	this.y = y;
}

Coordinate.prototype.equals = function(c) {
	return this.x === c.x && this.y === c.y;
}

function randomCoor() {
	return new Coordinate(Math.floor(Math.random() * gridWidth), Math.floor(Math.random() * gridHeight));
}

var direction = Direction.RIGHT;

var snakeBody = [];

var foodLocation = randomCoor();

var foodMovement = {
	x: +1,
	y: +1
};

var tickNum = 0;

snakeBody.push(new Coordinate(Math.round(gridWidth / 2), Math.round(gridHeight / 2)));

var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");

canvas.width = gridWidth * gridScale;
canvas.height = gridHeight * gridScale;

function tick() {
	tickNum++;
	ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "rgba(255,255,255,0.5)";

	snakeBody.push(new Coordinate(
		snakeBody[snakeBody.length - 1].x + (direction === Direction.RIGHT ? 1 : direction === Direction.LEFT ? -1 : 0),
		snakeBody[snakeBody.length - 1].y + (direction === Direction.DOWN ? 1 : direction === Direction.UP ? -1 : 0)
	));

	if(snakeBody.length > snakeLength)
		snakeBody.shift();

	if(snakeBody[snakeBody.length - 1].x < 0)
		snakeBody[snakeBody.length - 1].x = gridWidth - 1;

	if (snakeBody[snakeBody.length - 1].x > gridWidth)
		snakeBody[snakeBody.length - 1].x = 0;

	if(snakeBody[snakeBody.length - 1].y < 0)
		snakeBody[snakeBody.length - 1].y = gridHeight - 1;

	if(snakeBody[snakeBody.length - 1].y > gridHeight)
		snakeBody[snakeBody.length - 1].y = 0;

	for(var i = 0; i < snakeBody.length - 1; i++) {
		if(	snakeBody[i].x === snakeBody[snakeBody.length - 1].x &&
			snakeBody[i].y === snakeBody[snakeBody.length - 1].y) {
			snakeBody = [snakeBody[snakeBody.length - 1]];
			//snakeLength = 3;
		}
	}

	if(	snakeBody[snakeBody.length - 1].x === foodLocation.x &&
		snakeBody[snakeBody.length - 1].y === foodLocation.y) {
		foodLocation.x = Math.floor(Math.random() * gridWidth);
		foodLocation.y = Math.floor(Math.random() * gridHeight);
		snakeLength++;
	}

	//ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < snakeBody.length; i++) {
		ctx.fillRect(gridScale * snakeBody[i].x, gridScale * snakeBody[i].y, gridScale, gridScale);
		ctx.strokeRect(gridScale * snakeBody[i].x, gridScale * snakeBody[i].y, gridScale, gridScale);
	}
	ctx.fillRect(gridScale * snakeBody[snakeBody.length - 1].x, gridScale * snakeBody[snakeBody.length - 1].y, gridScale, gridScale);

	ctx.fillStyle = "rgba(255,255,0,0.8)";
	ctx.fillRect(gridScale * foodLocation.x, gridScale * foodLocation.y, gridScale, gridScale);

	if(foodLocation.x + foodMovement.x < 0)
		foodMovement.x = 1;

	if(foodLocation.x + foodMovement.x > gridWidth)
		foodMovement.x = -1;

	if(foodLocation.y + foodMovement.y < 0)
		foodMovement.y = 1;

	if(foodLocation.y + foodMovement.y > gridHeight)
		foodMovement.y = -1;

	if(tickNum % 6 == 0){
		foodLocation.x += foodMovement.x;
		foodLocation.y += foodMovement.y;
	}

	ctx.fillStyle = "white";
	ctx.font = "20px monospace";
	ctx.fillText("Snake Pong", 10, 20);

	ctx.font = "12px Arial";
	ctx.fillText("By @ w o n g m j a n e", 10, canvas.height - 5);
}

setInterval(tick, tickspeed);

window.addEventListener("keydown", function(ev) {
	if(	ev.keyCode === Direction.LEFT && direction !== Direction.RIGHT ||
		ev.keyCode === Direction.RIGHT && direction !== Direction.LEFT ||
		ev.keyCode === Direction.UP && direction !== Direction.DOWN ||
		ev.keyCode === Direction.DOWN && direction !== Direction.UP)
		direction = ev.keyCode;
}, false);
