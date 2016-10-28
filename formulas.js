// the subclasses of Force are only equipped to apply in one direction
// a bidirectional force will need to be instantiated twice, once in each direction
// follow the instructions on each subclass
class Force {
  compute() {
    return { x: 0, y: 0 } // should be over-ridden
  }
  applyToAccel(accel, mass, dt) {
    var force = this.compute()
    // console.log(force, dt)
    accel.x += force.x / mass * dt
    accel.y += force.y / mass * dt
  }
}

// newton's law of universal gravitation
// this is applied on pointMass2 by pointMass1
// applyToAccel() should be called on pointMass2
const G = 6.673e-11
class GravitationalForce extends Force {
  constructor (pointMass1, pointMass2) {
    super()
    this.pointMass1 = pointMass1
    this.pointMass2 = pointMass2
  }
  compute() {
    var pm1 = this.pointMass1, pm2 = this.pointMass2
    var direction = (new Vec2(pm1.x - pm2.x, pm1.y - pm2.y)).normalize(true)
    var distance = pm1.distance(pm2)
    var F = (G * this.pointMass1.mass * this.pointMass2.mass) / (distance * distance)
    // console.log(distance, F)
    return direction.multiply(F, true)
  }
}

// hooke's law
// this is applied on pointMass2 by pointMass1
// applyToAccel() should be called on pointMass2
class SpringForce extends Force {
  constructor (pointMass1, pointMass2, stiffness, restingDistance) {
    super()
    this.pointMass1 = pointMass1
    this.pointMass2 = pointMass2
    this.stiffness = stiffness
    this.restingDistance = restingDistance
  }
  compute() {
    var pm1 = this.pointMass1, pm2 = this.pointMass2
    var k = this.stiffness
    var x = this.restingDistance - pm1.distance(pm2)
    var direction = (new Vec2(pm1.x - pm2.x, pm1.y - pm2.y)).normalize(true)
    return direction.multiply(-k * x, true)
  }
}

function calculateDilation(centerMass, pointMass, maxDistance, standardFrameTime) {
  // modify the passage of time using the same basic ratio used in newton's gravity
  var distance = (pointMass.distance(centerMass))// / (maxDistance*10))
  // console.log(distance)
  return standardFrameTime * (distance * distance) / 1e5 // * 100
} 

class Acceleration extends Vec2 {
  applyToVel(vel, dt) {
    vel.x += this.x * dt
    vel.y += this.y * dt
  }
}

class Velocity extends Vec2 {
  applyToPos(pos, dt) {
    pos.x += this.x * dt
    pos.y += this.y * dt
  }
}

class PointMass extends Vec2 {
  constructor({ x, y, mass, radius, vel, forces }) {
    super(x, y)
    this.mass = mass
    this.vel = vel
    this.forces = forces

    this.graphic = canvas.display.ellipse({ x, y, fill: "#eee", radius })
    this.graphic.add()
  }
  tickForces(dt) {
    // apply forces
    var accel = new Acceleration()
    // console.log(this.forces)
    this.forces.forEach(force => force.applyToAccel(accel, this.mass, dt))
    // console.log(accel)
    accel.applyToVel(this.vel, dt)
    // console.log(this.vel)
  }
  tickPosition(dt) {
    // console.log(dt)
    this.vel.applyToPos(this, dt)

    // update graphic
    this.graphic.x = this.x
    this.graphic.y = this.y
  }
}