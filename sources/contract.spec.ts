import { toNano } from "ton";
import { ContractSystem } from "ton-emulator";
import { SampleTactContract } from "./output/sample_SampleTactContract";

describe("contract", () => {
    it("should deploy correctly", async () => {
        // Create ContractSystem and deploy contract
        let system = await ContractSystem.create();
        let owner = system.treasure("owner");
        let nonOwner = system.treasure("non-owner");
        let contract = system.open(await SampleTactContract.fromInit(owner.address));
        let track = system.track(contract.address);
        await contract.send(owner, { value: toNano(1) }, { $$type: "Deploy", queryId: 0n });
        await system.run();
        expect(track.events()).toMatchInlineSnapshot(`
            [
              {
                "type": "deploy",
              },
              {
                "message": {
                  "body": {
                    "cell": "x{95973DCC0000000000000000}",
                    "type": "cell",
                  },
                  "bounce": true,
                  "from": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                  "to": "kQCY8hRET2P9ghS3wLorMDazt37aCxg5cGcV0t0rYodDbYFu",
                  "type": "internal",
                  "value": 1000000000n,
                },
                "type": "received",
              },
              {
                "gasUsed": 8564n,
                "type": "processed",
              },
              {
                "messages": [
                  {
                    "body": {
                      "cell": "x{D37FB8210000000000000000}",
                      "type": "cell",
                    },
                    "bounce": true,
                    "from": "kQCY8hRET2P9ghS3wLorMDazt37aCxg5cGcV0t0rYodDbYFu",
                    "to": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                    "type": "internal",
                    "value": 990240000n,
                  },
                ],
                "type": "sent",
              },
            ]
        `);

        // Check counter
        expect(await contract.getCounter()).toEqual(0n);

        // Increment counter
        await contract.send(owner, { value: toNano(1) }, "increment");
        await system.run();
        expect(track.events()).toMatchInlineSnapshot(`
            [
              {
                "message": {
                  "body": {
                    "text": "increment",
                    "type": "text",
                  },
                  "bounce": true,
                  "from": "kQAI-3FJVc_ywSuY4vq0bYrzR7S4Och4y7bTU_i5yLOB3A6P",
                  "to": "kQCY8hRET2P9ghS3wLorMDazt37aCxg5cGcV0t0rYodDbYFu",
                  "type": "internal",
                  "value": 1000000000n,
                },
                "type": "received",
              },
              {
                "gasUsed": 4669n,
                "type": "processed",
              },
            ]
        `);

        // Check counter
        expect(await contract.getCounter()).toEqual(1n);

        // Non-owner
        await contract.send(nonOwner, { value: toNano(1) }, "increment");
        await system.run();
        expect(track.events()).toMatchInlineSnapshot(`
            [
              {
                "message": {
                  "body": {
                    "text": "increment",
                    "type": "text",
                  },
                  "bounce": true,
                  "from": "kQCVnZ1On-Ja4xfAfMbsq--jatb5sNnOUN421AHaXbebcCWH",
                  "to": "kQCY8hRET2P9ghS3wLorMDazt37aCxg5cGcV0t0rYodDbYFu",
                  "type": "internal",
                  "value": 1000000000n,
                },
                "type": "received",
              },
              {
                "errorCode": 4429,
                "type": "failed",
              },
              {
                "message": {
                  "body": {
                    "type": "empty",
                  },
                  "bounce": false,
                  "from": "kQCY8hRET2P9ghS3wLorMDazt37aCxg5cGcV0t0rYodDbYFu",
                  "to": "kQCVnZ1On-Ja4xfAfMbsq--jatb5sNnOUN421AHaXbebcCWH",
                  "type": "internal",
                  "value": 995047000n,
                },
                "type": "sent-bounced",
              },
            ]
        `);
    });
});
