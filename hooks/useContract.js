import { useEffect, useState } from 'react'
import useWeb3 from './useWeb3'
import { getIDOFactoryAddress, getStakingAddress, getCEAddress, getCEGAddress } from './addressHelpers'
import IDOFactory from './abis/IDOFactory.json'
import Staking from './abis/Staking.json'
import CEToken from './abis/CEToken.json'
import CEGToken from './abis/CEGToken.json'

const useContract = (abi, address) => {
    const web3 = useWeb3()
    const [contract, setContract] = useState(new web3.eth.Contract(abi, address))

    useEffect(() => {
        setContract(new web3.eth.Contract(abi, address))
    }, [abi, address, web3])

    return contract
}

export const useIDOFactory = () => {
    const abi = IDOFactory.abi;
    return useContract(abi, getIDOFactoryAddress())
}

export const useStaking = () => {
    const abi = Staking.abi;
    return useContract(abi, getStakingAddress())
}

export const useCEToken = () => {
    const abi = CEToken.abi;
    return useContract(abi, getCEAddress())
}

export const useCEGToken = () => {
    const abi = CEGToken.abi;
    return useContract(abi, getCEGAddress())
}