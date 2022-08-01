# react-hook-qrcode

React hook that generates QR code as SVG path.

You can use SVG path for `<svg>` element rendering or building a data URL (could be useful when it comes to downloading or printing).

See QR code generator: [QR-Code-generator](https://github.com/nayuki/QR-Code-generator/tree/master/typescript-javascript).

## Installation

```sh
yarn add react-hook-qrcode
```
or

```sh
npm install react-hook-qrcode
```

## Usage

### Basic usage

```jsx
import React from 'react'
import useQRCodeGenerator from 'react-hook-qrcode'

const QRCODE_SIZE = 256
const QRCODE_LEVEL = 'Q'
const QRCODE_BORDER = 4

const QRCodeComponent = ({ value }) => {
  const { path, viewBox } = useQRCodeGenerator(value, QRCODE_LEVEL, QRCODE_BORDER)

  return (
    <svg width={QRCODE_SIZE} height={QRCODE_SIZE} viewBox={viewBox} stroke='none'>
      <rect width='100%' height='100%' fill='#ffffff' />
      <path d={path} fill='#000000' />
    </svg>
  )
}
```

### Exclude rectangular area and draw logo

```jsx
import React, { useMemo } from 'react'
import useQRCodeGenerator from 'react-hook-qrcode'

const LOGO_PATH = `M 53.00,0.44
 C 74.13,-2.27 95.87,3.14 110.83,19.04
   139.01,48.98 132.42,101.51 95.00,120.74
   81.22,127.82 73.98,128.17 59.00,128.00
   31.12,127.67 7.43,105.37 1.24,79.00
   -0.37,72.18 -0.01,67.86 0.00,61.00
   0.05,29.96 23.24,6.01 53.00,0.44 Z
`
const LOGO_SIZE = 128

const QRCODE_SIZE = 256
const QRCODE_LEVEL = 'Q'
const QRCODE_BORDER = 4

const QRCodeComponent = ({ value }) => {
  const { path, viewBox, excludePoints } = useQRCodeGenerator(value, QRCODE_LEVEL, QRCODE_BORDER, {
    width: 42,
    height: 42,
    baseSize: QRCODE_SIZE
  })

  const [scaleX, scaleY, translateX, translateY] = useMemo(() => {
    const scaleX = (excludePoints.x2 - excludePoints.x1) / LOGO_SIZE
    const scaleY = (excludePoints.y2 - excludePoints.y1) / LOGO_SIZE

    const translateX = excludePoints.x1 + QRCODE_BORDER
    const translateY = excludePoints.y1 + QRCODE_BORDER

    return [scaleX, scaleY, translateX, translateY]
  }, [value])

  return (
    <svg width={QRCODE_SIZE} height={QRCODE_SIZE} viewBox={viewBox} stroke='none'>
      <rect width='100%' height='100%' fill='#ffffff' />
      <path d={path} fill='#000000' />
      <g transform={`translate(${translateX}, ${translateY})`}>
        <g transform={`scale(${scaleX}, ${scaleY})`}>
          <path
            fill='#cccccc'
            d={LOGO_PATH}
            shapeRendering='geometricPrecision'
          />
        </g>
      </g>
    </svg>
  )
}
```

## Options

```ts
text: string,

level: 'L' | 'M' | 'Q' | 'H',

border: number = 0,

exclude: {
  x?: number
  y?: number
  width: number
  height: number,
  baseSize: number
} | null = null
```
