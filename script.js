const ADMIN_EMAIL = "chair@eatoncountyhsdems.org";
const ADMIN_PASSCODE = "SarahAnthony4Michigan";
const STORAGE_KEY = "echsd-state";

const clone = (data) => {
  if (typeof structuredClone === "function") {
    return structuredClone(data);
  }
  return JSON.parse(JSON.stringify(data));
};

const defaultState = {
  events: [
    {
      title: "Back-to-School Organizing Rally",
      date: "2024-09-10",
      time: "18:00",
      location: "Charlotte High School Auditorium",
      description:
        "Kick off the school year with special guest Rep. Sarah Anthony and connect with fellow student organizers.",
    },
    {
      title: "Voter Registration Pop-Up",
      date: "2024-09-21",
      time: "12:00",
      location: "Eaton Rapids Public Library",
      description:
        "Join our civic engagement team to help new voters get registered before the general election deadline.",
    },
  ],
  board: [
    {
      name: "Jalen Brooks",
      role: "Chapter Chair",
      email: "jalen.brooks@echsd.org",
      photo:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      bio: "Junior at Charlotte HS, passionate about educational equity and youth power.",
      vacant: false,
    },
    {
      name: "Maya Chen",
      role: "Political Director",
      email: "maya.chen@echsd.org",
      photo:
        "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?auto=format&fit=crop&w=400&q=80",
      bio: "Student journalist amplifying student issues at the capitol.",
      vacant: false,
    },
    {
      name: "Communications Coordinator",
      role: "Communications Coordinator",
      email: "",
      photo: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      bio: "Craft our stories, manage our socials, and keep members informed.",
      vacant: true,
    },
  ],
  applications: [
    {
      title: "Communications Coordinator Application",
      description:
        "Help lead our digital storytelling, manage social media, and elevate the voices of Eaton County students.",
      link: "https://forms.gle/example-communications",
    },
  ],
};

const state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return clone(defaultState);
    }
    const parsed = JSON.parse(raw);
    return {
      events: Array.isArray(parsed.events) ? parsed.events : clone(defaultState.events),
      board: Array.isArray(parsed.board) ? parsed.board : clone(defaultState.board),
      applications: Array.isArray(parsed.applications)
        ? parsed.applications
        : clone(defaultState.applications),
    };
  } catch (error) {
    console.error("Failed to parse stored state", error);
    return clone(defaultState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save chapter data", error);
  }
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(date);
}

function formatTime(time) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(`1970-01-01T${time}`));
  } catch (err) {
    return time;
  }
}

function renderEvents() {
  const container = document.getElementById("eventsList");
  container.innerHTML = "";

  if (!state.events.length) {
    container.innerHTML = '<p class="empty">No upcoming events yet. Check back soon!</p>';
    return;
  }

  state.events
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((event) => {
      const card = document.createElement("article");
      card.className = "card";
      card.setAttribute("role", "listitem");

      const title = document.createElement("h3");
      title.textContent = event.title;
      card.append(title);

      const time = document.createElement("p");
      time.innerHTML = `<strong>${formatDate(event.date)}</strong> · ${formatTime(event.time)}`;
      card.append(time);

      const location = document.createElement("p");
      location.innerHTML = `<strong>Where:</strong> ${event.location}`;
      card.append(location);

      const description = document.createElement("p");
      description.textContent = event.description;
      card.append(description);

      container.append(card);
    });
}

function renderBoard() {
  const container = document.getElementById("boardList");
  container.innerHTML = "";

  if (!state.board.length) {
    container.innerHTML = '<p class="empty">Leadership positions coming soon.<\/p>';
    return;
  }

  state.board.forEach((member) => {
    const card = document.createElement("article");
    card.className = `card board-card${member.vacant ? " vacant" : ""}`;
    card.setAttribute("role", "listitem");

    const photo = document.createElement("img");
    photo.src = member.photo || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";
    photo.alt = member.vacant ? `${member.role} vacancy placeholder` : `${member.name} portrait`;
    card.append(photo);

    const name = document.createElement("h3");
    name.textContent = member.vacant ? `${member.role}` : member.name;
    card.append(name);

    const role = document.createElement("p");
    role.className = "role";
    role.textContent = member.role;
    card.append(role);

    if (member.vacant) {
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "Vacant";
      card.append(badge);
    }

    if (member.bio) {
      const bio = document.createElement("p");
      bio.className = "bio";
      bio.textContent = member.bio;
      card.append(bio);
    }

    if (member.email) {
      const email = document.createElement("p");
      email.innerHTML = `<a href="mailto:${member.email}">${member.email}<\/a>`;
      card.append(email);
    }

    container.append(card);
  });
}

function renderApplications() {
  const container = document.getElementById("applicationList");
  container.innerHTML = "";

  if (!state.applications.length) {
    container.innerHTML = '<p class="empty">No applications open right now. Check back soon!<\/p>';
    return;
  }

  state.applications.forEach((opportunity) => {
    const card = document.createElement("article");
    card.className = "application-card";

    const title = document.createElement("h3");
    title.textContent = opportunity.title;
    card.append(title);

    const description = document.createElement("p");
    description.textContent = opportunity.description;
    card.append(description);

    const link = document.createElement("a");
    link.href = opportunity.link;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.innerHTML = 'Apply now <span aria-hidden="true">→<\/span>';
    card.append(link);

    container.append(card);
  });
}

