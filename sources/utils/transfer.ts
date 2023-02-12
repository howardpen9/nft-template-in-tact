import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address, beginCell, toNano, internal} from "ton";


async function main() {
  const NFT_OWNER = Address.parse("EQDND6yHEzKB82ZGRn58aY9Tt_69Ie_uz73e2VuuJ3fVVXfV"); //wallet contract address of current owner NFT
  const NFT_DST = Address.parse("EQC4hErTeLrqzY05eiwMK4Wpy92QxAfYbgtOP7MhOKNnGj8Z"); // destination wallet contract address
  const NFT_ITEM = Address.parse("EQA2D8ZV0EaoXsXCLvQb4J8PBfm_0lEIkNdtcn3-DGJSXmV1"); // NFT item contract address, that will be transfered


  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "multiply voice predict..."; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const seqno = await walletContract.getSeqno();
  const queryId = 0;
  const secretKey = key.secretKey;
  const msgvalue = toNano("0.05");
  const forwardfee = toNano(1); // TODO need figure out how it should calculate

      //TLB: transfer#5fcc3d14 query_id:uint64 new_owner:address response_destination:address custom_payload:Maybe ^cell forward_amount:coins forward_payload:remainder<slice> = Transfer
      let msg_transfer_body = beginCell()
        .storeBuffer(Buffer.from("5fcc3d14", "hex"))
        .storeUint(queryId, 64)
        .storeAddress(NFT_DST)
        .storeAddress(NFT_OWNER)
        .storeUint(0,1)
        .storeCoins(forwardfee)
        .endCell()


      console.log('🛠️Preparing transfer NFT = ',NFT_ITEM ,' from ', NFT_OWNER);
      await walletContract.sendTransfer({
          seqno,
          secretKey,
          messages: [internal({
              value: msgvalue,
              to: NFT_ITEM,
              body: msg_transfer_body
          })]
      });
      console.log('======Sending NFT =', NFT_ITEM, ' to ', NFT_DST, ' ======');




}
main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}