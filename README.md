# P2P_VideoChatApp
The Peer-to-Peer WebRTC Video Call System, is a communication platform built on the robust foundation of the MERN stack, WebRTC, and WebSockets. 
This project empowers users with seamless, real-time video communication, featuring user-friendly functionalities such as peer-to-peer video calls, secure login/signup processes, and 
convenient toggling of microphone and video settings.

# Installation and local setup
* Clone the repository:
   *git clone https://github.com/Halima1872/P2P_VideoChatApp.git

* Server Setup:
   * Install Dependencies : npm init
   * Create a Mongo DB account at (https://www.mongodb.com/), create a Cluster and generate the Mongo URI and paste it into the .env file
      * MONGO = "YOUR MONGO URI HERE"
   * To Start the Server : nodemon server.js or node server.js

* Client Setup:
    * Install Dependencies : npm init
    * To Start Client : npm run dev

 * How to Run the Application?
     * Start the Server.
     * Start the Client in two different browsers.
     * Register for two different accountd and Log in into those accounts.
     * Create a Room from one account using a room id and from another account join the same room using room id.
     * After Entering the room, any user can Start call using the start call button, call will be connected.
     * To end the call, any user can end the call and call will be disconnected and both the users will be redirected to the home page.

