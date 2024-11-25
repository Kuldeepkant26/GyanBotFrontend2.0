import React, { useContext, useState, useEffect, useRef } from 'react';
import { MyContext } from '../Context/MyProvider';

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from '@langchain/core/output_parsers';

import '../css/home.css';
import { toast } from 'react-toastify';

function Home2() {
    const { currUser, logout } = useContext(MyContext)
    const [uprompt, setUprompt] = useState('');
    const [output, setOutput] = useState([]);  // Stores all messages, both user and bot
    const [chatHistory, setChatHistory] = useState([]);  // Keeps track of the last 3-4 messages

    // OpenAI model setup
    const model = new ChatOpenAI({
        openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
        modelName: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 1000,
    });

    // Output parser
    const parser = new StringOutputParser();

    // Create a reference to the last message element
    const chatEndRef = useRef(null);

    // Function to scroll to the bottom of the chat
    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Call scrollToBottom every time output is updated (new message added)
    useEffect(() => {
        scrollToBottom();
    }, [output]);

    // Function to build the prompt with chat history
    function buildPromptWithHistory(uprompt) {
        const limitedHistory = chatHistory.slice(-6);
        const historyString = limitedHistory.map(item => `${item.role}: ${item.message}`).join("\n");

        if (localStorage.getItem('gyanbot-auth-token')) {
            return ChatPromptTemplate.fromMessages([
                ["system", `You are an AI assistant who provides helpful and relevant responses based on the user's input and context as well as based on user info - (username-${currUser.name} , user Grade - ${currUser.grade}), user bio- ${currUser.bio} ) you can use this user information to provide personalized responses and also use vocabulary according to user grade`],
                ["system", "try to summerize the answer to user questions within 4-6 lines, remamber code do not count in summery you can write required code as much as needed"],
                ["system", historyString],
                ["human", uprompt]
            ]);
        } else {
            return ChatPromptTemplate.fromMessages([
                ["system", "You are an AI assistant(named GyanBot) who provides helpful and relevant responses based on the user's input and context"],
                ["system", "try to summerize the answer to user questions within 4-6 lines, remamber code do not count in summery you can write required code as much as needed"],
                ["system", historyString],
                ["human", uprompt]
            ]);
        }
    }

    async function asktobot() {
        if (uprompt === '') {
            return toast.warn("Enter somthing");
        }

        setChatHistory(prev => [...prev, { role: 'User', message: uprompt }]);
        setOutput(prev => [...prev, { role: 'user', message: uprompt }]);

        try {
            const promptWithHistory = buildPromptWithHistory(uprompt);

            let res = await promptWithHistory.pipe(model).pipe(parser).invoke({ input: uprompt });
            setUprompt('');  // Clear the input field after asking
            setChatHistory(prev => [...prev, { role: 'Bot', message: res }]);
            setOutput(prev => [...prev, { role: 'bot', message: res }]);

            setUprompt('');  // Clear the input field after asking
        } catch (error) {
            console.error("Error in fetching response:", error);
            setOutput(prev => [...prev, { role: 'bot', message: "Error: Unable to fetch response" }]);
        }
    }

    // Trigger "Ask" button when Enter is pressed
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            asktobot();  // Trigger the bot's response
        }
    };

    return (
        <div className='pages home-page'>

            <div className='chatbot'>
                <div className="top">
                    <img src="https://i.pinimg.com/originals/e5/d6/8b/e5d68b4c0923839b89fefb727afb9742.gif" alt="AI Bot Face" />
                    {localStorage.getItem('gyanbot-auth-token') && currUser ? <>
                        <h1 className='w-full text-center p-3'> Hello {currUser.name}!!</h1>
                    </> :

                        <h1 className='w-full text-center p-3'> Hey there!</h1>
                    }
                </div>
                <div className="chat">
                    {output.map((el, key) => (
                        <div key={key} className={el.role === 'user' ? 'user-message' : 'bot-message'}>
                            {el.message.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>  // Displaying each line as a separate paragraph
                            ))}
                        </div>
                    ))}
                    {/* Invisible div that we scroll to, to always be at the bottom */}
                    <div ref={chatEndRef}></div>
                </div>

            </div>
            <div className='input-section'>
                <input
                    type="text"
                    value={uprompt}
                    onChange={(e) => setUprompt(e.target.value)}
                    onKeyDown={handleKeyDown}  // Handle Enter key
                    placeholder='Ask here'
                    className='input-box'
                />
                <button onClick={asktobot} className='ask-button'><i className="ri-arrow-up-line"></i></button>
            </div>
        </div>
    );
}

export default Home2;
