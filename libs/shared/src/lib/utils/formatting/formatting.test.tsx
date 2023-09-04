import {sentenceCase} from './formatting'

describe('Formatting', () => {
  describe('Sentence Case', () => {
    it('should return a string in sentence case', () => {
      const result = sentenceCase('hello world')

      expect(result).toEqual('Hello world')
    })

    it('should return an empty string if an empty string is given', () => {
      const result = sentenceCase('')

      expect(result).toEqual('')
    })
  })
})
