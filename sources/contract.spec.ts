import { toNano } from 'ton';
import { createExecutorFromCode } from 'ton-nodejs';
import { SampleTactContract, SampleTactContract_init } from './output/sample_SampleTactContract';
import { randomAddress } from './utils/randomAddress';

describe('contract', () => {
    it('should deploy correctly', async () => {

        // Create stateinit
        let owner = randomAddress(0, 'some-owner');
        let nonOwner = randomAddress(0, 'some-non-owner');
        let init = await SampleTactContract_init(owner);
        let executor = await createExecutorFromCode(init);
        let contract = new SampleTactContract(executor);

        // Check counter
        expect((await contract.getCounter()).toString()).toEqual('0');

        // Increment counter
        await contract.send({ amount: toNano(1), from: owner }, 'increment');

        // Check counter
        expect((await contract.getCounter()).toString()).toEqual('1');

        // Non-owner
        await expect(() => contract.send({ amount: toNano(1), from: nonOwner }, 'increment')).rejects.toThrowError('Constraints error');
    });
});