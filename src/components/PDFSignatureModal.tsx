import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileSignature, AlertCircle } from 'lucide-react';
import SignatureCanvas from './SignatureCanvas';
import { signPDF } from '../utils/pdfUtils';

interface PDFSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignComplete: (signedPdfBytes: Uint8Array, originalFileName: string) => void;
  pdfBytes: ArrayBuffer | null;
  fileName: string;
}

export default function PDFSignatureModal({
  isOpen,
  onClose,
  onSignComplete,
  pdfBytes,
  fileName
}: PDFSignatureModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleSignatureSave = async (signatureDataUrl: string) => {
    if (!pdfBytes) {
      setError('No PDF file loaded');
      return;
    }

    try {
      const signedPdfBytes = await signPDF(pdfBytes, signatureDataUrl);
      onSignComplete(signedPdfBytes, `signed_${fileName}`);
      onClose();
    } catch (err) {
      setError('Failed to sign PDF. Please try again.');
      console.error('Signature error:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <FileSignature className="h-8 w-8 text-indigo-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Add Your Signature
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-4 flex items-center bg-red-50 text-red-600 p-4 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Draw your signature below. Make sure it's clear and visible.
                </p>
                <SignatureCanvas onSave={handleSignatureSave} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}