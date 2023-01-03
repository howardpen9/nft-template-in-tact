import { Address, beginCell, Cell, contractAddress, storeStateInit } from "ton";
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
    console.log("Address: " + address.toString({ testOnly: testnet }));
    console.log("Explorer: " + "https://" + (testnet ? 'testnet.' : '') + "tonwhales.com/explorer/address/" + address.toString({ testOnly: testnet }));
    printSeparator();
}

export function printDeploy(init: { code: Cell, data: Cell }, value: bigint, command: Cell | string, testnet: boolean = true) {

    // Resolve target address
    let to = contractAddress(0, init);

    // Resovle init
    let initStr = beginCell()
        .store(storeStateInit(init))
        .endCell()
        .toBoc()
        .toString('base64');

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
            bin: command.toBoc({ idx: false }).toString('base64'),
        });
    }
    console.log("Deploy: " + link);
    printSeparator();
}