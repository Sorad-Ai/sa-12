"use client"; // This directive ensures the file is run on the client-side

import { useEffect, useRef } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

// Define a custom hook for MediaPipe
const useMediaPipeHands = (videoRef: React.RefObject<HTMLVideoElement>, canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
      });

      hands.onResults((results) => {
        const canvasCtx = canvasRef.current?.getContext('2d');
        if (canvasCtx) {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          canvasCtx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

          if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
              drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, { color: '#00FF00', lineWidth: 5 });
              drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
            }
          }
          canvasCtx.restore();
        }
      });

      handsRef.current = hands;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 100,
        height: 100,
      });

      cameraRef.current = camera;

      return () => {
        handsRef.current?.close();
        cameraRef.current?.stop();
      };
    }
  }, [videoRef, canvasRef]);

  return { hands: handsRef.current, camera: cameraRef.current };
};

// Define the RootPage component
const RootPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { hands, camera } = useMediaPipeHands(videoRef, canvasRef);

  return (
    <div>
      <h1>Welcome to My Next.js App</h1>
      <p>Select a page from the navigation menu.</p>
      {/* The camera setup and MediaPipe are handled here */}
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ width: '100%' }} />
    </div>
  );
};

export default RootPage;
