# Solution Overview: PatientPrep SL

## Vision Statement
**PatientPrep SL** empowers patients to become active participants in their healthcare by providing a structured way to prepare for consultations. Its core innovation for the MVP is an agentic AI component that acts as a "Consultation Coach," guiding patients through a thoughtful preparation process.

## Core Innovation
- **Agentic AI Consultation Coach** - Intelligent guidance through preparation process
- **Absolute commitment to on-device data storage** for maximum patient privacy
- **Focus on patient empowerment** rather than medical diagnosis

## MVP Scope (Solo Developer, 3-Month Timeline)

### ✅ What's INCLUDED
- Patient-side preparation tools
- On-device data storage only
- General guidance and preparation prompts
- Consultation organization and summary

### ❌ What's EXCLUDED
- NO doctor-facing features
- NO in-app communication with doctors  
- NO server storage of sensitive patient data
- NO medical advice or diagnosis

## Core Features

### 🔐 User Authentication & On-Device Storage
- Simple email/password signup/login for app access
- **Critical:** All user-inputted health data stored encrypted locally on device only
- Explicit user notification about local-only data storage

### 📅 Appointment Planner
- Add upcoming doctor's appointments (date, time, doctor's name, specialty)
- Visual organization of medical appointments

### 🏥 Symptom Log & Detailer
- Log symptoms with onset, duration, severity details
- Track aggravating/alleviating factors
- **Agentic Nudge:** AI prompts like "When did this symptom start?" or "Does anything make it better or worse?"

### 💊 Medication List Manager
- Record current medications, dosage, and frequency
- Comprehensive medication tracking
- **Agentic Nudge:** "Don't forget to list any over-the-counter medicines you're taking!"

### ❓ Questions for Doctor Builder
- List specific questions for doctor consultations
- **Agentic Nudge:** Based on logged symptoms, suggest relevant questions like "If you're experiencing [symptom], consider asking about [common lifestyle factor]"
- **Note:** These are general prompts, not medical advice

### 📋 Consultation Summary Generator (Pre-Consultation)
- Consolidated, easy-to-read summary of symptoms, medications, and questions
- Patient can review before appointment
- No sharing functionality for MVP beyond showing on screen
- Patient can read it out or show doctor on their phone if they choose

### 📝 Post-Consultation Notes (Local)
- Jot down notes or action points after consultation
- Personal reference stored locally

## Technology Architecture

### Frontend: React Native with Expo Go
- **Rationale:** Rapid prototyping, single codebase for iOS/Android
- **Local Storage:** Expo SecureStore, AsyncStorage, or SQLite for patient data
- **Security:** All patient data encrypted locally

### Backend: Firebase (Limited Scope)
- **Firebase Authentication:** App access only
- **Cloud Firestore:** Non-sensitive app data only (NO PHI)
- **Cloud Functions:** Generic agentic nudges (NO PHI processing)
- **FCM:** General app reminders (NO health data)
- **Analytics:** App usage patterns (NO health data analysis)
- **Hosting:** Privacy policy and disclaimers

### Agentic Logic
- Rule-based logic in React Native code
- Simple Cloud Functions for general reminders
- Time-based triggers and common user actions
- **NO analysis of specific health inputs**

## Privacy & Security Principles
1. **On-Device Only:** Patient health data never leaves the device
2. **Transparent Communication:** Clear user notification about data practices
3. **Minimal Data Collection:** Only necessary app functionality data
4. **Encryption:** Local data stored with strong encryption
5. **No PHI Transmission:** Zero transmission of Personal Health Information