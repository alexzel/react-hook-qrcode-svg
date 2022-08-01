/**
 * @license react-hook-qrcode-svg
 * Copyright (c) 2022, Alex Zelensky. (MIT License)
 * https://github.com/alexzel/react-hook-qrcode
 */

import { useMemo } from 'react'
import QRC from '../QR-Code-generator/typescript-javascript/qrcodegen'

type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

interface Rectangle {
  x?: number
  y?: number
  width: number
  height: number
}

type ExcludeArea = Rectangle & {
  baseSize: number
}

interface ExcludePoints {
  x1: number
  y1: number
  x2: number
  y2: number
}

interface QrCode {
  path: string
  viewBox: string
  excludePoints?: ExcludePoints
}

function errorLevelToEcc (level: ErrorLevel): QRC.Ecc {
  switch (level) {
    case 'L' as const: return QRC.Ecc.LOW
    case 'M': return QRC.Ecc.MEDIUM
    case 'Q': return QRC.Ecc.QUARTILE
    default: return QRC.Ecc.HIGH
  }
}

export default (
  text: string,
  level: ErrorLevel = 'L',
  border: number = 0,
  exclude: ExcludeArea | null = null
): QrCode =>
  useMemo(() => {
    if (text === '') {
      return {
        path: '',
        viewBox: ''
      }
    }

    const qr = QRC.encodeText(text, errorLevelToEcc(level))
    const { size } = qr

    let e: ExcludePoints | undefined
    let x1Floor: number = 0
    let y1Floor: number = 0

    if (exclude !== null) {
      const scale = (size + border * 2) / exclude.baseSize

      const x1 = exclude.x !== undefined
        ? exclude.x >= 0
          ? exclude.x * scale
          : (exclude.baseSize + exclude.x - exclude.width / 2) * scale - border
        : size / 2 - exclude.width / 2 * scale

      const y1 = exclude.y !== undefined
        ? exclude.y >= 0
          ? exclude.y * scale
          : (exclude.baseSize + exclude.y - exclude.height / 2) * scale - border
        : size / 2 - exclude.height / 2 * scale

      const x2 = x1 + exclude.width * scale
      const y2 = y1 + exclude.height * scale

      e = { x1, y1, x2, y2 }
      x1Floor = Math.floor(x1)
      y1Floor = Math.floor(y1)
    }

    let path: string = ''
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (qr.getModule(x, y)) {
          if (e === undefined || x < x1Floor || x > e.x2 || y < y1Floor || y > e.y2) {
            path = `${path.length > 0 ? `${path} ` : ''}M${x + border},${y + border}h1v1h-1z`
          }
        }
      }
    }

    const viewBoxSize = size + border * 2
    const viewBox = `0 0 ${viewBoxSize} ${viewBoxSize}`

    return {
      path,
      viewBox,
      excludePoints: e
    }
  }, [text, border, level])
