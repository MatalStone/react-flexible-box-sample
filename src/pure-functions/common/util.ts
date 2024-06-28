export function indexGenerator(start: number) {
    let i = start
    return () => i++
}