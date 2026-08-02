const roleApp = document.querySelector('#roleApp');
const storedProfile = JSON.parse(sessionStorage.getItem('eventflowUser') || 'null');
const requestedRole = new URLSearchParams(window.location.search).get('role');
const role = requestedRole === 'participant' ? 'participant' : storedProfile?.role || null;
if (!role || role === 'admin') window.location.replace(role === 'admin' ? 'admin.html' : 'login.html');
const volunteerProfile = {
  uid: storedProfile?.uid || sessionStorage.getItem('eventflowDemoEmail') || 'demo-volunteer',
  name: storedProfile?.name || 'Rahul',
  email: storedProfile?.email || 'volunteer@eventflow.demo',
  role: 'volunteer',
  department: storedProfile?.department || 'Marketing',
  eventId: storedProfile?.eventId || 'pulzion',
  eventName: storedProfile?.eventName || 'Pulzion 2027',
  eventMeta: storedProfile?.eventMeta || 'Pulzion 2027 · 28 Aug — 30 Aug 2027'
};
const participant = { name: storedProfile?.name || 'Rahul Kadam', email: storedProfile?.email || 'rahul.participant@eventflow.demo', initials: 'RK', label: 'Participant workspace' };
const volunteerTasks = [
  { id:'contact-colleges', title:'Contact 20 colleges', due:'25 Aug 2027', department:'Outreach', completed:false },
  { id:'instagram-campaign', title:'Create Instagram campaign', due:'26 Aug 2027', department:'Social Media', completed:true },
  { id:'event-poster', title:'Design event poster', due:'27 Aug 2027', department:'Design', completed:true },
  { id:'reach-sponsors', title:'Reach out to sponsors', due:'28 Aug 2027', department:'Sponsorship', completed:true },
  { id:'venue-logistics', title:'Confirm venue logistics', due:'28 Aug 2027', department:'Logistics', completed:true },
  { id:'volunteer-roster', title:'Prepare volunteer roster', due:'28 Aug 2027', department:'Marketing', completed:true },
  { id:'publish-schedule', title:'Publish event schedule', due:'29 Aug 2027', department:'Content', completed:false },
  { id:'checkin-desk', title:'Coordinate check-in desk', due:'30 Aug 2027', department:'Technical', completed:false }
];
const taskStorageKey = `eventflowTasks:${volunteerProfile.uid}:${volunteerProfile.eventId}`;
const progressStorageKey = `eventflowProgress:${volunteerProfile.uid}:${volunteerProfile.eventId}`;
const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const saveJson = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const savedTasks = readJson(taskStorageKey, null);
let tasks = savedTasks ? volunteerTasks.map((task) => ({ ...task, completed: Boolean(savedTasks[task.id]) })) : volunteerTasks.map((task) => ({ ...task }));
const savedProgress = readJson(progressStorageKey, null);
let departmentProgress = savedProgress?.progressPercentage ?? 78;
let firestoreServices;
const participantEvents = [
  { id:'pulzion', name:'Pulzion 2027', category:'Technical Festival', date:'28 Aug – 30 Aug 2027', time:'10:00 AM – 06:00 PM', timezone:'(UTC+05:30) Asia/Kolkata', location:'PICT Campus, Pune', address:'Survey No. 27, Pune-Satara Road, Dhankawadi, Pune, Maharashtra 411043', organizer:'PICT ACM Student Chapter', contact:'pulzion@pict.edu · +91 98765 43210', website:'https://pulzion.pict.edu', description:'Pulzion is the annual technical festival of PICT where innovation meets creativity.', detailedDescription:'Join workshops, competitions, guest talks and hands-on experiences led by student builders and industry mentors.', schedule:[['Opening Ceremony','28 Aug · 10:00 AM'],['Technical Workshop','29 Aug · 11:00 AM'],['Closing Ceremony','30 Aug · 04:00 PM']] },
  { id:'hackathon-2027', name:'Hackathon 2027', category:'Innovation Challenge', date:'12 Sept 2027', time:'09:00 AM – 09:00 PM', timezone:'(UTC+05:30) Asia/Kolkata', location:'PICT Campus, Pune', address:'PICT Campus, Pune', organizer:'EventFlow Innovation Club', contact:'hello@eventflow.demo', website:'https://eventflow.demo/hackathon', description:'A focused build sprint for student teams solving real-world problems.', detailedDescription:'Form a team, build a working solution and present your idea to a panel of mentors.', schedule:[['Opening Briefing','12 Sept · 09:00 AM'],['Build Sprint','12 Sept · 10:00 AM'],['Final Showcase','12 Sept · 07:00 PM']] },
  { id:'ai-workshop', name:'Workshop: AI in Action', category:'Workshop', date:'20 Sept 2027', time:'10:00 AM – 01:00 PM', timezone:'(UTC+05:30) Asia/Kolkata', location:'Seminar Hall 1, PICT Campus', address:'PICT Campus, Pune', organizer:'EventFlow Learning Team', contact:'learn@eventflow.demo', website:'https://eventflow.demo/workshops', description:'A practical introduction to building useful AI-powered experiences.', detailedDescription:'Explore current AI tools through guided examples and a hands-on mini project.', schedule:[['Welcome & Introduction','20 Sept · 10:00 AM'],['Hands-on Workshop','20 Sept · 11:00 AM'],['Wrap-up','20 Sept · 12:30 PM']] }
];
const participantRegistrationKey = `eventflowParticipantRegistrations:${participant.email}`;
let participantRegisteredIds = readJson(participantRegistrationKey, ['pulzion']);
let participantTab = 'events';
let participantScreen = 'workspace';
let participantEventId = null;

