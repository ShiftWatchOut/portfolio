class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  get coordinate() {
    return [this.x, this.y]
  }
  static from(x, y) {
    return new Point(x, y)
  }
  distanceFrom(ax, ay) {
    let insideAx = ax,
      insideAy = ay
    if (ax instanceof Point) {
      insideAy = ax.y
      insideAx = ax.x
    }
    return Math.hypot(this.x - insideAx, this.y - insideAy)
  }
}

class Circle {
  constructor(p, r, v, c) {
    this.radius = r
    this.color = c
    /** @type {Point} */
    this.position = p
    /** @type {Point} */
    this.velocity = v
  }
  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
  }
  /**
   * @param {CanvasRenderingContext2D } ctx
   */
  render(ctx) {
    ctx.beginPath()
    ctx.fillStyle = this.color
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

function random(n) {
  return Math.random() * n
}

function randomBetween(min, max) {
  return random(Math.abs(max - min)) + min
}

/**
 * @param {CanvasRenderingContext2D } ctx
 * @param {number} w
 * @param {number} h
 */
export function startAnimation(ctx, w, h) {
  // 生成随机点
  const counts = 300
  const limitedGap = 80
  /** @type {Circle[]} */
  const circleGroup = []
  for (let i = 0; i < counts; i++) {
    const newPos = Point.from(random(w), random(h))
    const newV = Point.from(randomBetween(-1, 1), randomBetween(-1, 1))
    circleGroup.push(new Circle(newPos, randomBetween(1, 4), newV, 'white'))
  }
  const loop = () => {
    ctx.clearRect(0, 0, w, h)
    // 更新随机点
    for (let i = 0; i < counts; i++) {
      let c = circleGroup[i]
      c.position.x += c.velocity.x
      c.position.y += c.velocity.y
      if (c.x - c.radius < 0 || c.x + c.radius > w) {
        c.velocity.x = -c.velocity.x
      }
      if (c.y - c.radius < 0 || c.y + c.radius > h) {
        c.velocity.y = -c.velocity.y
      }
      c.render(ctx)
      for (let j = 0; j < counts; j++) {
        if (j !== i) {
          const cj = circleGroup[j]
          const dis = cj.position.distanceFrom(c.position)
          if (dis < limitedGap) {
            const rate = dis / limitedGap
            ctx.strokeStyle = `RGBA(255, 255, 255, ${1 - rate})`
            ctx.beginPath()
            ctx.moveTo(c.x, c.y)
            ctx.lineTo(cj.x, cj.y)
            ctx.stroke()
          }
        }
      }
    }
    aniId = requestAnimationFrame(loop)
  }
  // console.log('looooooooop', circleGroup)
  let aniId = requestAnimationFrame(loop)
  return () => {
    cancelAnimationFrame(aniId)
  }
}
