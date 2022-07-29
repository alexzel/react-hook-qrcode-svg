import React, { ReactElement } from 'react'
import renderer from 'react-test-renderer'

import useQRCodeGenerator from './'

const Component = (
  props: {
    value: string
    level: string
    border: number
  }
): ReactElement => {
  const { value, level, border } = props
  const { parts, size } = useQRCodeGenerator(value, level)
  return (
    <svg viewBox={`0 0 ${size + border * 2} ${size + border * 2}`} stroke='none'>
      <rect width='100%' height='100%' fill='#ffffff' />
      <path d={parts.join(' ')} fill='#000000' />
    </svg>
  )
}

describe('index', () => {
  it('renders component with useQRCodeGenerator', () => {
    const component = renderer.create(
      <Component value='test' level='L' border={3} />
    )
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
