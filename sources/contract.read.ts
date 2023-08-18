import { beginCell, contractAddress, toNano, Cell, Address, TonClient4 } from "ton";
import { deploy } from "./utils/deploy";
import { printAddress, printDeploy, printHeader } from "./utils/print";
// ================================================================= //
import { NftCollection } from "./output/sample_NftCollection";
// ================================================================= //

(async () => {
    const client = new TonClient4({
        // endpoint: "https://mainnet-v4.tonhubapi.com", // 🔴 Main-net API endpoint
        endpoint: "https://sandbox-v4.tonhubapi.com", // 🔴 Test-net API endpoint
    });

    // Parameters
    let address = Address.parse("YOUR ADDRESS"); // Replace owner with your address
    let contract_address = await NftCollection.fromAddress(address);
    let client_open = client.open(contract_address);

    const nft_index = 0n;
    let address_by_index = await client_open.getGetNftAddressByIndex(nft_index);
    printHeader("sampleNFT_Contract");
    printAddress(address);
    console.log("NFT Address: ", address_by_index);
})();
