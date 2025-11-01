const btnAgendar = document.getElementById("btnAgendar");
const resposta = document.getElementById("resposta");
const lista = document.getElementById("lista");
const btnListar = document.getElementById("btnListar");

btnAgendar.addEventListener("click", async () => {
  const nome = document.getElementById("nome").value;
  const data = document.getElementById("data").value;
  const hora = document.getElementById("hora").value;
  const servico = document.getElementById("servico").value;

  const res = await fetch("/api/agendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nomeCliente: nome, data, hora, servico }),
  });
  const json = await res.json();
  resposta.textContent = json.mensagem || json.erro;
});

btnListar.addEventListener("click", async () => {
  const res = await fetch("/api/agendamentos");
  const agendamentos = await res.json();

  lista.innerHTML = "";
  agendamentos.forEach((a) => {
    const li = document.createElement("li");
    li.textContent = `${a.nomeCliente} - ${a.data} ${a.hora} - ${a.servico} [${a.status}]`;
    lista.appendChild(li);
  });
});
