import { toNano, beginCell } from "ton";
import { ContractSystem } from "@tact-lang/emulator";
import { inspect } from "util";

import { NftCollection } from "./output/sample_NftCollection";
import { NftItem } from "./output/sample_NftItem";

describe("contract", () => {
    it("should deploy correctly", async () => {
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");
        let nonOwner = system.treasure("non-owner");

        const OFFCHAIN_CONTENT_PREFIX = 0x01;
        const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
        let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

        let contract = system.open(
            await NftCollection.fromInit(owner.address, newContent, {
                $$type: "RoyaltyParams",
                numerator: 350n, // 350n = 35%
                denominator: 1000n,
                destination: owner.address,
            })
        );
        let tracker = system.track(contract.address);

        await contract.send(owner, { value: toNano(1) }, "Mint"); // Send Mint Transaction
        await contract.send(owner, { value: toNano(1) }, "Mint"); // Send Mint Transaction
        await system.run();

        // Check Results
        // expect(track.collect()).toMatchInlineSnapshot();
        console.log(inspect(tracker.collect(), true, null, true));

        // // Check counter
        // // expect(await contract.getCounter()).toEqual(0n);

        // // Increment counter
        // await contract.send(owner, { value: toNano(1) }, "Mint");
        // await system.run();
        // expect(tracker.collect()).toMatchInlineSnapshot();
    });
});
