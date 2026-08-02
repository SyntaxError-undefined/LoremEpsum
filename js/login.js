const teamTab = document.querySelector('#teamTab');
const participantTab = document.querySelector('#participantTab');
const teamLogin = document.querySelector('#teamLogin');
const participantLogin = document.querySelector('#participantLogin');
const passwordToggle = document.querySelector('#passwordToggle');
const teamPassword = document.querySelector('#teamPassword');
let firebaseServices;
const demoTeamAccounts = {
  'admin@eventflow.demo': { password: 'Admin@123', role: 'admin', name: 'Anirudh Sharma' },
  'volunteer@eventflow.demo': { password: 'Volunteer@123', role: 'volunteer', name: 'Rahul', department: 'Marketing', eventId: 'pulzion', eventName: 'Pulzion 2027', eventMeta: 'Pulzion 2027 · 28 Aug — 30 Aug 2027' }
};

const setMode = (mode) => {
  const isTeam = mode === 'team';
  teamTab.classList.toggle('is-active', isTeam);
  participantTab.classList.toggle('is-active', !isTeam);
  teamTab.setAttribute('aria-selected', String(isTeam));
  participantTab.setAttribute('aria-selected', String(!isTeam));
  teamLogin.hidden = !isTeam;
  participantLogin.hidden = isTeam;
  (isTeam ? teamLogin : participantLogin).classList.remove('is-active');
  requestAnimationFrame(() => (isTeam ? teamLogin : participantLogin).classList.add('is-active'));
};

teamTab.addEventListener('click', () => setMode('team'));
participantTab.addEventListener('click', () => setMode('participant'));
passwordToggle.addEventListener('click', () => {
  const isVisible = teamPassword.type === 'text';
  teamPassword.type = isVisible ? 'password' : 'text';
  passwordToggle.classList.toggle('is-visible', !isVisible);
  passwordToggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
});

const clearFieldError = (input) => {
  const group = input.closest('.field-group');
  group.classList.remove('has-error');
  group.querySelector('.field-error').textContent = '';
};
document.querySelectorAll('.field-group input').forEach((input) => input.addEventListener('input', () => clearFieldError(input)));
const showError = (input, message) => { const group = input.closest('.field-group'); group.classList.add('has-error'); group.querySelector('.field-error').textContent = message; };
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getFirebaseServices = async () => {
  if (firebaseServices) return firebaseServices;
  const config = window.EVENTFLOW_FIREBASE_CONFIG || {};
  if (!config.apiKey) return null;
  const [{ initializeApp }, authSdk, firestoreSdk] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const app = initializeApp(config);
  firebaseServices = { auth: authSdk.getAuth(app), db: firestoreSdk.getFirestore(app), ...authSdk, ...firestoreSdk };
  return firebaseServices;
};

const saveAuthenticatedProfile = (uid, email, profile) => {
  sessionStorage.setItem('eventflowUser', JSON.stringify({ uid, email, ...profile }));
  sessionStorage.setItem('eventflowDemoRole', profile.role);
  sessionStorage.setItem('eventflowDemoEmail', email);
};

