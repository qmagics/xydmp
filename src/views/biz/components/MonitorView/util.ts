export const chunkArr = (arr: any[], size: number): any[] => {
    const len = arr.length;
    const result: any = [];
    let chunk: any[] = [];

    arr.forEach((item, index) => {
        chunk.push(item);

        if (chunk.length === size || index === len - 1) {
            result.push(chunk);
            chunk = [];
        }
    });

    return result;
}