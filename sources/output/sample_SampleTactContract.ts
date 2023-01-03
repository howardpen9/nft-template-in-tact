import { Cell, Slice, Address, Builder, beginCell, ComputeError, TupleItem, TupleReader, Dictionary, contractAddress, ContractProvider, Sender, Contract, ContractABI } from 'ton-core';
import { ContractSystem, ContractExecutor } from 'ton-emulator';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0 = b_0.storeRef(src.code);
        b_0 = b_0.storeRef(src.data);
    };
}

export function packStackStateInit(src: StateInit, __stack: TupleItem[]) {
    __stack.push({ type: 'cell', cell: src.code });
    __stack.push({ type: 'cell', cell: src.data });
}

export function packTupleStateInit(src: StateInit): TupleItem[] {
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'cell', cell: src.code });
    __stack.push({ type: 'cell', cell: src.data });
    return __stack;
}

export function unpackStackStateInit(slice: TupleReader): StateInit {
    const code = slice.readCell();
    const data = slice.readCell();
    return { $$type: 'StateInit', code: code, data: data };
}
export function unpackTupleStateInit(slice: TupleReader): StateInit {
    const code = slice.readCell();
    const data = slice.readCell();
    return { $$type: 'StateInit', code: code, data: data };
}
export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0 = b_0.storeBit(src.bounced);
        b_0 = b_0.storeAddress(src.sender);
        b_0 = b_0.storeInt(src.value, 257);
        b_0 = b_0.storeRef(src.raw);
    };
}

export function packStackContext(src: Context, __stack: TupleItem[]) {
    __stack.push({ type: 'int', value: src.bounced ? -1n : 0n });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'slice', cell: src.raw });
}

export function packTupleContext(src: Context): TupleItem[] {
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'int', value: src.bounced ? -1n : 0n });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.sender).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'slice', cell: src.raw });
    return __stack;
}

export function unpackStackContext(slice: TupleReader): Context {
    const bounced = slice.readBoolean();
    const sender = slice.readAddress();
    const value = slice.readBigNumber();
    const raw = slice.readCell();
    return { $$type: 'Context', bounced: bounced, sender: sender, value: value, raw: raw };
}
export function unpackTupleContext(slice: TupleReader): Context {
    const bounced = slice.readBoolean();
    const sender = slice.readAddress();
    const value = slice.readBigNumber();
    const raw = slice.readCell();
    return { $$type: 'Context', bounced: bounced, sender: sender, value: value, raw: raw };
}
export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0 = b_0.storeBit(src.bounce);
        b_0 = b_0.storeAddress(src.to);
        b_0 = b_0.storeInt(src.value, 257);
        b_0 = b_0.storeInt(src.mode, 257);
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
    };
}

export function packStackSendParameters(src: SendParameters, __stack: TupleItem[]) {
    __stack.push({ type: 'int', value: src.bounce ? -1n : 0n });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.code !== null) {
        __stack.push({ type: 'cell', cell: src.code });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.data !== null) {
        __stack.push({ type: 'cell', cell: src.data });
    } else {
        __stack.push({ type: 'null' });
    }
}

export function packTupleSendParameters(src: SendParameters): TupleItem[] {
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'int', value: src.bounce ? -1n : 0n });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(src.to).endCell() });
    __stack.push({ type: 'int', value: src.value });
    __stack.push({ type: 'int', value: src.mode });
    if (src.body !== null) {
        __stack.push({ type: 'cell', cell: src.body });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.code !== null) {
        __stack.push({ type: 'cell', cell: src.code });
    } else {
        __stack.push({ type: 'null' });
    }
    if (src.data !== null) {
        __stack.push({ type: 'cell', cell: src.data });
    } else {
        __stack.push({ type: 'null' });
    }
    return __stack;
}

export function unpackStackSendParameters(slice: TupleReader): SendParameters {
    const bounce = slice.readBoolean();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    const code = slice.readCellOpt();
    const data = slice.readCellOpt();
    return { $$type: 'SendParameters', bounce: bounce, to: to, value: value, mode: mode, body: body, code: code, data: data };
}
export function unpackTupleSendParameters(slice: TupleReader): SendParameters {
    const bounce = slice.readBoolean();
    const to = slice.readAddress();
    const value = slice.readBigNumber();
    const mode = slice.readBigNumber();
    const body = slice.readCellOpt();
    const code = slice.readCellOpt();
    const data = slice.readCellOpt();
    return { $$type: 'SendParameters', bounce: bounce, to: to, value: value, mode: mode, body: body, code: code, data: data };
}
export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0 = b_0.storeUint(2509716940, 32);
        b_0 = b_0.storeUint(src.queryId, 64);
    };
}

export function packStackDeploy(src: Deploy, __stack: TupleItem[]) {
    __stack.push({ type: 'int', value: src.queryId });
}

export function packTupleDeploy(src: Deploy): TupleItem[] {
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'int', value: src.queryId });
    return __stack;
}

export function unpackStackDeploy(slice: TupleReader): Deploy {
    const queryId = slice.readBigNumber();
    return { $$type: 'Deploy', queryId: queryId };
}
export function unpackTupleDeploy(slice: TupleReader): Deploy {
    const queryId = slice.readBigNumber();
    return { $$type: 'Deploy', queryId: queryId };
}
export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0 = b_0.storeUint(3548362785, 32);
        b_0 = b_0.storeUint(src.queryId, 64);
    };
}

