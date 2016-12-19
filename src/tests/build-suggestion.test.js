/*eslint-env jest */
import extractAnnotations from './utils/extract-annotations'
import { parseCode, buildSuggestion } from '../index'

const testNull = (info, annotation) => {
    const { label, text, start, end } = annotation

    test(`${label} is not clickable`, function() {
        const actual = buildSuggestion(info, text, { start, end })
        expect(actual).toBe(null)
    })
}

const testPath = (info, annotation, expected) => {
    const { label, text, start, end } = annotation

    test(`location '${label}' links to ${expected.module}`, function() {
        const actual = buildSuggestion(info, text, { start, end })
        expect(actual).not.toBe(null)
        expect(actual.type).toBe('path')

        // Make sure the resolved range wraps around the original range
        expect(actual.range.start).toBeLessThanOrEqual(start)
        expect(actual.range.end).toBeGreaterThanOrEqual(end)

        expect(actual.moduleName).toBe(expected.moduleName)
    })
}

const testImport = (info, annotation, expected) => {
    const { label, text, start, end } = annotation

    test(`location '${label}' imports ${expected.imported} from ${expected.moduleName}`, function() {
        const actual = buildSuggestion(info, text, { start, end })
        expect(actual).not.toBe(null)
        expect(actual.type).toBe('from-import')

        expect(actual.moduleName).toBe(expected.moduleName)
        expect(actual.imported).toBe(expected.imported)

        // Modules may also be used as bindings
        expect(actual.bindingStart).toBe(expected.binding.start)
        expect(actual.bindingEnd).toBe(expected.binding.end)

    })
}

const testBinding = (info, annotation, targetAnnotation) => {
    const { label, text, start, end } = annotation

    test(`location '${label}' jumps to ${targetAnnotation.label}`, function() {
        const actual = buildSuggestion(info, text, { start, end })
        expect(actual).not.toBe(null)
        expect(actual.type).toBe('binding')

        expect(actual.start).toBe(targetAnnotation.start)
        expect(actual.end).toBe(targetAnnotation.end)
    })
}

describe('buildSuggestion', () => {

    describe('es6-module.js', () => {
        const { code, annotations } = extractAnnotations('es6-module.js')
        const info = parseCode(code)

        testImport(info, annotations.foo, {
            moduleName: './foo',
            imported: 'default',
            binding: annotations.foo,
        })
        testImport(info, annotations.namedFoo, {
            moduleName: './foo',
            imported: 'namedFoo',
            binding: annotations.namedFoo,
        })
        testPath(info, annotations.fooPath, {
            moduleName: './foo',
        })

        // testImport(info, annotations.exportFrom, {
        //     moduleName: './other',
        //     imported: 'exportFrom',
        //     binding: annotations.exportFrom,
        // })
        testPath(info, annotations.exportFromPath, {
            moduleName: './other',
        })

        testPath(info, annotations.exportAll, {
            moduleName: './export-all'
        })

        testImport(info, annotations.renamedBar, {
            moduleName: './bar.js',
            imported: 'namedBar',
            binding: annotations.renamedBar,
        })

        // Clicking the declaration doesn't have anywhere for you to go
        testNull(info, annotations.someVar)
        testNull(info, annotations.someLet)
        testNull(info, annotations.someConst)

        testImport(info, annotations.logPath, {
            moduleName: 'path',
            imported: 'default',
            binding: annotations.path,
        })
        testBinding(info, annotations.logSomeVar, annotations.someVar)
        testBinding(info, annotations.logSomeLet, annotations.someLet)
        testBinding(info, annotations.logSomeConst, annotations.someConst)
        testImport(info, annotations.logFoo, {
            moduleName: './foo',
            imported: 'default',
            binding: annotations.foo,
        })
        testBinding(info, annotations.logDestructureA, annotations.destructureA)
        // testBinding(info, annotations.logDestructureB, annotations.destructureB)
        testBinding(info, annotations.logDestructureC, annotations.destructureC)

        testBinding(info, annotations.logShadow, annotations.shadowConst)
        testNull(info, annotations.defaultExport)
        testBinding(info, annotations.callMyFunc, annotations.myFunc)
    })

    describe('cjs.js', () => {
        const { code, annotations } = extractAnnotations('cjs.js')
        const info = parseCode(code)

        testImport(info, annotations.basicRequire, {
            moduleName: './basicRequire',
            imported: 'default',
            binding: annotations.basicRequire,
        })

        testImport(info, annotations.destructured, {
            moduleName: './destructured',
            // require() can only import the default export
            imported: 'default',
            binding: annotations.destructured,
        })

        testImport(info, annotations.renamed, {
            moduleName: './renamed',
            // require() can only import the default export
            imported: 'default',
            binding: annotations.renamed,
        })
    })

})
