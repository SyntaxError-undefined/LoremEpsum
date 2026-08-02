const app = document.querySelector('#app');
const modalRoot = document.querySelector('#modalRoot');

const state = {
  view: 'events',
  eventId: 'pulzion',
  editingEventId: null,
  departmentId: 'marketing',
  departmentTab: 'progress',
  participantFilter: 'all',
  participantSearch: '',
  nextEvent: 1,
  nextParticipant: 10,
  nextTask: 10,
  events: [
    { id: 'pulzion', name: 'Pulzion 2027', type: 'Technical Festival', date: '28 Aug — 30 Aug 2027', time: '10:00 AM – 06:00 PM', location: 'PICT Campus, Pune', status: 'Ongoing', participants: 486, volunteers: 42, checkedIn: 327, departments: 8, departmentNames: ['Marketing', 'Outreach', 'Sponsorship', 'Social Media', 'Technical', 'Content', 'Design', 'Logistics'], departmentProgress: { Marketing: 78, Outreach: 64, Sponsorship: 91, 'Social Media': 83, Technical: 72, Content: 68, Design: 70, Logistics: 66 }, description: 'A three-day technical festival bringing builders, creators and curious minds together.' },
    { id: 'hackathon', name: 'Hackathon 2027', type: 'Innovation Challenge', date: '12 Sept 2027', time: '09:00 AM – 09:00 PM', location: 'PICT Campus, Pune', status: 'Upcoming', participants: 312, volunteers: 26, checkedIn: 0, departments: 6, departmentNames: ['Marketing', 'Outreach', 'Technical', 'Content', 'Design', 'Logistics'], description: 'A focused build sprint for student teams solving real-world problems.' },
    { id: 'sports', name: 'Sports Fest 2027', type: 'Annual Sports Festival', date: '18 Oct — 22 Oct 2027', time: '08:00 AM – 06:00 PM', location: 'PICT Campus, Pune', status: 'Upcoming', participants: 620, volunteers: 48, checkedIn: 0, departments: 7, departmentNames: ['Outreach', 'Technical', 'Logistics', 'Hospitality', 'Marketing', 'Content', 'Photography'], description: 'Five days of competition, team spirit and campus-wide energy.' }
  ],
  departments: [
    { id: 'marketing', name: 'Marketing', volunteers: 12, progress: 78 },
    { id: 'outreach', name: 'Outreach', volunteers: 8, progress: 64 },
    { id: 'sponsorship', name: 'Sponsorship', volunteers: 10, progress: 91 },
    { id: 'social', name: 'Social Media', volunteers: 6, progress: 83 },
    { id: 'technical', name: 'Technical', volunteers: 7, progress: 72 },
    { id: 'content', name: 'Content', volunteers: 5, progress: 68 },
    { id: 'design', name: 'Design', volunteers: 4, progress: 70 },
    { id: 'logistics', name: 'Logistics', volunteers: 8, progress: 66 }
  ],
  reports: [
    { name: 'Rahul', time: 'Today — 10:32 AM', text: 'Contacted 12 colleges. 5 responded positively.' },
    { name: 'Priya', time: 'Today — 09:48 AM', text: 'Completed the Instagram campaign draft.' },
    { name: 'Aditya', time: 'Yesterday — 06:20 PM', text: 'Reached out to 8 sponsors.' }
  ],
  tasks: [
    { id: 1, name: 'Contact 20 colleges', assignee: 'Rahul', due: '25 Aug 2027', status: 'In Progress' },
    { id: 2, name: 'Create Instagram campaign', assignee: 'Priya', due: '26 Aug 2027', status: 'Completed' },
    { id: 3, name: 'Design event poster', assignee: 'Aditya', due: '27 Aug 2027', status: 'Pending' },
    { id: 4, name: 'Reach out to sponsors', assignee: 'Priya', due: '28 Aug 2027', status: 'Pending' }
  ],
  volunteers: [
    { name: 'Rahul', email: 'rahul@email.com', tasks: 8, progress: 78, status: 'Active' },
    { name: 'Priya', email: 'priya@email.com', tasks: 6, progress: 91, status: 'Active' },
    { name: 'Aditya', email: 'aditya@email.com', tasks: 4, progress: 62, status: 'Active' },
    { name: 'Neha', email: 'neha@email.com', tasks: 5, progress: 75, status: 'Active' }
  ],
  participants: [
    { id: 1, name: 'Rahul Kadam', email: 'rahul@email.com', phone: '9876543210', college: 'PICT', registration: 'Registered', attendance: 'Not Checked In' },
    { id: 2, name: 'Priya Shah', email: 'priya@email.com', phone: '9876543211', college: 'COEP', registration: 'Registered', attendance: 'Checked In' },
    { id: 3, name: 'Aditya Patil', email: 'aditya@email.com', phone: '9876543212', college: 'VJTI', registration: 'Registered', attendance: 'Not Checked In' },
    { id: 4, name: 'Neha Singh', email: 'neha@email.com', phone: '9876543213', college: 'SPIT', registration: 'Registered', attendance: 'Checked In' },
    { id: 5, name: 'Aman Gupta', email: 'aman@email.com', phone: '9876543214', college: 'KJ Somaiya', registration: 'Registered', attendance: 'Not Checked In' }
  ],
  recentCheckins: [
    { name: 'Rahul Kadam', college: 'PICT', time: '10:32 AM' },
    { name: 'Priya Shah', college: 'COEP', time: '10:34 AM' },
    { name: 'Aditya Patil', college: 'VJTI', time: '10:37 AM' },
    { name: 'Neha Singh', college: 'SPIT', time: '10:40 AM' }
  ],
  volunteerImportRows: [],
  volunteerImportInvalidRows: []
};

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));
const getEvent = () => state.events.find((event) => event.id === state.eventId) || state.events[0];
const getDepartment = () => state.departments.find((department) => department.id === state.departmentId) || state.departments[0];
const volunteerStorageKey = () => `eventflowVolunteers:${state.eventId}`;
const defaultEventVolunteers = [
  { id:'demo-volunteer-rahul', name:'Rahul Kadam', email:'rahul@email.com', department:'Marketing', status:'Active', tasks:8, progress:78 },
  { id:'demo-volunteer-priya', name:'Priya Sharma', email:'priya@gmail.com', department:'Technical', status:'Active', tasks:6, progress:91 },
  { id:'demo-volunteer-aman', name:'Aman Patil', email:'aman@gmail.com', department:'Marketing', status:'Active', tasks:4, progress:62 }
];
const getEventVolunteers = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(volunteerStorageKey()) || 'null');
    if (Array.isArray(stored)) return stored;
  } catch { }
  return state.eventId === 'pulzion' ? defaultEventVolunteers : [];
};
const saveEventVolunteers = (volunteers) => localStorage.setItem(volunteerStorageKey(), JSON.stringify(volunteers));
let volunteerFirestoreServices;
let volunteerUnsubscribe;
let volunteerSubscriptionEventId;
const getVolunteerFirestoreServices = async () => {
  if (volunteerFirestoreServices) return volunteerFirestoreServices;
  const config = window.EVENTFLOW_FIREBASE_CONFIG || {};
  if (!config.apiKey) return null;
  const [{ initializeApp }, firestoreSdk] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  ]);
  const app = initializeApp(config);
  volunteerFirestoreServices = { db: firestoreSdk.getFirestore(app), ...firestoreSdk };
  return volunteerFirestoreServices;
};
const subscribeToEventVolunteers = async () => {
  if (volunteerSubscriptionEventId === state.eventId) return;
  let services;
  try { services = await getVolunteerFirestoreServices(); } catch { return; }
  if (!services) return;
  volunteerUnsubscribe?.();
  volunteerSubscriptionEventId = state.eventId;
  volunteerUnsubscribe = services.onSnapshot(services.collection(services.db, `events/${state.eventId}/volunteers`), (snapshot) => {
    const volunteers = snapshot.docs.map((item) => ({ id:item.id, ...item.data(), status:item.data().status || 'Active' }));
    saveEventVolunteers(volunteers);
    if (state.view === 'workspace' && ['volunteers','departments'].includes(state.workspaceTab)) renderWorkspace();
  });
};
const volunteerDepartments = () => getEvent().departmentNames?.length ? getEvent().departmentNames : state.departments.map((department) => department.name);
const getStoredProgressReports = () => { try { return JSON.parse(localStorage.getItem('eventflowProgressReports') || '[]'); } catch { return []; } };
const departmentReports = (department) => [...state.reports, ...getStoredProgressReports().filter((report) => report.eventId === state.eventId && report.department === department.name).map((report) => ({ name: report.volunteerName, time: new Date(report.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }), text: report.reportText, progressPercentage: report.progressPercentage }))];
const statusClass = (status) => status === 'Completed' ? 'status-pill status-pill--done' : status === 'Pending' ? 'status-pill status-pill--pending' : 'status-pill';
const iconForDepartment = (name) => ({ Marketing: '✦', Outreach: '◎', Sponsorship: '◌', 'Social Media': '◈', Technical: '×', Content: '▣', Design: '⌁', Logistics: '⌗' }[name] || '·');

