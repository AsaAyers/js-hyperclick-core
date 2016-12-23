# js-hyperclick-core

This package provides the tools for [js-hyperclick][js-hyperclick] to scan JS
files for variables, imports, exports, and to locate imported modules.

## Why split this into an npm package?

Atom's testing process doesn't work for me. The command `Run Package Specs`
opens a new window every time instead of just reusing the last spec window. You
can reuse the window, but you have to either click a button in that window or
switch to the spec window and `ctrl+alt+r` to reload the window.

Since this package uses [Jest][jest], I can run it with `--watchAll --coverage`
and monitor my tests without ever leaving Atom or having to use the mouse.

[js-hyperclick]: https://atom.io/packages/js-hyperclick
[jest]: https://facebook.github.io/jest/
