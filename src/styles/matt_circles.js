// Camille Roux
// Status: Don't mint // "WIP", "Ready"
// Twitter: @camillerouxart
// Fxhash: https://www.fxhash.xyz/u/Camille%20Roux
// Wallet: tz1WEZkz46AZmGbW32qwUHsdA2PBBATgixth

import Style from './style'

export default class MattCirclesStyle extends Style {
  constructor (gridSizeX, gridSizeY, s, projectionCalculator3d, p5) {
    super(gridSizeX, gridSizeY, s, projectionCalculator3d, p5)
    this.refSize = this._s * 0.04
  }

  beforeDraw () {
    this._p5.background('#ffffff')
  }

  drawTile (tilePoints, frontLeftCorner3DCoord, isBorder) {
  }

  afterDraw () {
  }

  static author () {
    return 'Matt Circles'
  }

  static name () {
    return 'Under the stars'
  }
}
