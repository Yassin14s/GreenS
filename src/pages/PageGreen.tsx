import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Shield, User, Building, Briefcase, Calendar, AlertCircle, FileText } from 'lucide-react';
import { getSignatureById } from '../utils/storageUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface SignatureDetails {
  signatureId: string;
  signerName: string;
  organization?: string;
  role?: string;
  createdAt: string;
  documentTitle?: string;
}

export default function PageGreen() {
  const { signatureId } = useParams();
  const [signature, setSignature] = useState<SignatureDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

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
        setLoading(false);
      }
    }

    verifySignature();
  }, [signatureId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <div className="mb-6 text-red-500 flex justify-center">
            <AlertCircle className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('verify.title')}
          </h1>
          <p className="text-lg text-green-600">
            {t('verify.subtitle')}
          </p>
        </div>

        {signature && (
          <div className="space-y-6">
            <div className="bg-green-50 rounded-lg p-6 space-y-6">
              {signature.documentTitle && (
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">{t('verify.document')}</p>
                    <p className="text-lg font-semibold text-gray-900">{signature.documentTitle}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">{t('verify.signer')}</p>
                  <p className="text-lg font-semibold text-gray-900">{signature.signerName}</p>
                </div>
              </div>

              {signature.organization && (
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">{t('verify.organization')}</p>
                    <p className="text-lg font-semibold text-gray-900">{signature.organization}</p>
                  </div>
                </div>
              )}

              {signature.role && (
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Briefcase className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">{t('verify.role')}</p>
                    <p className="text-lg font-semibold text-gray-900">{signature.role}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">{t('verify.signedOn')}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(signature.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 text-green-700 bg-green-50 rounded-lg p-4 border border-green-100">
              <Shield className="h-5 w-5" />
              <p className="text-sm font-medium">
                {t('verify.protected')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}