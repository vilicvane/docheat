/**
 * Another useless function with overloads for demonstration.
 */
export function foo(a: string): Promise<void>;
export function foo(b: number): Date;
export function foo<T>(...args: T[]): T;
export function foo(): any {
    return;
}
