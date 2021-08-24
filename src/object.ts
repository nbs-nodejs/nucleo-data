export function isNotEmptyObject(
    o: Record<string | number | symbol, unknown> | null | undefined
): o is Record<string | number | symbol, unknown> {
    // If o is empty or null then return false
    if (o == null) {
        return false;
    }

    return Object.keys(o).length > 0;
}
