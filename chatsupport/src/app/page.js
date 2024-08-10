'use client';  // Directive to use React's client-side rendering

import { Box, TextField, Button } from "@mui/material";  // Importing Box component from MUI (Material-UI) for layout
import { Stack } from "@mui/system";  // Importing Stack component from MUI system for flexible layout
import { useState } from "react";  // Importing useState hook from React for managing state

export default function Home() {
  // useState hook to manage an array of messages
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, I am King Triton, here to help you navigate the seas of UC San Diego. How can I assist you today?'
  }]);

  // useState hook to manage the current message being typed by the user
  const [message, setMessage] = useState('');

  // Helper function to send our message to the backend and generate a response 
  const sendMessage = async () => {
    if (message.trim() === '') return;  // Don't send empty messages

    // Update state to add user's message and a placeholder for the assistant's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    setMessage('');  // Clear the input field

    // Send the message to the backend
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = '';
    const processText = async ({ done, value }) => {
      if (done) {
        return result;
      }

      const text = decoder.decode(value || new Int8Array(), { stream: true });
      result += text;

      setMessages((prevMessages) => {
        const otherMessages = prevMessages.slice(0, -1);
        let lastMessage = prevMessages[prevMessages.length - 1];
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          },
        ];
      });

      return reader.read().then(processText);
    };

    reader.read().then(processText);
  };

  return (
    // Box component for the overall layout, taking up the full viewport width and height
    <Box
      width="100vw"  // Full width of the viewport
      height="100vh"  // Full height of the viewport
      display="flex"  // Display as a flex container
      flexDirection="column"  // Align children in a column
      justifyContent="center"  // Center content vertically
      alignItems="center"  // Center content horizontally
    >
      {/* Stack component to stack the main content vertically */}
      <Stack
        direction="column"  // Stack items in a column
        width="600px"  // Set a fixed width for the chat container
        height="700px"  // Set a fixed height for the chat container
        border="1px solid black"  // Add a black border around the chat container
        p={2}  // Add padding inside the chat container
        spacing={3}  // Add spacing between items in the stack
      >
        {/* Stack component to stack messages vertically */}
        <Stack
          direction="column"  // Stack messages in a column
          spacing={2}  // Add spacing between messages
          flexGrow={1}  // Allow the stack to grow and fill available space
          overflow="auto"  // Enable scrolling if content overflows
          maxHeight="100%"  // Limit the height to the parent's height
        >
          {/* Map over the messages array and render each message */}
          {messages.map((message, index) => (
            <Box
              key={index}  // Unique key for each message
              display="flex"  // Display as a flex container
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }  // Align messages based on the role (assistant or user)
            >
              {/* Box component for individual message bubble */}
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'  // Set background color for assistant messages
                    : 'secondary.main'  // Set background color for user messages
                }
                color="white"  // Text color
                borderRadius={16}  // Rounded corners for the message bubble
                p={3}  // Padding inside the message bubble
              >
                {message.content}  
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}  // Send message on Enter key press
          /> 
          <Button variant="contained" onClick={sendMessage}>Send</Button>  {/* Trigger sendMessage on button click */}
        </Stack>
      </Stack>
    </Box>
  );
}
