import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import DocumentUploadScreen from './screens/DocumentUploadScreen';
import SymptomLoggerScreen from './screens/SymptomLoggerScreen';
import MedicationScreen from './screens/MedicationScreen';
import ConsultationPrepScreen from './screens/ConsultationPrepScreen';
import SettingsScreen from './screens/SettingsScreen';

type Screen = 'home' | 'chat' | 'documents' | 'symptoms' | 'medications' | 'consultation' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

  const navigateTo = (screen: Screen) => setCurrentScreen(screen);
  const goHome = () => setCurrentScreen('home');

  switch (currentScreen) {
    case 'chat':
      return <ChatScreen onBack={goHome} />;
    case 'documents':
      return <DocumentUploadScreen onBack={goHome} />;
    case 'symptoms':
      return <SymptomLoggerScreen onBack={goHome} />;
    case 'medications':
      return <MedicationScreen onBack={goHome} />;
    case 'consultation':
      return <ConsultationPrepScreen onBack={goHome} />;
    case 'settings':
      return <SettingsScreen onBack={goHome} />;
    default:
      return (
        <HomeScreen 
          onNavigateToChat={() => navigateTo('chat')}
          onNavigateToDocuments={() => navigateTo('documents')}
          onNavigateToSymptoms={() => navigateTo('symptoms')}
          onNavigateToMedications={() => navigateTo('medications')}
          onNavigateToConsultation={() => navigateTo('consultation')}
          onNavigateToSettings={() => navigateTo('settings')}
        />
      );
  }
}

