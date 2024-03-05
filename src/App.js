import React, { useRef, useState, useEffect } from "react";
import RecordList from "./components/recordList";
import Recorder from "./components/recorder";
import { muteSpeaker, unmuteSpeaker } from "./utils/videoUtils";

function App() {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordedList, updateRecordedList] = useState([]);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordedTimeRef = useRef(0);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    if (recording && !paused) {
      const intervalId = setInterval(() => {
        const timeTaken = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );
        setRecordedTime(timeTaken);
        recordedTimeRef.current = timeTaken;
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [recording, paused]);

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        muteSpeaker(videoRef);
      })
      .catch((_error) => {
        alert("Permission Denied");
      });
  };

  const startRecording = () => {
    setRecording(true);
    unmuteSpeaker(videoRef);
    setPaused(false);

    chunksRef.current = [];
    startTimeRef.current = Date.now();

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

    muteSpeaker(videoRef);
    setRecordedTime(0);
  };

  const pauseRecording = () => {
    if (!paused) {
      muteSpeaker(videoRef);
      mediaRecorderRef.current.pause();
    } else {
      unmuteSpeaker(videoRef);
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
