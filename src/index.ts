import { useMemo } from 'react'
import QRC from '../QR-Code-generator/typescript-javascript/qrcodegen'

export type ErrorLevel = 'L' | 'M' | 'Q' | 'H'
export interface QrCode {
  parts: string[]
  size: number
}

function errorLevelToEcc (level: ErrorLevel): QRC.Ecc {
  switch (level) {
    case 'L' as const: return QRC.Ecc.LOW
    case 'M': return QRC.Ecc.MEDIUM
    case 'Q': return QRC.Ecc.QUARTILE
    default: return QRC.Ecc.HIGH
  }
}

export default (text: string, level: ErrorLevel = 'L', border: number = 0): QrCode =>
  useMemo(() => {
    if (text === '') {
      return {
        parts: [],
        size: 0
      }
    }

    const qr = QRC.encodeText(text, errorLevelToEcc(level))
    const { size } = qr

    const parts: string[] = []
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (qr.getModule(x, y)) {
          parts.push(`M${x + border},${y + border}h1v1h-1z`)
        }
      }
    }

    return {
      parts,
      size
    }
  }, [text, border, level])
