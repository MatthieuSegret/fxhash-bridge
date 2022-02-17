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
  }

  beforeDraw () {
    this.background(this.bgColors)
  }

  drawTile (tilePoints, frontLeftCorner3DCoord, isBorder) {
    // this._p5.stroke(this.defaultColor)
    // this._p5.fill(isBorder ? this.colors[2] : this.defaultColor)
    // this._p5.quad(tilePoints[0].x * this._s, tilePoints[0].y * this._s, tilePoints[1].x * this._s, tilePoints[1].y * this._s, tilePoints[2].x * this._s, tilePoints[2].y * this._s, tilePoints[3].x * this._s, tilePoints[3].y * this._s)
  }

  afterDraw () {
    // this._p5.stroke(this.colors[0])
    // this._p5.strokeWeight(0.05 * this._s)
    // this._p5.noFill()
    // this._p5.rect(0, 0, this._s, this._s)
  }

  background (colors) {
    const rs = this.refSize
    const size = rs * 0.25
    const weight = rs * 0.12

    this._p5.push()
    this._p5.background(this.bgColors[0])
    this._p5.noFill()
    this._p5.strokeWeight(weight)

    // Setting shadow
    const dc = this._p5.drawingContext
    dc.shadowOffsetX = rs * 0.03
    dc.shadowOffsetY = rs * 0.03
    dc.shadowColor = '#000'

    let x = 0
    let y = 0
    for (let i = 0; i < 100; i++) {
      x = 0
      y += size
      for (let j = 0; j < 160; j++) {
        // intermingles line1 and line2
        const line1 = [new Vector(x, y - size), new Vector(x - size, y)]
        const line2 = [new Vector(x - size, y - size), new Vector(x, y)]
        const lines = [line2, line1]
        if (j % 2 === 0) lines.reverse()
        y = (j % 2 === 0) ? y + size / 6 : y - size / 6
        x -= 0.8 * weight

        for (let k = 0; k < 2; k++) {
          const color = this._p5.random(this.bgColors)
          this._p5.stroke(color)
          x += 1.5 * weight
          y = (k % 2 === 0) ? y + size / 10 : y - size / 10
          const line = lines.pop()
          this._p5.line(line[0].x, line[0].y, line[1].x, line[1].y)
        }
      }
    }

    this._p5.pop()
  }

  static author () {
    return 'Matt Circles'
  }

  static name () {
    return 'Under the stars'
  }
}
