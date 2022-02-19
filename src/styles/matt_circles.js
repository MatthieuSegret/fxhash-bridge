// Camille Roux
// Status: Don't mint // "WIP", "Ready"
// Twitter: @camillerouxart
// Fxhash: https://www.fxhash.xyz/u/Camille%20Roux
// Wallet: tz1WEZkz46AZmGbW32qwUHsdA2PBBATgixth

import { Vector } from 'p5'
import Style from './style'

export default class MattCirclesStyle extends Style {
  constructor (gridSizeX, gridSizeY, s, projectionCalculator3d, p5) {
    super(gridSizeX, gridSizeY, s, projectionCalculator3d, p5)
    this.refSize = this._s * 0.04
    this.starsGap = this.refSize * 1
    this.minSkyHeight = this._s / 3
    this.borderGap = this._s / 20
    this.nbStars = 200

    // Initialize colors
    this.bgColors = ['#03045E', '#02316F', '#012C65', '#00466B']
    this.bgShadowColor = '#000'

    this.birdsColors = ['#0096c7', '#00b4d8', '#48cae4']
    this.birdsShadowColor = '#023e8a'

    this.starsColors = ['#ffba08', '#faa307', '#f48c06']
    this.starsShadowColor = '#e85d04'

    // Create textures and mask for birds
    this.birdsMask = this.createGraphics(s, s)
    this.birdsTexture = this.createGraphics(s, s)
    this.birdsArea = this.getBirdsArea()

    // Create textures and mask for stars
    this.starsMask = this.createGraphics(s, s)
    this.starsTexture = this.createGraphics(s, s)

    this.flowField = this.createFlowField()
  }

  beforeDraw () {
    // Generate textures
    this.background(this.bgColors, this.bgShadowColor, this._p5)
    this.background(this.birdsColors, this.birdsShadowColor, this.birdsTexture)
    this.background(this.starsColors, this.starsShadowColor, this.starsTexture)
  }

  drawTile (tilePoints, frontLeftCorner3DCoord, isBorder) {
    // Draw birds on mask
    this.birdsMask.push()
    this.birdsMask.fill('#000')
    this.bird(tilePoints, this.birdsMask)
    this.birdsMask.pop()
  }

  afterDraw () {
    // Draw stars on mask
    this.drawStarsMask(this.nbStars, this.starsMask)

    // Draw birds and stars with textures on sketch
    this.drawImage(this.birdsMask, this.birdsTexture)
    this.drawImage(this.starsMask, this.starsTexture)

    // Draw border
    this.border(this.borderGap, this.bgColors[0])
  }

  getBirdsArea () {
    const p1 = this._p5.createVector().set(this._projectionCalculator3d.getProjectedPoint([-this._gridSizeX / 2, 0, 0]))
    const p2 = this._p5.createVector().set(this._projectionCalculator3d.getProjectedPoint([this._gridSizeX / 2, 0, 0]))
    const p3 = this._p5.createVector().set(this._projectionCalculator3d.getProjectedPoint([-this._gridSizeX / 2, this._gridSizeY, 0]))
    const p4 = this._p5.createVector().set(this._projectionCalculator3d.getProjectedPoint([this._gridSizeX / 2, this._gridSizeY, 0]))
    const gap = this.refSize * 1.2

    const area = [p1, p2, p3, p4].map((p) => {
      return new Vector(p.x * this._s, p.y * this._s)
    })

    if (area[2].y < this.minSkyHeight) area[2].y = this.minSkyHeight
    if (area[3].y < this.minSkyHeight) area[3].y = this.minSkyHeight

    const g = this.createGraphics(this._s, this._s)
    g.background('#fff')
    g.fill('#000')
    g.quad(area[0].x - gap, area[0].y, area[1].x + gap, area[1].y, area[3].x + gap, area[3].y - gap, area[2].x - gap, area[2].y - gap)

    const img = this.toImage(g)
    img.loadPixels()
    return img
  }

  drawStarsMask (nbStars, g) {
    const stars = []
    const [smallSize, mediumSize, largeSize] = [0.3 * this.refSize, 0.5 * this.refSize, 0.7 * this.refSize]

    for (let i = 0; i < nbStars; i++) {
      // Draw the biggest ones first
      let size = largeSize
      if (i > nbStars * 0.2 && i <= nbStars * 0.5) size = mediumSize
      if (i > nbStars * 0.2) size = smallSize
      const newStar = this.tryCreateStar(stars, size)
      if (newStar) stars.push(newStar)
    }

    g.push()
    g.strokeWeight(this.refSize * 0.15)
    stars.forEach((star) => {
      const drawStar = this._p5.random([this.star1, this.star2])
      const nbRay = this._p5.random([3, 4, 5])
      drawStar.call(this, star.x, star.y, star.size, nbRay, g)
    })
    g.pop()
  }

  tryCreateStar (stars, size) {
    let attempts = 0
    let star

    while (star === undefined) {
      star = this.createStar(size)

      stars.forEach((s) => {
        if (this.overlap(star, s)) {
          star = undefined
        }
      })

      if (!this.inTheSky(star)) {
        star = undefined
      }

      attempts++
      if (attempts > 100) {
        break
      }
    }

    return star
  }

  createStar (size) {
    const border = this.borderGap + this.refSize * 0.2
    const x = this._p5.random(border, this._s - border)
    const y = this._p5.random(border, this._s - border)
    return { x, y, size }
  }

