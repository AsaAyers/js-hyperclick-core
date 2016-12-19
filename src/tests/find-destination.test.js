/* eslint-env jest */
import path from 'path'

import extractAnnotations from './utils/extract-annotations'
import { parseCode, buildSuggestion, resolveModule, findDestination } from '../index'

expect.extend({
    toBeAnnotation(actual, expected) {
        const pass = (actual.start === expected.start)

        const message = () => {
            return `expected ${actual.start} ${pass ? 'not ' : ''}to be ${expected.start} (start of ${expected.label})`
        }
        return {message, pass}
    }
})

const suggestFromAnnotation = (info, annotation) => {
    const { text, start, end } = annotation
    return buildSuggestion(info, text, { start, end })
}

describe(`findDestination (all-imports.js)`, () => {
    const srcFilename = path.join(__dirname, 'fixtures/all-imports.js')
    const { code: srcCode, annotations: srcAnnotations } = extractAnnotations('all-imports.js')
    const srcInfo = parseCode(srcCode)

    test('someModule', () => {
        const suggestion = suggestFromAnnotation(srcInfo, srcAnnotations.someModule)
        expect(suggestion.type).toBe('from-import')

        const { filename } = resolveModule(srcFilename, suggestion)
        const { code, annotations } = extractAnnotations(filename)
        const info = parseCode(code)

        const destination = findDestination(info, suggestion)

        expect(destination).toBeAnnotation(
            annotations.defaultExport
        )
    })

    test('missingExport will go to the default export', () => {
        const suggestion = suggestFromAnnotation(srcInfo, srcAnnotations.missingExport)
        expect(suggestion.type).toBe('from-import')

        const { filename } = resolveModule(srcFilename, suggestion)
        const { code, annotations } = extractAnnotations(filename)
        const info = parseCode(code)

        const destination = findDestination(info, suggestion)

        expect(destination).toBeAnnotation(
            annotations.defaultExport
        )
    })

    test('logFoo', () => {
        const suggestion = suggestFromAnnotation(srcInfo, srcAnnotations.logFoo)
        expect(suggestion.type).toBe('binding')

        const destination = findDestination(srcInfo, suggestion)

        expect(destination).toBeAnnotation(
            srcAnnotations.foo
        )
    })

    test(`throws when you give it a bad suggestion object`, () => {
        const suggestion = {}

        expect(() => {
            findDestination(srcInfo, suggestion)
        }).toThrow(/Invalid suggestion type/)

    })
})