const initials = (name) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char]));
const volunteerCompletedCount = () => tasks.filter((task) => task.completed).length;
const volunteerProgress = () => Math.round((volunteerCompletedCount() / tasks.length) * 100);
const volunteerReports = () => readJson('eventflowProgressReports', []).filter((report) => report.eventId === volunteerProfile.eventId && report.volunteerId === volunteerProfile.uid).sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));

const user = role === 'volunteer'
  ? { name: volunteerProfile.name, initials: initials(volunteerProfile.name), label: 'Volunteer workspace', heading: 'Your event, in motion.', subheading: 'Keep your assignments moving and share progress with the team.' }
  : participant;
document.querySelector('#userAvatar').textContent = user.initials;
document.querySelector('#userName').textContent = user.name;
document.querySelector('#userRole').textContent = user.label;
document.title = `${user.label} — EventFlow`;

const showToast = (message) => { const toast = document.createElement('div'); toast.className = 'role-toast'; toast.textContent = message; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2600); };

const getFirestoreServices = async () => {
  if (firestoreServices) return firestoreServices;
  const config = window.EVENTFLOW_FIREBASE_CONFIG || {};
  if (role !== 'volunteer' || !storedProfile?.uid || !config.apiKey) return null;
  const [{ initializeApp }, firestoreSdk] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const app = initializeApp(config);
  firestoreServices = { db: firestoreSdk.getFirestore(app), ...firestoreSdk };
  return firestoreServices;
};

const loadFirestoreTasks = async () => {
  let services;
  try { services = await getFirestoreServices(); } catch { return; }
  if (!services) return;
  try {
    const assignmentQuery = services.query(services.collection(services.db, `events/${volunteerProfile.eventId}/volunteers`), services.where('email', '==', volunteerProfile.email));
    const assignmentSnapshot = await services.getDocs(assignmentQuery);
    const assignment = assignmentSnapshot.docs[0]?.data();
    if (assignment) {
      volunteerProfile.name = assignment.name || volunteerProfile.name;
      volunteerProfile.department = assignment.department || volunteerProfile.department;
      volunteerProfile.email = assignment.email || volunteerProfile.email;
      render();
    }
    const taskQuery = services.query(services.collection(services.db, 'tasks'), services.where('assignedTo', '==', volunteerProfile.uid));
    const snapshot = await services.getDocs(taskQuery);
    const remoteTasks = snapshot.docs.map((item) => ({ id:item.id, eventId:item.data().eventId, title:item.data().title || 'Assigned task', due:item.data().dueDate || 'Date to be decided', department:item.data().department || volunteerProfile.department, completed:Boolean(item.data().completed) })).filter((task) => !task.eventId || task.eventId === volunteerProfile.eventId);
    if (remoteTasks.length) { tasks = remoteTasks; render(); }
  } catch { }
};

