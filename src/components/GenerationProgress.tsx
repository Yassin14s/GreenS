import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Download, CheckCircle } from 'lucide-react';
import 'react-circular-progressbar/dist/styles.css';

interface GenerationProgressProps {
  progress: number;
  isGenerating: boolean;
  onDownload: () => void;
  downloadReady: boolean;
}

export default function GenerationProgress({
  progress,
  isGenerating,
  onDownload,
  downloadReady
}: GenerationProgressProps) {
  const isComplete = progress === 100;
  
  if (!isGenerating) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ y: 20, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl p-8 shadow-2xl w-80"
        >
          <div className="w-32 h-32 mx-auto mb-6">
            <CircularProgressbar
              value={progress}
              text={`${Math.round(progress)}%`}
              styles={buildStyles({
                rotation: 0.25,
                strokeLinecap: 'round',
                textSize: '16px',
                pathTransitionDuration: 0.5,
                pathColor: `rgba(79, 70, 229, ${progress / 100})`,
                textColor: '#1F2937',
                trailColor: '#E5E7EB',
                backgroundColor: '#3e98c7',
              })}
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isComplete ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span>Signature Complete!</span>
                </motion.div>
              ) : (
                'Adding Signature...'
              )}
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              {isComplete 
                ? 'Your document is ready for download'
                : 'Please wait while we process your document'}
            </p>

            {downloadReady && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDownload}
                className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Signed PDF
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}