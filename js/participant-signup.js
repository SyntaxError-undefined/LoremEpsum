const form = document.querySelector('#participantSignupForm');
const nameInput = document.querySelector('#participantName');
const emailInput = document.querySelector('#participantEmail');
const passwordInput = document.querySelector('#participantPassword');
const confirmPasswordInput = document.querySelector('#participantConfirmPassword');
const status = document.querySelector('#participantSignupStatus');
const submitButton = document.querySelector('#participantSignupButton');
const googleButton = document.querySelector('#participantGoogleButton');
let firebaseServices;

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const showFieldError = (input, message) => { const group = input.closest('.field-group'); group.classList.add('has-error'); group.querySelector('.field-error').textContent = message; };
const clearFieldError = (input) => { const group = input.closest('.field-group'); group.classList.remove('has-error'); group.querySelector('.field-error').textContent = ''; };
const setStatus = (message, type = '') => { status.textContent = message; status.className = `auth-status${type ? ` is-${type}` : ''}`; };
const saveProfile = (user, profile) => { sessionStorage.setItem('eventflowUser', JSON.stringify({ uid: user.uid, email: user.email, ...profile })); sessionStorage.setItem('eventflowDemoRole', 'participant'); sessionStorage.setItem('eventflowDemoEmail', user.email || ''); };
const authMessage = (error) => ({ 'auth/email-already-in-use': 'This email already has an EventFlow account. Use Participant Login to join events with it.', 'auth/weak-password': 'Use a password with at least 6 characters.', 'auth/invalid-email': 'Enter a valid email address.', 'auth/popup-closed-by-user': 'Google sign-in was cancelled.' }[error?.code] || error?.message || 'Unable to create your account right now.');

[nameInput, emailInput, passwordInput, confirmPasswordInput].forEach((input) => input.addEventListener('input', () => clearFieldError(input)));
document.querySelector('#passwordToggle').addEventListener('click', () => { const visible = passwordInput.type === 'text'; passwordInput.type = visible ? 'password' : 'text'; });

const getFirebaseServices = async () => {
  if (firebaseServices) return firebaseServices;
  const config = window.EVENTFLOW_FIREBASE_CONFIG || {};
  if (!config.apiKey) return null;
  const [{ initializeApp }, authSdk, firestoreSdk] = await Promise.all([import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'), import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'), import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')]);
  const app = initializeApp(config);
  firebaseServices = { auth: authSdk.getAuth(app), db: firestoreSdk.getFirestore(app), ...authSdk, ...firestoreSdk };
  await authSdk.setPersistence(firebaseServices.auth, authSdk.browserLocalPersistence);
  return firebaseServices;
};
const createProfile = async (services, user, name, existing = null) => {
  const isVolunteer = existing?.role === 'volunteer';
  const profile = isVolunteer
    ? { ...existing, name: name || existing.name || user.displayName || user.email.split('@')[0], email: user.email, roles: [...new Set([...(existing.roles || []), 'volunteer', 'participant'])], participantEnabled: true }
    : { name: name || user.displayName || user.email.split('@')[0], email: user.email, role: 'participant', createdAt: services.serverTimestamp() };
  await services.setDoc(services.doc(services.db, 'users', user.uid), profile, { merge: true });
  saveProfile(user, profile);
  window.location.href = 'role-dashboard.html';
};
const setBusy = (busy, message = '') => { submitButton.disabled = busy; googleButton.disabled = busy; setStatus(message); };

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(clearFieldError);
  let valid = true;
  if (!nameInput.value.trim()) { showFieldError(nameInput, 'Enter your name.'); valid = false; }
  if (!isEmail(emailInput.value.trim())) { showFieldError(emailInput, 'Enter a valid email address.'); valid = false; }
  if (passwordInput.value.length < 6) { showFieldError(passwordInput, 'Use at least 6 characters.'); valid = false; }
  if (passwordInput.value !== confirmPasswordInput.value) { showFieldError(confirmPasswordInput, 'Passwords do not match.'); valid = false; }
  if (!valid) return;
  setBusy(true, 'Creating your participant account…');
  try { const services = await getFirebaseServices(); if (!services) throw new Error('Firebase is not configured.'); const credential = await services.createUserWithEmailAndPassword(services.auth, emailInput.value.trim(), passwordInput.value); await createProfile(services, credential.user, nameInput.value.trim()); } catch (error) { setBusy(false); setStatus(authMessage(error), 'error'); }
});
googleButton.addEventListener('click', async () => {
  setBusy(true, 'Connecting to Google…');
  try { const services = await getFirebaseServices(); if (!services) throw new Error('Firebase is not configured.'); const credential = await services.signInWithPopup(services.auth, new services.GoogleAuthProvider()); const snapshot = await services.getDoc(services.doc(services.db, 'users', credential.user.uid)); const existing = snapshot.exists() ? snapshot.data() : null; if (existing && !['participant', 'volunteer'].includes(existing.role)) throw new Error('This account is already linked to an admin role. Use Team Login instead.'); await createProfile(services, credential.user, nameInput.value.trim(), existing); } catch (error) { setBusy(false); setStatus(authMessage(error), 'error'); }
});
