export function muteSpeaker(videoRef) {
    const audioTracks = videoRef.current.srcObject.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = false;
    });
}

export function unmuteSpeaker(videoRef) {
    const audioTracks = videoRef.current.srcObject.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = true;
    });
}