import React, { useRef, useState, useEffect } from "react";
import RecordList from "./components/recordList";
import Recorder from "./components/recorder";

function App() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordedList, updateRecordedList] = useState([]);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordedTimeRef = useRef(0);

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    if (recording && !paused) {
      let timeTaken =  recordedTime + 1;
      const intervalId = setInterval(() => {
        timeTaken++;
        setRecordedTime(timeTaken);
        recordedTimeRef.current = timeTaken;

        // Stop recording if exeeds threshold
        if(timeTaken > 60) {
            stopRecording()
            alert('Recording on for long time. Hence stopped and saved for download');
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [recording, paused]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      
  };

  const startRecording = () => {
    setRecording(true);
    setPaused(false);

    chunksRef.current = [];

    const stream = videoRef.current.srcObject;
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.onstop = handleStop;
    mediaRecorderRef.current.start();
  };

  const handleDataAvailable = (event) => {
    chunksRef.current.push(event.data);
  };

  const handleStop = () => {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    updateRecordedList([
      ...recordedList,
      {
        name: `my-video-${recordedList.length + 1}.webm`,
        blob: blob,
        duration: recordedTimeRef.current,
      },
    ]);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    setRecordedTime(0);
  };

  const pauseRecording = () => {
    if (!paused) {
      mediaRecorderRef.current.pause();
    } else {
      mediaRecorderRef.current.resume();
    }
    setPaused(!paused);
  };

  return (
    <div>
      <h1>My Video Recorder</h1>
      <section>
        <Recorder
          videoRef={videoRef}
          startRecording={startRecording}
          pauseRecording={pauseRecording}
          stopRecording={stopRecording}
          isRecording={recording}
          isPaused={paused}
          recordedTime={recordedTime}
        />
      </section>
      <section>
        <RecordList list={recordedList} />
      </section>
    </div>
  );
}

export default App;
