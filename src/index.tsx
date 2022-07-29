import React, { useMemo } from 'react'
import QRC from '../QR-Code-generator/typescript-javascript/qrcodegen'

export type ErrorLevel = 'L' | 'M' | 'Q' | 'H'

function errorLevelToEcc(level: ErrorLevel): QRC.Ecc {
    switch (level) {
      case 'L': return QRC.Ecc.LOW;
      case 'M': return QRC.Ecc.MEDIUM;
      case 'Q': return QRC.Ecc.QUARTILE;
      default: return QRC.Ecc.HIGH;
    }
}

export default (text: string, border: number, level: ErrorLevel): Array<string> => {
  return useMemo(() => {
    const qr = QRC.encodeText(text, errorLevelToEcc(level));

    let parts: Array<string> = [];
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.getModule(x, y))
          parts.push(`M${x + border},${y + border}h1v1h-1z`);
      }
    }
    
    return parts;
  }, [text, border, level])
}
