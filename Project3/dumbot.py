
import datetime
import requests 
class Chatbot:
    def get_current_time(self):
        now = datetime.datetime.now()
        return now.strftime("%H:%M:%S")

    def __init__(self):
        self.responses = {
            "hi": "Hello! How can I help you today?",
            "how are you": "Good!",
            "what time is it?": self.get_current_time,
            "tell me a joke": self.dark_humer_jokes,
            "bye": "Goodbye! Have a great day!",
        }
        self.default_response = "Sorry I am having a hard time understanding you."

    def get_response(self, user_input):
        user_input = user_input.lower()
        if user_input in self.responses:
            response = self.responses[user_input]
            if callable(response):
                return response()
            return response
        if any(char.isdigit() for char in user_input):
            return self.calculate(user_input)
        return self.default_response
    
      
    def dark_humer_jokes(self):
        response = requests.get('https://official-joke-api.appspot.com/random_joke')
        joke = response.json()
        return f"{joke['setup']} - {joke['punchline']}"
    @staticmethod
    def main():
        bot = Chatbot()
        print("Welcome to the chatbot! Type 'bye' to exit.")
        while True:
            user_input = input("What would you like to tell the chatbot? ")
            if user_input.lower() == 'bye':
                print("Chatbot: Goodbye! Have a great day!")
                break
            response = bot.get_response(user_input)
            print(f"Chatbot: {response}")

Chatbot.main()