const progressReportModal = () => `<div class="role-modal-backdrop" data-progress-backdrop><section class="role-modal" role="dialog" aria-modal="true" aria-labelledby="progressModalTitle"><div class="role-modal__head"><div><h2 id="progressModalTitle">Update Department Progress</h2><p>Share a quick update with your event admin.</p></div><button type="button" class="modal-close" data-close-progress>×</button></div><form id="progressReportForm"><label class="modal-field"><span>Current Progress</span><div class="percentage-input"><input id="progressPercentage" type="number" min="0" max="100" value="${departmentProgress}" required><b>%</b></div></label><label class="modal-field"><span>Progress Update</span><textarea id="progressReportText" rows="5" required placeholder="Contacted 12 colleges and received responses from 8 of them."></textarea></label><div class="modal-actions"><button type="button" class="button button--ghost" data-close-progress>Cancel</button><button type="submit" class="button">Submit Report</button></div></form></section></div>`;

const openProgressModal = () => { document.body.insertAdjacentHTML('beforeend', progressReportModal()); document.querySelector('#progressReportText').focus(); };
const closeProgressModal = () => document.querySelector('.role-modal-backdrop')?.remove();
const saveProgressReport = async (progressPercentage, reportText) => {
  const report = { eventId: volunteerProfile.eventId, eventName: volunteerProfile.eventName, department: volunteerProfile.department, volunteerId: volunteerProfile.uid, volunteerName: volunteerProfile.name, volunteerEmail: volunteerProfile.email, progressPercentage, reportText, createdAt: new Date().toISOString() };
  const reports = readJson('eventflowProgressReports', []);
  reports.unshift(report);
  saveJson('eventflowProgressReports', reports);
  saveJson(progressStorageKey, { ...report, updatedAt: new Date().toISOString() });
  try {
    const services = await getFirestoreServices();
    if (services) await services.addDoc(services.collection(services.db, 'progressReports'), { ...report, createdAt: services.serverTimestamp() });
  } catch { }
  departmentProgress = progressPercentage;
};

const volunteerView = () => {
  const completed = volunteerCompletedCount();
  const progress = volunteerProgress();
  const reports = volunteerReports();
  const history = reports.length ? reports.map((report) => `<article class="progress-report"><div class="progress-report__head"><div><strong>${report.progressPercentage}% progress</strong><small>${new Date(report.createdAt).toLocaleString([], { dateStyle:'medium', timeStyle:'short' })}</small></div><span class="tag">${escapeHtml(report.department)}</span></div><p>“${escapeHtml(report.reportText)}”</p></article>`).join('') : '<p class="history-empty">Your submitted progress updates will appear here.</p>';
  return `<div class="role-main"><div class="hero-heading"><div><p class="eyebrow">Volunteer workspace</p><h1>Your event, in motion.</h1><p>Keep your assignments moving and share progress with the team.</p></div><button class="button" data-action="update-progress">Update Progress →</button></div><div class="summary-grid"><div class="summary"><label>Assigned Tasks</label><strong>${tasks.length}</strong></div><div class="summary"><label>Completed</label><strong>${completed}</strong></div><div class="summary"><label>Progress</label><strong>${progress}%</strong></div></div><div class="content-grid"><section class="section"><h2>My tasks</h2><div class="list">${tasks.map((task) => `<label class="list-row task-row ${task.completed ? 'is-completed' : ''}"><span class="task-check"><input type="checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}><span class="task-check__box" aria-hidden="true">✓</span></span><span class="task-copy"><strong>${escapeHtml(task.title)}</strong><small>Due ${escapeHtml(task.due)} · ${escapeHtml(task.department)}</small></span><span class="tag task-status">${task.completed ? 'Completed' : 'Pending'}</span></label>`).join('')}</div></section><section class="section"><h2>Team progress</h2><div class="event-panel"><div class="event-panel__top"><span class="event-mark">✦</span><div><h2>${escapeHtml(volunteerProfile.department)} Department</h2><p>${escapeHtml(volunteerProfile.eventMeta)}</p></div></div><div class="progress"><div class="progress__label"><span>Department progress</span><strong>${departmentProgress}%</strong></div><div class="progress__track"><span style="width:${departmentProgress}%"></span></div></div><span class="tag">12 volunteers active</span></div></section></div><div class="notice">Complete tasks as you go, then submit a short progress report for your admin.</div><section class="section progress-history"><div class="section-heading"><div><p class="eyebrow">Your activity</p><h2>Past Progress Updates</h2></div><span class="history-count">${reports.length} ${reports.length === 1 ? 'update' : 'updates'}</span></div><div class="progress-report-list">${history}</div></section></div>`;
};