function render() {
  if (state.view === 'events') renderEvents();
  if (state.view === 'create') renderSimpleCreateEvent();
  if (state.view === 'workspace') renderWorkspace();
  if (state.view === 'department') renderDepartmentWorkspace();
}

function renderEvents() {
  const filter = document.querySelector('.filter-button.is-active')?.dataset.filter || 'all';
  const events = state.events.filter((event) => filter === 'all' || event.status.toLowerCase() === filter);
  app.innerHTML = `<section class="view events-view">
    <div class="page-heading"><div><p class="eyebrow">Admin workspace</p><h1>Your Events</h1><p>Manage your events, teams and participants from one place.</p></div><button class="button" data-action="create-event">+ Create New Event</button></div>
    <div class="filter-bar" role="tablist" aria-label="Event filters">${['all','upcoming','ongoing','past'].map((item) => `<button class="filter-button ${filter === item ? 'is-active' : ''}" data-filter="${item}" role="tab">${item[0].toUpperCase() + item.slice(1)}</button>`).join('')}</div>
    <div class="event-grid">${events.map(eventCard).join('')}<button class="create-card" data-action="create-event"><span class="create-card__inner"><span class="create-card__plus">+</span><strong>Create New Event</strong><small>Start by creating a new event</small></span></button></div>
  </section>`;
}

function eventCard(event) {
  return `<button class="event-card" data-event-id="${event.id}" aria-label="Open ${escapeHtml(event.name)}"><span class="event-card__mark">${event.id === 'pulzion' ? '✦' : event.id === 'hackathon' ? '⌁' : '◈'}</span><span class="event-card__status ${event.status === 'Past' ? 'event-card__status--past' : ''}">${escapeHtml(event.status)}</span><h2>${escapeHtml(event.name)}</h2><p>${escapeHtml(event.type)}</p><span class="event-card__meta"><span>${escapeHtml(event.date)}</span><span>${escapeHtml(event.location)}</span></span></button>`;
}

function workspaceHeader(tab) {
  const event = getEvent();
  const statusLabel = event.status === 'Ongoing' ? 'HAPPENING NOW' : event.status.toUpperCase();
  return `<div class="workspace-top"><a href="#" class="back-link" data-action="all-events">← All Events</a><div class="workspace-title"><div class="workspace-title__main"><span class="event-logo">✦</span><div><div class="workspace-name-row"><h1>${escapeHtml(event.name)}</h1><span class="event-status event-status--${event.status.toLowerCase()}">${escapeHtml(statusLabel)}</span></div><p>${escapeHtml(event.date)} · ${escapeHtml(event.time || 'Time to be announced')} · ${escapeHtml(event.location)}</p></div></div><button class="button button--ghost button--small" data-action="edit-event">✎ Edit Event</button></div><nav class="workspace-nav" aria-label="Event navigation">${['overview','departments','volunteers','participants','checkins'].map((item) => `<button class="${tab === item ? 'is-active' : ''}" data-workspace-tab="${item}">${item === 'checkins' ? 'Check-ins' : item[0].toUpperCase() + item.slice(1)}</button>`).join('')}</nav></div>`;
}

function renderWorkspace() {
  const tab = state.workspaceTab || 'overview';
  const content = tab === 'overview' ? overviewView() : tab === 'departments' ? departmentsView() : tab === 'volunteers' ? eventVolunteersView() : tab === 'participants' ? participantsView() : checkinsView();
  app.innerHTML = `<section class="view workspace-view workspace-view--${tab}">${workspaceHeader(tab)}${content}</section>`;
  if (tab === 'volunteers' || tab === 'departments') subscribeToEventVolunteers();
}

function overviewView() {
  const event = getEvent();
  const departmentNames = event.departmentNames || [];
  const progress = departmentNames.map((name) => ({ name, value: typeof event.departmentProgress?.[name] === 'number' ? event.departmentProgress[name] : 0 }));
  const detailedDescription = event.detailedDescription ? `<p class="overview-detail-copy">${escapeHtml(event.detailedDescription)}</p>` : '';
  return `<div class="stats-row"><div class="stat"><label>Participants</label><strong>${event.participants || 0}</strong></div><div class="stat"><label>Volunteers</label><strong>${event.volunteers || 0}</strong></div><div class="stat"><label>Checked In</label><strong>${event.checkedIn || 0}</strong></div><div class="stat"><label>Departments</label><strong>${departmentNames.length || event.departments || 0}</strong></div></div><div class="overview-grid"><section class="overview-about"><h2>About the Event</h2><p class="overview-lead">${escapeHtml(event.description || 'No short description has been added yet.')}</p>${detailedDescription}<h2 class="overview-section-heading">Department Progress</h2><div class="progress-list">${progress.length ? progress.map((department) => progressItem(department.name, department.value)).join('') : '<p class="overview-empty">No departments have been assigned yet.</p>'}</div></section><section class="overview-details"><h2>Event Details</h2><dl class="event-detail-list"><div><dt>Date</dt><dd>${escapeHtml(event.date || 'Date to be announced')}</dd></div><div><dt>Time</dt><dd>${escapeHtml(event.time || 'Time to be announced')}</dd></div><div><dt>Venue</dt><dd>${escapeHtml(event.location || 'Venue to be announced')}</dd></div></dl></section></div>`;
}

function progressItem(name, value) { const label = value === 0 ? 'Not started' : `${value}%`; return `<div class="progress-item"><div class="progress-item__head"><span>${escapeHtml(name)}</span><span>${label}</span></div><div class="progress-track"><span style="width:${value}%"></span></div></div>`; }

function departmentsView() {
  const volunteers = getEventVolunteers();
  return `<section class="departments-tab"><div class="section-toolbar"><h2>Departments</h2><button class="button button--small" data-action="add-department">+ Add Department</button></div><div class="department-grid">${state.departments.map((department) => { const count = volunteers.filter((volunteer) => volunteer.department === department.name).length; return `<button class="department-card" data-department-id="${department.id}"><span class="department-card__icon">${iconForDepartment(department.name)}</span><h3>${escapeHtml(department.name)}</h3><p>${count} Volunteers</p><div class="department-card__head"><span>Progress</span><strong>${department.progress}%</strong></div><div class="department-card__progress"><span style="width:${department.progress}%"></span></div></button>`; }).join('')}</div></section>`;
}

function eventVolunteersView() {
  const volunteers = getEventVolunteers();
  return `<section class="event-volunteers-tab"><div class="section-toolbar volunteers-toolbar"><div><h2>Volunteers</h2><p>Manage volunteers and their department assignments for this event.</p></div><div class="toolbar-actions"><button class="button button--ghost button--small" data-action="import-volunteers">Import Excel</button><button class="button button--small" data-action="add-volunteer">+ Add Volunteer</button></div></div>${volunteers.length ? `<div class="table-wrap table-scroll volunteers-table"><table><thead><tr><th>Volunteer Name</th><th>Email</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead><tbody>${volunteers.map((volunteer) => `<tr><td><strong>${escapeHtml(volunteer.name)}</strong></td><td>${escapeHtml(volunteer.email)}</td><td>${escapeHtml(volunteer.department)}</td><td><span class="status-pill status-pill--done">${escapeHtml(volunteer.status || 'Active')}</span></td><td><div class="inline-actions"><button class="icon-button" data-action="edit-event-volunteer" data-volunteer-id="${volunteer.id}">Edit</button><button class="icon-button" data-action="remove-event-volunteer" data-volunteer-id="${volunteer.id}">Remove</button></div></td></tr>`).join('')}</tbody></table></div>` : '<div class="volunteers-empty"><h3>No volunteers added yet.</h3><p>Import your volunteer roster using Excel or add volunteers manually.</p><div><button class="button button--ghost button--small" data-action="import-volunteers">Import Excel</button><button class="button button--small" data-action="add-volunteer">+ Add Volunteer</button></div></div>'}</section>`;
}

function renderDepartmentWorkspace() {
  const department = getDepartment();
  const tab = state.departmentTab;
  const assignedVolunteers = getEventVolunteers().filter((volunteer) => volunteer.department === department.name);
  app.innerHTML = `<section class="view department-view"><a href="#" class="back-link" data-action="departments">← Departments</a><div class="dept-head"><div><h1>${escapeHtml(department.name)} Department</h1><p>${assignedVolunteers.length} Volunteers · ${escapeHtml(getEvent().name)}</p></div>${tab === 'progress' ? '<button class="button button--ghost button--small" data-action="add-remark">+ Add Remark</button>' : tab === 'tasks' ? '<button class="button button--small" data-action="assign-task">+ Assign Task</button>' : '<button class="button button--small" data-action="add-volunteer">+ Add Volunteer</button>'}</div><div class="subtabs">${['progress','tasks','volunteers'].map((item) => `<button class="${tab === item ? 'is-active' : ''}" data-dept-tab="${item}">${item[0].toUpperCase() + item.slice(1)}</button>`).join('')}</div>${tab === 'progress' ? progressDepartmentView(department) : tab === 'tasks' ? tasksView() : volunteersView()}</section>`;
}

