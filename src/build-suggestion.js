const scopeSize = ({block: b}) => b.end - b.start

function findClosestScope(scopes, start, end) {
    return scopes.reduce((closest, scope) => {
        const { block } = scope

        if (block.start <= start
            && block.end >= end
            && scopeSize(scope) < scopeSize(closest)
        ) {
            return scope
        }

        return closest
    })
}

export default function buildSuggestion(info, text, { start, end }, options = {}) {
    const { paths, scopes, externalModules } = info

    for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        if (path.start > end) { break }
        if (path.start < start && path.end > end) {
            return {
                type: 'path',
                imported: 'default',
                moduleName: path.moduleName,
                range: {
                    start: path.start,
                    end: path.end,
                }
            }
        }
    }

    const closestScope = findClosestScope(scopes, start, end)
    // Sometimes it reports it has a binding, but it can't actually get the
    // binding
    if (closestScope.hasBinding(text) && closestScope.getBinding(text)) {
        const binding = closestScope.getBinding(text)
        const { start: bindingStart, end: bindingEnd } = binding.identifier

        const clickedDeclaration = (
            bindingStart <= start
            && bindingEnd >= end
        )
        const crossFiles = !options.jumpToImport

        if (clickedDeclaration || crossFiles) {
            const targetModule = externalModules.find((m) => {
                const { start: bindingStart } = binding.identifier
                return m.local == text && m.start == bindingStart
            })

            if (targetModule) {
                return {
                    ...targetModule,
                    type: 'from-import',
                    bindingStart,
                    bindingEnd,
                }
            }
        }

        // Exit early if you clicked on where the variable is declared
        if (clickedDeclaration) {
            return null
        }

        return {
            type: 'binding',
            start: bindingStart,
            end: bindingEnd,
        }
    }

    return null
}
