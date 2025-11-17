// Dark mode
document.getElementById('darkModeToggle').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
});
if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark');

// Navigation
function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'practice') renderQuestions(allQuestions);
  if (id === 'studyplan') renderStudyPlan();
}

// Render questions, filters, quiz, etc. (full script is long – sending next)