  overlap (s1, s2) {
    if (s1 === undefined || s2 === undefined) return true
    const d = this._p5.dist(s1.x, s1.y, s2.x, s2.y)
    return d < s1.size / 2 + s2.size / 2 + this.starsGap
  }

  inTheSky (star) {
    if (star === undefined) return false
    const img = this.birdsArea
    const [r, g, b] = img.get(star.x, star.y)
    const pixelc = this._p5.color(r, g, b)

    return (pixelc.toString() === this._p5.color(255).toString())
  }

  star1 (x, y, r, nbRays, g) {
    g.push()
    g.noFill()
    const start = this._p5.random(-Math.PI / 6)
    for (let a = start; a < 2 * Math.PI - start; a += Math.PI / nbRays) {
      const p1 = new Vector(x + r * Math.cos(a), y + r * Math.sin(a))
      const p2 = new Vector(x + r * Math.cos(a - Math.PI), y + r * Math.sin(a - Math.PI))
      g.line(p1.x, p1.y, p2.x, p2.y)
    }
    g.pop()
  }

  star2 (x, y, r, nbRays, g) {
    g.push()
    g.noStroke()
    g.beginShape()
    let i = 0
    const start = this._p5.random(-Math.PI / 6)
    for (let a = start; a < 2 * Math.PI - start; a += Math.PI / nbRays) {
      const radius = i % 2 === 0 ? r : r / 2
      g.vertex(x + radius * Math.cos(a), y + radius * Math.sin(a))
      i++
    }
    g.endShape(g.CLOSE)
    g.pop()
  }

  bird (tilePoints, g) {
    // Don't display the birds over 1/3 of the sky
    if (tilePoints[3].y * this._s < this.minSkyHeight) return

    const [minWeight, maxWeight] = [this.refSize * 0.05, this.refSize * 0.2]
    const weight = this._p5.map(tilePoints[3].y * this._s, this.minSkyHeight, this._s, minWeight, maxWeight)
    const h = tilePoints[3].y - tilePoints[2].y
    const w = tilePoints[1].x - tilePoints[2].x
    const p0 = new Vector((tilePoints[3].x + tilePoints[0].x) / 2 * this._s, (tilePoints[3].y - 2 * h / 3) * this._s)
    const p1 = new Vector((tilePoints[2].x + 1 / 6 * w) * this._s, tilePoints[2].y * this._s)
    const p2 = new Vector((tilePoints[1].x - 1 / 6 * w) * this._s, tilePoints[1].y * this._s)

    g.push()
    g.noFill()
    g.strokeWeight(weight)

    g.beginShape()
    g.vertex(p1.x, p1.y)
    g.vertex(p0.x, p0.y)
    g.vertex(p2.x, p2.y)
    g.endShape()
    g.pop()
  }

  background (colors, shadowColor, g) {
    const rs = this.refSize
    const size = rs * 0.35
    const weight = rs * 0.12

    g.push()
    g.background(colors[0])
    g.noFill()
    g.strokeWeight(weight)

    // Setting shadow
    const dc = g.drawingContext
    dc.shadowOffsetX = rs * 0.03
    dc.shadowOffsetY = rs * 0.03
    dc.shadowColor = shadowColor

    let x = 0
    let y = -size
    for (let i = 0; i < 110; i++) {
      x = (i % 2 === 0) ? -4.4 * weight : 0
      y += size - 1 * weight
      for (let j = 0; j < 50; j++) {
        for (let k = 0; k < 2; k++) {
          const color = g.random(colors)
          g.stroke(color)
          x += 2.2 * weight
          y = (k % 2 === 0) ? y + size / 8 : y - size / 8

          g.push()
          g.translate(x, y)
          g.rotate(this.flowField[i][j])
          g.line(0, 0, 0, size)
          g.pop()
        }
      }
    }
    g.pop()
  }

  border (weight, color) {
    this._p5.stroke(color)
    this._p5.strokeWeight(weight)
    this._p5.noFill()
    this._p5.rect(0, 0, this._s, this._s)
  }

  createFlowField () {
    const flowField = []
    const inc = 0.02
    let yoff = 0

    for (let y = 0; y < 110; y++) {
      let xoff = 0
      flowField[y] = []
      for (let x = 0; x < 50; x++) {
        flowField[y][x] = this._p5.noise(xoff, yoff) * Math.PI * 2
        xoff += inc
      }
      yoff += inc
    }

    return flowField
  }

  toImage (g, density) {
    density ||= g.pixelDensity()
    const img = this._p5.createImage(g.width * density, g.height * density)
    img.copy(g, 0, 0, g.width, g.height, 0, 0, g.width * density, g.height * density)
    return img
  }

  drawImage (mask, texture) {
    const maskImg = this.toImage(mask)
    const img = this.toImage(texture)
    img.mask(maskImg)
    this._p5.image(img, 0, 0, this.s, this.s)
  }

  createGraphics (w, h) {
    const g = this._p5.createGraphics(w, h)
    const pixelDensity = this._p5.pixelDensity()
    g.scale(1 / pixelDensity, 1 / pixelDensity)
    g.background(this._p5.color(255, 255, 255, 0))
    return g
  }

  static author () {
    return 'Matt Circles'
  }

  static name () {
    return 'Birds under the stars'
  }
}
