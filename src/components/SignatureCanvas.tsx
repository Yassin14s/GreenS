import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSave: (signature: string) => void;
}

export default function SignatureCanvas({ onSave }: SignatureCanvasProps) {
  const signaturePadRef = useRef<SignaturePad>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGuide(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const clear = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
    setShowGuide(true);
  };

  const handleSave = () => {
    if (signaturePadRef.current && !isEmpty) {
      const signatureData = signaturePadRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  const handleBegin = () => {
    setIsEmpty(false);
    setShowGuide(false);
  };

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <SignaturePad
          ref={signaturePadRef}
          canvasProps={{
            className: 'w-full h-64 cursor-crosshair',
          }}
          onBegin={handleBegin}
        />
        
        <AnimatePresence>
          {showGuide && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-center text-white text-lg font-medium"
              >
                Sign here
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clear}
          className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isEmpty}
          className={`
            flex items-center px-6 py-2 rounded-lg transition-all duration-200
            ${isEmpty 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          <Check className="w-4 h-4 mr-2" />
          Apply Signature
        </motion.button>
      </div>
    </div>
  );
}