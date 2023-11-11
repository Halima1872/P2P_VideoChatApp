import { useParams } from "react-router-dom";
import "./videocall.css"
const VideoCall = () => {
    const { roomID } = useParams();
    console.log(roomID);
    return (
        <div>
             <div id="videos">
        <video className="video-player" autoPlay playsInline muted></video>
        <video className="video-player" autoPlay playsInline></video>
      </div>
      <div id="controls">
        <div className="control-container" id="camera-btn">
          <img src="/icons/camera.png" alt="Camera" />
        </div>
        <div className="control-container" id="mic-btn">
          <img src="/icons/mic.png" alt="Microphone" />
        </div>
        <a href="/">
          <div className="control-container" id="leave-btn">
            <img src="/icons/phone.png" alt="Hang Up" />
          </div>
        </a>
      </div>
        </div>
    );
}
export default VideoCall;