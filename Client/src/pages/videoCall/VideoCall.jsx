import { useParams,useNavigate } from "react-router-dom";
import "./videocall.css"

import {  useEffect,useRef,useState } from "react";
const VideoCall = () => {
  const { roomID } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);
  const socketRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = new WebSocket('ws://localhost:8080');
    const socket = socketRef.current;

    socket.onopen = () => {
      console.log('WebSocket connected');
      // Join the room
      socket.send(JSON.stringify({ type: 'join-room', roomID }));
    };

    // Handle messages received from the WebSocket server
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      switch (msg.type) {
        case 'offer':
          handleOffer(msg.offer);
          break;
        case 'answer':
          handleAnswer(msg.answer);
          break;
        case 'ice-candidate':
          handleNewICECandidateMsg(msg.candidate);
          break;
        case 'leave-call':
          closeConnection();
          break;
      }
    };

    // Get media stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setLocalStream(stream);
      // Display your local video stream on the page
      const localVideo = document.querySelector('.local-video');
      if (localVideo) {
        localVideo.srcObject = stream;
      }
      // When local stream is obtained, set up the peer connection
      setupPeerConnection(stream);
    });

    return () => {
      // Clean up on component unmount
      socket.close();
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [roomID]);

  useEffect(() => {
    // Whenever remoteStream changes, attach it to the remote video element
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Set up the peer connection and add the media stream tracks
  const setupPeerConnection = (stream) => {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    peerConnection.current = new RTCPeerConnection(configuration);

    // Add each track from the local stream to the peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    // Listen for remote stream
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      const remoteVideo = document.querySelector('.remote-video');
      if (remoteVideo) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // Listen for ice candidate events
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.send(
          JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
            roomID,
          })
        );
      }
    };
  };

  const closeConnection = () => {
    alert('Other User Left the Call');
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null); // Remove the remote stream
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setTimeout(() => {
      navigate("/");
    }, 3000);
    
  };
  // When receiving an offer, set it as the remote description, and create an answer
  const handleOffer = async (offer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    socketRef.current.send(
      JSON.stringify({
        type: 'answer',
        answer: answer,
        roomID,
      })
    );
  };

  // When receiving an answer, set it as the remote description
  const handleAnswer = async (answer) => {
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // When receiving a new ICE candidate, add it to the peer connection
  const handleNewICECandidateMsg = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  };

  // To start the call, create an offer and set the local description, then send the offer to the peer
  const callUser = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    socketRef.current.send(
      JSON.stringify({
        type: 'offer',
        offer: offer,
        roomID,
      })
    );
  };

  const leaveCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null); // Remove the local stream
    }
    // Close the peer connection if it's open
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    // Send a message to the other peer so they can perform cleanup as well
    socketRef.current.send(JSON.stringify({
      type: 'leave-call',
      roomID: roomID,
    }));

    navigate("/");
    
  };

  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the track status
      });
      setIsCameraOff(!isCameraOff); // Update the state accordingly
    }
  };
  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled; // Toggle the track status
      });
      setIsMicMuted(!isMicMuted); // Update the state accordingly
    }
  };

    return (
        <div>
             <div className="video-call-container">
      <video className="local-video" autoPlay playsInline ref={video => {
        // Attach the local stream to this video element when it's mounted
        if (video) video.srcObject = localStream;
      }} />
      <div className="local-video-label">You</div>
      {!remoteStream && <p className="noRemote">Start Call to connect with others in the room!</p>}
      <video className="remote-video" autoPlay playsInline ref={remoteVideoRef} />
    </div>
      <div id="controls">
      {!remoteStream && <button onClick={callUser} className="startCall">Start Call</button>}
        <div className={isCameraOff ? "OFF" : "control-container"} onClick={toggleCamera}   id="camera-btn">
          <img src="/icons/camera.png" alt="Camera" />
        </div>
        <div className={isMicMuted ? "OFF" : "control-container"} onClick={toggleMic} id="mic-btn">
          <img src="/icons/mic.png" alt="Microphone" />
        </div>
        <a onClick={leaveCall}>
          <div className="control-container" id="leave-btn">
            <img src="/icons/phone.png" alt="Hang Up" />
          </div>
        </a>
        
      </div>
        </div>
    );
}
export default VideoCall;