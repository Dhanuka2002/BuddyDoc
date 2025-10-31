# Technical Architecture Specification - PatientPrep SL

## Overview
PatientPrep SL is built as a privacy-first mobile application using React Native with Expo, emphasizing local data storage and minimal server interaction.

---

## System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────┐
│                 USER DEVICE                 │
├─────────────────────────────────────────────┤
│  PatientPrep SL App (React Native/Expo)    │
│  ┌─────────────────┬─────────────────────┐  │
│  │   UI Layer      │   Business Logic    │  │
│  │   - Screens     │   - Agentic Logic   │  │
│  │   - Components  │   - Data Processing │  │
│  │   - Navigation  │   - Validation      │  │
│  └─────────────────┴─────────────────────┘  │
│  ┌─────────────────────────────────────────┐  │
│  │        LOCAL STORAGE LAYER              │  │
│  │  - Encrypted SQLite (Health Data)      │  │
│  │  - SecureStore (Authentication)        │  │
│  │  - AsyncStorage (App Preferences)      │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                        │ HTTPS Only
                        │ (Non-PHI Data)
┌─────────────────────────────────────────────┐
│              FIREBASE CLOUD                 │
├─────────────────────────────────────────────┤
│  Authentication  │  Analytics  │  FCM       │
│  Cloud Functions │  Firestore  │  Hosting   │
│  (General Only)  │  (Non-PHI)  │  (Static)  │
└─────────────────────────────────────────────┘
```

---

## Technology Stack Detailed Specification

### Frontend: React Native with Expo Go

#### Core Technologies
- **React Native:** 0.72.x (Latest stable)
- **Expo SDK:** 49.x (Managed workflow)
- **TypeScript:** Full type safety implementation
- **Navigation:** React Navigation v6 (Stack + Tab navigation)

#### Key Libraries
```json
{
  "expo": "~49.0.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/stack": "^6.3.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "expo-secure-store": "~12.3.0",
  "expo-sqlite": "~11.3.0",
  "expo-crypto": "~12.4.0",
  "react-hook-form": "^7.45.0",
  "date-fns": "^2.30.0",
  "react-native-paper": "^5.10.0"
}
```

#### Development Rationale
- **Rapid Prototyping:** Expo enables fast iteration cycles
- **Single Codebase:** iOS and Android from one codebase
- **Managed Workflow:** Simplified deployment and updates
- **Rich SDK:** Built-in APIs for storage, notifications, etc.
- **Solo Developer Friendly:** Excellent documentation and community

---

## Local Storage Architecture

### Storage Strategy Overview
All Personal Health Information (PHI) is stored exclusively on-device using a multi-layer approach:

### Layer 1: Encrypted SQLite Database (Health Data)
**Purpose:** Store all patient health information  
**Technology:** `expo-sqlite` with custom encryption

```sql
-- Core Tables Schema
CREATE TABLE symptoms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  symptom_name TEXT ENCRYPTED NOT NULL,
  onset_date TEXT ENCRYPTED,
  severity INTEGER,
  description TEXT ENCRYPTED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_name TEXT ENCRYPTED NOT NULL,
  dosage TEXT ENCRYPTED,
  frequency TEXT ENCRYPTED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_text TEXT ENCRYPTED NOT NULL,
  priority INTEGER DEFAULT 1,
  appointment_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_name TEXT ENCRYPTED,
  specialty TEXT ENCRYPTED,
  appointment_date TEXT,
  notes TEXT ENCRYPTED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Layer 2: Expo SecureStore (Authentication & Keys)
**Purpose:** Store authentication tokens and encryption keys  
**Technology:** `expo-secure-store` (Keychain/Keystore integration)

```typescript
// Secure storage interface
interface SecureStorage {
  authToken: string;
  encryptionKey: string;
  userPreferences: string;
}
```

### Layer 3: AsyncStorage (App Preferences)
**Purpose:** Store non-sensitive app configuration  
**Technology:** `@react-native-async-storage/async-storage`

```typescript
// Non-sensitive preferences
interface AppPreferences {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: 'en' | 'si' | 'ta';
  onboardingCompleted: boolean;
}
```

---

## Data Encryption Strategy

### Encryption Implementation
```typescript
import * as Crypto from 'expo-crypto';

class EncryptionService {
  private static encryptionKey: string;
  
  static async initializeEncryption(): Promise<void> {
    // Generate unique key per installation
    const key = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `patientprep_${Date.now()}_${Math.random()}`
    );
    this.encryptionKey = key;
    await SecureStore.setItemAsync('encryption_key', key);
  }
  
  static async encryptData(data: string): Promise<string> {
    // Implementation using AES-256 encryption
    // Details to be implemented with crypto library
  }
  
  static async decryptData(encryptedData: string): Promise<string> {
    // Decryption implementation
  }
}
```

### Security Features
- **AES-256 Encryption:** Industry standard encryption
- **Unique Keys:** Per-installation encryption keys
- **No Key Transmission:** Keys never leave the device
- **Secure Key Storage:** Using device keychain/keystore
- **Data Integrity:** Hash verification for data integrity

---

## Backend Services (Firebase)

