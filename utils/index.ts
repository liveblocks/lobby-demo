function hashCode(str: string): number {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function intToRGB(i: number): string {
    let c = (i & 0x00ffffff).toString(16).toUpperCase();
    return '00000'.substring(0, 6 - c.length) + c;
}

export function getBgColorForRoom(roomId: string): string {
    return intToRGB(hashCode(roomId));
}
