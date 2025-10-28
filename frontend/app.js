// app.js — versão corrigida (sem enviar Access-Control-Allow-Origin nos requests)
const API_BASE = "https://s7t9osqh58.execute-api.us-west-2.amazonaws.com/prod";
const API_TASKS = `${API_BASE}/tasks`;

const form = document.getElementById("taskForm");
const formMessage = document.getElementById("formMessage");
const tasksContainer = document.getElementById("tasksContainer");

// Util helpers
function showMessage(el, msg, isError = false) {
  el.textContent = msg;
  el.style.color = isError ? "#c0392b" : "#2d862d";
  setTimeout(() => { el.textContent = ""; }, 4000);
}

async function fetchTasks() {
  tasksContainer.innerHTML = "<p>Carregando...</p>";
  try {
    const res = await fetch(API_TASKS, {
      method: "GET",
      mode: "cors",
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);

    // Alguns setups do API Gateway retornam { body: "JSON-string" } ou texto —
    // tentamos interpretar robustamente:
    const text = await res.text();
    let tasks;
    try {
      tasks = JSON.parse(text);
      // se o retorno tiver body -> extrair
      if (tasks && typeof tasks === "object" && tasks.body) {
        try {
          tasks = JSON.parse(tasks.body);
        } catch (e) {
          // body já pode ser array/objeto
          if (Array.isArray(tasks.body)) tasks = tasks.body;
        }
      }
    } catch (e) {
      // não era JSON — tentar como array direto
      tasks = text;
    }

    if (!Array.isArray(tasks)) {
      tasksContainer.innerHTML = "<p>Resposta inesperada do servidor.</p>";
      console.warn("Resposta GET inesperada:", tasks);
      return;
    }

    renderTasks(tasks);
  } catch (err) {
    console.error(err);
    tasksContainer.innerHTML = `<p>Erro ao carregar tasks: ${err.message}</p>`;
  }
}

function renderTasks(tasks) {
  if (!tasks || tasks.length === 0) {
    tasksContainer.innerHTML = "<p>Nenhuma task encontrada.</p>";
    return;
  }

  tasksContainer.innerHTML = "";
  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";

    const info = document.createElement("div");
    info.className = "task-info";

    const titleEl = document.createElement("div");
    titleEl.className = "task-title";
    titleEl.textContent = task.title || "(sem título)";

    const descEl = document.createElement("div");
    descEl.className = "task-description";
    descEl.textContent = task.description || "";

    info.appendChild(titleEl);
    info.appendChild(descEl);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.textContent = "✏️";
    btnEdit.title = "Atualizar";
    btnEdit.style.backgroundColor = "#f0ad4e";
    btnEdit.style.marginRight = "8px";
    btnEdit.addEventListener("click", () => onEditTask(task));

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.textContent = "🗑️";
    btnDelete.title = "Excluir";
    btnDelete.style.backgroundColor = "#e74c3c";
    btnDelete.addEventListener("click", () => onDeleteTask(task.id));

    actions.appendChild(btnEdit);
    actions.appendChild(btnDelete);

    card.appendChild(info);
    card.appendChild(actions);

    tasksContainer.appendChild(card);
  });
}

// Create
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title || !description) {
    showMessage(formMessage, "Preencha título e descrição.", true);
    return;
  }

  form.querySelector("button[type=submit]").disabled = true;
  showMessage(formMessage, "Criando...");

  try {
    const res = await fetch(API_TASKS, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ title, description })
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${text}`);
    }
    showMessage(formMessage, "Task criada com sucesso!");
    form.reset();
    fetchTasks();
  } catch (err) {
    console.error("POST error:", err);
    showMessage(formMessage, "Erro ao criar task.", true);
  } finally {
    form.querySelector("button[type=submit]").disabled = false;
  }
});

// Edit handler (usa prompts simples)
async function onEditTask(task) {
  const novoTitulo = prompt("Novo título:", task.title || "");
  if (novoTitulo === null) return; // cancelou
  const novaDesc = prompt("Nova descrição:", task.description || "");
  if (novaDesc === null) return;

  try {
    const res = await fetch(`${API_TASKS}/${encodeURIComponent(task.id)}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ title: novoTitulo, description: novaDesc })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`${res.status} ${txt}`);
    }
    showMessage(formMessage, "Task atualizada!");
    fetchTasks();
  } catch (err) {
    console.error("PUT error:", err);
    showMessage(formMessage, "Erro ao atualizar task.", true);
  }
}

// Delete handler
async function onDeleteTask(id) {
  if (!confirm("Confirma exclusão desta task?")) return;

  try {
    const res = await fetch(`${API_TASKS}/${encodeURIComponent(id)}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`${res.status} ${txt}`);
    }
    showMessage(formMessage, "Task excluída!");
    fetchTasks();
  } catch (err) {
    console.error("DELETE error:", err);
    showMessage(formMessage, "Erro ao excluir task.", true);
  }
}

// Inicializa
window.addEventListener("load", fetchTasks);