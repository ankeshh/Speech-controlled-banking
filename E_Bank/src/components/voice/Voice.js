import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { HeadingText, SubText } from '../Home/HomeElements';
import SideMenu from '../Home/modules/SideMenu';
import { ComponentWrapper, Heading } from './VoiceElements';

const useVoice = ({user}) => {

    const commands = [
        {
            command: ["* go to :redirectPage *","* open :redirectPage *"],
            callback: redirectPage => {setRedirectPage(redirectPage)}
        },
        {
            command: ["* transfer from account :sender_acc to account :receiver_acc amount :amount *"],
            callback: (sender_acc, receiver_acc, amount) => {
                setAcc({
                    fee: 0,
                    sender: sender_acc, 
                    receiver:receiver_acc, 
                    amount: amount, 
                    used:true
                })
            }
        },
        {
            command: ["* transfer from account :sender_acc to beneficiary :benef amount :amount *"],
            callback: (sender_acc, benef, amount) => {
                setAcc({
                    sender: sender_acc,
                    benef: benef,
                    amount: amount,
                    benef_used: true
                })
            }
        },
        {
            command: ["* show detail of account :account *"],
            callback: account => {setAccView(account)}
        },
        {
            command: ["* add account with label :label type :type spend limit :max *"],
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
            command: ["* close account :account *"],
            callback: account => {delAcc(account)}
        },
        {
            command: ["* add beneficiary :name of bank :bank and account :account *"],
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
            command: ["* remove beneficiary :acc_num *"],
            callback: acc_num => {delBen(acc_num)}
        },
        {
            command: ["* delete all message *"],
            callback: () => {
                fetch(`http://localhost:3000/deleteAllMessage`)
                .then(response => response.json)
                .catch(err => console.log(err))
            }
        },
        {
            command: ["clear transcript"],
            callback: () => {clearTrans(1)}
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
    }

    // STATE VARIABLES
    const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition({commands});
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
        limit: 0
    });
    const [newAcc, makeNewAcc] = useState({
        label: "", 
        type: "", 
        limit: 0, 
        used: false
    });
    const [closeAcc, delAcc] = useState(0);
    const [removeBen, delBen] = useState(0);
    const [trans,clearTrans] = useState(0);


    if(!browserSupportsSpeechRecognition){
        return <span>Browser does not support speech recognition</span>
    }

    if(redirectPage){
        if(pages.includes(redirectPage)){
            window.location.href = `/${redirectPage}`;
        }
        else {
            alert('Page not found, try again.')
        }
    }

    if(delAcc){
        fetch(`http://localhost:3000/closeaccount/${closeAcc}`)
            .then(response => response.json())
            .catch(err => console.log(err));
    }

    if(accountView){
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
                transfer_fee: account.fee
            })
            })
        .then(response => response.json())
        .then(status => {
            alert(status);
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
        .catch(err => console.log(err));
    }

    if(account.benef_used){
        fetch(`http://localhost:3000/beneficiarylist/${user.id}`)
        .then(respone => respone.json())
        .then(log => {setBenef(log)})
        .then(
            beneficiary.forEach((benef) => {
                if(benef.benef_name === account.benef){
                    setAcc(previousState => {
                        return {
                            ...previousState,
                            receiver: benef.benef_acc_no,
                            fee: benef.transfer_fee,
                        }
                    })
                }
            })
        ) 
        .then(
            fetch('http://localhost:3000/transaction', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    sender_acc: account.sender,
                    receiver_acc: account.receiver,
                    amount: account.amount,
                    transfer_fee: 0
                })
            })
            .then(response => response.json())
            .then(status => {
                alert(status);
                // window.location.reload(false);
            })
            .catch(err => console.log(err))
        );
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
                transfer_fee: this.state.transfer_fee
            })
        })
        .then(response => response.json())
        .then(status => {
            alert(status);
            // window.location.reload(false);
        })
        .catch(err => console.log(err));
    }

    if(removeBen){
        fetch(`http://localhost:3000/beneficiary/remove/${removeBen}`)
        .then(respone => respone.json())
        .then(log => {
            alert("Beneficiary deleted")
            window.location.reload(false);
        });
    }

    if(trans){
        // ()=>{resetTranscript} 
        clearTrans(0);
    }

    return(
        <>
            <ComponentWrapper>
                <SideMenu/>
                <Heading>
                    <HeadingText>Voice Commands</HeadingText>
                    <SubText>Use your voice to navigate around the site</SubText>
                </Heading>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button onClick={SpeechRecognition.startListening({continuous: true})}>Start</button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                <p style={{color: "red"}}>{transcript}</p>
            </ComponentWrapper>
        </>
    )
}

export default useVoice;