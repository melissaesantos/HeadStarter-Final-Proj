'use client'
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [messages,setMessages] = useState({
    role: 'assistant',
    content: 'Hi I am King Triton, here to help you navigate the seas of UC San Diego. How can I assist you today? '
  })
  const[message,setMessage] = useState('')
}