teamLogin.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#teamEmail');
  let valid = true;
  clearFieldError(email);
  clearFieldError(teamPassword);
  if (!validEmail(email.value.trim())) { showError(email, 'Enter a valid work email.'); valid = false; }
  if (!teamPassword.value) { showError(teamPassword, 'Enter your password.'); valid = false; }
  const status = document.querySelector('#teamStatus');
  if (!valid) { status.textContent = ''; return; }
  status.textContent = 'Verifying your account...';
  try {
    const services = await getFirebaseServices();
    if (!services) {
      const demoAccount = demoTeamAccounts[email.value.trim().toLowerCase()];
      if (!demoAccount || demoAccount.password !== teamPassword.value) { showError(teamPassword, 'Demo email or password is incorrect.'); status.textContent = ''; return; }
      saveAuthenticatedProfile(`demo-${demoAccount.role}`, email.value.trim().toLowerCase(), demoAccount);
      status.textContent = `Opening ${demoAccount.role} workspace...`;
      window.setTimeout(() => { window.location.href = demoAccount.role === 'admin' ? 'admin.html' : 'role-dashboard.html'; }, 220);
      return;
    }
    const credentials = await services.signInWithEmailAndPassword(services.auth, email.value.trim(), teamPassword.value);
    const profileSnapshot = await services.getDoc(services.doc(services.db, 'users', credentials.user.uid));
    const profile = profileSnapshot.exists() ? profileSnapshot.data() : null;
    if (!profile || !['admin', 'volunteer'].includes(profile.role)) { await services.signOut(services.auth); status.textContent = 'Your account does not have a valid EventFlow team role.'; return; }
    const assignedEvent = Array.isArray(profile.events) ? profile.events[0] : null;
    const normalizedProfile = { ...profile, eventId: profile.eventId || assignedEvent?.eventId, eventName: profile.eventName || assignedEvent?.name, eventMeta: profile.eventMeta || assignedEvent?.meta };
    saveAuthenticatedProfile(credentials.user.uid, credentials.user.email || email.value.trim().toLowerCase(), normalizedProfile);
    status.textContent = `Opening ${normalizedProfile.role} workspace...`;
    window.setTimeout(() => { window.location.href = normalizedProfile.role === 'admin' ? 'admin.html' : 'role-dashboard.html'; }, 220);
  } catch (error) {
    status.textContent = error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' ? 'Email or password is incorrect.' : 'Unable to sign in right now. Check your Firebase configuration.';
  }
});

const demoParticipantAccounts = { 'rahul.participant@eventflow.demo': { password: 'Participant@123', role: 'participant', name: 'Rahul Kadam' } };
participantLogin.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#participantEmail');
  const password = document.querySelector('#participantPassword');
  let valid = true;
  clearFieldError(email);
  clearFieldError(password);
  if (!validEmail(email.value.trim())) { showError(email, 'Enter a valid registered email.'); valid = false; }
  if (!password.value) { showError(password, 'Enter your password.'); valid = false; }
  const status = document.querySelector('#participantStatus');
  if (!valid) { status.textContent = ''; return; }
  const account = demoParticipantAccounts[email.value.trim().toLowerCase()];
  if (!account || account.password !== password.value) { showError(password, 'Demo email or password is incorrect.'); status.textContent = ''; return; }
  sessionStorage.removeItem('eventflowUser');
  sessionStorage.setItem('eventflowUser', JSON.stringify({ uid: `demo-participant-${email.value.trim().toLowerCase()}`, name: account.name, email: email.value.trim().toLowerCase(), role: account.role }));
  sessionStorage.setItem('eventflowDemoRole', account.role);
  sessionStorage.setItem('eventflowDemoEmail', email.value.trim().toLowerCase());
  status.textContent = 'Opening participant workspace...';
  window.setTimeout(() => { window.location.href = 'role-dashboard.html?role=participant'; }, 220);
});

document.querySelector('#participantGoogleButton').addEventListener('click', () => {
  sessionStorage.removeItem('eventflowUser');
  sessionStorage.setItem('eventflowUser', JSON.stringify({ uid: 'demo-google-participant', name: 'Rahul Kadam', email: 'rahul.google@eventflow.demo', role: 'participant' }));
  sessionStorage.setItem('eventflowDemoRole', 'participant');
  sessionStorage.setItem('eventflowDemoEmail', 'rahul.google@eventflow.demo');
  document.querySelector('#participantStatus').textContent = 'Opening participant workspace...';
  window.setTimeout(() => { window.location.href = 'role-dashboard.html?role=participant'; }, 220);
});

document.querySelector('#createParticipantButton').addEventListener('click', () => {
  document.querySelector('#participantStatus').textContent = 'Account creation will be connected when authentication is added.';
});
