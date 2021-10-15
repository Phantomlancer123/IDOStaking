import { useState, useRef, useEffect } from 'react'
import Web3 from 'web3'
import getRpcUrl from './getRpcUrl'

const RPC_URL = getRpcUrl()
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })

const useWeb3 = () => {
    var ethereum;
    if (typeof window != 'undefined') {
        var { ethereum } = window;
    }
    const refEth = useRef(ethereum)
    const [web3, setweb3] = useState(new Web3(ethereum || httpProvider))

    useEffect(() => {
        if (ethereum !== refEth.current) {
            setweb3(new Web3(ethereum || httpProvider))
            refEth.current = ethereum
        }
    }, [ethereum])
    return web3
}

export default useWeb3
