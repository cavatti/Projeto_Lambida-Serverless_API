// URL base da API (substitua pelo endpoint real do API Gateway)
const API_URL = "https://SEU_ENDPOINT.execute-api.eu-east-1.amazonaws.com/prod/tasks";

// Selecionando elementos do DOM
const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const formMessage = document.getElementById("formMessage");
const tasksContainer = document.getElementById("tasksContainer");

// Função para listar todas as tasks
async function fetchTasks() {
  tasksContainer.innerHTML = "Carregando...";
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    tasksContainer.innerHTML = "";

    if (!data || data.length === 0) {
      tasksContainer.innerHTML = "<p>Nenhuma task encontrada.</p>";
      return;
    }

    data.forEach(task => {
      const taskCard = document.createElement("div");
      taskCard.className = "task-card";

      taskCard.innerHTML = `
        <div class="task-info">
          <div class="task-title">${task.title}</div>
          <div class="task-description">${task.description}</div>
        </div>
        <div class="task-actions">
          <button onclick="deleteTask('${task.id}')">Remover</button>
        </div>
      `;

      tasksContainer.appendChild(taskCard);
    });
  } catch (error) {
    tasksContainer.innerHTML = "<p>Erro ao carregar tasks.</p>";
    console.error(error);
  }
}

// Função para criar nova task
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newTask = {
    title: titleInput.value,
    description: descriptionInput.value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    });

    const data = await res.json();

    formMessage.textContent = "Task criada com sucesso!";
    formMessage.style.color = "green";

    // Limpar formulário
    titleInput.value = "";
    descriptionInput.value = "";

    // Atualizar lista
    fetchTasks();
  } catch (error) {
    formMessage.textContent = "Erro ao criar task.";
    formMessage.style.color = "red";
    console.error(error);
  }
});

// Função para deletar task
async function deleteTask(id) {
  if (!confirm("Deseja realmente remover esta task?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  } catch (error) {
    alert("Erro ao remover task.");
    console.error(error);
  }
}

// Inicializar lista de tasks
fetchTasks();
