import {
    calculateFee, SigningStargateClient, GasPrice, coins
} from "@cosmjs/stargate"
import {DirectSecp256k1Wallet} from '@cosmjs/proto-signing'
import {fromHex} from "@cosmjs/encoding"
import {encode} from 'js-base64'

const RPC_URL = 'https://sei-rpc.brocha.in'
const PRIVATE_KEY = ''

async function send() {
    try {
        const wallet = await DirectSecp256k1Wallet.fromKey(fromHex(PRIVATE_KEY.substring(2)), 'sei');
        const gasPrice = GasPrice.fromString('1usei')
        const client = await SigningStargateClient.connectWithSigner(RPC_URL, wallet, {
            gasPrice
        })

        const amount = coins(1, gasPrice.denom)
        const fee = calculateFee(100000, GasPrice.fromString('0.1usei'));
        const memo = 'data:,{"p":"sei-20","op":"mint","tick":"seis","amt":"1000"}'
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


