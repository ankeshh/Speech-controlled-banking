import React from 'react';
import { Redirect } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { HeadingText, SubText } from '../Home/HomeElements';
import SideMenu from '../Home/modules/SideMenu';
import { ComponentWrapper, Heading } from './VoiceElements';

class Voice extends React.Component {
    constructor(props){
        super(props);
        this.state={
            redirectPage: '',
            transcript: ''
        }
    }

    useVoice = () => {

        const commands = [
            {
                command: ["Go to *","Open *"],
                callback: redirectPage => {this.setState({redirectPage: redirectPage})}
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
        if(!browserSupportsSpeechRecognition){
            return <span>Browser does not support speech recognition</span>
        }

        if(this.state.redirectPage){
            if(pages.includes(this.state.redirectPage)){
                <Redirect to={URLs[this.state.redirectPage]}/>
            }
            else {
                alert('Page not found, try again.')
            }
        }
        return(
            <>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                <button onClick={SpeechRecognition.startListening}>Start</button>
                <button onClick={SpeechRecognition.stopListening}>Stop</button>
                <button onClick={resetTranscript}>Reset</button>
                <p>{transcript}</p>
            </>
        )
    }

    render() {
        return(
            <>
                <ComponentWrapper>
                    <SideMenu/>
                    <Heading>
                        <HeadingText>Voice Commands</HeadingText>
                        <SubText>Use your voice to navigate around the site</SubText>
                    </Heading>
                    {this.useVoice()}
                </ComponentWrapper>
            </>
        )
    }
}

export default Voice;