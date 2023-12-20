import {
    calculateFee,
    SigningStargateClient,
    GasPrice,
    coins
} from "@cosmjs/stargate"
import {crypto} from "cosmos-lib"
import {
    DirectSecp256k1Wallet,
} from '@cosmjs/proto-signing'
import {fromHex} from "@cosmjs/encoding"
import {encode} from 'js-base64'

const RPC_URL = 'https://shentu-rpc.publicnode.com'
const PRIVATE_KEY = ''
const MNEMONIC = ''

async function send() {
    try {
        const keys = crypto.getKeysFromMnemonic(MNEMONIC);
        const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(keys.privateKey), 'shentu');
        const gasPrice = GasPrice.fromString('1uctk')
        const client = await SigningStargateClient.connectWithSigner(RPC_URL, wallet, {
            gasPrice
        })

        const amount = coins(1, gasPrice.denom)
        const fee = calculateFee(70000, GasPrice.fromString('0.04uctk'));
        const memo = 'data:,{"op":"mint","amt":"10000","tick":"openbounty","p":"src-20"}'
        const encodedMemo = encode(memo)

        const [account] = await wallet.getAccounts()

        const balance = await client.getBalance(account.address, gasPrice.denom)

        console.log(account.address, balance)

        let count = 0
        while (count < 1000) {
            try {
                const result = await client.sendTokens(account.address, account.address, amount, fee, encodedMemo)
                console.log(result)
            } catch (e) {

            }

            count += 1

            await new Promise(resolve => setTimeout(resolve, 1000)); // 失败后等待一秒
        }
    } catch (e) {
        console.log('e', e)
    }
}

(async () => {
    await send()

})()


