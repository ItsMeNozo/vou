import React, { useState } from "react";
import "./ShakingBox.css";

const ShakingBox: React.FC<{ triggerShake: boolean; onShakeEnd: () => void }> = ({
  triggerShake,
  onShakeEnd,
}) => {
  const [isShaking, setIsShaking] = useState(false);

  // When the triggerShake prop changes, start shaking
  React.useEffect(() => {
    if (triggerShake) {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        onShakeEnd(); // Call the callback after shaking ends
      }, 1500); // Duration of shake animation
    }
  }, [triggerShake, onShakeEnd]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
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

export default ShakingBox;
