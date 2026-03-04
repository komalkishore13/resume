document.addEventListener('DOMContentLoaded', () => {
  if (!Auth.requireAuth()) return;

  initDashTheme();
  initDashSidebar();
  loadDashProfile();
  loadDashProjects();
  initProjectModal();
  initExportImport();
  initDashNav();

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.logout();
      window.location.href = 'index.html';
    });
  }
});

function initDashTheme() {
  const saved = localStorage.getItem('portfolio_theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  const toggle = document.getElementById('dash-theme-toggle');
  if (!toggle) return;

  const update = () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    toggle.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19';
  };

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('portfolio_theme', next);
    update();
  });

  update();
}

function initDashSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  const overlay = document.querySelector('.dash-overlay');

  if (!toggle || !sidebar) return;

  const close = () => {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
  };

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('visible');
  });

  if (overlay) overlay.addEventListener('click', close);
}

function initDashNav() {
  const links = document.querySelectorAll('.dash-nav a[data-section]');
  const sections = document.querySelectorAll('.dash-content-section');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.section;

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      sections.forEach(s => {
        s.style.display = s.id === target ? 'block' : 'none';
      });

      const sidebar = document.querySelector('.dash-sidebar');
      const overlay = document.querySelector('.dash-overlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
    });
  });
}

function loadDashProfile() {
  const profile = getProfile();
  const user = Auth.getCurrentUser();

  const form = document.getElementById('profile-form');
  if (!form) return;

  form.querySelector('[name="name"]').value = profile.name;
  form.querySelector('[name="role"]').value = profile.role;
  form.querySelector('[name="bio"]').value = profile.bio;
  form.querySelector('[name="email"]').value = user ? user.email : profile.email;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = {
      name: form.querySelector('[name="name"]').value.trim(),
      role: form.querySelector('[name="role"]').value.trim(),
      bio: form.querySelector('[name="bio"]').value.trim(),
      email: form.querySelector('[name="email"]').value.trim()
    };

    const current = getProfile();
    Object.assign(current, updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(current));

    showToast('Profile updated', 'success');
  });
}

function loadDashProjects() {
  const list = document.getElementById('project-list');
  if (!list) return;

  const projects = getProjects();

  if (!projects.length) {
    list.innerHTML = '<div class="empty-state"><p>No projects yet - add your first one</p></div>';
    return;
  }

  list.innerHTML = projects.map(project => `
    <div class="project-list-item" draggable="true" data-id="${project.id}">
      <span class="drag-handle">\u2630</span>
      <div class="project-info">
        <h4>${project.title}</h4>
        <p>${project.description}</p>
      </div>
      <div class="project-actions">
        <button class="btn btn-sm btn-danger" onclick="deleteProject('${project.id}')">Delete</button>
      </div>
    </div>
  `).join('');

  initDragDrop();
}

function initDragDrop() {
  const list = document.getElementById('project-list');
  if (!list) return;

  let dragItem = null;

  list.addEventListener('dragstart', (e) => {
    dragItem = e.target.closest('.project-list-item');
    if (!dragItem) return;
    dragItem.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  list.addEventListener('dragend', () => {
    if (dragItem) dragItem.classList.remove('dragging');
    dragItem = null;
  });

  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const afterElement = getDragAfterElement(list, e.clientY);
    const dragging = list.querySelector('.dragging');
    if (!dragging) return;

    if (afterElement) {
      list.insertBefore(dragging, afterElement);
    } else {
      list.appendChild(dragging);
    }
  });

  list.addEventListener('drop', (e) => {
    e.preventDefault();
    saveProjectOrder();
    showToast('Project order updated', 'info');
  });
}

function getDragAfterElement(container, y) {
  const items = [...container.querySelectorAll('.project-list-item:not(.dragging)')];

  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveProjectOrder() {
  const list = document.getElementById('project-list');
  const items = list.querySelectorAll('.project-list-item');
  const projects = getProjects();
  const ordered = [];

  items.forEach(item => {
    const project = projects.find(p => p.id === item.dataset.id);
    if (project) ordered.push(project);
  });

  localStorage.setItem(PROJECTS_KEY, JSON.stringify(ordered));
}

function deleteProject(id) {
  if (!confirm('Delete this project?')) return;
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  loadDashProjects();
  showToast('Project deleted', 'success');
}

function initProjectModal() {
  const addBtn = document.getElementById('add-project-btn');
  const overlay = document.getElementById('project-modal');
  const form = document.getElementById('add-project-form');
  const cancelBtn = document.getElementById('cancel-modal');

  if (!addBtn || !overlay) return;

  addBtn.addEventListener('click', () => overlay.classList.add('visible'));

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      overlay.classList.remove('visible');
      if (form) form.reset();
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('visible');
      if (form) form.reset();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = form.querySelector('[name="title"]').value.trim();
      const description = form.querySelector('[name="description"]').value.trim();
      const tags = form.querySelector('[name="tags"]').value.trim();
      const icon = form.querySelector('[name="icon"]').value.trim() || '\uD83D\uDCBB';

      if (!title || !description) {
        showToast('Title and description are required', 'error');
        return;
      }

      const projects = getProjects();
      projects.push({
        id: 'p' + Date.now().toString(36),
        title,
        description,
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        link: '#',
        icon
      });

      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      overlay.classList.remove('visible');
      form.reset();
      loadDashProjects();
      showToast('Project added', 'success');
    });
  }
}

function initExportImport() {
  const exportBtn = document.getElementById('export-btn');
  const importInput = document.getElementById('import-input');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = {
        profile: getProfile(),
        projects: getProjects(),
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-backup.json';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Data exported', 'success');
    });
  }

  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);

          if (data.profile) {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
            loadDashProfile();
          }
          if (data.projects) {
            localStorage.setItem(PROJECTS_KEY, JSON.stringify(data.projects));
            loadDashProjects();
          }

          showToast('Data imported', 'success');
        } catch {
          showToast('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
      importInput.value = '';
    });
  }
}

function showToast(message, type) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'info');
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

