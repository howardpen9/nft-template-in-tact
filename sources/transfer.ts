import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address, beginCell } from "ton";


async function main() {
  const NFT_OWNER = Address.parse("EQDND6yHEzKB82ZGRn58aY9Tt_69Ie_uz73e2VuuJ3fVVXfV");
  const NFT_DST = Address.parse("kQC4hErTeLrqzY05eiwMK4Wpy92QxAfYbgtOP7MhOKNnGoST");


  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "multiply voice predict admit hockey fringe flat bike napkin child quote piano year cloud bundle lunch curtain flee crouch injury accuse leisure tray danger"; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  if (!await client.isContractDeployed(wallet.address)) {
    return console.log("wallet is not deployed");
  }

  // open wallet and read the current seqno of the wallet
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();
  const query_id = 0;

      //TLB: transfer#5fcc3d14 query_id:uint64 new_owner:address response_destination:address custom_payload:Maybe ^cell forward_amount:coins forward_payload:remainder<slice> = Transfer
      let msg_transfer_body = beginCell()
        .storeBuffer(Buffer.from("5fcc3d14", "hex"))
        .storeUint(queryId, 64)
        .storeAddress(NFT_DST)
        .storeAddress(NFT_OWNER)
        .storeUint(0,1)
        .storeCoins(toNano(1))
        .endCell()


      console.log('🛠️Preparing new outgoing massage from deployment wallet. Seqno = ', seqno);
      console.log('Current deployment wallet balance = ', fromNano(balance).toString(), '💎TON');
      console.log('Totally supply for deployed Token = ', supply, ', amount = ', amount.toString());
      await contract.sendTransfer({
          seqno,
          secretKey,
          messages: [internal({
              value: msgvalue,
              to: NFT_DST,
              body: msg
          })]
      });
      console.log('======Sending NFT to ', NFT_DST, ' ======');




}
main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}