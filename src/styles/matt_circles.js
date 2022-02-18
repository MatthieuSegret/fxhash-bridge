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
    this.bgColors = ['#03045E', '#02316F', '#012C65', '#00466B']
    this.tilesColors = ['#212529', '#343a40', '#495057', '#6c757d']

    this.tilesMask = this._p5.createGraphics(s, s)
    this.tilesTexture = this._p5.createGraphics(s, s)
  }

  beforeDraw () {
    this.background(this.bgColors)
    this.background(this.tilesColors, this.tilesTexture)

    // Initialize tiles graphics
    this.tilesMask.background(this._p5.color(255, 255, 255, 0))

    const pixelDensity = this._p5.pixelDensity()
    this.tilesMask.scale(1 / pixelDensity, 1 / pixelDensity)
  }

  drawTile (tilePoints, frontLeftCorner3DCoord, isBorder) {
    this.tilesMask.push()
    this.tilesMask.fill('#000000')
    this.tilesMask.quad(tilePoints[0].x * this._s, tilePoints[0].y * this._s, tilePoints[1].x * this._s, tilePoints[1].y * this._s, tilePoints[2].x * this._s, tilePoints[2].y * this._s, tilePoints[3].x * this._s, tilePoints[3].y * this._s)
    this.tilesMask.pop()
  }

  afterDraw () {
    const tilesMaskImg = this.toImage(this.tilesMask, 2)
    const tilesImg = this.toImage(this.tilesTexture, 2)
    tilesImg.mask(tilesMaskImg)
    this._p5.image(tilesImg, 0, 0, this.s, this.s)
  }

  background (colors, graphics) {
    const g = (graphics === undefined) ? this._p5 : graphics
    const rs = this.refSize
    const size = rs * 0.25
    const weight = rs * 0.12
    const pixelDensity = this._p5.pixelDensity()

    g.push()
    if (graphics !== undefined) g.scale(1 / pixelDensity, 1 / pixelDensity)
    g.background(this.bgColors[0])
    g.noFill()
    g.strokeWeight(weight)

    // Setting shadow
    const dc = g.drawingContext
    dc.shadowOffsetX = rs * 0.03
    dc.shadowOffsetY = rs * 0.03
    dc.shadowColor = '#000'

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

  toImage (g, density) {
    density ||= g.pixelDensity()
    const img = this._p5.createImage(g.width * density, g.height * density)
    img.copy(g, 0, 0, g.width, g.height, 0, 0, g.width * density, g.height * density)
    return img
  }

  static author () {
    return 'Matt Circles'
  }

  static name () {
    return 'Under the stars'
  }
}
