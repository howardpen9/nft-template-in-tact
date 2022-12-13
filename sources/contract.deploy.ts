import { contractAddress, toNano } from "ton";
import { packAdd, SampleTactContract_init } from "./output/sample_SampleTactContract";
import { printAddress, printDeploy, printHeader } from "./utils/print";
import { randomAddress } from "./utils/randomAddress";

(async () => {

    // Parameters
    let owner = randomAddress(0, 'some-owner'); // Replace owner with your address
    let packed = packAdd({ $$type: 'Add', amount: 10n }); // Replace if you want another message used
    let init = await SampleTactContract_init(owner);
    let address = contractAddress({ workchain: 0, initialCode: init.code, initialData: init.data });
    let deployAmount = toNano(10);
    let testnet = true;

    // Print basics
    printHeader('SampleTactContract');
    printAddress(address);
    printDeploy(init, deployAmount, packed, testnet);
})();