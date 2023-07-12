import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

// (ABI) is the standard way to interact with contracts in the Ethereum ecosystem,

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const [ownerName, setOwnerName] = useState("Shivam Gupta");
  const [add, setAdd] = useState(0);
  const [sub, setSub] = useState(0);
  const [mult, setMult] = useState(0);
  const [inputA, setInputA] = useState("");
  const [inputB, setInputB] = useState("");
  // const [result, setResult] = useState(0);



  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
      window.ethereum.on("accountsChanged", (accounts) => {handleAccount(accounts)})
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const deposit = async() => {
    if (atm) {
      let tx = await atm.deposit(5);
      await tx.wait()
      getBalance();
    }
  }

  const withdraw = async() => {
    if (atm) {
      let tx = await atm.withdraw(2);
      await tx.wait()
      getBalance();
    }
  }

  const checkOwner = async() => {
    if(atm){
      let owner = await atm.checkOwner();
      setOwnerName(owner);
    }
  }

  const addition = async() => {
    if (atm) {
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      let answer = await atm.addition(a,b);
      // let tx = await atm.withdraw(1);
      await answer.wait()
      setAdd(answer);
    }
  }

  const subtraction = async() => {
    if(atm){
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      const answer = await atm.subtraction(a,b);
      setSub(answer);
    }
  }

  const multiplication = async() => {
    if(atm){
      const a = parseInt(inputA);
      const b = parseInt(inputB);
      const answer = await atm.multiplication(a,b);
      setMult(answer);
    }
  }

  const handleInputAChange = (event) =>{
    setInputA(event.target.value);
  }

  const handleInputBChange = (event) =>{
    setInputB(event.target.value);
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button style={{backgroundColor: '#red'}} onClick={connectAccount}>Connect MetaMask Wallet!</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <>
      <div>
      
        <p style={{ fontFamily: "sans-serif"}}>Your Account: {account}</p>
        <p style="color:blue"> Wallet Balance: <button onClick={balance}>Balance Inquiry</button></p>
        // <p style={{ fontFamily: "sans-serif"}}>Your Balance: {balance} ETH </p>
        <p style={{ fontFamily: "sans-serif"}}>Owner Name : {ownerName}</p>

        {/* <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} /> */}
        
        <input type="number" placeholder="Enter ETH to deposit" value={inputA}
        onChange={handleInputAChange}/>
        <button style={{backgroundColor: '#green'}} onClick={deposit}>Confirm Deposit ETH</button><br>

  
        {/* window.alert("1 Eth Succrfully deposited "); */}
        <input type="number" placeholder="Enter ETH to withdraw" value={inputB}
        onChange={handleInputAChange}/>
        <button background-color: #FF0000; onClick={withdraw}>Conform Withdraw ETH</button>
        <p>Visit Our <b>Marketplace</b> to Buy Items with your NFT's </p>
        <a href="fruit.html">Shivam Fruit Shop</a>
      </div>

      <div>
        <h2>Crypto CLaculator</h2>
        <p style={{ fontFamily: "sans-serif"}}>Added ether : {add}</p>
        <p style={{ fontFamily: "sans-serif"}}>Subracted ether: {sub}</p>
        <p style={{ fontFamily: "sans-serif"}}>Multiplyed ether: {mult}</p>

        <input
        type="number"
        placeholder="Enter ETH"
        value={inputA}
        onChange={handleInputAChange}
        />

        <input
        type="number"
        placeholder="Enter ETH"
        value={inputB}
        onChange={handleInputBChange}
        /><br>
          
        <p>Choose Operation to perform on test network</p>
          
        <button style={{backgroundColor: "grey"}} onClick={addition}>+</button>
        <button style={{backgroundColor: "grey"}} onClick={subtraction}>-</button>
        <button style={{backgroundColor: "grey"}} onClick={multiplication}>*</button>

        <p style={{ fontFamily: "sans-serif"}}> Gas Fee : $0.12 or 0.00006177ETH</p>
        <p color= "red" style={{ fontFamily: "sans-serif"}}> (Estimated per transaction subjected to change)</p>
      </div>
      </>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome!</h1></header>
      <header><h2>Delhi Crypto ATM awaits you !</h2></header>
      <p>Please Click on the button blow to set <b>Wallet Conncetion</b></p>

      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
