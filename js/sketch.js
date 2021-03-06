var w = window.innerWidth;
var h = window.innerHeight;
var shapes = [];
var points = [];
var colors = [];
var viewerMode = false;
var i = 0;
var j = 0;
var bgColor = 0;
var weight = 5;
var increase = true;
var strokeColors;
var strokeN = 0;
var effectN = 0;
var view = false;

var ref = new Firebase("redraw.firebaseIO.com");
var shapesRef = ref.child("drawings");

function setup() {
  var redColor = color(255, 0, 0);
  var greenColor = color(0, 255, 0);
  var blueColor = color(0, 0, 255);
  var darkGray = color(50, 50, 50);
  var lightGray = color(200, 200, 200);
  strokeColors = new Array(lightGray, darkGray, redColor, greenColor, blueColor);
  createCanvas(w, h);
  // smooth();
  noSmooth();
}

function draw() {
  blockScroll();
  noFill();
  background(bgColor);

  strokeWeight(weight);
  for (var k = 0; k < shapes.length; k++) {
    beginShape();
    stroke(strokeColors[colors[k]]);
    for (var l = 0; l < shapes[k].length; l++) {
      if (l==0 || l==shapes[k].length-1) {
        curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
      }
      curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
    }
    endShape();
  }
  stroke(strokeColors[strokeN]);
  beginShape();
  for (var key in points) {
    if (key==0 || key==points.length-1) {
      curveVertex(points[key].x*w, points[key].y*h);
    }
    curveVertex(points[key].x*w, points[key].y*h);
  }
  endShape();

  if (mouseIsPressed && !viewerMode) {
    if (points.length == 0) {
      if (mouseY > 55) {
        points.push({x: mouseX/w, y:mouseY/h});
      }
    } else {
      points.push({x: mouseX/w, y:mouseY/h});
    }
  } else if (touchIsDown && !viewerMode) {
    if (points.length == 0) {
      if (touchY > 55) {
        points.push({x: touchX/w, y:touchY/h});
      }
    } else {
      points.push({x: touchX/w, y:touchY/h});
    }
  } else {
    points = [];
  }

  if (viewerMode || view) {
    // smooth();
    background(bgColor);
    if (i < shapes.length && !view) {
      for (var k = 0; k <= i; k++) {
        // smooth();
        beginShape();
        stroke(strokeColors[colors[k]]);
        if (k == i) {
          for (var l = 0; l <= j; l++) {
            if (l==0 || l==j) {
              curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
            }
            curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
            if (0 == j) {
              curveVertex(shapes[k][l].x*w+0.5, shapes[k][l].y*h+0.5);
              curveVertex(shapes[k][l].x*w+0.5, shapes[k][l].y*h+0.5);
            }
          }
        } else {
          for (var l = 0; l < shapes[k].length; l++) {
            curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
            if (l==0 || l==shapes[k].length-1) {
              curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
            }
            curveVertex(shapes[k][l].x*w, shapes[k][l].y*h);
          }
        }
        endShape();
      }
      if (j < shapes[i].length - 1) {
        j++;
      } else {
        i++;
        j = 0;
      }
    } else {
      if (effectN === 0) {
        if (weight > 9) {
          increase = false;
        } else if (weight < 4) {
          increase = true;
        }
        if (increase) {
          weight += 0.3;
        } else {
          weight -= 0.1;
        }
      } else {
        weight = 5;
      }
      for (var k = 0; k < shapes.length; k++) {
        stroke(strokeColors[colors[k]]);
        // smooth();
        beginShape();
        for (var l = 0; l < shapes[k].length; l++) {
          var x = shapes[k][l].x*w;
          var y = shapes[k][l].y*h;
          if (l==0 || l==shapes[k].length-1) {
            curveVertex(x, y);
          }
          curveVertex(x, y);
          if (effectN === 1) {
            ellipse(x+random(4)-random(4), y+random(4)-random(4), 2+random(2), 2+random(2));
          }
        }
        endShape();
      }
    }
  }
}

function mouseReleased() {
  if (points.length != 0) {
    shapes.push(points);
    colors.push(strokeN);
  }
}

function touchEnded() {
  touchIsDown = false;
  if (points.length != 0) {
    shapes.push(points);
    colors.push(strokeN);
  }
}

function share() {
  var newShapesRef = shapesRef.push();
  newShapesRef.set({shapes: shapes, bgColor: bgColor, colors: colors, effectN: effectN});
  window.open("http://jackbdu.github.io/redrawer/drawings/?"+newShapesRef.path.o[1]);
}

function clearAll() {
  shapes = [];
  colors = [];
}

function toggleBackground() {
  if (bgColor == 0) {
    bgColor = 255;
  } else {
    bgColor = 0;
  }
}

function changeColor() {
  if (strokeN < strokeColors.length - 1) {
    strokeN++;
  } else {
    strokeN = 0;
  }
  var theRGBA = strokeColors[strokeN].rgba;
  $('#color').css('background-color', 'rgb('+theRGBA[0]+','+theRGBA[1]+','+theRGBA[2]+')');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  w = window.innerWidth;
  h = window.innerHeight;
}

function viewEdit() {
  view = !view;
}

function changeEffect() {
  if (effectN < 1) {
    effectN++;
  } else {
    effectN = 0;
  }
}

// block scrolling in iphone
function blockScroll() {
  $("body").swipe({
    swipe:function(event, direction, distance, duration, fingerCount) {
      var swipeDirection = direction;
    }
  });
}
