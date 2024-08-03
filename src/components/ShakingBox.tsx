import React, { useState } from "react";
import { Button } from "./ui/button";
import "./ShakingBox.css";
import Shake from "shake.js";

const Box: React.FC = () => {
  const [isShaking, setIsShaking] = useState(false);

  const handleShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1000); // Shake for 1 second
  };

  const requestPermission = async () => {
    // @ts-expect-error: requestPermission is not available on all devices
    if (typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        // @ts-expect-error: requestPermission is not available on all devices
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState === "granted") {
          const shakeEvent = new Shake({ threshold: 15 });
          shakeEvent.start();
          window.addEventListener("shake", handleShake);
        }
      } catch (error) {
        console.error("Permission request failed", error);
      }
    } else {
      // Handle regular non-iOS 13+ devices
      const shakeEvent = new Shake({ threshold: 15 });
      shakeEvent.start();
      window.addEventListener("shake", handleShake);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Button onClick={requestPermission} className="bg-purple-500 text-white">
        Enable Shake Detection
      </Button>
      <div className={`w-32 h-32 ${isShaking ? "animate-shake" : ""}`}>
        <img
          src="/images/treasure.png"
          alt="Shake this treasure chest"
          className={`w-32 h-32 ${isShaking ? "animate-shake" : ""}`}
        />
      </div>
    </div>
  );
};

export default Box;
