'use client'; // Directive to use React's client-side rendering

import { Box, TextField, Button, Typography, AppBar, Toolbar } from "@mui/material"; // Importing MUI components
import { Stack } from "@mui/system"; // Importing Stack component for layout
import { useState, useEffect } from "react"; // Importing useState and useEffect hooks
import { auth } from '../firebase/firebase'; // Import the Firebase auth module
import { onAuthStateChanged } from 'firebase/auth'; // Import the Firebase auth state listener

export default function Home() {
  // useState hooks to manage the array of messages and user data
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, I am King Triton, here to help you navigate the seas of UC San Diego. How can I assist you today?'
  }]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // Retrieve user data on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirect to sign-in page if not authenticated
        window.location.href = '/signin';
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper function to send the message to the backend and generate a response
  const sendMessage = async () => {
    if (message.trim() === '') return; // Don't send empty messages

    // Update state to add user's message and a placeholder for the assistant's response
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);

    setMessage(''); // Clear the input field

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
    <Box
      width="100vw" // Full width of the viewport
      height="100vh" // Full height of the viewport
      display="flex" // Display as a flex container
      flexDirection="column" // Align children in a column
      justifyContent="center" // Center content vertically
      alignItems="center" // Center content horizontally
      sx={{ backgroundColor: '#003d5b' }} // Background color
    >
      {/* AppBar for the banner */}
      <AppBar position="relative" sx={{ width: "600px", backgroundColor: 'gold' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="h6" color="black" justifyContent={'center'}>
            UCSD Triton Chatbot
          </Typography>
        </Toolbar>
      </AppBar>

      {/* User Greeting Banner */}
      {user && (
        <Box
          sx={{
            width: '600px',
            backgroundColor: '#003d5b', // UCSD blue
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            marginBottom: '16px',
            opacity: 0, // Start with hidden
            animation: 'fadeIn 2s forwards', // Apply fade-in animation
          }}
        >
          <Typography variant="h5" color="white">
            Hello, {user.email}!
          </Typography>
        </Box>
      )}

      {/* Chat Area */}
      <Stack
        direction="column" // Stack items in a column
        width="600px" // Set a fixed width for the chat container
        height="700px" // Set a fixed height for the chat container
        border="1px solid black" // Add a black border around the chat container
        p={2} // Add padding inside the chat container
        spacing={3} // Add spacing between items in the stack
        sx={{
          backgroundColor: '#deeaff ', // Background color for the chat container
          borderRadius: 2,
          boxShadow: 3 // Optional: add a shadow
        }}
      >
        <Stack
          direction="column" // Stack messages in a column
          spacing={2} // Add spacing between messages
          flexGrow={1} // Allow the stack to grow
          overflow="auto" // Enable scrolling if content overflows
          maxHeight="100%" // Limit the height
        >
          {messages.map((message, index) => (
            <Box
              key={index} // Unique key for each message
              display="flex" // Display as a flex container
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'darkblue' // Background color for assistant messages
                    : 'gold' // Background color for user messages
                }
                color="white" // Text color
                borderRadius={16} // Rounded corners
                p={3} // Padding inside the message bubble
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>

        {/* Text input and send button */}
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message" // Label for the input field
            fullWidth // Make the input field take the full width
            value={message} // Bind the input field to the message state
            onChange={(e) => setMessage(e.target.value)} // Update message state on input change
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()} // Send message on Enter key press
          />
          <Button
            sx={{ backgroundColor: '#FEDD56', '&:hover': { backgroundColor: '#FEF3C7' } }}
            variant="contained"
            onClick={sendMessage} // Trigger sendMessage on button click
          >
            Send
          </Button>
        </Stack>
      </Stack>

      {/* Add CSS animation for fade-in effect */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
}
