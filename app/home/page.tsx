"use client"; // This directive ensures the file is run on the client-side

import { useState, useRef, useEffect } from 'react';
import { Hands } from '@mediapipe/hands';
import { drawLandmarks } from '@mediapipe/drawing_utils';
import { Camera } from '@mediapipe/camera_utils';

export default function HomePage() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let camera: Camera | null = null;
    let hands: Hands | null = null;

    const startCamera = async () => {
      setIsProcessing(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          videoRef.current.onloadedmetadata = () => {
            if (canvasRef.current && videoRef.current) {
              // Set canvas dimensions to match video dimensions
              canvasRef.current.width = videoRef.current.videoWidth;
              canvasRef.current.height = videoRef.current.videoHeight;

              hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
              });

              hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 0, // Set lower complexity for faster processing
                minDetectionConfidence: 0.8, // Increase confidence threshold
                minTrackingConfidence: 0.8,  // Increase confidence threshold
              });

              hands.onResults((results) => {
                if (canvasRef.current && videoRef.current) {
                  const canvasCtx = canvasRef.current.getContext('2d');
                  if (canvasCtx) {
                    // Clear and draw on the canvas
                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    canvasCtx.drawImage(
                      videoRef.current,
                      0,
                      0,
                      canvasRef.current.width,
                      canvasRef.current.height
                    );

                    if (results.multiHandLandmarks) {
                      for (const landmarks of results.multiHandLandmarks) {
                        drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 1 }); // Draw points on landmarks
                      }
                    }
                    canvasCtx.restore();
                  }
                }
              });

              camera = new Camera(videoRef.current, {
                onFrame: async () => {
                  if (hands && videoRef.current) {
                    await hands.send({ image: videoRef.current });
                  }
                },
                width: 640,
                height: 480,
              });

              camera.start();
            }
          };
        }
      }
      setIsProcessing(false);
    };

    const stopCamera = () => {
      setIsProcessing(true);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      if (hands) {
        hands.close();
      }

      if (camera) {
        camera.stop();
      }
      setIsProcessing(false);
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraOn]);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isCameraOn}
          onChange={() => setIsCameraOn(prev => !prev)}
          disabled={isProcessing}
        />
        Toggle Camera
      </label>
      {isProcessing && <p>Processing...</p>}
      <div style={{ position: 'relative' }}>
        {isCameraOn && (
          <>
            <video ref={videoRef} style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ width: '100%' }} />
          </>
        )}
      </div>
    </div>
  );
}
