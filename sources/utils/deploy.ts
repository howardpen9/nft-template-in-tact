import { beginCell, Cell, contractAddress, storeStateInit } from "ton-core";
import { prompt } from 'enquirer';
import open from 'open';
import base64url from "base64url";
import { printSeparator } from "./print";
import qs from 'qs';

function getLink(prefix: string, init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean) {
    // Resolve target address
    let to = contractAddress(0, init);

    // Resovle init
    let initStr = base64url(beginCell()
        .store(storeStateInit(init))
        .endCell()
        .toBoc({ idx: false }));

    let link: string;
    if (typeof command === 'string') {
        link = prefix + `transfer/` + to.toString({ testOnly: testnet }) + "?" + qs.stringify({
            text: command,
            amount: value.toString(10),
            init: initStr
        });
    } else {
        link = prefix + `transfer/` + to.toString({ testOnly: testnet }) + "?" + qs.stringify({
            text: "Deploy contract",
            amount: value.toString(10),
            init: initStr,
            bin: base64url(command.toBoc({ idx: false })),
        });
    }
    return link;
}

export function getTonhubLink(init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean) {
    return getLink(`https://${testnet ? 'test.' : ''}tonhub.com/`, init, value, command, testnet);
}

export function getTonkeeperLink(init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean) {
    return getLink(`https://app.tonkeeper.com/`, init, value, command, testnet);
}

export function getLocalLink(init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean) {
    return getLink(`ton://`, init, value, command, testnet);
}

export function get(init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean) {
    // Resolve target address
    let to = contractAddress(0, init);

    // Resovle init
    let initStr = base64url(beginCell()
        .store(storeStateInit(init))
        .endCell()
        .toBoc({ idx: false }));

    let link: string;
    if (typeof command === 'string') {
        link = `https://${testnet ? 'test.' : ''}tonhub.com/transfer/` + to.toString({ testOnly: testnet }) + "?" + qs.stringify({
            text: command,
            amount: value.toString(10),
            init: initStr
        });
    } else {
        link = `https://${testnet ? 'test.' : ''}tonhub.com/transfer/` + to.toString({ testOnly: testnet }) + "?" + qs.stringify({
            text: "Deploy contract",
            amount: value.toString(10),
            init: initStr,
            bin: base64url(command.toBoc({ idx: false })),
        });
    }
    return link;
}

export async function deploy(init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean = true) {
    let kind = (await prompt<{ kind: 'tonhub' | 'tonkeeper' | 'local' }>([{
        type: 'select',
        name: 'kind',
        message: 'Way to deploy',
        initial: 0,
        choices: [{
            message: 'Tonhub/Sandbox',
            name: 'tonhub'
        }, {
            message: 'Tonkeeper',
            name: 'tonkeeper'
        }, {
            message: 'Open local link',
            name: 'local'
        }]
    }])).kind;

    // Show tonhub link
    if (kind === 'tonhub') {
        printSeparator();
        console.log("Deploy: " + getTonhubLink(init, value, command, testnet));
        printSeparator();
        return;
    }

    // Show tonkeeper link
    if (kind === 'tonkeeper') {
        printSeparator();
        console.log("Deploy: " + getTonkeeperLink(init, value, command, testnet));
        printSeparator();
        return;
    }

    // Show tonkeeper link
    if (kind === 'local') {

        // Create a link and display to the user
        let l = getLocalLink(init, value, command, testnet);
        printSeparator();
        console.log("Deploy: " + l);
        printSeparator();

        // Open link
        open(l);
        
        return;
    }
}