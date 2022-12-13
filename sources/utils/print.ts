import { Address, Cell, contractAddress, StateInit } from "ton";
import BN from 'bn.js';
import qs from 'qs';

export function printSeparator() {
    console.log("========================================================================================");
}

export function printHeader(name: string) {
    printSeparator();
    console.log('Contract: ' + name);
    printSeparator();
}

export function printAddress(address: Address, testnet: boolean = true) {
    console.log("Address: " + address.toFriendly({ testOnly: testnet }));
    console.log("Explorer: " + "https://" + (testnet ? 'testnet.' : '') + "tonwhales.com/explorer/address/" + address.toFriendly({ testOnly: testnet }));
    printSeparator();
}

export function printDeploy(init: { code: Cell, data: Cell }, amount: BN, command: Cell | string, testnet: boolean = true) {

    // Resolve target address
    let to = contractAddress({ workchain: 0, initialCode: init.code, initialData: init.data });

    // Resovle init
    let cell = new Cell();
    new StateInit(init).writeTo(cell);
    let initStr = cell.toBoc({ idx: false }).toString("base64");

    let link: string;
    if (typeof command === 'string') {
        link = `https://${testnet ? 'test.' : ''}tonhub.com/transfer/` + to.toFriendly({ testOnly: testnet }) + "?" + qs.stringify({
            text: command,
            amount: amount.toString(10),
            init: initStr
        });
    } else {
        link = `https://${testnet ? 'test.' : ''}tonhub.com/transfer/` + to.toFriendly({ testOnly: testnet }) + "?" + qs.stringify({
            text: "Deploy contract",
            amount: amount.toString(10),
            init: initStr,
            bin: command.toBoc({ idx: false }).toString('base64'),
        });
    }
    console.log("Deploy: " + link);
    printSeparator();
}