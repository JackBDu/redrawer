var w = window.innerWidth;
var h = window.innerHeight;
var shapes = [];
var points = [];
var onload = false;

function setup() {
  createCanvas(w, h);
  background(0);
  smooth();
}

function draw() {
  stroke(255);
  strokeWeight(5);
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
    points.push({x: mouseX, y:mouseY});
  } else {
    points = [];
  }

  if (onload) {
    for (var j = 0; j < shapes.length; j++) {
      for (var i = 1; i < shapes[j].length; i++) {
        line(shapes[j][i-1].x, shapes[j][i-1].y+200, shapes[j][i].x, shapes[j][i].y+200);
      }
    }
  }
}

function mouseReleased() {
  // shapes.push(points);
}

function keyPressed() {

}

function keyTyped() {
  if (key === 'u') {
    uploadShapes(shapes);
  } else if (key === 'l') {
    shapesRef.on("value", function(snapshot) {
      var drawings = snapshot.val();
      for (var key in drawings) {
        if (key === "-Jr6_ryP1ErCiU_7MQtp") {
          shapes = drawings[key].shapes;
          console.log("what");
        }
      }
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

    onload = true;
  }
}

function keyReleased() {

}