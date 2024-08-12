"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Button, Container, Typography, TextField, Stack, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signIn } from '../firebase/auth'; // Adjust this path based on your file structure

const themeUCSD = createTheme({
  typography: {
      fontFamily: 'Georgia, serif',
  },
  palette: {
      mode: 'dark',
      primary: {
          main: '#00a3e0', // UCSD blue
      },
      secondary: {
          main: '#00a3e0', // UCSD light blue
      },
      background: {
          default: '#003d5b',
          paper: '#003d5b',
      },
      text: {
          primary: '#ffffff',
          secondary: '#cccccc',
      },
      gold: {
          main: '#FFD700', // Gold color
      }
  },
});


const SigninPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (event) => {
        event.preventDefault();
        try {
            await signIn(email, password);
            router.push('/chatbot');
        } catch (error) {
            let errorMessage = 'An error occurred. Please try again.';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                default:
                    errorMessage = 'Failed to sign in. Please check your credentials and try again.';
            }
            setError(errorMessage);
        }
    };

    const handleSignUp = () => {
        router.push('/signup');
    };

    return (
        <ThemeProvider theme={themeUCSD}>
            <CssBaseline />
            <Container maxWidth="xs">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="80vh"
                    textAlign="center"
                    sx={{backgroundImage: 'url("/images/Triton.jpg")', // Path to your background image
                    backgroundSize: 'cover', // Cover the entire viewport
                    backgroundPosition: 'center', // Center the background image
                    backgroundRepeat: 'no-repeat', }}
                    
                >
                    <Stack direction="row" spacing={2} alignItems="center" width="auto" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
                        <Typography variant="h4" color="primary" fontWeight={'bold'}>
                            UCSD<span style={{ color: "#ffcc00" }}> Chatbot</span>
                        </Typography>
                    </Stack>

                    <Box
                        component="form"
                        onSubmit={handleSignIn}
                        noValidate
                        sx={{
                            padding: '40px',
                            borderRadius: '12px',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                            width: '100%',
                            maxWidth: '400px',
                            mt: 5,
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Sign In
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            color="primary"
                            onClick={handleSignUp}
                        >
                            Don&apos;t have an account? Sign Up
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default SigninPage;