function progressDepartmentView(department) {
  const reports = departmentReports(department);
  const latestProgress = reports.find((report) => typeof report.progressPercentage === 'number')?.progressPercentage ?? department.progress;
  return `<div class="progress-hero"><h2>${escapeHtml(department.name)} Progress</h2><strong>${latestProgress}%</strong></div><div class="section-toolbar" style="margin-top:28px"><h2>Volunteer Progress Reports</h2></div><div class="report-list">${reports.map((report) => `<article class="report"><div><strong>${escapeHtml(report.name)}</strong><small>${escapeHtml(report.time)}</small></div><p>“${escapeHtml(report.text)}”</p></article>`).join('')}</div>`;
}

function tasksView() {
  return `<div class="task-list">${state.tasks.map((task) => `<div class="task-row"><div><strong>${escapeHtml(task.name)}</strong><small>Assigned to ${escapeHtml(task.assignee)}</small></div><span class="assigned">${escapeHtml(task.assignee)}</span><span class="due">Due: ${escapeHtml(task.due)}</span><span class="${statusClass(task.status)}">${escapeHtml(task.status)}</span><button class="icon-button" data-task-id="${task.id}" data-action="edit-task" aria-label="Edit task">⋮</button></div>`).join('')}</div>`;
}

function volunteersView() {
  const volunteers = getEventVolunteers().filter((volunteer) => volunteer.department === getDepartment().name);
  return `<div class="table-wrap table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Tasks</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>${volunteers.length ? volunteers.map((volunteer) => `<tr><td><strong>${escapeHtml(volunteer.name)}</strong></td><td>${escapeHtml(volunteer.email)}</td><td>${volunteer.tasks || 0} Tasks</td><td>${volunteer.progress || 0}%</td><td><span class="status-pill status-pill--done">${escapeHtml(volunteer.status || 'Active')}</span></td><td><button class="icon-button" data-volunteer-id="${volunteer.id}" data-action="volunteer-detail">View</button></td></tr>`).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--muted)">No volunteers assigned to this department.</td></tr>'}</tbody></table></div>`;
}

function participantsView() {
  const filtered = state.participants.filter((participant) => {
    const query = state.participantSearch.toLowerCase();
    const matchesSearch = !query || `${participant.name} ${participant.email} ${participant.college}`.toLowerCase().includes(query);
    const matchesFilter = state.participantFilter === 'all' || (state.participantFilter === 'checked' ? participant.attendance === 'Checked In' : participant.attendance === 'Not Checked In');
    return matchesSearch && matchesFilter;
  });
  return `<div class="section-toolbar"><div><h2>Participants</h2><p style="margin:4px 0 0;color:var(--muted);font-size:10px">${state.participants.length} Registered</p></div><div class="toolbar-actions"><button class="button button--ghost button--small" data-action="add-participant">+ Add Participant</button></div></div><div class="filter-bar"><input class="search-input" id="participantSearch" value="${escapeHtml(state.participantSearch)}" placeholder="Search participants..." aria-label="Search participants"><button class="filter-button ${state.participantFilter === 'all' ? 'is-active' : ''}" data-participant-filter="all">All</button><button class="filter-button ${state.participantFilter === 'checked' ? 'is-active' : ''}" data-participant-filter="checked">Checked In</button><button class="filter-button ${state.participantFilter === 'not-checked' ? 'is-active' : ''}" data-participant-filter="not-checked">Not Checked In</button></div><div class="table-wrap table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>College</th><th>Registration</th><th>Attendance</th><th>Actions</th></tr></thead><tbody>${filtered.length ? filtered.map(participantRow).join('') : '<tr><td colspan="6" style="text-align:center;padding:30px;color:var(--muted)">No participants found.</td></tr>'}</tbody></table></div>`;
}

function participantRow(participant) {
  const attendanceClass = participant.attendance === 'Checked In' ? 'status-pill status-pill--done' : 'status-pill status-pill--pending';
  return `<tr><td><strong>${escapeHtml(participant.name)}</strong></td><td>${escapeHtml(participant.email)}</td><td>${escapeHtml(participant.college)}</td><td>${escapeHtml(participant.registration)}</td><td><span class="${attendanceClass}">${escapeHtml(participant.attendance)}</span></td><td><div class="inline-actions"><button class="icon-button" data-participant-id="${participant.id}" data-action="edit-participant">Edit</button><button class="icon-button" data-participant-id="${participant.id}" data-action="delete-participant">Delete</button></div></td></tr>`;
}

