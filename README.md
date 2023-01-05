# TACT template project

This project has ready to use TACT compiler, typescript + jest with [ton-emulator](https://github.com/ton-community/ton-emulator), example how to do tests.

```bash
yarn test # To test contract
yarn build # To build contract
yarn deploy # To deploy contract
```
## Overview
This project has ready to use TACT compiler, typescript + jest with [ton-emulator](https://github.com/ton-community/ton-emulator), example how to do tests.

To launch your own contract you should:

1) Specify `contract.tact` that will be used in `yarn build`
2) Specify `contract.spec.ts` tests for using `yarn tests` for launching local tests on your local IDE. Not necessary for deployment.
3) Specify `contract.deploy.ts` according to your `contract.tact` to generate a deployment link. In particular, it is necessary to correctly call the Init() function from the contract. From the beginning in the template project using Tonhub endpoint in the deeplink, that means you can deploy your smart contract via [Tonhub/Sandbox](https://ton.org/docs/participate/wallets/apps#tonhub) application.

4) If you refactor template project to your own contract, you should update `tact.config.json` correspondingly.
```json
{
"projects": [{
    "name": "sample",
    "path": "./sources/contract.tact",
    "output": "./sources/output"
}]
}
```
Where:  
* `path` - is path to *.tact contract file it will be used when `yarn build` run. 
* `output` - is path to building files when yarn build run. `yarn test` & `yarn deploy` use these output files. 

In this way you can use template project to play with Tact smart contract examples from [examples](https://github.com/ton-community/tact/tree/main/examples). Good luck!🍀🚀

[Tact documentation.](https://github.com/ton-community/tact/blob/main/docs/overview.md)

## Licence

MIT
