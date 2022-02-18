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

    // Initialize colors
    this.bgColors = ['#03045E', '#02316F', '#012C65', '#00466B']
    this.birdsColors = ['#0096c7', '#00b4d8', '#48cae4']

    // Create textures and mask for birds
    this.birdsMask = this.createGraphics(s, s)
    this.birdsTexture = this.createGraphics(s, s)
  }

  beforeDraw () {
    // Generate textures
    this.background(this.bgColors, '#000', this._p5)
    this.background(this.birdsColors, '#023e8a', this.birdsTexture)
  }

  drawTile (tilePoints, frontLeftCorner3DCoord, isBorder) {
    // Draw birds on mask
    this.birdsMask.push()
    this.birdsMask.fill('#000000')
    if (!isBorder) this.bird(tilePoints, this.birdsMask)
    this.birdsMask.pop()
  }

  afterDraw () {
    // Draw birds with textures on sketch
    this.drawImage(this.birdsMask, this.birdsTexture)
  }

  background (colors, shadowColor, g) {
    const rs = this.refSize
    const size = rs * 0.25
    const weight = rs * 0.12

    g.push()
    g.background(this.bgColors[0])
    g.noFill()
    g.strokeWeight(weight)

    // Setting shadow
    const dc = g.drawingContext
    dc.shadowOffsetX = rs * 0.03
    dc.shadowOffsetY = rs * 0.03
    dc.shadowColor = shadowColor

    let x = 0
    let y = 0
    for (let i = 0; i < 100; i++) {
      x = 0
      y += size
      for (let j = 0; j < 160; j++) {
        const line = [new Vector(x, y - size), new Vector(x - size, y)]
        y = (j % 2 === 0) ? y + size / 6 : y - size / 6
        x -= 0.8 * weight

        for (let k = 0; k < 2; k++) {
          const color = g.random(colors)
          g.stroke(color)
          x += 1.5 * weight
          y = (k % 2 === 0) ? y + size / 10 : y - size / 10
          g.line(line[0].x, line[0].y, line[1].x, line[1].y)
        }
      }
    }
    g.pop()
  }

  bird (tilePoints, g) {
    // Don't display the birds over 1/3 of the sky
    if (tilePoints[3].y * this._s < this._s / 3) return
    // Displays less birds
    if (this._p5.random() >= 0.5) return

    const weight = this._p5.map(tilePoints[3].y * this._s, this._s / 3, this._s, this.refSize * 0.05, this.refSize * 0.2)
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
