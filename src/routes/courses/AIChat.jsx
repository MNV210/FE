import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';
import { QuestionAi } from '../../api/QuestionAI';
import { useParams } from 'react-router-dom';
import { Button } from 'antd'; // Import Button from Ant Design

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const params = useParams();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAllMessages = async () => {
    try {
      const response = await QuestionAi.getQuestionByUserAndLesson(
        { user_id: storedUser.info.id,
          lesson_id: params.lessonId 
        });
      setMessages(Array.isArray(response) ? response : []); 
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createMessage = async (question, type) => {
    try {
      // Create user question
      await QuestionAi.createQuestionAI({
        user_id: storedUser.info.id,
        lesson_id: params.lessonId,
        question: question,
        type: type
      });
      await getAllMessages();
    } catch (error) {
      console.error('Error creating message:', error);
    }
  };

  const callApiAi = async (question) => {
    try {
      setLoading(true);
      // Call AI API to get the response
      const response = await axios.post('http://localhost:8000/api/test_ai', 
            { question },
            { timeout: 60000000 }
      );
      await createMessage(response.data.answer, 'ai');
      return response.data.answer;
    } catch (error) {
      console.error('Error fetching AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, userMessage]);
    setMessage('');

    await createMessage(message, 'user');
    await callApiAi(message);
  };

  useEffect(() => {
    getAllMessages();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full max-w-4xl p-4">
      {/* Chat Header */}
      {/* <div className="flex items-center border-b border-gray-200 pb-2">
        <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">Chat Room</h2>
      </div> */}

      {/* Chat Content */}
      <div className="h-96 bg-gray-50 p-4 overflow-y-auto rounded-lg my-4">
        {Array.isArray(messages) && messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.type === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block max-w-[70%] ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              } p-3 rounded-lg`}
            >
              <p>{msg.question}</p>
              <span className={`text-xs ${
                msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {/* {msg.timestamp} */}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full"
          placeholder="Nhập tin nhắn của bạn..."
          disabled={loading}
        />
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="px-6 py-3 rounded-lg"
          disabled={loading}
        >
          Gửi
        </Button>
      </form>
    </div>
  );
};

export default AIChat;