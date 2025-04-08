import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Shield, User, Save, Download, History, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signPDF } from '../utils/pdfUtils';
import GenerationProgress from '../components/GenerationProgress';
import { getSignaturesByUserId, saveSignature, updateUser } from '../utils/storageUtils';
import { formatDate } from '../utils/signatureUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface UserData {
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  createdAt: string;
}

interface SignatureHistory {
  id: string;
  documentTitle: string;
  createdAt: string;
  signatureId: string;
  pdfData?: string;
}

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
  const [signedPdfData, setSignedPdfData] = useState<{ bytes: Uint8Array; fileName: string } | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    role: ''
  });
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [signatureHistory, setSignatureHistory] = useState<SignatureHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const getDisplayName = () => {
    if (profileData.firstName && profileData.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    }
    return currentUser?.email || 'Anonymous User';
  };

  useEffect(() => {
    if (currentUser) {
      setUserData({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        organization: currentUser.organization || '',
        role: currentUser.role || '',
        createdAt: new Date().toISOString()
      });
      
      setProfileData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        organization: currentUser.organization || '',
        role: currentUser.role || ''
      });
      
      fetchSignatureHistory();
    }
  }, [currentUser]);

  const fetchSignatureHistory = async () => {
    if (!currentUser?.uid) return;

    setLoadingHistory(true);
    try {
      const signatures = await getSignaturesByUserId(currentUser.uid);
      setSignatureHistory(signatures);
    } catch (err) {
      console.error('Error fetching signature history:', err);
      setError('Failed to fetch signature history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!currentUser?.uid) return;

    try {
      setError(null);
      const updatedUser = await updateUser(currentUser.uid, profileData);
      
      setUserData({
        ...userData!,
        ...updatedUser
      });
      
      setProfileUpdateSuccess(true);
      setTimeout(() => setProfileUpdateSuccess(false), 3000);
      setIsEditingProfile(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer);
      setSelectedFile(file);
      setError(null);
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to read PDF file. Please ensure the file is a valid PDF document.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isGenerating
  });

  const validateForm = () => {
    if (!documentTitle.trim()) {
      setError('Please enter a document title');
      return false;
    }
    if (!selectedFile || !pdfBytes) {
      setError('Please select a PDF file');
      return false;
    }
    if (!currentUser?.uid) {
      setError('You must be logged in to sign documents');
      return false;
    }
    return true;
  };

  const handleGenerateSignature = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setUploadProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      if (!pdfBytes) {
        throw new Error('No PDF file loaded');
      }

      const { signedPdfBytes, signatureId } = await signPDF(
        pdfBytes,
        getDisplayName(),
        profileData.organization || '',
        profileData.role || 'User'
      );

      // Convert signed PDF bytes to base64
      const pdfBase64 = btoa(
        Array.from(signedPdfBytes)
          .map(byte => String.fromCharCode(byte))
          .join('')
      );

      const signature = {
        id: crypto.randomUUID(),
        userId: currentUser!.uid,
        documentTitle,
        signatureId,
        signerName: getDisplayName(),
        organization: profileData.organization || '',
        role: profileData.role || 'User',
        createdAt: new Date().toISOString(),
        verified: true,
        pdfData: pdfBase64
      };

      await saveSignature(signature);
      await fetchSignatureHistory();

      setUploadProgress(100);
      setDownloadReady(true);
      setSignedPdfData({
        bytes: signedPdfBytes,
        fileName: `signed_${selectedFile!.name}`
      });

      clearInterval(progressInterval);
    } catch (err: any) {
      console.error('Error signing PDF:', err);
      setError(`Failed to sign document: ${err.message}. Please try again.`);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!signedPdfData) return;
    
    const blob = new Blob([signedPdfData.bytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = signedPdfData.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
    
    setSelectedFile(null);
    setPdfBytes(null);
    setIsGenerating(false);
    setDownloadReady(false);
    setSignedPdfData(null);
    setUploadProgress(0);
    setDocumentTitle('');
  };

  const handleDownloadHistory = (signature: SignatureHistory) => {
    if (!signature.pdfData) return;

    const bytes = Uint8Array.from(atob(signature.pdfData), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `signed_${signature.documentTitle}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
          <p className="text-xl text-gray-600">{t('dashboard.welcome')}, {getDisplayName()}</p>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg flex items-start"
          >
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.profile.title')}</h2>
              </div>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-green-600 hover:text-green-700 font-medium transition-colors duration-200"
              >
                {isEditingProfile ? t('dashboard.profile.cancel') : t('dashboard.profile.edit')}
              </button>
            </div>

            {isEditingProfile ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.profile.firstName')}</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                      placeholder={t('dashboard.profile.firstNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.profile.lastName')}</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                      placeholder={t('dashboard.profile.lastNamePlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.profile.organization')}</label>
                  <input
                    type="text"
                    value={profileData.organization}
                    onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder={t('dashboard.profile.organizationPlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('dashboard.profile.role')}</label>
                  <input
                    type="text"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                    placeholder={t('dashboard.profile.rolePlaceholder')}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateProfile}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('dashboard.profile.save')}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('dashboard.profile.name')}:</span>{' '}
                  {profileData.firstName || profileData.lastName ? 
                    `${profileData.firstName} ${profileData.lastName}` : 
                    t('dashboard.profile.notSet')}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('dashboard.profile.organization')}:</span>{' '}
                  {profileData.organization || t('dashboard.profile.notSet')}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{t('dashboard.profile.role')}:</span>{' '}
                  {profileData.role || t('dashboard.profile.notSet')}
                </p>
              </motion.div>
            )}

            {profileUpdateSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-green-50 text-green-700 rounded-md"
              >
                {t('dashboard.profile.updateSuccess')}
              </motion.div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.sign.title')}</h2>
              <p className="mt-2 text-gray-600">
                {t('dashboard.sign.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="documentTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('dashboard.sign.documentTitle')}
                </label>
                <input
                  type="text"
                  id="documentTitle"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder={t('dashboard.sign.documentTitlePlaceholder')}
                />
              </div>

              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
                  ${isDragActive ? 'border-green-400 bg-green-50' : 'border-gray-300'}
                  hover:border-green-400
                  ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <input {...getInputProps()} />
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    {selectedFile ? (
                      <File className="h-12 w-12" />
                    ) : (
                      <Upload className="h-12 w-12" />
                    )}
                  </div>
                  <div>
                    {selectedFile ? (
                      <p className="text-sm text-gray-600">{selectedFile.name}</p>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-900">
                          {isDragActive ? t('dashboard.sign.dropHere') : t('dashboard.sign.dragDrop')}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{t('dashboard.sign.or')}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>

              {selectedFile && !isGenerating && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateSignature}
                  className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  {t('dashboard.sign.signDocument')}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {isGenerating && (
            <GenerationProgress
              progress={uploadProgress}
              isGenerating={isGenerating}
              downloadReady={downloadReady}
              onDownload={handleDownload}
            />
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <History className="h-8 w-8 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.history.title')}</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchSignatureHistory}
              className="flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('dashboard.history.refresh')}
            </motion.button>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-8">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-8 w-8 border-b-2 border-green-600"
              />
            </div>
          ) : signatureHistory.length > 0 ? (
            <div className="space-y-4">
              {signatureHistory.map((signature, index) => (
                <motion.div
                  key={signature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200"
                >
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {signature.documentTitle}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {t('dashboard.history.signedOn')} {formatDate(new Date(signature.createdAt))}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('dashboard.history.signatureId')}: {signature.signatureId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/verify/${signature.signatureId}`}
                      className="text-green-600 hover:text-green-700 text-sm transition-colors duration-200"
                    >
                      {t('dashboard.history.verify')}
                    </Link>
                    {signature.pdfData && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadHistory(signature)}
                        className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-200 text-sm"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {t('dashboard.history.download')}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t('dashboard.history.noSignatures')}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}