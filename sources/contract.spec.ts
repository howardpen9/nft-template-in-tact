import { toNano, beginCell } from "ton";

// import { ContractSystem, testKey } from "@tact-lang/emulator";
import { ContractSystem, testKey } from "ton-emulator";

import { NftCollection } from "./output/sample_NftCollection";
import { NftItem } from "./output/sample_NftItem";

describe("contract", () => {
    it("should deploy correctly", async () => {
        // Create ContractSystem and deploy contract
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");
        let nonOwner = system.treasure("non-owner");

        const OFFCHAIN_CONTENT_PREFIX = 0x01;
        const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
        let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

        let init = await NftCollection.fromInit(owner.address, newContent, {
            $$type: "RoyaltyParams",
            numerator: 350n, // 350n = 35%
            denominator: 1000n,
            destination: owner.address,
        });
        let contract = system.open(init);

        let track = system.track(contract.address);

        await contract.send(owner, { value: toNano(1) }, { $$type: "Deploy", queryId: 0n });
        await contract.send(owner, { value: toNano(1) }, "Mint"); // Send Mint Transaction
        await system.run();

        // Check Results
        expect(track.events()).toMatchInlineSnapshot(`
            [
              {
                "type": "deploy",
              },
              {
                "message": {
                  "body": {
                    "text": "Mint",
                    "type": "text",
                  },
                  "bounce": true,
                  "from": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                  "to": "kQD8zFRnd-VRnou4c3quzwJfnx2eEom4-h9eeI29FXZ64eoA",
                  "type": "internal",
                  "value": 1000000000n,
                },
                "type": "received",
              },
              {
                "gasUsed": 18402n,
                "type": "processed",
              },
              {
                "messages": [
                  {
                    "body": {
                      "cell": "x{5FCC3D14000000000000000080011F6E292AB9FE5825731C5F568DB15E68F69707390F1976DA6A7F173916703B900023EDC525573FCB04AE638BEAD1B62BCD1ED2E0E721E32EDB4D4FE2E722CE07721_}
             x{}",
                      "type": "cell",
                    },
                    "bounce": false,
                    "from": "kQD8zFRnd-VRnou4c3quzwJfnx2eEom4-h9eeI29FXZ64eoA",
                    "to": "kQBv2R_74jT6I4Kl75B8y832XkyQshinlHQ08ycdfHAxkybg",
                    "type": "internal",
                    "value": 926106000n,
                  },
                ],
                "type": "sent",
              },
            ]
        `);

        // Check counter
        // expect(await contract.getCounter()).toEqual(0n);

        // Increment counter
        await contract.send(owner, { value: toNano(1) }, "Mint");
        await system.run();
        expect(track.events()).toMatchInlineSnapshot();
    });
});
