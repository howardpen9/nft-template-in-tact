import { toNano, beginCell } from "ton";
import { ContractSystem } from "@tact-lang/emulator";
import { inspect } from "util";

import { NftCollection } from "./output/sample_NftCollection";
import { NftItem } from "./output/sample_NftItem";

describe("contract", () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    it("should deploy correctly", async () => {
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");
        let nonOwner = system.treasure("non-owner");

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
        expect(tracker.collect()).toMatchInlineSnapshot(`
            [
              {
                "$seq": 0,
                "events": [
                  {
                    "$type": "deploy",
                  },
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "text": "Mint",
                        "type": "text",
                      },
                      "bounce": true,
                      "from": "@treasure(owner)",
                      "to": "kQAEV0zlb7sQFpCrKo0JC6-v3ANISs0mem2Q-hk_ioBRbSIs",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 21328n,
                  },
                  {
                    "$type": "sent",
                    "messages": [
                      {
                        "body": {
                          "cell": "x{5FCC3D14000000000000000080011F6E292AB9FE5825731C5F568DB15E68F69707390F1976DA6A7F173916703B900023EDC525573FCB04AE638BEAD1B62BCD1ED2E0E721E32EDB4D4FE2E722CE07721_}
             x{}",
                          "type": "cell",
                        },
                        "bounce": false,
                        "from": "kQAEV0zlb7sQFpCrKo0JC6-v3ANISs0mem2Q-hk_ioBRbSIs",
                        "to": "kQDoo-y0Tw_SbHyORXdWPY7Guyxvq4gvToEGl-O7iGTId76Y",
                        "type": "internal",
                        "value": 922466000n,
                      },
                    ],
                  },
                ],
              },
              {
                "$seq": 1,
                "events": [
                  {
                    "$type": "received",
                    "message": {
                      "body": {
                        "text": "Mint",
                        "type": "text",
                      },
                      "bounce": true,
                      "from": "@treasure(owner)",
                      "to": "kQAEV0zlb7sQFpCrKo0JC6-v3ANISs0mem2Q-hk_ioBRbSIs",
                      "type": "internal",
                      "value": 1000000000n,
                    },
                  },
                  {
                    "$type": "processed",
                    "gasUsed": 20911n,
                  },
                  {
                    "$type": "sent",
                    "messages": [
                      {
                        "body": {
                          "cell": "x{5FCC3D14000000000000000080011F6E292AB9FE5825731C5F568DB15E68F69707390F1976DA6A7F173916703B900023EDC525573FCB04AE638BEAD1B62BCD1ED2E0E721E32EDB4D4FE2E722CE07721_}
             x{}",
                          "type": "cell",
                        },
                        "bounce": false,
                        "from": "kQAEV0zlb7sQFpCrKo0JC6-v3ANISs0mem2Q-hk_ioBRbSIs",
                        "to": "kQCBClCawabUjc7kr7ulWyv7dxM5rVrRTck7ntDbGx1rioRC",
                        "type": "internal",
                        "value": 952466000n,
                      },
                    ],
                  },
                ],
              },
            ]
        `);
        // console.log(inspect(tracker.collect(), true, null, true));

        // Check counter
        expect((await contract.getRoyaltyParams()).numerator).toEqual(350n);
    });
});
