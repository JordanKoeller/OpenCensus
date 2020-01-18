
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

export const CAN_MIGRATE_API = "https://qqifi2u8bd.execute-api.us-east-1.amazonaws.com/dev";

export default rgb;