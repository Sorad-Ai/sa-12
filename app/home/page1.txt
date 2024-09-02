'use client';

import React, { useEffect, useState, useRef } from 'react';

const HomePage: React.FC = () => {
  const [pythonOutput, setPythonOutput] = useState('');

  useEffect(() => {
    const fetchPythonOutput = async () => {
      const response = await fetch('/api/run-python');
      const data = await response.json();
      setPythonOutput(data.output);
    };

    fetchPythonOutput();
  }, []);


  // for video
  const HomePage: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      const openCamera = async () => {
        try {
          const constraints = {
            video: {
              facingMode: 'environment', // Use 'user' for front-facing camera
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false, // Disable audio if not needed
          };
  
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play(); // Ensure the video is playing
          }
        } catch (error) {
          console.error('Error accessing the camera:', error);
          alert('Unable to access the camera. Please ensure you have granted camera permissions.');
        }
      };
  
      openCamera();
  
      // Cleanup on component unmount
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      };
    }, []);
    



  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main content of the Home page.</p>
      <h2>Python Output:</h2>
      <pre>{pythonOutput}</pre>

      <h2>Camera Feed:</h2>
      <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default HomePage;
