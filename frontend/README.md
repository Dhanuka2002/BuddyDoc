# BuddyDoc Frontend (Expo React Native)

This folder contains a minimal Expo React Native scaffold for the BuddyDoc mobile frontend. It's intended as a starting point for development and connects to the backend REST API described in the project architecture.

Quick notes

- This scaffold uses Expo for fast iteration and Expo Go for mobile testing.
- The sample `App.js` implements a simple chat UI that posts to `/api/v1/patient/chat` on the configured backend.
- For Android emulator, the default host URL points at `10.0.2.2:8000` so the app can reach a backend running on your machine.

Firebase auth

- This scaffold includes Firebase Authentication support. Before running, create a Firebase project and add a Web App to get configuration keys.
- Fill `frontend/firebaseConfig.js` with values from the Firebase console (API key, projectId, appId, etc.).
- Enable at least Email/Password and Anonymous sign-in providers in the Firebase Authentication section.

When signed in the app will include the Firebase ID token in the Authorization header as `Bearer <token>` for backend requests.

Run locally (Windows PowerShell)

```powershell
# move into frontend
cd frontend

# install dependencies
npm install

# start the Expo dev server (Metro)
npx expo start
```

If you added Firebase and polyfills, run the Expo-friendly installs to ensure compatible versions:

```powershell
# From the frontend folder
npx expo install react-native-get-random-values@~1.9.0 react-native-url-polyfill base-64 buffer
npx expo install react-native@0.71.14
```

Then start Expo with cleared cache:

```powershell
npx expo start -c
```

Open on device/emulator

- Use the Expo Go app on your phone and scan the QR code shown by the dev server.
- To run on Android emulator use `npm run android` (ensure Android SDK and emulator are installed).

Configuring backend URL

- The app uses a sane default for local development (`http://10.0.2.2:8000` on Android or `http://localhost:8000` on iOS/web).
- To point to a different backend, set the environment variable `BUDDYDOC_BACKEND_URL` before starting Expo, or edit `App.js` and change `BACKEND_URL`.

Notes & next steps

- Replace the placeholder endpoint `/api/v1/patient/chat` with the real FastAPI endpoints when available.
- Add authentication flows (Firebase token sign-in) once backend auth is wired.
- Add styles, localization (Sinhala/Tamil/English), and accessibility improvements.
