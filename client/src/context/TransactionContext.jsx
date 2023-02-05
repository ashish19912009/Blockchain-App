import React, {useEffect, useState} from 'react';

import {ethers} from 'ethers';

import {contractABI, contractAddress} from '../utils/constants';

export const TransactionContext = React.createContext();

const {ethereum} = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    
    return transactionContract;
}

export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrentAccounts]= useState();
    const [formData, setFromData] = useState({addressTo:'', amount:'', keyword:'', message:''});
    const [isLoading, setLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transaction, setTransaction] = useState([]);
    const handleChange = (e, name)=> {
        setFromData((prevState)=>({...prevState,[name]:e.target.value}))
    }

    const getAllTransactions = async () => {
        try{
            if(!ethereum)
                return alert("Please install metamask"); 
            const transactionContract = getEthereumContract();
            const allTransactions = await transactionContract.getAllTransactions();
            const structedTransaction = allTransactions.map((transaction)=>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
            setTransaction(structedTransaction);
            console.log("All Transaction", structedTransaction);
        }
        catch(error) {
            console.log("Something went wrong");
        }

    }

    const checkIfWalletIsConnected = async () => {
        try{
        if(!ethereum) {
            return alert("Please install metamask"); 
        }
        const accounts = await ethereum.request({method:'eth_accounts'});
        if(accounts.length){
            setCurrentAccounts(accounts[0])
            getAllTransactions();
        }
        else {
            console.log("No account found");
        }

        }
        catch(error){
            console.error(error);
            throw new Error("No Ethereum object");
        }
    }

    const checkIfTransactionExist = async () => {
        try{
            const transactionContract = getEthereumContract();
            const transCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transCount);
        }
        catch(error) {
            console.error(error);
            throw new Error("No Ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionExist();
    },[]);

    const connectWallet = async () => {
        try {
            if(!ethereum) {
                return alert("Please install metamask"); 
            }
            const accounts = await ethereum.request({method:'eth_requestAccounts'});
            if(accounts.lenght){
                setCurrentAccounts(accounts[0]);

                // getAllTransactions();
            }else {
                console.log("No Account Found");
            }
        }
        catch(error) {
            console.error(error);
            throw new Error("No Ethereum object");
        }
    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) {
                return alert("Please install metamask"); 
            }
            const {addressTo, amount, keyword, message} = formData;
            const transactionContract = getEthereumContract();
            const parasedAmount = ethers.utils.parseEther(amount);
            // const parasedAmount = parseEther(amount).toString(16);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params:[{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208' ,
                    value:parasedAmount._hex
                }]
            })
            // 0x05CA411ac7c0b1DE7fC936C0A9A418D2DA691Eb5 
            const transHash = await transactionContract.addToBlockchain(addressTo, parasedAmount, message, keyword);
            setLoading(true);
            await transHash.wait();
            setLoading(false);
            const transCount = await transactionContract.getTransactionCount();
            setTransactionCount(transCount.toNumber());
            setFromData({addressTo:'', amount:'', keyword:'', message:''});
        }
        catch(error) {
            console.error(error);
            throw new Error("No Ethereum object");
        }
    }

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, formData, sendTransaction, handleChange, isLoading, transaction}}>
            {children}
        </TransactionContext.Provider>
    )
}