export function packStackDeployOk(src: DeployOk, __stack: TupleItem[]) {
    __stack.push({ type: 'int', value: src.queryId });
}

export function packTupleDeployOk(src: DeployOk): TupleItem[] {
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'int', value: src.queryId });
    return __stack;
}

export function unpackStackDeployOk(slice: TupleReader): DeployOk {
    const queryId = slice.readBigNumber();
    return { $$type: 'DeployOk', queryId: queryId };
}
export function unpackTupleDeployOk(slice: TupleReader): DeployOk {
    const queryId = slice.readBigNumber();
    return { $$type: 'DeployOk', queryId: queryId };
}
export type Add = {
    $$type: 'Add';
    amount: bigint;
}

export function storeAdd(src: Add) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0 = b_0.storeUint(3310826759, 32);
        b_0 = b_0.storeUint(src.amount, 32);
    };
}

export function packStackAdd(src: Add, __stack: TupleItem[]) {
    __stack.push({ type: 'int', value: src.amount });
}

export function packTupleAdd(src: Add): TupleItem[] {
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'int', value: src.amount });
    return __stack;
}

export function unpackStackAdd(slice: TupleReader): Add {
    const amount = slice.readBigNumber();
    return { $$type: 'Add', amount: amount };
}
export function unpackTupleAdd(slice: TupleReader): Add {
    const amount = slice.readBigNumber();
    return { $$type: 'Add', amount: amount };
}
async function SampleTactContract_init(owner: Address) {
    const __code = 'te6ccgECIAEAAosAART/APSkE/S88sgLAQIBYgIDAgLLBAUCASAcHQIBIAYHAgFIDQ4CAdQICQAV/KP4DlAHA4AOUAQD9Tt+3Ah10nCH5UwINcLH94C0NMDAXGwwAGRf5Fw4gH6QCJQZm8E+GECkVvgIIIQxVc1B7qONDDtRNDUAfhi+kABAdMfWWwSAtMfAYIQxVc1B7ry4IHTHwExEvAVyPhCAcxZWc8Wyx/J7VTgIIIQlZc9zLrjAsAAkTDjDYAoLDAALCBu8tCAgAGgw7UTQ1AH4YvpAAQHTH1lsEgLTHwGCEJWXPcy68uCB0z8BMRLwF8j4QgHMWVnPFssfye1UAJT5AYLwxPjXIxLt/e9be+x4M727Fi0VEb14qRKu0PJjevZVcq66jiLtRNDUAfhi+kABAdMfWWwS8BbI+EIBzFlZzxbLH8ntVNsx4AAG8sCCAgEgDxACASAWFwIBIBESAgEgFBUB9zIcQHKAVAH8A9wAcoCUAXPFlAD+gJwAcpoI26zJW6zsY49f/APyHDwD3DwDyRus5l/8A8E8AFQBMyVNANw8A/iJG6zmX/wDwTwAVAEzJU0A3DwD+Jw8A8Cf/APAslYzJYzMwFw8A/iIW6zmH/wDwHwAQHMlDFw8A/iyQGATACU+EFvJBAjXwN/AnCAQlhtbfAQgAAT7AAAXHACyMwCWc8Wyx/JgAB8+EFvJFuBEU0yJMcF8vSggAgEgGBkCASAaGwADDGAABTwE4AAHHHwE4AAhMgBghDTf7ghWMsfyz/J8BGAACb2ez4CUAgFIHh8AKbdDHaiaGoA/DF9IACA6Y+stgl4CkABNt3owTgudh6ullc9j0J2HOslQo2zQThO6xqWlbI+WZFp15b++LEcw';
    const depends = Dictionary.empty(Dictionary.Keys.Uint(16), Dictionary.Values.Cell());
    let systemCell = beginCell().storeDict(depends).endCell();
    let __stack: TupleItem[] = [];
    __stack.push({ type: 'cell', cell: systemCell });
    __stack.push({ type: 'slice', cell: beginCell().storeAddress(owner).endCell() });
    let codeCell = Cell.fromBoc(Buffer.from(__code, 'base64'))[0];
    let system = await ContractSystem.create();
    let executor = await ContractExecutor.create({ code: codeCell, data: new Cell() }, system);
    let res = await executor.get('init_SampleTactContract', __stack);
    if (!res.success) { throw Error(res.error); }
    let data = res.stack.readCell();
    return { code: codeCell, data };
}

const SampleTactContract_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    4429: { message: `Invalid sender` },
}

export class SampleTactContract implements Contract {
    
    static async init(owner: Address) {
        return await SampleTactContract_init(owner);
    }
    
    static async fromInit(owner: Address) {
        const init = await SampleTactContract_init(owner);
        const address = contractAddress(0, init);
        return new SampleTactContract(address, init);
    }
    
    static fromAddress(address: Address) {
        return new SampleTactContract(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: SampleTactContract_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Add | 'increment' | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Add') {
            body = beginCell().store(storeAdd(message)).endCell();
        }
        if (message === 'increment') {
            body = beginCell().storeUint(0, 32).storeBuffer(Buffer.from(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getCounter(provider: ContractProvider) {
        let __stack: TupleItem[] = [];
        let result = await provider.get('counter', __stack);
        return result.stack.readBigNumber();
    }
    
}