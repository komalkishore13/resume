const PROJECTS_KEY = 'portfolio_projects';
const PROFILE_KEY = 'portfolio_profile';

const DEFAULT_PROJECTS = [
  {
    id: 'p1',
    title: 'E-Commerce Platform',
    description: 'Full-featured online store with product listings, cart management, and a seamless checkout flow.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    link: '#',
    icon: '\uD83D\uDED2'
  },
  {
    id: 'p2',
    title: 'Weather Dashboard',
    description: 'Real-time weather app with city search, 5-day forecasts, and dynamic background themes.',
    tags: ['API', 'JavaScript', 'CSS'],
    link: '#',
    icon: '\u26C5'
  },
  {
    id: 'p3',
    title: 'Task Manager',
    description: 'Productivity tool with drag-and-drop task boards, categories, and progress tracking.',
    tags: ['JavaScript', 'localStorage', 'CSS'],
    link: '#',
    icon: '\u2705'
  }
];

const DEFAULT_PROFILE = {
  name: 'Komal Kishore',
  role: 'Web Developer',
  bio: 'I build things for the web. Focused on creating clean, functional, and user-friendly experiences with modern web technologies.',
  email: 'komal@example.com',
  skills: [
    { name: 'HTML', icon: '\uD83C\uDFD7\uFE0F', desc: 'Semantic markup' },
    { name: 'CSS', icon: '\uD83C\uDFA8', desc: 'Responsive layouts' },
    { name: 'JavaScript', icon: '\u26A1', desc: 'Interactive logic' },
    { name: 'Git', icon: '\uD83D\uDD00', desc: 'Version control' },
    { name: 'APIs', icon: '\uD83D\uDD17', desc: 'Data integration' },
    { name: 'UI Design', icon: '\uD83D\uDDBC\uFE0F', desc: 'Clean interfaces' }
  ]
};

function getProjects() {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(DEFAULT_PROJECTS));
  return DEFAULT_PROJECTS;
}

function getProfile() {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
  return DEFAULT_PROFILE;
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollAnimations();
  initContactForm();
  loadHero();
  loadAbout();
  loadProjects();
  updateAuthUI();
});

function initTheme() {
  const saved = localStorage.getItem('portfolio_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio_theme', next);
    updateThemeIcon();
  });

  updateThemeIcon();
}

function updateThemeIcon() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  toggle.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
}

function initNavigation() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
    if (window.scrollY > 50) nav.classList.add('scrolled');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');
  if (sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.nav-links a').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  }
}

function initScrollAnimations() {
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var revealObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(function(el) { revealObs.observe(el); });
  }

  var sections = document.querySelectorAll('.section');
  if (sections.length) {
    var sectionObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.05 });
    sections.forEach(function(el) { sectionObs.observe(el); });
  }
}

function loadHero() {
  const profile = getProfile();
  const nameEl = document.getElementById('hero-name');
  const roleEl = document.getElementById('hero-role');
  const bioEl = document.getElementById('hero-bio');

  if (nameEl) nameEl.textContent = profile.name;
  if (roleEl) roleEl.textContent = profile.role;
  if (bioEl) bioEl.textContent = profile.bio;
}

function loadAbout() {
  const profile = getProfile();
  const bioEl = document.getElementById('about-bio');
  const skillsEl = document.getElementById('skills-grid');

  if (bioEl) {
    bioEl.innerHTML = `
      <p>${profile.bio}</p>
      <p>I specialize in building responsive, accessible websites using
      <span class="highlight">HTML</span>, <span class="highlight">CSS</span>, and
      <span class="highlight">JavaScript</span>. Always learning, always building.</p>
    `;
  }

  if (skillsEl) {
    skillsEl.innerHTML = profile.skills.map(skill => `
      <div class="skill-card reveal">
        <div class="skill-card-visual">${skill.icon}</div>
        <div class="skill-card-info">
          <h4>${skill.name}</h4>
          <p>${skill.desc}</p>
        </div>
      </div>
    `).join('');

    setTimeout(initScrollAnimations, 50);
  }
}

function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const projects = getProjects();
  if (!projects.length) {
    grid.innerHTML = '<div class="empty-state"><p>No projects yet</p></div>';
    return;
  }

  grid.innerHTML = projects.map((project, i) => `
    <div class="project-card reveal reveal-delay-${i % 4 + 1}">
      <div class="project-card-img">${project.icon || '\uD83D\uDCBB'}</div>
      <div class="project-card-body">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  setTimeout(initScrollAnimations, 50);
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const fields = ['name', 'email', 'message'];
    fields.forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      const error = input.parentElement.querySelector('.form-error');
      if (!input.value.trim()) {
        input.classList.add('error');
        if (error) { error.textContent = 'This field is required'; error.classList.add('visible'); }
        valid = false;
      } else {
        input.classList.remove('error');
        if (error) error.classList.remove('visible');
      }
    });

    const emailInput = form.querySelector('[name="email"]');
    if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.classList.add('error');
      const error = emailInput.parentElement.querySelector('.form-error');
      if (error) { error.textContent = 'Please enter a valid email'; error.classList.add('visible'); }
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.querySelector('[name="name"]').value.trim(),
          email: form.querySelector('[name="email"]').value.trim(),
          message: form.querySelector('[name="message"]').value.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      form.reset();
      const success = document.getElementById('contact-success');
      if (success) {
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 4000);
      }
    } catch (err) {
      const success = document.getElementById('contact-success');
      if (success) {
        success.textContent = err.message;
        success.classList.add('visible', 'error');
        setTimeout(() => {
          success.classList.remove('visible', 'error');
          success.textContent = 'Message sent - thanks for reaching out!';
        }, 4000);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

function updateAuthUI() {
  const authBtn = document.getElementById('auth-btn');
  if (!authBtn) return;

  if (Auth.isAuthenticated()) {
    authBtn.textContent = 'Dashboard';
    authBtn.href = 'dashboard.html';
  } else {
    authBtn.textContent = 'Login';
    authBtn.href = 'login.html';
  }
}