### Firebase Configuration
```typescript
// Firebase config (non-PHI services only)
const firebaseConfig = {
  apiKey: "...",
  authDomain: "patientprep-sl.firebaseapp.com",
  projectId: "patientprep-sl",
  storageBucket: "patientprep-sl.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

### Service Breakdown

#### 1. Firebase Authentication
**Purpose:** User account management (email/password only)  
**Data Stored:** Email, hashed password, user ID  
**PHI Status:** No PHI involved

#### 2. Cloud Firestore (Non-PHI Only)
**Purpose:** App configuration and general content  
**Collections:**
```typescript
// Allowed collections (NO PHI)
interface FirestoreData {
  appConfig: {
    version: string;
    features: string[];
    maintenance: boolean;
  };
  generalTips: {
    category: string;
    content: string;
    language: string;
  };
  userPreferences: {
    userId: string;
    notificationSettings: object;
    language: string;
  };
}
```

#### 3. Cloud Functions (Limited Scope)
**Purpose:** General app logic and notifications  
**Restrictions:** No PHI processing allowed

```typescript
// Example function (NO PHI processing)
exports.sendAppointmentReminder = functions.firestore
  .document('appointments/{userId}')
  .onCreate(async (snap, context) => {
    // Send general reminder (no health data)
    // "Your appointment is tomorrow. Have you prepared?"
  });
```

#### 4. Firebase Cloud Messaging (FCM)
**Purpose:** General app notifications  
**Allowed Messages:**
- Appointment reminders (no health details)
- App update notifications
- General health preparation tips
- Feature announcements

**Prohibited Messages:**
- Symptom-specific reminders
- Medication reminders with details
- Any PHI-containing content

#### 5. Firebase Analytics
**Purpose:** App usage patterns (no health data)  
**Tracked Events:**
```typescript
// Allowed analytics events
const allowedEvents = {
  'screen_view': { screen_name: string },
  'feature_used': { feature_name: string },
  'app_opened': { timestamp: number },
  'onboarding_completed': { step: string }
};
```

---

## Agentic Logic Architecture

### Rule-Based AI System
The agentic features use a rule-based approach to provide general guidance without analyzing specific health data.

```typescript
interface AgenticRule {
  trigger: string;
  condition: string;
  suggestion: string;
  category: 'symptom' | 'medication' | 'question' | 'general';
}

// Example rules (general only)
const agenticRules: AgenticRule[] = [
  {
    trigger: 'symptom_entry_started',
    condition: 'user_entered_symptom_name',
    suggestion: 'Consider noting when this symptom started and what makes it better or worse.',
    category: 'symptom'
  },
  {
    trigger: 'question_list_empty',
    condition: 'appointment_in_24_hours',
    suggestion: 'You might want to prepare some questions for your doctor.',
    category: 'question'
  }
];
```

### AI Implementation Strategy
- **Local Processing:** All logic runs on-device
- **General Prompts:** No analysis of specific health data
- **Pattern-Based:** Trigger on user actions, not content analysis
- **Educational Focus:** General health preparation tips

---

## Security Architecture

### Device-Level Security
- **Encryption at Rest:** All local data encrypted
- **Secure Storage:** Using device keychain/keystore
- **App Sandboxing:** Standard mobile app security model
- **Biometric Integration:** Optional device biometric authentication

### Network Security
- **HTTPS Only:** All network communication encrypted
- **Certificate Pinning:** Prevent man-in-the-middle attacks
- **No PHI Transmission:** Technical controls prevent PHI sending
- **Minimal Data Exchange:** Only essential non-PHI data

### Code Security
- **No PHI Logging:** Strict no-logging policy for health data
- **Error Handling:** Health data excluded from crash reports
- **Code Obfuscation:** Additional protection for production builds
- **Regular Updates:** Security patches via app store updates

---

## Performance Considerations

### Local Database Optimization
- **Indexed Queries:** Efficient search capabilities
- **Pagination:** Large datasets handled efficiently
- **Background Processing:** Database operations off main thread
- **Memory Management:** Efficient data loading and caching

### App Performance
- **Lazy Loading:** Components loaded as needed
- **Image Optimization:** Minimal image usage, optimized assets
- **Bundle Splitting:** Efficient app bundle management
- **Background Tasks:** Limited background processing

---

## Development Environment Setup

### Required Tools
```bash
# Development environment setup
npm install -g @expo/cli
npm install -g eas-cli
```

### Project Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # Business logic and API calls
├── storage/           # Local storage management
├── utils/             # Utility functions
├── types/             # TypeScript type definitions
└── constants/         # App constants and configuration
```

### Development Workflow
1. **Local Development:** Expo Go for rapid testing
2. **Testing:** Jest for unit tests, Detox for E2E
3. **Building:** EAS Build for production builds
4. **Deployment:** EAS Submit for app store deployment

---

## Deployment Architecture

### Build Process
- **Development:** Expo Go for testing
- **Staging:** EAS Build development builds
- **Production:** EAS Build production builds for app stores

### App Store Deployment
- **Google Play Store:** Primary target for Sri Lankan market
- **Future iOS:** Apple App Store consideration for phase 2
- **Update Mechanism:** Over-the-air updates for non-native code

### Monitoring and Analytics
- **Crash Reporting:** Expo crash reporting (no PHI in reports)
- **Performance Monitoring:** App performance metrics
- **Usage Analytics:** Feature adoption and user engagement
- **Privacy Compliance:** All monitoring excludes PHI data