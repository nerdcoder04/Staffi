
import React, { useEffect, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [showTitle, setShowTitle] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    // Show bubbles immediately with faster timing
    const titleTimer = setTimeout(() => setShowTitle(true), 1800);
    
    // Start explosion effect sooner
    const explodeTimer = setTimeout(() => setIsExploding(true), 2200);
    
    // Complete animation and transition out faster
    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => onComplete(), 600); // Faster transition out
    }, 3000); // Shorter overall duration

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(explodeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Generate more bubbles in multiple spiral groups for a richer effect
  const generateSpiralBubbles = (count: number, spiralOffset = 0, delayOffset = 0, speed = 1) => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i * 0.5) + spiralOffset;
      const radius = 10 + i * 5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const size = Math.max(6, 16 - i * 0.2); // Smaller bubbles
      const delay = delayOffset + i * 0.01 * speed; // Faster delays between bubbles
      
      return { x, y, size, delay };
    });
  };

  // Create more spiral groups with different offsets for a complex magic-like animation
  const bubbles = [
    ...generateSpiralBubbles(24, 0, 0, 1.5),
    ...generateSpiralBubbles(24, 2.5, 0.02, 1.5),
    ...generateSpiralBubbles(24, 5, 0.04, 1.5),
    ...generateSpiralBubbles(24, 7.5, 0.06, 1.5),
    ...generateSpiralBubbles(18, 10, 0.08, 1.5)
  ];

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }} // Faster exit animation
        >
          {/* Bubbles container */}
          <div className="relative h-96 w-96">
            {/* Spiral bubbles with faster animation */}
            {bubbles.map((bubble, index) => (
              <motion.div
                key={index}
                className="absolute left-1/2 top-1/2 rounded-full bg-gradient-to-r from-staffi-purple to-staffi-blue shadow-lg"
                initial={{ 
                  x: bubble.x * 12, // Start further out
                  y: bubble.y * 12,
                  scale: 0,
                  opacity: 0,
                  width: bubble.size,
                  height: bubble.size
                }}
                animate={isExploding ? {
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                  rotate: 720, // More rotation for dramatic effect
                } : {
                  x: [
                    bubble.x * 12, // Start further out
                    bubble.x * 9, 
                    bubble.x * 7, 
                    bubble.x * 5, 
                    bubble.x * 3,
                    0 // All bubbles end at center
                  ],
                  y: [
                    bubble.y * 12,
                    bubble.y * 9,
                    bubble.y * 7,
                    bubble.y * 5,
                    bubble.y * 3,
                    0
                  ],
                  scale: [0, 1, 1, 0.9, 0.7, 0],
                  opacity: [0, 0.9, 1, 0.9, 0.6, 0],
                  rotate: [0, 180, 360, 540, 720, 900] // 2.5 full rotations for more dynamic effect
                }}
                transition={{
                  duration: isExploding ? 0.4 : 2.0, // Faster animation
                  delay: bubble.delay * 0.7, // Reduce delay between bubbles
                  ease: "easeInOut",
                  times: isExploding ? [0, 1] : [0, 0.2, 0.4, 0.6, 0.8, 1]
                }}
              />
            ))}

            {/* Central bubble that grows and then pops with more dramatic effect */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-staffi-purple/90 to-staffi-blue/90 shadow-[0_0_40px_rgba(155,135,245,0.9)]"
              initial={{ scale: 0, opacity: 0, width: 30, height: 30 }}
              animate={{
                scale: isExploding ? [1, 20, 40] : [0, 0.2, 0.6, 1], // More dramatic scale
                opacity: isExploding ? [1, 1, 0] : [0, 0.5, 0.8, 1],
              }}
              transition={{
                delay: isExploding ? 0 : 1.8,
                duration: isExploding ? 0.5 : 0.4, // Faster animation
                ease: isExploding ? "easeOut" : "easeIn",
              }}
            />

            {/* Screen fill effect after explosion - faster and more dramatic */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-staffi-purple to-staffi-blue"
              initial={{ scale: 0, opacity: 0, borderRadius: "100%" }}
              animate={{
                scale: isExploding ? [0, 30] : 0, // More dramatic scale
                opacity: isExploding ? [0, 1] : 0,
                borderRadius: ["100%", "0%"]
              }}
              transition={{
                delay: 2.2, // Start sooner
                duration: 0.6, // Faster animation
                ease: "easeOut"
              }}
              style={{ 
                position: "fixed", 
                top: "50%", 
                left: "50%", 
                width: "10vw", 
                height: "10vh", 
                transform: "translate(-50%, -50%)" 
              }}
            />
          </div>

          {/* Content with faster reveal */}
          <motion.div
            className="absolute z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: showTitle ? 1 : 0,
              y: showTitle ? 0 : 20
            }}
            transition={{ duration: 0.5 }} // Faster animation
          >
            <motion.h1 
              className="mb-4 text-6xl font-bold text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.9, duration: 0.3 }} // Faster animation
            >
              STAFFI
            </motion.h1>
            <motion.p
              className="text-xl text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0, duration: 0.3 }} // Faster animation
            >
              Web3 & AI HR Management
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1 }} // Faster animation
            >
              <div className="flex justify-center gap-4">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: "200ms" }} />
                <div className="h-2 w-2 animate-pulse rounded-full bg-white" style={{ animationDelay: "400ms" }} />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
