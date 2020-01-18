
function numberToHex(i: number): string {
    const hex = Number(i).toString(16);
    if (hex.length < 2) {
         return "0" + hex;
    }
    return hex;
}

function rgb([r,g,b]: [number, number, number]): string {
    return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}`;
}

export default rgb;