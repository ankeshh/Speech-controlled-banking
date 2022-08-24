import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { HeadingText, SubText } from '../Home/HomeElements';
import SideMenu from '../Home/modules/SideMenu';
import { ComponentWrapper, Heading } from './VoiceElements';

const useVoice = () => {

    const commands = [
        {
            command: ["go to *","Open *"],
            callback: redirectPage => {setRedirectPage(redirectPage)}
        }
    ];

    const pages = ["home","account","beneficiary","transaction","card","messages","settings"];
    const URLs = {
        home: "/home",
        account: "/account",
        beneficiary: "/beneficiary",
        transaction: "/transaction",
        card: "/card",
        messages: "/message",
        settings: "/settings",
    }

    const {transcript, listening, resetTranscript, browserSupportsSpeechRecognition} = useSpeechRecognition({commands});
    const [redirectPage, setRedirectPage] = useState("");
    if(!browserSupportsSpeechRecognition){
        return <span>Browser does not support speech recognition</span>
    }

    if(redirectPage){
        if(pages.includes(redirectPage)){
            console.log(transcript)
            // <Redirect to="/home"/>
            // console.log(redirectPage)
            window.location.href = `/${redirectPage}`;
        }
        else {
            alert('Page not found, try again.')
        }
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
                <button onClick={SpeechRecognition.startListening}>Start</button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                <p style={{color: "red"}}>{transcript}</p>
            </ComponentWrapper>
        </>
    )
}

export default useVoice;