function renderAdminLists() {
  const eventList = document.getElementById("adminEventList");
  eventList.innerHTML = "";
  state.events.forEach((event, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${event.title}<\/strong><small>${formatDate(event.date)} · ${formatTime(
      event.time
    )}<\/small><small>${event.location}<\/small><\/span>`;
    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("danger");
    deleteBtn.addEventListener("click", () => {
      if (confirm(`Delete event “${event.title}”?`)) {
        state.events.splice(index, 1);
        saveState();
        renderEvents();
        renderAdminLists();
      }
    });
    actions.append(deleteBtn);
    li.append(actions);
    eventList.append(li);
  });

  const boardList = document.getElementById("adminBoardList");
  boardList.innerHTML = "";
  state.board.forEach((member, index) => {
    const li = document.createElement("li");
    const status = member.vacant ? "Vacant" : member.name;
    li.innerHTML = `<span><strong>${status}<\/strong><small>${member.role}<\/small><\/span>`;
    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = member.vacant ? "Mark Filled" : "Mark Vacant";
    toggleBtn.addEventListener("click", () => {
      state.board[index].vacant = !state.board[index].vacant;
      if (state.board[index].vacant && !state.board[index].bio) {
        state.board[index].bio = "We're looking for a motivated student leader to step into this role.";
      }
      saveState();
      renderBoard();
      renderAdminLists();
    });

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("danger");
    removeBtn.addEventListener("click", () => {
      if (confirm(`Remove ${member.role}?`)) {
        state.board.splice(index, 1);
        saveState();
        renderBoard();
        renderAdminLists();
      }
    });

    actions.append(toggleBtn, removeBtn);
    li.append(actions);
    boardList.append(li);
  });

  const applicationList = document.getElementById("adminApplicationList");
  applicationList.innerHTML = "";
  state.applications.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${item.title}<\/strong><small>${item.link}<\/small><\/span>`;
    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add("danger");
    removeBtn.addEventListener("click", () => {
      if (confirm(`Remove application “${item.title}”?`)) {
        state.applications.splice(index, 1);
        saveState();
        renderApplications();
        renderAdminLists();
      }
    });

    actions.append(removeBtn);
    li.append(actions);
    applicationList.append(li);
  });
}

function setYear() {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function setUpNavigationToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("primary-menu");
  toggle?.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function showAdminPanel() {
  document.getElementById("adminPanel").hidden = false;
  renderAdminLists();
}

function hideAdminPanel() {
  document.getElementById("adminPanel").hidden = true;
}

function setupAdminControls() {
  const dialog = document.getElementById("adminDialog");
  const trigger = document.getElementById("adminTrigger");
  const cancelBtn = document.getElementById("adminCancel");
  const form = document.getElementById("adminLoginForm");
  const errorEl = document.getElementById("adminError");
  const signOutBtn = document.getElementById("adminSignOut");

  trigger?.addEventListener("click", () => {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.removeAttribute("hidden");
    }
  });

  cancelBtn?.addEventListener("click", () => {
    dialog.close();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSCODE) {
      dialog.close();
      form.reset();
      errorEl.textContent = "";
      showAdminPanel();
    } else {
      errorEl.textContent = "Incorrect email or passcode.";
    }
  });

  signOutBtn?.addEventListener("click", () => {
    hideAdminPanel();
  });
}

function setupEventForm() {
  const form = document.getElementById("eventForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newEvent = {
      title: document.getElementById("eventTitle").value.trim(),
      date: document.getElementById("eventDate").value,
      time: document.getElementById("eventTime").value,
      location: document.getElementById("eventLocation").value.trim(),
      description: document.getElementById("eventDescription").value.trim(),
    };

    state.events.push(newEvent);
    saveState();
    renderEvents();
    renderAdminLists();
    form.reset();
  });
}

function setupBoardForm() {
  const form = document.getElementById("boardForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newMember = {
      name: document.getElementById("boardName").value.trim(),
      role: document.getElementById("boardRole").value.trim(),
      email: document.getElementById("boardEmail").value.trim(),
      photo: document.getElementById("boardPhoto").value.trim(),
      bio: document.getElementById("boardBio").value.trim(),
      vacant: document.getElementById("boardVacant").checked,
    };

    if (newMember.vacant && !newMember.bio) {
      newMember.bio = "We're looking for a motivated student leader to step into this role.";
    }

    state.board.push(newMember);
    saveState();
    renderBoard();
    renderAdminLists();
    form.reset();
  });
}

function setupApplicationForm() {
  const form = document.getElementById("applicationForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const newApp = {
      title: document.getElementById("applicationTitle").value.trim(),
      description: document.getElementById("applicationDescription").value.trim(),
      link: document.getElementById("applicationLink").value.trim(),
    };

    state.applications.push(newApp);
    saveState();
    renderApplications();
    renderAdminLists();
    form.reset();
  });
}

function init() {
  setYear();
  setUpNavigationToggle();
  setupAdminControls();
  setupEventForm();
  setupBoardForm();
  setupApplicationForm();
  renderEvents();
  renderBoard();
  renderApplications();
}

document.addEventListener("DOMContentLoaded", init);
