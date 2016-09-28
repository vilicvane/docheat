# Docheat

Docheat is a "cheating" tool for libraries written in TypeScript, it generates
API references inside a markdown file with brief descriptions and links to
source code, i.e., cheating.

Please understand it is **NOT** meant to generate detailed and well-organized
documentations.

Also, currently it supports **ONLY** exported functions, please check out the issue list
to see what might be coming.

## Installing

```sh
npm install docheat -g
```

## Usage and example

> **1.** A docheat entry list starts with marker comment:\
> `<!-- docheat:functions -->`

> **3.** As an example, the following content is generated using docheat under
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

> **2.** And ends with marker comment:\
> `<!-- endcheat -->`

# License

MIT License.
