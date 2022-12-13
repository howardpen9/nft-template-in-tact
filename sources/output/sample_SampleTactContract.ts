import { Cell, Slice, StackItem, Address, Builder, InternalMessage, CommonMessageInfo, CellMessage, beginCell, serializeDict } from 'ton';
import { ContractExecutor, createExecutorFromCode } from 'ton-nodejs';
import BN from 'bn.js';

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: BigInt;
    mode: BigInt;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function packSendParameters(src: SendParameters): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounce);
    b_0 = b_0.storeAddress(src.to);
    b_0 = b_0.storeInt(new BN(src.value.toString(10), 10), 257);
    b_0 = b_0.storeInt(new BN(src.mode.toString(10), 10), 257);
    if (src.body !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.body);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.code !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.code);
    } else {
        b_0 = b_0.storeBit(false);
    }
    if (src.data !== null) {
        b_0 = b_0.storeBit(true);
        b_0 = b_0.storeRef(src.data);
    } else {
        b_0 = b_0.storeBit(false);
    }
    return b_0.endCell();
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: BigInt;
}

export function packContext(src: Context): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeBit(src.bounced);
    b_0 = b_0.storeAddress(src.sender);
    b_0 = b_0.storeInt(new BN(src.value.toString(10), 10), 257);
    return b_0.endCell();
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function packStateInit(src: StateInit): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeRef(src.code);
    b_0 = b_0.storeRef(src.data);
    return b_0.endCell();
}

export type Add = {
    $$type: 'Add';
    amount: BigInt;
}

export function packAdd(src: Add): Cell {
    let b_0 = new Builder();
    b_0 = b_0.storeUint(3310826759, 32);
    b_0 = b_0.storeUint(new BN(src.amount.toString(10), 10), 32);
    return b_0.endCell();
}

export async function SampleTactContract_init(owner: Address) {
    const __code = 'te6ccgECEQEAAT8AART/APSkE/S88sgLAQIBYgIDAgLMBAUCASAPEAHp32/bgQ66ThD8qYEGuFj+8BaGmBgLjYYADIv8i4cQD9IBgqIIq3gfwwgUit8BBBCGKrmoPdRxoYdqJoagD8MX0gAIDpj6y2CQFpj4DBCGKrmoPdeXAyaY+AmIl4BuR8IQDmLKzni2WP5PaqcGAASJhxhvlgMkBgIBIAcIAJT5AYLwxPjXIxLt/e9be+x4M727Fi0VEb14qRKu0PJjevZVcq66jiLtRNDUAfhi+kABAdMfWWwS8A7I+EIBzFlZzxbLH8ntVNsx4AIBWAkKAgEgCwwAFxwAsjMAlnPFssfyYAAbPhBbyMwMSPHBfLgZKCACASANDgAHRx8AuAADDGAABTwC4AAJvZ7PgFQAKbzQx2omhqAPwxfSAAgOmPrLYJeAZA==';
    const depends = new Map<string, Cell>();
    let systemCell = beginCell().storeDict(null).endCell();
    let __stack: StackItem[] = [];
    __stack.push({ type: 'cell', cell: systemCell });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(owner).endCell() });
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let executor = await createExecutorFromCode({ code: codeCell, data: new Cell() });
    let res = await executor.get('init_SampleTactContract', __stack, { debug: true });
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

export class SampleTactContract {
            
    readonly executor: ContractExecutor; 
    constructor(executor: ContractExecutor) { this.executor = executor; } 
    
    async send(args: { amount: BN, from?: Address, debug?: boolean }, message: Add | 'increment') {
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Add') {
            body = packAdd(message);
        }
        if (message === 'increment') {
            body = beginCell().storeUint(0, 32).storeBuffer(Buffer.from(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        await this.executor.internal(new InternalMessage({
            to: this.executor.address,
            from: args.from || this.executor.address,
            bounce: false,
            value: args.amount,
            body: new CommonMessageInfo({
                body: new CellMessage(body!)
            })
        }), { debug: args.debug });
    }
    async getCounter() {
        let __stack: StackItem[] = [];
        let result = await this.executor.get('counter', __stack);
        return result.stack.readBigNumber();
    }
}