const getParticipantEvent = () => participantEvents.find((event) => event.id === participantEventId) || participantEvents[0];
const participantIsRegistered = (eventId) => participantRegisteredIds.includes(eventId);
const participantEventCard = (event) => `<article class="participant-event-card" data-participant-action="view-event" data-event-id="${event.id}"><div><p class="eyebrow">${escapeHtml(event.category)}</p><h2>${escapeHtml(event.name)}</h2><p class="participant-event-card__description">${escapeHtml(event.description)}</p><div class="participant-event-card__meta"><span>${escapeHtml(event.date)}</span><span>${escapeHtml(event.time)}</span><span>${escapeHtml(event.location)}</span></div></div><button class="button button--ghost" type="button">View Details →</button></article>`;
const participantPassCard = (event) => `<button class="participant-pass registered-pass" data-participant-action="open-registered" data-event-id="${event.id}"><span class="participant-pass__label">EventFlow participant</span><h2>${escapeHtml(participant.name)}</h2><p>${escapeHtml(event.name)} · ${escapeHtml(event.location)}</p><span class="participant-pass__event">${escapeHtml(event.category)}</span><span class="participant-pass__code">Registered</span></button>`;
const participantWorkspaceView = () => {
  const availableEvents = participantEvents.filter((event) => !participantIsRegistered(event.id));
  const registeredEvents = participantEvents.filter((event) => participantIsRegistered(event.id));
  const content = participantTab === 'events'
    ? `<section class="participant-event-list">${availableEvents.length ? availableEvents.map(participantEventCard).join('') : '<div class="participant-empty"><h2>No new events available right now.</h2><p>Check back soon for the next EventFlow experience.</p></div>'}</section>`
    : `<section class="participant-registered-list">${registeredEvents.length ? registeredEvents.map(participantPassCard).join('') : '<div class="participant-empty"><h2>You haven’t registered for any events yet.</h2><button class="button" data-participant-action="participant-tab" data-tab="events">Explore Events →</button></div>'}</section>`;
  return `<div class="role-main participant-main"><div class="participant-welcome"><p class="eyebrow">Participant workspace</p><h1>Welcome, ${escapeHtml(participant.name)}.</h1><p>Discover events, register for them, and manage your event passes.</p></div><nav class="participant-tabs" aria-label="Participant navigation"><button class="${participantTab === 'events' ? 'is-active' : ''}" data-participant-action="participant-tab" data-tab="events">Events</button><button class="${participantTab === 'registered' ? 'is-active' : ''}" data-participant-action="participant-tab" data-tab="registered">Registered</button></nav>${content}</div>`;
};
const participantPublicEventView = () => {
  const event = getParticipantEvent();
  const registered = participantIsRegistered(event.id);
  return `<div class="role-main participant-detail-main"><button class="back-link participant-back" data-participant-action="back-workspace">← Back to Events</button><div class="participant-detail-heading"><p class="eyebrow">${escapeHtml(event.category)}</p><h1>${escapeHtml(event.name)}</h1><p>${escapeHtml(event.description)}</p></div><section class="participant-detail-card"><div class="participant-detail-grid"><div><span class="detail-label">Date</span><strong>${escapeHtml(event.date)}</strong></div><div><span class="detail-label">Time</span><strong>${escapeHtml(event.time)}</strong></div><div><span class="detail-label">Timezone</span><strong>${escapeHtml(event.timezone)}</strong></div><div><span class="detail-label">Venue</span><strong>${escapeHtml(event.location)}</strong></div></div><div class="participant-detail-copy"><h2>About this event</h2><p>${escapeHtml(event.detailedDescription || event.description)}</p><dl><div><dt>Full address</dt><dd>${escapeHtml(event.address || event.location)}</dd></div><div><dt>Organizer</dt><dd>${escapeHtml(event.organizer)}</dd></div><div><dt>Contact</dt><dd>${escapeHtml(event.contact)}</dd></div><div><dt>Website</dt><dd>${escapeHtml(event.website)}</dd></div></dl></div></section><div class="participant-register-actions">${registered ? '<button class="button registered-button" disabled>Registered ✓</button>' : `<button class="button" data-participant-action="register-event" data-event-id="${event.id}">Register for Event</button>`}</div></div>`;
};
const mockQr = (event) => `<div class="mock-qr" aria-label="Mock QR code"><span></span><span></span><span></span><span></span><b>EF</b></div>`;
const participantRegisteredDetailView = () => {
  const event = getParticipantEvent();
  return `<div class="role-main participant-detail-main"><button class="back-link participant-back" data-participant-action="participant-tab" data-tab="registered">← Registered Events</button><div class="participant-welcome registered-welcome"><p class="eyebrow">Participant workspace</p><h1>Ready for ${escapeHtml(event.name)}.</h1><p>Your event details and access pass, all in one place.</p></div><div class="summary-grid participant-summary"><div class="summary"><label>Event Dates</label><strong>${escapeHtml(event.date.replace(' 2027', '').replace(' – ', '–'))}</strong></div><div class="summary"><label>Check-in</label><strong>Not Checked In</strong></div><div class="summary"><label>Venue</label><strong>${escapeHtml(event.location.split(',')[0])}</strong></div></div><div class="content-grid participant-registered-content"><section class="section"><h2>Event schedule</h2><div class="list">${event.schedule.map((item) => `<div class="list-row"><div><strong>${escapeHtml(item[0])}</strong><small>${escapeHtml(item[1])}</small></div></div>`).join('')}</div><button class="button participant-public-button" data-participant-action="view-public-details" data-event-id="${event.id}">View Event Details →</button></section><section class="section"><h2>Your access pass</h2><div class="participant-pass"><span class="participant-pass__label">EventFlow participant</span><h2>${escapeHtml(participant.name)}</h2><p>${escapeHtml(event.name)} · ${escapeHtml(event.category)}</p><span class="participant-pass__event">${escapeHtml(event.location)}</span><span class="participant-pass__code">Registered ✓</span></div></section></div><section class="participant-qr-section"><p class="eyebrow">Event check-in</p><h2>Show this QR code at the entrance.</h2>${mockQr(event)}<p>Your QR code is used by the organizer to verify your registration and record your attendance.</p></section></div>`;
};
const participantView = () => participantScreen === 'public-detail' ? participantPublicEventView() : participantScreen === 'registered-detail' ? participantRegisteredDetailView() : participantWorkspaceView();

