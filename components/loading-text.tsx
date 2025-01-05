import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const LoadingText = ({ isUploading }: { isUploading: boolean }) => {
  const loadingText = "Uploading...";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const letterAnimation = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <AnimatePresence>
      {isUploading && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit="exit"
          className="text-sm text-muted-foreground"
        >
          {loadingText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterAnimation}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingText;
