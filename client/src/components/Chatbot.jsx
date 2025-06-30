import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaPaperPlane, FaTimes } from 'react-icons/fa';
import apiClient from '../api';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: 'bot', text: 'Hello! I am your Wanderlust Assistant. How can I help you find your next adventure?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatboxRef = useRef(null);

    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const handleApiResponse = (data) => {
        if (data.response.startsWith('[ACTION_URL]')) {
            const url = data.response.replace('[ACTION_URL]', '');
            window.location.href = url;
        } else {
            setMessages(prev => [...prev, { from: 'bot', text: data.response }]);
        }
    };

    const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    const newMessages = [...messages, { from: 'user', text: userMessage }];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
        const history = newMessages
            .slice(1)
            .map(msg => ({
                role: msg.from === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));
        history.pop();
        
        const data = await apiClient('/chat', {
                method: 'POST',
                body: JSON.stringify({ prompt: userMessage, history: history }),
            });
        handleApiResponse(data);

    } catch (error) {
        console.error(error);
        setIsLoading(false); 
        setMessages(prev => [...prev, { from: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' }]);
    } finally {
            setIsLoading(false); 
    }
};

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h3>Wanderlust Assistant</h3>
                        <button onClick={toggleChat} className="chat-close-btn"><FaTimes /></button>
                    </div>
                    <div className="chat-box" ref={chatboxRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message ${msg.from}`}>
                                <p>{msg.text.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
                            </div>
                        ))}
                        {isLoading && <div className="chat-message bot"><p className="typing-indicator">...</p></div>}
                    </div>
                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask about listings, bookings..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}><FaPaperPlane /></button>
                    </form>
                </div>
            )}
            <button className="chat-bubble" onClick={toggleChat}>
                {isOpen ? <FaTimes /> : <FaCommentDots />}
            </button>
        </div>
    );
};

export default Chatbot;