const render = () => { roleApp.innerHTML = role === 'volunteer' ? volunteerView() : participantView(); };
render();
if (role === 'volunteer') loadFirestoreTasks();

roleApp.addEventListener('click', (event) => {
  const participantTarget = event.target.closest('[data-participant-action]');
  if (role === 'participant' && participantTarget) {
    const participantAction = participantTarget.dataset.participantAction;
    if (participantAction === 'participant-tab') { participantTab = participantTarget.dataset.tab; participantScreen = 'workspace'; render(); return; }
    if (participantAction === 'view-event') { participantEventId = participantTarget.dataset.eventId; participantScreen = 'public-detail'; render(); return; }
    if (participantAction === 'open-registered') { participantEventId = participantTarget.dataset.eventId; participantScreen = 'registered-detail'; render(); return; }
    if (participantAction === 'back-workspace') { participantScreen = 'workspace'; participantTab = 'events'; render(); return; }
    if (participantAction === 'view-public-details') { participantEventId = participantTarget.dataset.eventId; participantScreen = 'public-detail'; render(); return; }
    if (participantAction === 'register-event') {
      participantEventId = participantTarget.dataset.eventId;
      if (!participantIsRegistered(participantEventId)) { participantRegisteredIds = [...participantRegisteredIds, participantEventId]; saveJson(participantRegistrationKey, participantRegisteredIds); }
      participantScreen = 'public-detail';
      render();
      showToast('You are registered for this event.');
      return;
    }
  }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'update-progress') openProgressModal();
});

roleApp.addEventListener('change', (event) => {
  const input = event.target.closest('[data-task-id]');
  if (!input) return;
  const task = tasks.find((item) => item.id === input.dataset.taskId);
  if (!task) return;
  task.completed = input.checked;
  saveJson(taskStorageKey, Object.fromEntries(tasks.map((item) => [item.id, item.completed])));
  getFirestoreServices().then((services) => services?.updateDoc(services.doc(services.db, 'tasks', task.id), { completed: task.completed })).catch(() => {});
  render();
});

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-progress], [data-progress-backdrop]')) closeProgressModal();
});

document.addEventListener('submit', async (event) => {
  if (event.target.id !== 'progressReportForm') return;
  event.preventDefault();
  const progressPercentage = Math.max(0, Math.min(100, Number(document.querySelector('#progressPercentage').value)));
  const reportText = document.querySelector('#progressReportText').value.trim();
  if (!reportText) return;
  await saveProgressReport(progressPercentage, reportText);
  closeProgressModal();
  render();
  showToast('Progress report submitted successfully.');
});