function checkinsView() {
  const event = getEvent();
  const notChecked = Math.max(event.participants - event.checkedIn, 0);
  return `<div class="checkin-summary"><div class="stat"><label>Registered</label><strong>${event.participants}</strong></div><div class="stat"><label>Checked In</label><strong>${event.checkedIn}</strong></div><div class="stat"><label>Not Checked In</label><strong>${notChecked}</strong></div></div><div class="scanner-card"><div><h2>Scan participant QR</h2><p>Verify registration and mark attendance at the door.</p></div><button class="button" data-action="scan-qr">Scan QR Code</button></div><div class="section-toolbar"><h2>Recent Check-ins</h2></div><div class="table-wrap table-scroll"><table><thead><tr><th>Name</th><th>College</th><th>Check-in Time</th></tr></thead><tbody>${state.recentCheckins.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.college)}</td><td>${escapeHtml(item.time)}</td></tr>`).join('')}</tbody></table></div>`;
}

function renderCreateEvent() {
  const suggestions = ['Marketing', 'Outreach', 'Sponsorship', 'Technical', 'Social Media', 'Content', 'Design', 'Logistics'];
  const slots = state.createSlots || [
    { name: 'CodeSprint 2.0', type: 'Competition', date: '28 Aug 2027', time: '10:00 AM – 01:00 PM', venue: 'Main Auditorium' },
    { name: 'Robowars', type: 'Competition', date: '28 Aug 2027', time: '02:00 PM – 05:00 PM', venue: 'Tech Ground' },
    { name: 'Workshop: AI in Action', type: 'Workshop', date: '29 Aug 2027', time: '10:00 AM – 01:00 PM', venue: 'Seminar Hall 1' },
    { name: 'Guest Talk: Future of Tech', type: 'Session', date: '29 Aug 2027', time: '02:00 PM – 04:00 PM', venue: 'Main Auditorium' },
    { name: 'Project Expo', type: 'Exhibition', date: '30 Aug 2027', time: '10:00 AM – 03:00 PM', venue: 'Open Area' }
  ];
  state.createSlots = slots;
  const selectedDepartments = state.createDepartments || suggestions.slice(0, 5);
  const departmentChip = (name) => `<label class="create-dept-chip ${selectedDepartments.includes(name) ? 'is-selected' : ''}"><input type="checkbox" value="${escapeHtml(name)}" ${selectedDepartments.includes(name) ? 'checked' : ''}>${escapeHtml(name)}</label>`;
  app.innerHTML = `<section class="view create-view create-builder">
    <a href="#" class="back-link" data-action="all-events">← Back to Events</a>
    <div class="create-heading"><div><h1>Create New Event</h1><p>Fill in the details to create a new event. These details will be visible to all participants.</p></div><div class="stepper" aria-label="Event creation steps"><button class="step is-active" data-create-step="details"><b>1</b><span>Details</span></button><button class="step" data-create-step="slots"><b>2</b><span>Slots (Optional)</span></button><button class="step" data-create-step="departments"><b>3</b><span>Departments</span></button><button class="step" data-create-step="review"><b>4</b><span>Review</span></button></div></div>
    <form id="createEventForm">
      <div class="create-columns">
        <div class="create-main-column">
          <section class="builder-card" id="basicInfo"><div class="builder-card__title"><span>1. BASIC INFORMATION</span></div><div class="builder-grid builder-grid--basic"><div><div class="field"><label for="eventName">Event Name <em>*</em></label><input id="eventName" name="eventName" required value="Pulzion 2027"></div><div class="field"><label>Event Logo / Cover Image</label><small class="field-note">This will be shown to participants.</small><label class="cover-upload" for="eventLogo"><span class="upload-icon">⇧</span><strong>Drag &amp; drop an image here</strong><span>or</span><button type="button" class="button button--ghost button--small">Upload Image</button><small>PNG, JPG or SVG (Max. 5MB)</small><input id="eventLogo" type="file" accept="image/png,image/jpeg,image/svg+xml"></label><span class="upload-name" id="uploadName"></span></div></div><div><div class="field"><label for="eventCategory">Event Category <em>*</em></label><select id="eventCategory"><option>Technical Festival</option><option>Hackathon</option><option>Sports Festival</option><option>Cultural Event</option></select></div><div class="field"><label for="eventDescription">Short Description <em>*</em></label><textarea id="eventDescription" name="description" maxlength="250">Pulzion is the annual technical festival of PICT where innovation meets creativity. Join us for workshops, competitions, guest talks and much more!</textarea><small class="char-count"><span id="descriptionCount">142</span>/250</small></div><div class="field"><label for="detailedDescription">Detailed Description</label><div class="rich-editor"><div class="rich-toolbar"><button type="button"><b>B</b></button><button type="button"><i>I</i></button><button type="button"><u>U</u></button><span></span><button type="button">☷</button><button type="button">≡</button><button type="button">↗</button></div><textarea id="detailedDescription" placeholder="Tell participants more about your event, its purpose, highlights, what to expect, rules, etc."></textarea></div></div></div></div></section>
          <section class="builder-card" id="dateVenue"><div class="builder-card__title"><span>2. DATE, TIME &amp; VENUE</span><label class="toggle-label"><input id="singleDay" type="checkbox"><span class="toggle"></span>Single Day Event</label></div><div class="builder-grid builder-grid--three"><div class="field"><label for="startDate">Event Start Date <em>*</em></label><input id="startDate" value="28 Aug 2027"></div><div class="field"><label for="endDate">Event End Date <em>*</em></label><input id="endDate" value="30 Aug 2027"></div><div></div><div class="field"><label for="startTime">Start Time <em>*</em></label><input id="startTime" value="10:00 AM"></div><div class="field"><label for="endTime">End Time <em>*</em></label><input id="endTime" value="06:00 PM"></div><div class="field"><label for="timezone">Timezone <em>*</em></label><select id="timezone"><option>(UTC+05:30) Asia/Kolkata</option><option>(UTC+00:00) Europe/London</option></select></div><div class="field span-two"><label for="venue">Venue / Location <em>*</em></label><input id="venue" value="PICT Campus, Pune"></div><div class="field venue-type"><label for="venueType">Venue Type</label><select id="venueType"><option>Offline</option><option>Online</option><option>Hybrid</option></select></div><div class="field span-two"><label for="address">Full Address</label><input id="address" value="Survey No. 27, Pune-Satara Road, Dhankawadi, Pune, Maharashtra 411043"></div><button type="button" class="button button--ghost button--small map-button" data-action="use-map">⌖ Use map</button></div></section>
          <section class="builder-card" id="eventInfo"><div class="builder-card__title"><span>3. EVENT INFORMATION</span></div><div class="builder-grid builder-grid--three"><div class="field"><label for="expectedParticipants">Expected Participants</label><input id="expectedParticipants" type="number" value="1000"></div><div class="field"><label for="registrationMode">Registration Mode</label><select id="registrationMode"><option>Google Form / External</option><option>EventFlow Registration</option><option>Invite Only</option></select></div><div class="field"><label for="registrationLink">Registration Link (if any)</label><input id="registrationLink" value="https://forms.gle/pulzion2027"></div><div class="field"><label for="website">Event Website</label><input id="website" value="https://pulzion.pict.edu"></div><div class="field"><label for="socialLink">Social Media Link (Optional)</label><input id="socialLink" value="https://instagram.com/pulzion"></div><div class="field"><label for="contactEmail">Contact Email</label><input id="contactEmail" value="pulzion@pict.edu"></div><div class="field"><label for="contactPhone">Contact Phone</label><input id="contactPhone" value="+91 98765 43210"></div><div class="field"><label for="organizer">Event Organiser / Club</label><input id="organizer" value="PICT ACM Student Chapter"></div><div class="field"><label for="hashtag">Event Hashtag (Optional)</label><input id="hashtag" value="#Pulzion2027"></div></div></section>
          <section class="builder-card additional-card" id="additionalDetails"><div class="builder-card__title"><span>4. ADDITIONAL DETAILS</span></div><div class="option-grid"><label class="option-card"><span class="option-icon">♜</span><span><strong>QR Check-in</strong><small>Enable event check-in</small></span><input type="checkbox" checked></label><label class="option-card"><span class="option-icon">♧</span><span><strong>Seat Limit</strong><small>Limited seats</small></span><input type="checkbox"></label><label class="option-card"><span class="option-icon">♧</span><span><strong>Event Kit</strong><small>Includes event kit</small></span><input type="checkbox"></label><label class="option-card"><span class="option-icon">₹</span><span><strong>Payment Required</strong><small>Paid event</small></span><input type="checkbox"></label></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="all-events">Cancel</button><button type="submit" class="button">Save &amp; Continue →</button></div></section>
        </div>
        <aside class="create-side-column">
          <section class="builder-card slots-card" id="eventSlots"><div class="builder-card__title"><span>5. EVENT SLOTS / SUB-EVENTS (OPTIONAL)</span><button type="button" class="button button--ghost button--small" data-action="add-slot">+ Add Slot</button></div><p class="card-description">Add multiple slots or sub-events if applicable. These will be visible to participants.</p><div class="slot-list">${slots.map((slot, index) => slotCard(slot, index)).join('')}</div><div class="info-note">ⓘ Slots are optional. Add them if your event has multiple sessions, competitions, workshops or time-based activities.</div></section>
          <section class="builder-card" id="createDepartments"><div class="builder-card__title"><span>6. DEPARTMENTS</span></div><p class="card-description">Choose the teams that will help run this event.</p><div class="create-dept-grid">${[...new Set([...suggestions, ...(state.createDepartments || [])])].map(departmentChip).join('')}<button type="button" class="create-dept-chip add-custom" data-action="add-custom-department">+ Add Custom Department</button></div></section>
          <section class="builder-card preview-card" id="eventPreview"><div class="builder-card__title"><span>7. PREVIEW</span></div><p class="card-description">This is how the event will appear to participants.</p><div class="event-preview"><div class="preview-cover"><span>✦</span><strong id="previewInitials">PULZION<br>2027</strong></div><div class="preview-content"><h2 id="previewName">Pulzion 2027</h2><p id="previewMeta">28 Aug 2027 – 30 Aug 2027　·　10:00 AM – 06:00 PM</p><p id="previewVenue">⌖ PICT Campus, Pune</p><p id="previewDescription">Pulzion is the annual technical festival of PICT where innovation meets creativity. Join us for workshops, competitions, guest talks and much more!</p><div class="preview-stats"><span>♧ <b>1000</b><small>Expected</small></span><span>⌘ <b id="previewSlotCount">5</b><small>Slots</small></span><span>♧ <b id="previewDeptCount">5</b><small>Departments</small></span><span>⌗ <b>QR</b><small>Check-in</small></span></div></div></div><div class="info-note">ⓘ You can edit all the details later from the event dashboard.</div></section>
        </aside>
      </div>
    </form>
  </section>`;
  syncCreatePreview();
}

function slotCard(slot, index) {
  const tone = slot.type === 'Workshop' ? 'workshop' : slot.type === 'Session' ? 'session' : slot.type === 'Exhibition' ? 'exhibition' : 'competition';
  return `<article class="slot-card"><span class="drag-handle">⠿</span><div class="slot-copy"><h3>${escapeHtml(slot.name)} <span class="slot-type slot-type--${tone}">${escapeHtml(slot.type)}</span></h3><p>▣　${escapeHtml(slot.date)}　　◷　${escapeHtml(slot.time)}　　⌖　${escapeHtml(slot.venue)}</p></div><div class="slot-actions"><button type="button" data-action="edit-slot" data-slot-index="${index}" aria-label="Edit slot">⌑</button><button type="button" data-action="delete-slot" data-slot-index="${index}" aria-label="Delete slot">♧</button></div></article>`;
}

function syncCreatePreview() {
  const name = document.querySelector('#eventName')?.value || 'Pulzion 2027';
  const description = document.querySelector('#eventDescription')?.value || '';
  const venue = document.querySelector('#venue')?.value || 'PICT Campus, Pune';
  const start = document.querySelector('#startDate')?.value || '28 Aug 2027';
  const end = document.querySelector('#endDate')?.value || '30 Aug 2027';
  const nameNode = document.querySelector('#previewName');
  if (!nameNode) return;
  nameNode.textContent = name;
  document.querySelector('#previewDescription').textContent = description;
  document.querySelector('#previewVenue').textContent = `⌖ ${venue}`;
  document.querySelector('#previewMeta').textContent = `${start} – ${end}　·　10:00 AM – 06:00 PM`;
  document.querySelector('#previewSlotCount').textContent = state.createSlots?.length || 0;
  document.querySelector('#previewDeptCount').textContent = document.querySelectorAll('.create-dept-chip input:checked').length;
  document.querySelector('#descriptionCount').textContent = description.length;
}

function renderSimpleCreateEvent() {
  const departments = ['Marketing', 'Outreach', 'Sponsorship', 'Social Media', 'Technical', 'Content', 'Design', 'Logistics', 'Photography', 'Hospitality'];
  const editingEvent = state.editingEventId ? state.events.find((event) => event.id === state.editingEventId) : null;
  const isEditing = Boolean(editingEvent);
  const eventDateParts = String(editingEvent?.date || '').split(' — ');
  const eventTimeParts = String(editingEvent?.time || '').split(' – ');
  const selectedDepartments = editingEvent?.departmentNames || state.createDepartments || departments.slice(0, 5);
  const departmentChip = (name) => `<label class="create-dept-chip ${selectedDepartments.includes(name) ? 'is-selected' : ''}"><input type="checkbox" value="${escapeHtml(name)}" ${selectedDepartments.includes(name) ? 'checked' : ''}>${escapeHtml(name)}</label>`;
  app.innerHTML = `<section class="view create-builder simple-create">
    <a href="#" class="back-link" data-action="all-events">← Back to Events</a>
    <div class="create-heading"><div><h1>${isEditing ? 'Edit Event' : 'Create New Event'}</h1><p>${isEditing ? 'Update the details for this event and keep everything in one place.' : 'Add the essential details for your event. You can manage teams, participants and check-ins after creating the event.'}</p></div></div>
    <form id="createEventForm">
      <div class="create-columns">
        <div class="create-main-column">
          <section class="builder-card" id="eventEssentials"><div class="builder-card__title"><span>1. BASIC INFORMATION + DATE, TIME &amp; VENUE</span></div><div class="builder-grid builder-grid--basic"><div class="field"><label for="eventName">Event Name <em>*</em></label><input id="eventName" name="eventName" required value="Pulzion 2027" placeholder="Pulzion 2027"></div><div class="field"><label for="eventCategory">Event Category <em>*</em></label><select id="eventCategory" required><option value="Technical Fest">Technical Fest</option><option>Cultural Fest</option><option>Hackathon</option><option>Workshop</option><option>Competition</option><option>Seminar</option><option>Sports</option><option>Other</option></select></div><div class="field"><label>Event Logo / Cover Image</label><label class="compact-upload" for="eventLogo"><span class="upload-icon">⇧</span><span>Upload image or drag and drop</span><small>PNG, JPG or SVG · Max. 5MB</small><input id="eventLogo" type="file" accept="image/png,image/jpeg,image/svg+xml"></label><span class="upload-name" id="uploadName"></span></div><div class="field"><label for="eventDescription">Short Description <em>*</em></label><textarea id="eventDescription" name="description" required maxlength="250" placeholder="A short 1–2 sentence description.">Pulzion is the annual technical festival of PICT where innovation meets creativity.</textarea><small class="char-count"><span id="descriptionCount">79</span>/250</small></div><div class="field span-two"><label for="detailedDescription">Detailed Description <span class="optional">(optional)</span></label><textarea id="detailedDescription" placeholder="Explain what the event is about, what participants can expect, and other useful details."></textarea></div><div class="field"><label for="startDate">Event Start Date <em>*</em></label><input id="startDate" required value="28 Aug 2027"></div><div class="field"><label for="endDate">Event End Date <em>*</em></label><input id="endDate" required value="30 Aug 2027"></div><div class="field"><label for="startTime">Start Time <em>*</em></label><input id="startTime" required value="10:00 AM"></div><div class="field"><label for="endTime">End Time <em>*</em></label><input id="endTime" required value="06:00 PM"></div><div class="field"><label for="timezone">Timezone <em>*</em></label><select id="timezone" required><option>(UTC+05:30) Asia/Kolkata</option><option>(UTC+00:00) Europe/London</option><option>(UTC-05:00) America/New_York</option></select></div><div class="field"><label for="venueType">Venue Type</label><select id="venueType"><option>Offline</option><option>Online</option><option>Hybrid</option></select></div><div class="field span-two"><label for="venue">Venue / Location <em>*</em></label><input id="venue" required value="PICT Campus, Pune" placeholder="PICT Campus, Pune"></div><div class="field"><label for="address">Full Address <span class="optional">(offline / hybrid)</span></label><input id="address" value="Survey No. 27, Pune-Satara Road, Dhankawadi, Pune"></div><div class="field"><label for="meetingLink">Meeting / Event Link <span class="optional">(online / hybrid)</span></label><input id="meetingLink" type="url" placeholder="https://meet.google.com/..."></div></div></section>
          <section class="builder-card" id="eventFormation"><div class="builder-card__title"><span>2. EVENT FORMATION</span></div><div class="builder-grid builder-grid--three"><div class="field span-two"><label for="organizer">Event Organizer / Club <em>*</em></label><input id="organizer" required value="PICT ACM Student Chapter" placeholder="PICT ACM Student Chapter"></div><div class="field"><label for="expectedParticipants">Expected Participants</label><input id="expectedParticipants" type="number" min="0" value="1000" placeholder="1000"></div><div class="field"><label for="registrationMode">Registration Mode <em>*</em></label><select id="registrationMode" required><option>External Registration</option><option>Google Form</option><option>Website Registration</option><option>Other</option></select></div><div class="field"><label for="registrationLink">Registration Link <span class="optional">(optional)</span></label><input id="registrationLink" type="url" placeholder="https://forms.gle/..."></div><div class="field"><label for="website">Event Website <span class="optional">(optional)</span></label><input id="website" type="url" placeholder="https://event-website.com"></div><div class="field"><label for="socialLink">Social Media Link <span class="optional">(optional)</span></label><input id="socialLink" type="url" placeholder="https://instagram.com/..."></div><div class="field"><label for="contactEmail">Contact Email <em>*</em></label><input id="contactEmail" type="email" required value="pulzion@pict.edu" placeholder="pulzion@pict.edu"></div><div class="field"><label for="contactPhone">Contact Phone <span class="optional">(optional)</span></label><input id="contactPhone" type="tel" placeholder="+91 98765 43210"></div><div class="field"><label for="hashtag">Event Hashtag <span class="optional">(optional)</span></label><input id="hashtag" value="#Pulzion2027" placeholder="#Pulzion2027"></div></div></section>
        </div>
        <aside class="create-side-column"><section class="builder-card departments-builder" id="eventDepartments"><div class="builder-card__title"><span>3. DEPARTMENTS</span></div><p class="card-description">Choose the teams that will help run this event.</p><div class="create-dept-grid">${departments.map(departmentChip).join('')}<button type="button" class="create-dept-chip add-custom" data-action="add-custom-department">+ Add Custom Department</button></div><div class="info-note">Selected departments will appear inside the event dashboard.</div></section></aside>
      </div>
      <div class="form-actions create-actions"><button type="button" class="button button--ghost" data-action="all-events">Cancel</button><button type="submit" class="button">${isEditing ? 'Save Changes' : 'Create Event'} →</button></div>
    </form>
  </section>`;
  const placeholders = {
    eventName: 'Pulzion 2027', eventDescription: 'A short 1–2 sentence description.', detailedDescription: 'Explain what the event is about and what participants can expect.',
    startDate: '28 Aug 2027', endDate: '30 Aug 2027', startTime: '10:00 AM', endTime: '06:00 PM', venue: 'PICT Campus, Pune', address: 'Full address', meetingLink: 'https://meet.google.com/...',
    organizer: 'PICT ACM Student Chapter', expectedParticipants: '1000', registrationLink: 'https://forms.gle/...', website: 'https://event-website.com', socialLink: 'https://instagram.com/...', contactEmail: 'pulzion@pict.edu', contactPhone: '+91 98765 43210', hashtag: '#Pulzion2027'
  };
  const editValues = editingEvent ? {
    eventName: editingEvent.name || '',
    eventDescription: editingEvent.description || '',
    detailedDescription: editingEvent.detailedDescription || '',
    startDate: editingEvent.startDate || eventDateParts[0] || '',
    endDate: editingEvent.endDate || eventDateParts[1] || eventDateParts[0] || '',
    startTime: editingEvent.startTime || eventTimeParts[0] || '',
    endTime: editingEvent.endTime || eventTimeParts[1] || eventTimeParts[0] || '',
    venue: editingEvent.location || '',
    address: editingEvent.address || '',
    meetingLink: editingEvent.meetingLink || '',
    organizer: editingEvent.organizer || 'PICT ACM Student Chapter',
    expectedParticipants: editingEvent.expectedParticipants ?? '',
    registrationLink: editingEvent.registrationLink || '',
    website: editingEvent.website || '',
    socialLink: editingEvent.socialLink || '',
    contactEmail: editingEvent.contactEmail || 'events@eventflow.com',
    contactPhone: editingEvent.contactPhone || '',
    hashtag: editingEvent.hashtag || ''
  } : {};
  Object.entries(placeholders).forEach(([id, placeholder]) => { const field = document.querySelector(`#${id}`); if (field) { field.value = editValues[id] ?? ''; field.placeholder = placeholder; } });
  const category = document.querySelector('#eventCategory');
  if (category && editingEvent?.type) {
    const option = Array.from(category.options).find((item) => item.value === editingEvent.type || item.textContent === editingEvent.type || (editingEvent.type === 'Technical Festival' && item.value === 'Technical Fest'));
    if (option) category.value = option.value;
  }
  const registrationMode = document.querySelector('#registrationMode');
  if (registrationMode && editingEvent?.registrationMode) registrationMode.value = editingEvent.registrationMode;
  const timezone = document.querySelector('#timezone');
  if (timezone && editingEvent?.timezone) timezone.value = editingEvent.timezone;
  const venueType = document.querySelector('#venueType');
  if (venueType && editingEvent?.venueType) venueType.value = editingEvent.venueType;
  const description = document.querySelector('#eventDescription');
  document.querySelector('#descriptionCount').textContent = description.value.length;
}

