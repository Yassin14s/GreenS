import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Shield } from 'lucide-react';
import { getSignatureById } from '../utils/storageUtils';

interface SignatureDetails {
  signatureId: string;
  signerName: string;
  organization?: string;
  role?: string;
  createdAt: string;
  documentTitle?: string;
}

export default function VerifySignature() {
  const { signatureId } = useParams();
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState<SignatureDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifySignature() {
      if (!signatureId) {
        setError('Invalid signature ID');
        setLoading(false);
        return;
      }

      try {
        const data = await getSignatureById(signatureId);
        if (data) {
          setSignature(data);
        } else {
          setError('Signature not found');
        }
      } catch (err) {
        console.error('Error verifying signature:', err);
        setError('Failed to verify signature');
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    }

    verifySignature();
  }, [signatureId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center"
      >
        <AnimatePresence>
          {!error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="relative inline-block mb-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-green-100 rounded-full"
              />
              <CheckCircle className="h-24 w-24 text-green-500 relative z-10" />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {error ? (
            <div className="text-center text-red-600">
              <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
              <p>{error}</p>
            </div>
          ) : signature && (
            <>
              <h1 className="text-3xl font-bold text-gray-900">
                Signature Valide
              </h1>
              
              <p className="text-xl text-green-600">
                Cette signature numérique est authentique et sécurisée
              </p>

              <div className="mt-8 space-y-4">
                {signature.documentTitle && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-gray-500">Document</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {signature.documentTitle}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <h3 className="text-sm font-medium text-gray-500">Signataire</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {signature.signerName}
                  </p>
                </motion.div>

                {signature.organization && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-gray-500">Organisation</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {signature.organization}
                    </p>
                  </motion.div>
                )}

                {signature.role && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gray-50 p-4 rounded-lg"
                  >
                    <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {signature.role}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gray-50 p-4 rounded-lg"
                >
                  <h3 className="text-sm font-medium text-gray-500">Date de signature</h3>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {new Date(signature.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 flex items-center justify-center space-x-2 text-green-700 bg-green-50 rounded-lg p-4"
              >
                <Shield className="h-5 w-5" />
                <p className="text-sm">
                  Cette signature est protégée par cryptographie
                </p>
              </motion.div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}