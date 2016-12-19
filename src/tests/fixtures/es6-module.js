/* eslint-disable */
import foo/* foo */, { namedFoo /* namedFoo */ } from './foo' /* fooPath */
import path /* path */ from 'path'

import { namedBar as renamedBar /* renamedBar */ } from './bar.js'

export { exportFrom /* exportFrom */ } from './other' /* exportFromPath */

export * from './export-all' /* exportAll */

var someVar /* someVar */
let someLet /* someLet */
export const someConst /* someConst */ = 'someConst'

// This seems like a bad idea, but it's supported!
export const {
    obj: { destructureA /* destructureA */ },
    arr: [ destrctureB /* destructureB */ ]
} = {}

const [ destructureC /* destructureC */ ] = [ 'b' ]


console.log(
    path, /* logPath */
    someVar, /* logSomeVar */
    someLet, /* logSomeLet */
    someConst, /* logSomeConst */
    foo, /* logFoo */
    destructureA, /* logDestructureA */
    // destructureB, /* logDestructureB */
    destructureC /* logDestructureC */
)

export function functionDeclaration() {

}

export /* defaultExport */ default function myFunc() /* myFunc */ {
    const someConst /* shadowConst */ = 'SHADOW'

    console.log('someConst: ', someConst /* logShadow */)
}


myFunc() /* callMyFunc */