function showModal(content) { modalRoot.innerHTML = `<div class="modal-backdrop" data-modal-backdrop><div class="modal">${content}</div></div>`; }
function showWideModal(content) { modalRoot.innerHTML = `<div class="modal-backdrop" data-modal-backdrop><div class="modal modal--wide">${content}</div></div>`; }
function closeModal() { modalRoot.innerHTML = ''; }
function showToast(message) { const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2600); }

function slotModal(index = -1) {
  const slot = index >= 0 ? state.createSlots[index] : { name: '', type: 'Competition', date: '', time: '', venue: '' };
  showModal(`<div class="modal__head"><div><h2>${index >= 0 ? 'Edit Event Slot' : 'Add Event Slot'}</h2><p>Make a session visible to participants.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="slotForm" data-slot-index="${index}"><div class="field"><label for="slotName">Slot Name</label><input id="slotName" required value="${escapeHtml(slot.name)}" placeholder="CodeSprint 2.0"></div><div class="field-grid"><div class="field"><label for="slotType">Type</label><select id="slotType"><option ${slot.type === 'Competition' ? 'selected' : ''}>Competition</option><option ${slot.type === 'Workshop' ? 'selected' : ''}>Workshop</option><option ${slot.type === 'Session' ? 'selected' : ''}>Session</option><option ${slot.type === 'Exhibition' ? 'selected' : ''}>Exhibition</option></select></div><div class="field"><label for="slotDate">Date</label><input id="slotDate" value="${escapeHtml(slot.date)}" placeholder="28 Aug 2027"></div><div class="field"><label for="slotTime">Time</label><input id="slotTime" value="${escapeHtml(slot.time)}" placeholder="10:00 AM – 01:00 PM"></div><div class="field"><label for="slotVenue">Venue</label><input id="slotVenue" value="${escapeHtml(slot.venue)}" placeholder="Main Auditorium"></div></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button class="button" type="submit">${index >= 0 ? 'Save Slot' : 'Add Slot'}</button></div></form>`);
}

