import React, { createContext, useContext, useState } from 'react';

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.admin': 'Administration',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',

    // Home
    'home.hero.title': 'Secure Digital Signatures',
    'home.hero.subtitle': 'for Your Documents',
    'home.hero.description': 'Sign your documents securely and professionally. Verify signatures instantly and manage all your signed documents in one place.',
    'home.cta.dashboard': 'Go to Dashboard',
    'home.cta.getStarted': 'Get Started',
    'home.cta.signIn': 'Sign In',
    'home.why.title': 'Why Choose GreenSign?',
    'home.why.subtitle': 'Secure, efficient, and environmentally conscious digital signatures',
    'home.feature.security': 'Advanced Security',
    'home.feature.security.desc': 'Enterprise-grade encryption and secure document storage.',
    'home.feature.compliance': 'Legal Compliance',
    'home.feature.compliance.desc': 'Signatures that meet international legal standards.',
    'home.feature.verification': 'Easy Verification',
    'home.feature.verification.desc': 'Verify signature authenticity instantly.',
    'home.footer.developedBy': 'Developed by',

    // Dashboard
    'dashboard.title': 'Digital Document Signature',
    'dashboard.welcome': 'Welcome back',
    'dashboard.profile.title': 'Profile Information',
    'dashboard.profile.edit': 'Edit Profile',
    'dashboard.profile.cancel': 'Cancel',
    'dashboard.profile.firstName': 'First Name',
    'dashboard.profile.lastName': 'Last Name',
    'dashboard.profile.organization': 'Organization',
    'dashboard.profile.role': 'Role',
    'dashboard.profile.firstNamePlaceholder': 'Enter first name',
    'dashboard.profile.lastNamePlaceholder': 'Enter last name',
    'dashboard.profile.organizationPlaceholder': 'Enter organization name',
    'dashboard.profile.rolePlaceholder': 'Enter your role',
    'dashboard.profile.save': 'Save Changes',
    'dashboard.profile.name': 'Name',
    'dashboard.profile.notSet': 'Not set',
    'dashboard.profile.updateSuccess': 'Profile updated successfully!',

    'dashboard.sign.title': 'Sign Document',
    'dashboard.sign.subtitle': 'Upload and sign your PDF document securely',
    'dashboard.sign.documentTitle': 'Document Title',
    'dashboard.sign.documentTitlePlaceholder': 'Enter document title',
    'dashboard.sign.dropHere': 'Drop your PDF here',
    'dashboard.sign.dragDrop': 'Drag & drop your PDF here',
    'dashboard.sign.or': 'or click to select a file',
    'dashboard.sign.signDocument': 'Sign Document',

    'dashboard.history.title': 'Signature History',
    'dashboard.history.refresh': 'Refresh',
    'dashboard.history.signedOn': 'Signed on',
    'dashboard.history.signatureId': 'Signature ID',
    'dashboard.history.verify': 'Verify',
    'dashboard.history.download': 'Download',
    'dashboard.history.noSignatures': 'No signatures found. Sign your first document above!',

    // Verification
    'verify.title': 'Document Verified',
    'verify.subtitle': 'This digital signature is authentic and secure',
    'verify.document': 'Document',
    'verify.signer': 'Signer',
    'verify.organization': 'Organization',
    'verify.role': 'Role',
    'verify.signedOn': 'Signed on',
    'verify.protected': 'Protected by GreenSign Digital Signature',
  },
  fr: {
    // Navigation
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.admin': 'Administration',
    'nav.login': 'Connexion',
    'nav.register': "S'inscrire",
    'nav.dashboard': 'Tableau de bord',
    'nav.logout': 'Déconnexion',

    // Home
    'home.hero.title': 'Signatures Numériques Sécurisées',
    'home.hero.subtitle': 'pour vos Documents',
    'home.hero.description': 'Signez vos documents en toute sécurité et professionnellement. Vérifiez les signatures instantanément et gérez tous vos documents signés en un seul endroit.',
    'home.cta.dashboard': 'Accéder au tableau de bord',
    'home.cta.getStarted': 'Commencer',
    'home.cta.signIn': 'Se connecter',
    'home.why.title': 'Pourquoi choisir GreenSign ?',
    'home.why.subtitle': 'Signatures numériques sécurisées, efficaces et écologiques',
    'home.feature.security': 'Sécurité Avancée',
    'home.feature.security.desc': 'Cryptage et stockage sécurisé de niveau entreprise.',
    'home.feature.compliance': 'Conformité Légale',
    'home.feature.compliance.desc': 'Signatures conformes aux normes légales internationales.',
    'home.feature.verification': 'Vérification Facile',
    'home.feature.verification.desc': 'Vérifiez l\'authenticité des signatures instantanément.',
    'home.footer.developedBy': 'Développé par',

    // Dashboard
    'dashboard.title': 'Signature Numérique de Documents',
    'dashboard.welcome': 'Bienvenue',
    'dashboard.profile.title': 'Informations du Profil',
    'dashboard.profile.edit': 'Modifier le Profil',
    'dashboard.profile.cancel': 'Annuler',
    'dashboard.profile.firstName': 'Prénom',
    'dashboard.profile.lastName': 'Nom',
    'dashboard.profile.organization': 'Organisation',
    'dashboard.profile.role': 'Rôle',
    'dashboard.profile.firstNamePlaceholder': 'Entrez votre prénom',
    'dashboard.profile.lastNamePlaceholder': 'Entrez votre nom',
    'dashboard.profile.organizationPlaceholder': 'Entrez le nom de l\'organisation',
    'dashboard.profile.rolePlaceholder': 'Entrez votre rôle',
    'dashboard.profile.save': 'Enregistrer les Modifications',
    'dashboard.profile.name': 'Nom',
    'dashboard.profile.notSet': 'Non défini',
    'dashboard.profile.updateSuccess': 'Profil mis à jour avec succès !',

    'dashboard.sign.title': 'Signer un Document',
    'dashboard.sign.subtitle': 'Téléchargez et signez votre document PDF en toute sécurité',
    'dashboard.sign.documentTitle': 'Titre du Document',
    'dashboard.sign.documentTitlePlaceholder': 'Entrez le titre du document',
    'dashboard.sign.dropHere': 'Déposez votre PDF ici',
    'dashboard.sign.dragDrop': 'Glissez et déposez votre PDF ici',
    'dashboard.sign.or': 'ou cliquez pour sélectionner un fichier',
    'dashboard.sign.signDocument': 'Signer le Document',

    'dashboard.history.title': 'Historique des Signatures',
    'dashboard.history.refresh': 'Actualiser',
    'dashboard.history.signedOn': 'Signé le',
    'dashboard.history.signatureId': 'ID de Signature',
    'dashboard.history.verify': 'Vérifier',
    'dashboard.history.download': 'Télécharger',
    'dashboard.history.noSignatures': 'Aucune signature trouvée. Signez votre premier document ci-dessus !',

    // Verification
    'verify.title': 'Document Vérifié',
    'verify.subtitle': 'Cette signature numérique est authentique et sécurisée',
    'verify.document': 'Document',
    'verify.signer': 'Signataire',
    'verify.organization': 'Organisation',
    'verify.role': 'Rôle',
    'verify.signedOn': 'Signé le',
    'verify.protected': 'Protégé par Signature Numérique GreenSign',
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}