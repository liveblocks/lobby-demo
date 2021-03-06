const BG_COLORS = [
    '#ecbab3',
    '#faf3d3',
    '#dbf4e4',
    '#f0c67d',
    '#d3bedf',
    '#92bfe5',
    '#d6dbdb',
    '#98deae',
];

function hashCode(str: string): number {
    let hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

export function getBgColorForRoom(roomId: string): string {
    return BG_COLORS[Math.abs(hashCode(roomId)) % BG_COLORS.length];
}