function customDepartmentModal() {
  showModal(`<div class="modal__head"><div><h2>Add Custom Department</h2><p>Create a team specific to this event.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="customDepartmentForm"><div class="field"><label for="customDepartmentName">Department Name</label><input id="customDepartmentName" required placeholder="Registration Desk"></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button class="button" type="submit">Add Department</button></div></form>`);
}

function volunteerModal(volunteer = {}) {
  const departments = volunteerDepartments();
  showModal(`<div class="modal__head"><div><h2>${volunteer.id ? 'Edit Volunteer' : 'Add Volunteer'}</h2><p>Assign a volunteer to a department for ${escapeHtml(getEvent().name)}.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="eventVolunteerForm" data-volunteer-id="${escapeHtml(volunteer.id || '')}"><div class="field"><label for="volunteerName">Full Name <em>*</em></label><input id="volunteerName" required value="${escapeHtml(volunteer.name || '')}" placeholder="Rahul Kadam"></div><div class="field"><label for="volunteerEmail">Email <em>*</em></label><input id="volunteerEmail" type="email" required value="${escapeHtml(volunteer.email || '')}" placeholder="rahul@email.com"></div><div class="field"><label for="volunteerDepartment">Department <em>*</em></label><select id="volunteerDepartment" required>${departments.map((department) => `<option ${department === volunteer.department ? 'selected' : ''}>${escapeHtml(department)}</option>`).join('')}</select></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button class="button" type="submit">${volunteer.id ? 'Save Changes' : 'Add Volunteer'}</button></div></form>`);
}

function removeVolunteerModal(volunteer) {
  showModal(`<div class="modal__head"><div><h2>Remove this volunteer?</h2><p>Are you sure you want to remove ${escapeHtml(volunteer.name)} from this event?</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button type="button" class="button" data-action="confirm-remove-volunteer" data-volunteer-id="${escapeHtml(volunteer.id)}">Remove Volunteer</button></div>`);
}

function volunteerImportModal() {
  state.volunteerImportRows = [];
  state.volunteerImportInvalidRows = [];
  showWideModal(`<div class="modal__head"><div><h2>Import Volunteers</h2><p>Upload an .xlsx roster with Name, Email and Department columns.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="field"><label for="volunteerExcelFile">Volunteer Excel File</label><input id="volunteerExcelFile" type="file" accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"></div><p class="import-status" id="volunteerImportStatus">Choose an Excel file to preview the roster.</p><div id="volunteerImportPreview"></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button type="button" class="button" data-action="import-volunteer-rows" disabled>Import Volunteers</button></div>`);
}

