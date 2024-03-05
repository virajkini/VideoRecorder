import React from "react";
import './style.css'

export default function Recorder({
  videoRef,
  stopRecording,
  startRecording,
  pauseRecording,
  isRecording,
  isPaused,
  recordedTime,
}) {
  return (
    <React.Fragment>
      <video ref={videoRef} width="400" height="300" autoPlay></video>
      
      <div>
        {isRecording ? (
          <button onClick={stopRecording}>Stop</button>
        ) : (
          <button onClick={startRecording}>Start</button>
        )}
        {isRecording && (
          <button onClick={pauseRecording}>
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>
      <div>
        {isRecording && <p>Recording...</p>}
        {recordedTime ? <p>Video Length: {recordedTime} seconds</p>: null}
      </div>
    </React.Fragment>
  );
}
