[![NPM Package](https://badge.fury.io/js/docheat.svg)](https://www.npmjs.com/package/docheat)

# Docheat

Docheat is a "cheating" tool for libraries written in TypeScript, it generates
API references inside a markdown file with brief descriptions and links to
source code, i.e., cheating.

This tool is developed for [villa](https://github.com/vilic/villa), a set
of promise utilities for `async`-`await`-ready environment. And currently it
supports **ONLY** exported **functions**, please check out the issue list to
see what might be coming next.

Please understand it is **NOT** meant to generate detailed and well-organized
documentations.

## Installing

```sh
npm install docheat -g
```

## Usage and example

**Note:** to understand the example, please read in the order suggested by step
numbers.

> **1.** A docheat entry list starts with marker comment below:<br>
> `<!-- docheat:functions -->`

<!-- quotes-separator -->

> **3.** And the following content is generated using docheat under
> current project folder with command `docheat demo/tsconfig.json`:

<!-- docheat:functions -->

#### [[+]](demo/bar.ts#L4) `bar(a: string, b: number): Promise<void>`

A useless function for demonstration.

#### [[+]](demo/foo.ts#L4) `foo(a: string): Promise<void>`<sup>+2</sup>

Another useless function with overloads for demonstration.

##### Overloads:

- `foo(b: number): Date`
- `foo<T>(...args: T[]): T`

<!-- endcheat -->

> **2.** And ends with marker comment below:<br>
> `<!-- endcheat -->`

## Command options

- **target:** Glob patterns of target markdown files, defaults to
  `README,README.*`.
- **level:** Heading level of generated entries, defaults to `4`.

# License

MIT License.