async function parseVolunteerExcel(file) {
  const status = document.querySelector('#volunteerImportStatus');
  const preview = document.querySelector('#volunteerImportPreview');
  const importButton = modalRoot.querySelector('[data-action="import-volunteer-rows"]');
  status.textContent = 'Reading Excel file...';
  try {
    const XLSX = await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs');
    const workbook = XLSX.read(await file.arrayBuffer(), { type:'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval:'' });
    const firstRow = rawRows[0] || {};
    const headers = Object.keys(firstRow).map((header) => header.trim().toLowerCase());
    const requiredColumns = ['name', 'email', 'department'];
    if (requiredColumns.some((column) => !headers.includes(column))) { state.volunteerImportRows = []; state.volunteerImportInvalidRows = []; status.textContent = 'Invalid Excel file. Required columns are Name, Email and Department.'; preview.innerHTML = ''; importButton.disabled = true; return; }
    const existingEmails = new Set(getEventVolunteers().map((volunteer) => volunteer.email.toLowerCase()));
    const seenEmails = new Set();
    const rows = rawRows.map((row, index) => {
      const values = Object.fromEntries(Object.entries(row).map(([key, value]) => [key.trim().toLowerCase(), String(value).trim()]));
      const volunteer = { name: values.name || '', email: values.email || '', department: values.department || '', row: index + 2 };
      const invalid = !volunteer.name || !volunteer.email || !volunteer.department || existingEmails.has(volunteer.email.toLowerCase()) || seenEmails.has(volunteer.email.toLowerCase());
      if (!invalid) seenEmails.add(volunteer.email.toLowerCase());
      return { ...volunteer, invalid, reason: !volunteer.name || !volunteer.email || !volunteer.department ? 'Missing required field' : 'Duplicate email' };
    });
    state.volunteerImportRows = rows.filter((row) => !row.invalid);
    state.volunteerImportInvalidRows = rows.filter((row) => row.invalid);
    status.textContent = `${state.volunteerImportRows.length} valid volunteers · ${state.volunteerImportInvalidRows.length} rows need attention`;
    preview.innerHTML = `<div class="import-preview-summary"><strong>${state.volunteerImportRows.length} valid volunteers</strong><span>${state.volunteerImportInvalidRows.length} rows need attention</span></div><div class="table-wrap table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Validation</th></tr></thead><tbody>${rows.map((row) => `<tr class="${row.invalid ? 'import-row-invalid' : ''}"><td>${escapeHtml(row.name || '—')}</td><td>${escapeHtml(row.email || '—')}</td><td>${escapeHtml(row.department || '—')}</td><td>${row.invalid ? escapeHtml(row.reason) : 'Ready to import'}</td></tr>`).join('')}</tbody></table></div>`;
    importButton.disabled = state.volunteerImportRows.length === 0;
  } catch { status.textContent = 'Unable to read this Excel file. Please check the file and try again.'; preview.innerHTML = ''; importButton.disabled = true; }
}

async function saveVolunteerRecord(volunteer, existingId = '') {
  const volunteers = getEventVolunteers();
  const duplicate = volunteers.find((item) => item.email.toLowerCase() === volunteer.email.toLowerCase() && item.id !== existingId);
  if (duplicate) { showToast('A volunteer with this email already exists for this event.'); return false; }
  const record = { ...volunteer, id: existingId || `volunteer-${Date.now()}`, eventId: state.eventId, status: 'Active', updatedAt: new Date().toISOString() };
  const nextVolunteers = existingId ? volunteers.map((item) => item.id === existingId ? { ...item, ...record } : item) : [...volunteers, record];
  saveEventVolunteers(nextVolunteers);
  try {
    const services = await getVolunteerFirestoreServices();
    if (services) {
      const collectionRef = services.collection(services.db, `events/${state.eventId}/volunteers`);
      if (existingId) await services.updateDoc(services.doc(services.db, `events/${state.eventId}/volunteers/${existingId}`), { ...record, updatedAt: services.serverTimestamp() });
      else await services.setDoc(services.doc(collectionRef, record.id), { ...record, createdAt: services.serverTimestamp(), updatedAt: services.serverTimestamp() });
    }
  } catch { }
  return true;
}

async function importVolunteerRows() {
  for (const row of state.volunteerImportRows) await saveVolunteerRecord({ name:row.name, email:row.email, department:row.department });
  const count = state.volunteerImportRows.length;
  closeModal();
  renderWorkspace();
  showToast(`${count} volunteers imported successfully.`);
}

function addParticipantModal(participant = {}) {
  const editing = Boolean(participant.id);
  showModal(`<div class="modal__head"><div><h2>${editing ? 'Edit Participant' : 'Add Participant'}</h2><p>Keep registration details ready for event check-in.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="participantForm" data-edit-id="${participant.id || ''}"><div class="field-grid"><div class="field"><label for="participantName">Name</label><input id="participantName" required value="${escapeHtml(participant.name || '')}" placeholder="Rahul Kadam"></div><div class="field"><label for="participantEmailField">Email</label><input id="participantEmailField" type="email" required value="${escapeHtml(participant.email || '')}" placeholder="rahul@email.com"></div><div class="field"><label for="participantPhone">Phone</label><input id="participantPhone" value="${escapeHtml(participant.phone || '')}" placeholder="9876543210"></div><div class="field"><label for="participantCollege">College</label><input id="participantCollege" value="${escapeHtml(participant.college || '')}" placeholder="PICT"></div></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button class="button" type="submit">${editing ? 'Save Participant' : 'Add Participant'}</button></div></form>`);
}

function taskModal() { showModal(`<div class="modal__head"><div><h2>Assign Task</h2><p>Give a volunteer a clear next step.</p></div><button class="modal-close" data-action="close-modal">×</button></div><form id="taskForm"><div class="field"><label for="taskName">Task Name</label><input id="taskName" required placeholder="Contact 20 colleges"></div><div class="field"><label for="taskDescription">Description</label><textarea id="taskDescription" placeholder="Add task details"></textarea></div><div class="field-grid"><div class="field"><label for="taskAssignee">Assign To</label><select id="taskAssignee">${state.volunteers.map((volunteer) => `<option>${volunteer.name}</option>`).join('')}</select></div><div class="field"><label for="taskDeadline">Deadline</label><input id="taskDeadline" placeholder="25 Aug 2027"></div></div><div class="form-actions"><button type="button" class="button button--ghost" data-action="close-modal">Cancel</button><button class="button" type="submit">Assign Task</button></div></form>`); }

function scannerModal() { showWideModal(`<div class="modal__head"><div><h2>Scan Participant QR</h2><p>Frontend-only scanner interface prepared for QR integration.</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="scanner-frame"><div class="scanner-frame__box">⌗</div></div><p class="scanner-copy">Point the participant’s QR code inside the frame.</p><div class="form-actions"><button class="button button--ghost" data-action="close-modal">Close Scanner</button><button class="button button--ghost" data-action="scan-result" data-result="invalid">Simulate Invalid</button><button class="button" data-action="scan-result" data-result="success">Simulate Success</button></div>`); }

function resultModal(type) {
  const result = type === 'success' ? { cls: 'result-state--success', icon: '✓', title: 'Check-in Successful', text: 'Rahul Kadam<br>PICT<br>Pulzion 2027<br>10:32 AM', action: 'Done' } : type === 'already' ? { cls: 'result-state--warning', icon: '!', title: 'Already Checked In', text: 'Rahul Kadam<br>Checked in at 10:32 AM', action: 'Scan Again' } : { cls: 'result-state--error', icon: '×', title: 'Invalid Participant', text: 'This participant is not registered for this event.', action: 'Scan Again' };
  showModal(`<div class="result-state ${result.cls}"><div class="result-icon">${result.icon}</div><h2>${result.title}</h2><p>${result.text}</p><button class="button" data-action="${type === 'success' ? 'close-modal' : 'scan-qr'}">${result.action}</button></div>`);
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action], [data-event-id], [data-department-id], [data-workspace-tab], [data-dept-tab], [data-participant-filter]');
  if (!target) return;
  if (target.dataset.eventId) { state.eventId = target.dataset.eventId; state.workspaceTab = 'overview'; state.view = 'workspace'; render(); return; }
  if (target.dataset.departmentId) { state.departmentId = target.dataset.departmentId; state.departmentTab = 'progress'; state.view = 'department'; render(); return; }
  if (target.dataset.workspaceTab) { state.workspaceTab = target.dataset.workspaceTab; render(); return; }
  if (target.dataset.deptTab) { state.departmentTab = target.dataset.deptTab; render(); return; }
  if (target.dataset.participantFilter) { state.participantFilter = target.dataset.participantFilter; render(); return; }
  if (target.dataset.createStep) {
    const targetIds = { details: 'basicInfo', slots: 'eventSlots', departments: 'createDepartments', review: 'eventPreview' };
    document.querySelector(`#${targetIds[target.dataset.createStep]}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.step').forEach((step) => step.classList.toggle('is-active', step.dataset.createStep === target.dataset.createStep));
    return;
  }
  const action = target.dataset.action;
  if (action === 'create-event') { state.editingEventId = null; state.view = 'create'; render(); }
  if (action === 'edit-event') { state.editingEventId = state.eventId; state.view = 'create'; render(); }
  if (action === 'add-slot') slotModal();
  if (action === 'edit-slot') slotModal(Number(target.dataset.slotIndex));
  if (action === 'delete-slot') { state.createSlots.splice(Number(target.dataset.slotIndex), 1); render(); showToast('Event slot removed.'); }
  if (action === 'add-custom-department') customDepartmentModal();
  if (action === 'use-map') showToast('Map picker is ready for a maps integration.');
  if (action === 'all-events') { state.editingEventId = null; state.view = 'events'; render(); }
  if (action === 'departments') { state.view = 'workspace'; state.workspaceTab = 'departments'; render(); }
  if (action === 'add-department') showToast('Custom departments can be added here.');
  if (action === 'assign-task') taskModal();
  if (action === 'edit-task') taskModal();
  if (action === 'add-remark') showToast('Remark composer ready for Firebase integration.');
  if (action === 'add-volunteer') volunteerModal();
  if (action === 'import-volunteers') volunteerImportModal();
  if (action === 'import-volunteer-rows') importVolunteerRows();
  if (action === 'edit-event-volunteer') { const volunteer = getEventVolunteers().find((item) => item.id === target.dataset.volunteerId); if (volunteer) volunteerModal(volunteer); }
  if (action === 'remove-event-volunteer') { const volunteer = getEventVolunteers().find((item) => item.id === target.dataset.volunteerId); if (volunteer) removeVolunteerModal(volunteer); }
  if (action === 'confirm-remove-volunteer') {
    const nextVolunteers = getEventVolunteers().filter((item) => item.id !== target.dataset.volunteerId);
    saveEventVolunteers(nextVolunteers);
    getVolunteerFirestoreServices().then((services) => services?.deleteDoc(services.doc(services.db, `events/${state.eventId}/volunteers/${target.dataset.volunteerId}`))).catch(() => {});
    closeModal();
    renderWorkspace();
    showToast('Volunteer removed from this event.');
  }
  if (action === 'add-participant') addParticipantModal();
  if (action === 'edit-participant') { const participant = state.participants.find((item) => String(item.id) === target.dataset.participantId); addParticipantModal(participant); }
  if (action === 'delete-participant') { state.participants = state.participants.filter((item) => String(item.id) !== target.dataset.participantId); render(); showToast('Participant removed from this mock event.'); }
  if (action === 'scan-qr') scannerModal();
  if (action === 'scan-result') resultModal(target.dataset.result); 
  if (action === 'close-modal') closeModal();
  if (action === 'volunteer-detail') { const volunteer = target.dataset.volunteerId ? getEventVolunteers().find((item) => item.id === target.dataset.volunteerId) : state.volunteers.find((item) => item.name === target.dataset.volunteer); if (volunteer) showModal(`<div class="modal__head"><div><h2>${escapeHtml(volunteer.name)}</h2><p>${escapeHtml(volunteer.department || 'Marketing')} Department · ${escapeHtml(volunteer.status || 'Active')}</p></div><button class="modal-close" data-action="close-modal">×</button></div><div class="stats-row"><div class="stat"><label>Assigned Tasks</label><strong>${volunteer.tasks || 0}</strong></div><div class="stat"><label>Progress</label><strong>${volunteer.progress || 0}%</strong></div></div><p style="color:var(--muted);font-size:11px;margin:20px 0 0">Volunteer assignment for ${escapeHtml(getEvent().name)}.</p>`); }
  if (action === 'profile' || action === 'settings') { document.querySelector('#profileMenu').hidden = true; showToast(`${action[0].toUpperCase() + action.slice(1)} is ready for Firebase integration.`); }
  if (action === 'logout') { window.location.href = 'login.html'; }
});

app.addEventListener('input', (event) => {
  if (event.target.id === 'participantSearch') { state.participantSearch = event.target.value; const cursor = event.target.selectionStart; render(); const input = document.querySelector('#participantSearch'); input.focus(); input.setSelectionRange(cursor, cursor); }
  if (state.view === 'create' && ['eventName', 'eventDescription', 'venue', 'startDate', 'endDate'].includes(event.target.id)) syncCreatePreview();
});

app.addEventListener('change', (event) => {
  if (event.target.matches('.department-chip input')) event.target.closest('.department-chip').classList.toggle('is-selected', event.target.checked);
  if (event.target.matches('.create-dept-chip input')) { event.target.closest('.create-dept-chip').classList.toggle('is-selected', event.target.checked); state.createDepartments = Array.from(document.querySelectorAll('.create-dept-chip input:checked')).map((input) => input.value); syncCreatePreview(); }
  if (event.target.id === 'singleDay') { const endDate = document.querySelector('#endDate'); if (endDate) { endDate.disabled = event.target.checked; endDate.style.opacity = event.target.checked ? '.45' : '1'; } }
  if (event.target.id === 'eventLogo') { const file = event.target.files?.[0]; const name = document.querySelector('#uploadName'); if (name && file) name.textContent = `${file.name} selected`; }
});

modalRoot.addEventListener('click', (event) => { if (event.target.matches('[data-modal-backdrop]')) closeModal(); });
modalRoot.addEventListener('change', (event) => { if (event.target.id === 'volunteerExcelFile' && event.target.files?.[0]) parseVolunteerExcel(event.target.files[0]); });
modalRoot.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'close-modal') closeModal();
  if (action === 'scan-qr') scannerModal();
  if (action === 'scan-result') resultModal(event.target.closest('[data-action]').dataset.result);
  if (action === 'import-volunteer-rows') importVolunteerRows();
  if (action === 'confirm-remove-volunteer') {
    const volunteerId = event.target.closest('[data-action]').dataset.volunteerId;
    saveEventVolunteers(getEventVolunteers().filter((item) => item.id !== volunteerId));
    getVolunteerFirestoreServices().then((services) => services?.deleteDoc(services.doc(services.db, `events/${state.eventId}/volunteers/${volunteerId}`))).catch(() => {});
    closeModal();
    renderWorkspace();
    showToast('Volunteer removed from this event.');
  }
});

app.addEventListener('submit', (event) => {
  if (event.target.id !== 'createEventForm') return;
  event.preventDefault();
  const missingRequiredField = Array.from(event.target.querySelectorAll('[required]')).find((field) => !field.value.trim());
  if (missingRequiredField) {
    missingRequiredField.focus();
    showToast('Please complete all required event details.');
    return;
  }
  const name = document.querySelector('#eventName').value.trim() || `New Event ${state.nextEvent}`;
  const departmentNames = Array.from(document.querySelectorAll('.create-dept-chip input:checked')).map((input) => input.value);
  const existingEvent = state.editingEventId ? state.events.find((item) => item.id === state.editingEventId) : null;
  const eventDetails = {
    name,
    type: document.querySelector('#eventCategory')?.value || 'New Event',
    date: `${document.querySelector('#startDate')?.value} – ${document.querySelector('#endDate')?.value}`,
    time: `${document.querySelector('#startTime')?.value} – ${document.querySelector('#endTime')?.value}`,
    startDate: document.querySelector('#startDate')?.value || '',
    endDate: document.querySelector('#endDate')?.value || '',
    startTime: document.querySelector('#startTime')?.value || '',
    endTime: document.querySelector('#endTime')?.value || '',
    location: document.querySelector('#venue').value || 'Venue to be announced',
    status: existingEvent?.status || 'Upcoming',
    participants: existingEvent?.participants || 0,
    volunteers: existingEvent?.volunteers || 0,
    checkedIn: existingEvent?.checkedIn || 0,
    departments: departmentNames.length,
    departmentNames,
    departmentProgress: existingEvent?.departmentProgress || {},
    description: document.querySelector('#eventDescription').value,
    detailedDescription: document.querySelector('#detailedDescription')?.value || '',
    organizer: document.querySelector('#organizer')?.value || '',
    expectedParticipants: document.querySelector('#expectedParticipants')?.value || '',
    registrationMode: document.querySelector('#registrationMode')?.value || '',
    registrationLink: document.querySelector('#registrationLink')?.value || '',
    website: document.querySelector('#website')?.value || '',
    socialLink: document.querySelector('#socialLink')?.value || '',
    contactEmail: document.querySelector('#contactEmail')?.value || '',
    contactPhone: document.querySelector('#contactPhone')?.value || '',
    hashtag: document.querySelector('#hashtag')?.value || '',
    address: document.querySelector('#address')?.value || '',
    meetingLink: document.querySelector('#meetingLink')?.value || '',
    venueType: document.querySelector('#venueType')?.value || '',
    timezone: document.querySelector('#timezone')?.value || ''
  };
  if (existingEvent) {
    Object.assign(existingEvent, eventDetails);
    state.eventId = existingEvent.id;
    state.editingEventId = null;
    state.workspaceTab = 'overview';
    state.view = 'workspace';
    render();
    showToast('Event updated successfully.');
    return;
  }
  const id = `new-event-${state.nextEvent++}`;
  state.events.push({ id, ...eventDetails });
  state.eventId = id;
  state.editingEventId = null;
  state.workspaceTab = 'overview';
  state.view = 'workspace';
  render();
  showToast('Event created successfully.');
});

modalRoot.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (event.target.id === 'eventVolunteerForm') {
    const volunteerId = event.target.dataset.volunteerId;
    const saved = await saveVolunteerRecord({ name: document.querySelector('#volunteerName').value.trim(), email: document.querySelector('#volunteerEmail').value.trim(), department: document.querySelector('#volunteerDepartment').value }, volunteerId);
    if (saved) { closeModal(); render(); showToast(volunteerId ? 'Volunteer updated successfully.' : 'Volunteer added successfully.'); }
  }
  if (event.target.id === 'createEventForm') { const name = document.querySelector('#eventName').value.trim() || `New Event ${state.nextEvent}`; const id = `new-event-${state.nextEvent++}`; state.events.push({ id, name, type: 'New Event', date: 'Date to be announced', location: document.querySelector('#venue').value || 'Venue to be announced', status: 'Upcoming', participants: 0, volunteers: 0, checkedIn: 0, departments: document.querySelectorAll('.department-chip input:checked').length, description: document.querySelector('#eventDescription').value }); state.eventId = id; state.workspaceTab = 'overview'; state.view = 'workspace'; render(); showToast('Event created successfully.'); }
  if (event.target.id === 'participantForm') { const editId = event.target.dataset.editId; const details = { name: document.querySelector('#participantName').value, email: document.querySelector('#participantEmailField').value, phone: document.querySelector('#participantPhone').value, college: document.querySelector('#participantCollege').value, registration: 'Registered', attendance: 'Not Checked In' }; if (editId) { Object.assign(state.participants.find((item) => String(item.id) === editId), details); } else { state.participants.push({ id: state.nextParticipant++, ...details }); } closeModal(); render(); showToast(editId ? 'Participant updated.' : 'Participant added.'); }
  if (event.target.id === 'taskForm') { state.tasks.push({ id: state.nextTask++, name: document.querySelector('#taskName').value, assignee: document.querySelector('#taskAssignee').value, due: document.querySelector('#taskDeadline').value || 'To be decided', status: 'Pending' }); closeModal(); render(); showToast('Task assigned successfully.'); }
  if (event.target.id === 'slotForm') { const index = Number(event.target.dataset.slotIndex); const slot = { name: document.querySelector('#slotName').value, type: document.querySelector('#slotType').value, date: document.querySelector('#slotDate').value, time: document.querySelector('#slotTime').value, venue: document.querySelector('#slotVenue').value }; if (index >= 0) state.createSlots[index] = slot; else state.createSlots.push(slot); closeModal(); render(); showToast(index >= 0 ? 'Event slot updated.' : 'Event slot added.'); }
  if (event.target.id === 'customDepartmentForm') { const name = document.querySelector('#customDepartmentName').value.trim(); if (name) { state.createDepartments = [...new Set([...(state.createDepartments || []), name])]; closeModal(); render(); showToast(`${name} added to this event.`); } }
});

document.querySelector('#profileTrigger').addEventListener('click', () => { const menu = document.querySelector('#profileMenu'); menu.hidden = !menu.hidden; document.querySelector('#profileTrigger').setAttribute('aria-expanded', String(!menu.hidden)); });
document.querySelector('#profileMenu').addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  document.querySelector('#profileMenu').hidden = true;
  if (action === 'logout') window.location.href = 'login.html';
  if (action === 'profile' || action === 'settings') showToast(`${action[0].toUpperCase() + action.slice(1)} is ready for Firebase integration.`);
});
document.addEventListener('click', (event) => { if (!event.target.closest('.profile-wrap')) { document.querySelector('#profileMenu').hidden = true; document.querySelector('#profileTrigger').setAttribute('aria-expanded', 'false'); } });

render();
