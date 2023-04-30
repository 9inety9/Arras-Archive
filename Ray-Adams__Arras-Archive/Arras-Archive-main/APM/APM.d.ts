interface Array<T> {
    remove: (index: number) => void;
}

export const enum kColor {

}

declare type kEncodableType = (number | string | boolean);
declare type kPacket = kEncodableType[];

declare interface Server {
    parseGamemode(code: string): string;
    parseRegion(code: string): string;
    parseHost(code: string): string;
    parseCode(code: string): string;
}

declare interface APMLeaderboardEntry {
    id: number;
    score: number;
    index: number;
    name: string;
    color: kColor;
    barColor: kColor;
}

declare interface APMTeamMapEntry {
    id: number;
    x: number;
    y: number;
    color: kColor;
}

declare interface APMGlobalMapEntry {
    id: number;
    type: number;
    x: number;
    y: number;
    color: kColor;
    size: number;
}

interface APMRotator {
    i: number;
    arr: kPacket;
    get(index: number): kEncodableType;
    set(index: number, value: kEncodableType): kEncodableType;
    nex(): kEncodableType;
}


declare class APMBroadcastParser {
    public constructor();

    public leaderboard: APMLeaderboardEntry[];
    public teamMinimap: APMTeamMapEntry[];
    public globalMinimap: APMGlobalMapEntry[];

    public parse(packet: kPacket): this;

    private _array<T>(rotator: APMRotator, read: (index: number, rotator: APMRotator) => T, length?: number): T[];
}

declare class APMRecordParser {
    public constructor();

    public score?: number;
    public seconds?: number;
    public killCount: {
        players?: number;
        assists?: number;
        bosses?: number;
    }
    public killersLength?: number;
    public killers: number[];
    public baseCooldown?: number;
    public scoreCode?: string;

    public parse(packet: kPacket): this;
}

declare interface APMWorldCamera {
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fov?: number;
}

declare interface APMWorldPlayer {
    fps: number;
    body: {
        type?: number;
        color?: kColor;
        id?: number;
    },
    upgrades: number[];
    stats: number[];
    score?: number;
    points?: number;
    skills?: number;
    accel?: number;
    top?: number;
    party?: number;
}

interface APMEntityGun {
    time: number;
    power: number;
}

interface APMWorldEntity {
    x: number;
    y: number;
    vx: number; 
    vy: number;
    facing: number;
    flags: number;
    health: number;
    shield: number;
    alpha: number;
    size: number;
    score: number;
    name: string;
    mockupIndex: number;
    color: kColor;
    layer: number;
    guns: APMEntityGun[];
    turrets: APMWorldEntity[];
}

declare class APMUpdateParser {
    public constructor(parseEntities?: boolean);

    public now: number;
    public camera: APMWorldCamera;
    public player: APMWorldPlayer
    public entities: APMWorldEntity[] | false;

    public parse(packet: kPacket): this;

    private _table<T>(rotator: APMRotator, read: (index: number, rotator: APMRotator) => T): T[];
    private _parseEnts(rotator: APMRotator): void;
    private _parseEnt(entity: APMWorldEntity, rotator: APMRotator): APMWorldEntity;
}

declare type APMPacketHook = (packet: kPacket) => kPacket | void | false;

declare class APMSocket extends WebSocket {
    public constructor(host: string, ...args: any[]);

    public isntArras: boolean;
    public hookSend(...hooks: APMPacketHook[]): number;
    public hookMsg(...hooks: APMPacketHook[]): number;
    public talk(...data: kPacket): void;
    public directTalk(...data: kPacket): void;
    public receive(...data: kPacket): void;
    
    private sendHooks: APMPacketHook[];
    private msgHooks: APMPacketHook[];
    private _hook();
}

declare interface APMLibrary {
    encode: (data: kPacket) => Uint8Array;
    decode: (buffer: ArrayBufferLike) => kPacket;

    Server: Server;
    BroadcastParser: APMBroadcastParser;
    RecordParser: APMRecordParser;
    UpdateParser: APMUpdateParser;

    hijack(): Promise<APMSocket>;
}

declare function arras(): APMLibrary;
