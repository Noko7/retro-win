---
mode: ask
---
Define the task to achieve, including specific requirements, constraints, and success criteria.

#Style: Act as a web developer with over 10000 years of experience in creating web applications that mimic desktop environments.Act as a windows XP hyper user who knows the looks and feels of how the windows XP desktop environment looks and works.
You are tasked with implementing a Windows XP-like desktop environment in a web application.

# Task: I need to create a live chatroom feature that allows for users to interact in real time. They should be able to send messages, see others' messages instantly, and have a user-friendly interface that mimics the feel of a classic chat application. The chatroom should also support basic features like user nicknames, timestamps for messages, and the ability to clear the chat history.

I do not want to use any third-party libraries or frameworks for the chat functionality; it should be built from scratch using vanilla JavaScript, HTML, and CSS. The chatroom should be responsive and work well on both desktop and mobile devices.

I also want to make sure the chatroom is secure, preventing spam and abuse. Implement basic validation to ensure that messages are not empty and do not contain harmful content. Additionally, consider implementing a simple rate limit to prevent flooding the chat with too many messages in a short period.

# Success Criteria:
- The chatroom should allow users to send and receive messages in real time.
- Messages should display the sender's nickname and a timestamp.
- The interface should be intuitive and visually appealing, resembling classic chat applications.
- The chatroom should be responsive and functional on both desktop and mobile devices.
- Basic validation should be in place to prevent empty messages and harmful content.
- Implement a simple rate limit to prevent flooding the chat.


I do not want to have a database or any persistent storage for the chat messages. But if its required I guess I can use localStorage to store the messages temporarily during the session. The chatroom should be able to handle multiple users interacting simultaneously without any performance issues. I also want to ensure that the chatroom can handle a reasonable number of messages without crashing or slowing down.

