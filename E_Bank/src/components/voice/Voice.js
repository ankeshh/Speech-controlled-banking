import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { HeadingText, SubText } from '../Home/HomeElements';
import SideMenu from '../Home/modules/SideMenu';
import { ComponentWrapper, Heading } from './VoiceElements';

const useVoice = ({user}) => {

    // STATE VARIABLES
    const [redirectPage, setRedirectPage] = useState("");
    const [account, setAcc] = useState({
        sender: 0, 
        receiver: 0, 
        amount: 0, 
        fee: 0, 
        used: false, 
        benef_used: false, 
        benef: ""
    });
    const [beneficiary, setBenef] = useState([]);
    const [addBenef, newBenef] = useState({
        name: "", 
        bank: "", 
        account: 0, 
        used: false
    });
    const [accountView, setAccView] = useState({
        number: 0,
        balance: 0,
        label: "",
        type: "",
        limit: 0,
        used: false
    });
    const [newAcc, makeNewAcc] = useState({
        label: "", 
        type: "", 
        limit: 0, 
        used: false
    });
    const [closeAcc, delAcc] = useState(0);
    const [removeBen, delBen] = useState({name: "", used: false});
    const [trans,clearTrans] = useState(0);

    const commands = [
        {
            command: ["go to :redirectPage","open :redirectpage"],
            callback: (redirectPage) => {setRedirectPage(redirectPage)}
        },
        {
            command: ["transfer :amount to account :receiver_acc"],
            callback: (amount, receiver_acc) => {
                setAcc({
                    fee: 0,
                    sender: user.account_no, 
                    receiver: 2861297468, 
                    amount: 15, 
                    used:true
                
                })
                console.log(receiver_acc)
            }
        },
        {
            command: ["transfer :amount to :benef"],
            callback: (amount, benef) => {
                setAcc({
                    sender: user.account_no,
                    benef: benef,
                    amount: amount,
                    benef_used: true
                })
            }
        },
        {
            command: ["show detail of account :account"],
            callback: (da,account) => {setAccView(account)}
        },
        {
            command: ["add account with label :label of type :type with spend limit :max"],
            callback: (label, type, max)=>{
                makeNewAcc({
                    label: label,
                    type: type,
                    limit: max,
                    used: true
                })
            }
        },
        {
            command: ["close account :account"],
            callback: (account) => {delAcc(account)}
        },
        {
            command: ["add beneficiary :name of bank :bank and account :account"],
            callback: (name, bank, account) => {
                newBenef({
                    name: name,
                    bank: bank,
                    account: account,
                    used: true
                })
            }
        },
        {
            command: ["remove beneficiary :name"],
            callback: name => {delBen({
                name: name,
                used: true
            })}
        },
        {
            command: ["delete all message"],
            callback: () => {
                fetch(`http://localhost:3000/deleteAllMessage`)
                .then(response => response.json)
                .then(alert("All messages deleted"))
                .catch(err => console.log(err))
            }
        },
        {
            command: ["* clear transcript"],
            callback: () => {return(resetTranscript)}
        }
    ];

    const pages = ["home","account","beneficiary","transaction","card","messages","settings","statment"];
    const URLs = {
        home: "/home",
        account: "/account",
        beneficiary: "/beneficiary",
        transaction: "/transaction",
        card: "/card",
        messages: "/message",
        settings: "/settings",
        statment: "/user/statement",
    };

    const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition({commands});

    if(!browserSupportsSpeechRecognition){
        return <span>Browser does not support speech recognition</span>
    }

    if(redirectPage){
        if(pages.includes(redirectPage)){
            window.location.href = `/${redirectPage}`;
            setTimeout(()=>{window.location.href = `/voice`},10000)
        }
        else {
            alert('Page not found, try again.')
        }
    }

    if(delAcc){
        fetch(`http://localhost:3000/closeaccount/${closeAcc}`)
            .then(response => response.json())
            .then(alert("Account deleted"))
            .catch(err => console.log(err));
    }

    if(accountView.used){
        fetch(`http://localhost:3000/getaccount/${accountView.number}`)
        .then(response => response.json())
        .then(account => {
            setAccView({
                number: account.acc_no,
                balance: account.balance,
                label: account.acc_label,
                type: account.acc_type,
                limit: account.acc_limit
            })
        })
        .catch(err => console.log(err));
    }
    
    if(account.used){
        console.log(account)
        fetch('http://localhost:3000/transaction', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sender_acc: account.sender,
                receiver_acc: account.receiver,
                amount: account.amount,
                transfer_fee: account.fee,
                transfer_info: "voice",
                transfer_category: "spending"
            })
            })
        .then(response => response.json())
        .then(status => {
            alert("Transfered")
            // window.location.reload(false);
        })
        .catch(err => console.log(err));  
    }

    if(newAcc.used){
        fetch('http://localhost:3000/addaccount', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                accNo: Math.floor(2E9+Math.random()*1E9),
                id: user.id,
                type: newAcc.type,
                limit: newAcc.limit,
                label: newAcc.label
            })
        })
        .then(response => response.json())
        .then(alert("Account created"))
        .catch(err => console.log(err));
    }

    if(account.benef_used){
        // console.log(account)
        fetch(`http://localhost:3000/beneficiarylist/${user.id}`)
        .then(respone => respone.json())
        .then(log => {setBenef(log)})
        .then(
            beneficiary.forEach((benef) => {
                console.log(benef);
                // if(benef.benef_name === account.benef){
                //     console.log(benef.benef_acc_no)
                    // setAcc(previousState => {
                    //     return {
                    //         ...previousState,
                    //         receiver: benef.benef_acc_no,
                    //         fee: benef.transfer_fee,
                    //     }
                    // })
                // }
            })
        ).catch(err=>console.log(err))
        // .then(
        //     fetch('http://localhost:3000/transaction', {
        //         method: 'POST',
        //         headers: {'Content-Type': 'application/json'},
        //         body: JSON.stringify({
        //             sender_acc: account.sender,
        //             receiver_acc: account.receiver,
        //             amount: account.amount,
        //             transfer_fee: account.fee
        //         })
        //     })
        //     .then(response => response.json())
        //     .then(status => {
        //         alert("Transfered");
        //     })
        //     .catch(err => console.log(err))
        // );
    }

    if(addBenef.used){
        fetch('http://localhost:3000/beneficiary/request', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: user.id,
                user_name: user.name,
                benef_acc_no: addBenef.account,
                benef_name: addBenef.name,
                benef_bank: addBenef.bank,
                transfer_fee: 25
            })
        })
        .then(response => response.json())
        .then(status => {
            alert("Beneficiary request sent");
            // window.location.reload(false);
        })
        .catch(err => console.log(err));
    }

    if(removeBen.used){
        fetch(`http://localhost:3000/beneficiarylist/${user.id}`)
        .then(respone => respone.json())
        .then(log => {setBenef(log)})
            beneficiary.map((benef) => {
                console.log(benef);
                // if(benef.benef_name === removeBen.name){
                //     console.log('ff')
                    // fetch(`http://localhost:3000/beneficiary/remove/${benef.benef_acc_no}`)
                    // .then(respone => respone.json())
                    // .then(log => {
                    //     alert("Beneficiary deleted")
                    // });
                // }
            })
    }

    // if(trans){
    //     // ()=>{resetTranscript} 
        // clearTrans(0);
    // }

    return(
        <>
            <ComponentWrapper>
                <SideMenu/>
                <Heading>
                    <HeadingText>Voice Commands</HeadingText>
                    <SubText>Use your voice to navigate around the site</SubText>
                </Heading>
                <h5 style={{color: 'black', paddingLeft: '20px'}}>Microphone: {listening ? 'on' : 'off'}</h5>
                <button style={{height: '70px', width: '120px', borderRadius: '10px', background: 'black', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer'}} onClick={SpeechRecognition.startListening}>Start</button>
                <button style={{height: '70px', width: '120px', borderRadius: '10px', background: 'black', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer'}} onClick={SpeechRecognition.stopListening}>Stop</button>
                <button style={{height: '70px', width: '120px', borderRadius: '10px', background: 'black', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer'}} onClick={resetTranscript}>Reset</button>
                <h4 style={{color: "black", paddingLeft: '30px', fontSize: '20px', background: 'red'}}>{transcript}</h4>
            </ComponentWrapper>
        </>
    )
}

export default useVoice;