import React from 'react'
import {render} from '@testing-library/react'
import {interpolateContent} from './interpolate'

describe('interpolateContent', () => {
  it('should do nothing when vars and tags not provided', () => {
    const val = 'Hello {name}. {b}this{/b} {i}is{/i} {b}a test{/b} of interpolation'
    const result = interpolateContent(val)
    expect(result.join('')).toEqual(val)
  })

  it('should do nothing when vars and tags do not match provided', () => {
    const val = 'Hello {name}. {b}this{/b} {i}is{/i} {b}a test{/b} of interpolation'
    const vars = {other: 'OtherVal'}
    const tags = {otherTag: () => 'OtherTagVal'}
    const result = interpolateContent(val, vars, tags)
    expect(result.join('')).toEqual(val)
  })

  it('should replace vars', () => {
    const val = 'Hello {name}. Your age is {age}'
    const vars = {name: 'John Smith', age: 27}
    const result = interpolateContent(val, vars)
    expect(result.join('')).toEqual('Hello John Smith. Your age is 27')
  })

  it('should ignore unknown vars', () => {
    const val = 'Hello {name}. Your age is {age}'
    const vars = {name: 'John Smith'}
    const result = interpolateContent(val, vars)
    expect(result.join('')).toEqual('Hello John Smith. Your age is {age}')
  })

  it('should replace tags using string handler', () => {
    const val =
      '{upper}Hello{/upper} {lower}JOHN smith{/lower}. {lower}HOW{/lower} Are {upper}you{/upper}?'
    const tags = {
      upper: (text: string) => text.toUpperCase(),
      lower: (text: string) => text.toLowerCase(),
    }
    const result = interpolateContent(val, undefined, tags)
    expect(result.join('')).toEqual('HELLO john smith. how Are YOU?')
  })

  it('should replace tags using jsx handler', () => {
    const val = 'Hello {s}John{/s}. How {s}are{/s} you?'
    const tags = {
      s: (text: string) => (
        <span key={text} data-testid="TESTSPAN">
          {text}
        </span>
      ),
    }
    const result = interpolateContent(val, undefined, tags)
    //eslint-disable-next-line react/jsx-no-useless-fragment
    const {queryAllByTestId} = render(<>{result}</>)
    const spans = queryAllByTestId('TESTSPAN')

    expect(spans).toHaveLength(2)
    expect(spans[0].textContent).toEqual('John')
    expect(spans[1].textContent).toEqual('are')
  })

  it('should ignore unknown tags', () => {
    const val =
      '{upper}Hello{/upper} {lower}JOHN smith{/lower}. {lower}HOW{/lower} Are {upper}you{/upper}?'
    const tags = {
      upper: (text: string) => text.toUpperCase(),
    }
    const result = interpolateContent(val, undefined, tags)
    expect(result.join('')).toEqual(
      'HELLO {lower}JOHN smith{/lower}. {lower}HOW{/lower} Are YOU?',
    )
  })
})
