//Player class
var Player = (function () {

  function Player (x, y) {
    this.x = x;
    this.y = y;
    this.velocity = vec2(0,0);
    this.truePosition = gridCoordToBlock(x,y);
  }

  /*---------------- Vertices ---------------------*/

  Player.prototype.getVertices = function () {
    var vertices = [];

    vertices.push(this.truePosition);
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.06, 0)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.05)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.12)));
    vertices.push(add(this.truePosition, vec2(0.01, 0.07)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.11)));
    vertices.push(add(this.truePosition, vec2(0.03, 0.11)));
    vertices.push(add(this.truePosition, vec2(0.05, 0.08)));
    vertices.push(add(this.truePosition, vec2(0.05, 0.08)));
    vertices.push(add(this.truePosition, vec2(0.06, 0.1)));

    //TODO draw head

    return vertices
  };

  /*---------------- Vertices end ---------------------*/

  /*---------------- Movement ---------------------*/

  Player.prototype.moveLeft = function () {
    if( this.velocity[0] > - 0.025 ) {
      this.velocity = add(this.velocity, vec2(-0.02, 0));
    }
  };

  Player.prototype.moveRight = function () {
    if ( this.velocity[0] < 0.025) {
      this.velocity = add(this.velocity, vec2(0.02, 0));
    }
  };

  Player.prototype.jump = function () {
    if(this.velocity[1] == 0) {
      this.velocity = add(this.velocity, vec2(0,0.05));
    }
  };

  Player.prototype.updatePosition = function (){
    if(leftKeyDown) this.moveLeft();
    if(rightKeyDown) this.moveRight();
    if(upKeyDown) this.jump();

    this.truePosition = add(this.truePosition, this.velocity);

    // Gravity
    if(!this.isStandingOnBlock()) {
      this.velocity = add(this.velocity, vec2(0,-0.01));
    } else {
      console.log("block ramt")
      this.velocity = vec2(this.velocity[0], 0);
    }

    if(this.velocity[0] > 0) {
      this.velocity = add(this.velocity, vec2(-0.005,0));
    } else if (this.velocity[0] < 0) {
      this.velocity = add(this.velocity, vec2(0.005, 0));
    }

    if(Math.abs(this.velocity[0]) < 0.001){
      this.velocity[0] = 0;
    }

    if(this.colliding()){
      this.velocity[0] = 0;
    }

    var gridPos = worldToGrid(this.truePosition[0], this.truePosition[1]);
    this.x = gridPos[0];
    this.y = gridPos[1];
    console.log("x: " + this.x + " – y: " + this.y);
  };

  /*---------------- Movement end ---------------------*/

  /*---------------- Collision detection --------------*/

  Player.prototype.isStandingOnBlock = function () {
    if (this.y == 0) return true;
    if (world[this.x] != undefined) {
      var lowerBlock = world[this.x][this.y - 1];
    }
    if (lowerBlock != undefined &&
        gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08 >= this.truePosition[1]) {
      this.truePosition[1] = gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08;
      return true;
    }
    var rightLeg = worldToGrid(this.truePosition[0] + 0.04, this.truePosition[1]);

    if (world[rightLeg[0]] != undefined) {
      lowerBlock = world[rightLeg[0]][rightLeg[1]];
    }
    if (lowerBlock != undefined &&
        gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08 >= this.truePosition[1]) {
      this.truePosition[1] = gridCoordToBlock(lowerBlock.x, lowerBlock.y)[1] + 0.08;
      return true;
    }
  };

  Player.prototype.colliding = function () {
    if (this.x == 0) return true;
    var leftNeighbour;
    var leftNeighbour2;
    var rightNeighbour;
    var rightNeighbour2;
    var upperNeighbour;
    var upperNeighbour2;
    if(world[this.x -1] != undefined) {
      leftNeighbour = world[this.x - 1][this.y];
    }
    if(world[this.x -1] != undefined && this.y +1 <=25) {
      leftNeighbour2 = world[this.x - 1][this.y+1];
    }
    if(world[this.x+1] != undefined) {
      rightNeighbour = world[this.x + 1][this.y];
    }
    if(world[this.x+1] != undefined && this.y +1 <= 25) {
      rightNeighbour2 = world[this.x + 1][this.y +1];
    }
    if(world[this.x] != undefined && this.y +2 <= 25) {
      upperNeighbour = world[this.x][this.y +2];
    }
    if(world[this.x+1] != undefined && this.y +2 <= 25) {
      upperNeighbour = world[this.x+1][this.y +2];
    }

    if(leftNeighbour != undefined &&
        gridCoordToBlock(leftNeighbour.x, leftNeighbour.y)[0]+0.08 >= this.truePosition[0]) {
      this.truePosition[0] = gridCoordToBlock(leftNeighbour.x, leftNeighbour.y)[0]+0.08;
      return true;
    }
    if(leftNeighbour2 != undefined &&
        gridCoordToBlock(leftNeighbour2.x, leftNeighbour2.y)[0]+0.08 >= this.truePosition[0]) {
      this.truePosition[0] = gridCoordToBlock(leftNeighbour2.x, leftNeighbour2.y)[0]+0.08;
      return true;
    }

    if(rightNeighbour != undefined &&
        gridCoordToBlock(rightNeighbour.x, rightNeighbour.y)[0] <= this.truePosition[0]+0.06) {
      this.truePosition[0] = gridCoordToBlock(rightNeighbour.x, rightNeighbour.y)[0]-0.06;
    }
    if(rightNeighbour2 != undefined &&
        gridCoordToBlock(rightNeighbour2.x, rightNeighbour2.y)[0] <= this.truePosition[0]+0.06) {
      this.truePosition[0] = gridCoordToBlock(rightNeighbour2.x, rightNeighbour2.y)[0]-0.06;
    }

    if(upperNeighbour != undefined &&
        gridCoordToBlock(upperNeighbour.x, upperNeighbour.y)[1] <= this.truePosition[1]+0.13) {
      this.truePosition[1] = gridCoordToBlock(upperNeighbour.x, upperNeighbour.y)[1] - 0.13;
    }

    if(upperNeighbour2 != undefined &&
        gridCoordToBlock(upperNeighbour2.x, upperNeighbour2.y)[1] <= this.truePosition[1]+0.13) {
      this.truePosition[1] = gridCoordToBlock(upperNeighbour2.x, upperNeighbour2.y)[1] - 0.13;
    }

    if(this.truePosition[0] <= -1){
      this.truePosition[0] = -1;
      this.velocity[1] = 0;
    }
    if(this.truePosition[1] <= -1){
      this.truePosition[1] = -1;
      this.velocity[1] = 0;
    }
    if(this.truePosition[0] >= 1-0.06){
      this.truePosition[0] = 1-0.06;
      this.velocity[0] = 0;
    }
    if(this.truePosition[1] >= 1-0.16){
      this.truePosition[1] = 1-0.13;
      this.velocity[1] = -0.05;
    }
  }

  /*---------------- Collision detection end ----------*/

  Player.prototype.getX = function () {
    return this.truePosition[0];
  };

  Player.prototype.getY = function () {
    return this.truePosition[1];
  }

  return Player;
})();
