const FPS = 60
const standardFrameTime = 1000 / 60 // 16.666667
const pointMassDistance = 40
var dilationEnabled = false

var canvas = oCanvas.create({
  canvas: "#canvas",
  background: "#222",
  fps: 60
});

// Center object
var theCenterMass = new PointMass({
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: canvas.width / 50,
  mass: 1e8, // kg
  vel: new Velocity(0, 0),
  forces: []
})
theCenterMass.graphic.add();

// Two point-masses
var thePointMass1 = new PointMass({
  x: canvas.width * 1/2 + 50,
  y: canvas.height / 2,
  mass: 1, // kg
  radius: 5,
  vel: new Velocity(0, -0.2),
  forces: []
})
var thePointMass2 = new PointMass({
  x: canvas.width * 1/2 + 50 + pointMassDistance,
  y: canvas.height / 2,
  mass: 1, // kg
  radius: 5,
  vel: new Velocity(0, -0.2),
  forces: []
})

// Seven circles (purely visual)
var circleProto = canvas.display.ellipse({ stroke: "1px #999" });
for (var i = 0; i < 7; i++) {
  let c = ''+(15-i).toString('16')
  theCenterMass.graphic.addChild(circleProto.clone({
    x: 0,
    y: 0,
    radius: (i + 1) * canvas.width / 14,
    strokeColor: ('#'+c+c+c)
  }))
}

// Set up a tick function that will move all satellites each frame
canvas.setLoop(function () {
  var dt1 = standardFrameTime
  var dt2 = standardFrameTime
  if (dilationEnabled) {
    // modify the passage of time using the same basic ratio used in newton's gravity
    dt1 = calculateDilation(theCenterMass, thePointMass1, canvas.width / 2, standardFrameTime)
    dt2 = calculateDilation(theCenterMass, thePointMass2, canvas.width / 2, standardFrameTime)    
  }
  console.log(dt1, dt2, dt2 - dt1)

  // calculate force changes first, to make sure all forces use the same position info
  thePointMass1.tickForces(dt1)
  thePointMass2.tickForces(dt2)
  // then calculate position changes
  thePointMass1.tickPosition(dt1)
  thePointMass2.tickPosition(dt2)
});

// setup1 - only the gravity force
function setup1 () {
  thePointMass1.forces.push(new GravitationalForce(theCenterMass, thePointMass1))
  thePointMass2.forces.push(new GravitationalForce(theCenterMass, thePointMass2))
  dilationEnabled = false
}
// setup1b - gravity force, with the spring force added
function setup1b () {
  thePointMass1.forces.push(new SpringForce(thePointMass2, thePointMass1, 0.0001, pointMassDistance))
  thePointMass2.forces.push(new SpringForce(thePointMass1, thePointMass2, 0.0001, pointMassDistance))
  thePointMass1.forces.push(new GravitationalForce(theCenterMass, thePointMass1))
  thePointMass2.forces.push(new GravitationalForce(theCenterMass, thePointMass2))
  dilationEnabled = false
}
// setup2 - only the spring force, with dilation
function setup2 () {
  thePointMass1.forces.push(new SpringForce(thePointMass2, thePointMass1, 0.001, pointMassDistance))
  thePointMass2.forces.push(new SpringForce(thePointMass1, thePointMass2, 0.001, pointMassDistance))
  dilationEnabled = true
}

setup2()
canvas.timeline.start()