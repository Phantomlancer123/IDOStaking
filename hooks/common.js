const { BigNumber } = require('ethers')
import { getIDOFactoryAddress, getStakingAddress } from './addressHelpers'

export const getAllIdos = async (web3, contract, index) => {
    if (contract){
        const response = await contract.methods.allIdos(index).call()
        console.log(response)
        return { linkDiscord: response.stringInfo.linkDiscord, linkTelegram: response.stringInfo.linkTelegram, linkTwitter: response.stringInfo.linkTwitter, linkWebsite: response.stringInfo.linkWebsite, saleTitle: response.stringInfo.saleTitle, closeTime: response.info.closeTime, decimals: response.info.decimals, hardCapInWei: response.info.hardCapInWei, maxInvestInWei: response.info.maxInvestInWei, minInvestInWei: response.info.minInvestInWei, openTime: response.info.openTime, softCapInWei: response.info.softCapInWei, tokenAddress: response.info.tokenAddress, tokenPriceInWei: response.info.tokenPriceInWei, whitelistedAddresses: response.info.whitelistedAddresses, creator: response.creator }
    }else{
        return [];
    }
}

export const getCounter = async (web3, contract) => {
    if (contract){
        const response = await contract.methods.counter().call()
        return response
    }else{
        return [];
    }
}

export const getBalanceOfCE = async (web3, contract, account) => {
    if (contract){
        const response = await contract.methods.balanceOf(account).call()
        return parseFloat(web3.utils.fromWei(response, 'ether')) 
    }else{
        return [];
    }
}

export const getBalanceOfCEG = async (web3, contract, account) => {
    if (contract){
        const response = await contract.methods.balanceOf(account).call()
        return parseFloat(web3.utils.fromWei(response, 'ether')) 
    }else{
        return [];
    }
}

export const setTokenApprove = async (web3, contract, account, amount) => {
    if (contract){
        const response = await contract.methods.approve(getStakingAddress(), web3.utils.toWei(amount+1, 'ether')).send({ from: account });
        console.log(response)
        return response
    }else{
        return [];
    }
}


export const setStake = async (web3, contract, account, amount) => {
    if (contract){
        const response = await contract.methods.stake(web3.utils.toWei(amount, 'ether')).send({ from: account });
        console.log(response)
        return response
    }else{
        return [];
    }
}

export const getStakeAmount = async (web3, contract, account) => {
    if (contract){
        const response = await contract.methods.checkStake().call({ from: account });
        return web3.utils.fromWei(response, 'ether');
    }else{
        return [];
    }
}

export const getStakeProfit = async (web3, contract, account) => {
    if (contract){
        const response = await contract.methods.checkCurrentRewards().call({ from: account });
        return web3.utils.fromWei(response, 'ether');
    }else{
        return [];
    }
}

export const setWithdraw = async (web3, contract, account, amount) => {
    if (contract){
        const response = await contract.methods.withdraw(web3.utils.toWei(amount, 'ether')).send({ from: account });
        console.log(response)
        return response
    }else{
        return [];
    }
}

export const addIdo = async (web3, contract, account, info, link) => {
    if (contract){
        const response = await contract.methods.createPresale(info ,link).send({ from: account, value:web3.utils.toWei("0.01", "ether") });
        console.log(response)
        return response
    }else{
        return [];
    }
}

export const setCEApproveFactory = async (web3, contract, account, amount) => {
    if (contract){
        const response = await contract.methods.approve(getIDOFactoryAddress(), web3.utils.toWei((amount+1).toString(), 'ether')).send({ from: account });
        return response
    }else{
        return [];
    }
}