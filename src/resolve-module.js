// import url from 'url'
// import shell from 'shell'
import path from 'path'
import fs from 'fs'
import { sync as resolve } from 'resolve'

// Default comes from Node's `require.extensions`
const defaultExtensions = [ '.js', '.json', '.node' ]

function findRecursively(basedir, fileName) {
    const packagePath = path.resolve(basedir, fileName)
    try {
        fs.accessSync(packagePath)
    } catch (e) {
        const parent = path.resolve(basedir, '../')
        if (parent !== basedir) {
            return findRecursively(parent, fileName)
        }
        return undefined
    }
    return packagePath
}

function loadModuleRoots(basedir) {
    const packagePath = findRecursively(basedir, 'package.json')
    if (!packagePath) {
        return
    }

    const config = require(packagePath)
    let roots = config && config.moduleRoots
    if (!roots) {
        return
    }

    if (typeof roots === 'string') {
        roots = [ roots ]
    }

    // make paths absolute and return them
    const packageDir = path.dirname(packagePath)
    return roots.map(r => path.resolve(packageDir, r))
}


function resolveWithCustomRoots(basedir, absoluteModule, resolveOptions) {
    const moduleName = `./${absoluteModule}`

    const roots = loadModuleRoots(basedir)
    if (!roots) {
        return
    }

    for (let i = 0; i < roots.length; i++) {
        try {
            return resolve(moduleName, { ...resolveOptions, basedir: roots[i] })
        } catch (e) {
            /* do nothing */
        }
    }
}

export default function resolveModule(filePath, suggestion, options = {}) {
    const { extensions = defaultExtensions } = options
    let { moduleName } = suggestion

    const basedir = path.dirname(filePath)
    const resolveOptions = { basedir, extensions }

    let filename

    try {
        filename = resolve(moduleName, resolveOptions)
        if (filename == moduleName) {
            return {
                url: `http://nodejs.org/api/${moduleName}.html`
            }
        }
    } catch (e) {
        /* do nothing */
    }

    // Allow linking to relative files that don't exist yet.
    if (!filename && moduleName[0] === '.') {
        if (path.extname(moduleName) == '') {
            moduleName += '.js'
        }

        filename = path.join(basedir, moduleName)
    } else if (!filename) {
        filename = resolveWithCustomRoots(basedir, moduleName, resolveOptions)
    }

    return { filename }
}
