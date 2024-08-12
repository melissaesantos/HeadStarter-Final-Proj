// src/app/signup/page.js
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Box, Button, Container, Typography, TextField, Stack, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signUp } from '../firebase/auth'; // Adjust based on your file structure

const themePrimary = createTheme({
    typography: {
        fontFamily: 'Georgia, serif',
    },
    palette: {
        mode: 'dark',
        primary: {
            main: '#003d5b', // UCSD blue
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

const SignUpPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        try {
            await signUp(email, password);
            router.push('/chatbot');
        } catch (error) {
            let errorMessage = 'Failed to sign up. Please check your information and try again.';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'Password is too weak.';
                    break;
                case 'auth/email-already-in-use':
                    errorMessage = 'Email already in use.';
                    break;
                default:
                    errorMessage = 'Failed to sign up. Please check your information and try again.';
            }
            setError(errorMessage);
        }
    };

    return (
        <ThemeProvider theme={themePrimary}>
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
                    
                    backgroundPosition: 'center', // Center the background image
                    backgroundRepeat: 'no-repeat', }}
                >
                    {/* Logo and text */}
                    <Stack direction="row" spacing={2} alignItems="center" width="auto" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
                        <img src="/images/Triton.png"
                            alt="UCSD"
                            style={{
                                width: '50px',
                                height: 'auto',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
                            }} />
                        <Typography variant="h4" color="gold" fontWeight={'bold'}>
                            UCSD<span style={{ color: "#E0C350" }}> Chatbot</span>
                        </Typography>
                    </Stack>

                    <Box
                        component="form"
                        onSubmit={handleSignUp}
                        noValidate
                        sx={{
                            padding: '40px',
                            borderRadius: '12px',
                            boxShadow: '0 12px 24px rgba(0,0,0,0.8)',
                            width: '100%',
                            maxWidth: '400px',
                            mt: 5,
                            backgroundColor: themePrimary.palette.primary.main, // UCSD blue background
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom color="gold">
                            Sign Up
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
                            InputLabelProps={{
                                style: { color: '#FFD700' } // Gold color for the label
                            }}
                            InputProps={{
                                style: { color: '#ffffff' } // White text color for input
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            InputLabelProps={{
                                style: { color: '#FFD700' } // Gold color for the label
                            }}
                            InputProps={{
                                style: { color: '#ffffff' } // White text color for input
                            }}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            
                            sx={{ mt: 3, mb: 2 ,backgroundColor: "#E0C350"}}
                        >
                            Sign Up
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            color="secondary"
                            onClick={() => router.push('/signin')}
                        >
                            Already have an account? Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default SignUpPage;
