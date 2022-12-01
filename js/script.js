const UOL_API = "https://mock-api.driven.com.br/api/v6/uol";
const TEMPOATUALIZACAOCONEXAO = 50000;
const TEMPOOBTERMENSAGENS = 3000;
let usuario = null;

function login() {
    document.querySelector('.container').classList.remove('escondido');
    document.querySelector('.container-entrada').classList.add('escondido');
    let nome = document.querySelector('.entrar');
    usuario = { name: nome.value };
    const promise = axios.post(
        `${UOL_API}/participants`, usuario
    );
    promise.then(() => {
      obterMensagens();
      setInterval(obterMensagens, TEMPOOBTERMENSAGENS);
      setInterval(manterUsuarioConectado, TEMPOATUALIZACAOCONEXAO);
    });
    promise.catch(erro => login());

    return usuario;
}


function obterMensagens() {
    const promise = axios.get(`${UOL_API}/messages`);
    promise.then(resposta => {
      console.log(resposta.data);
      renderizarMensagens(resposta.data);
      focarNaUltimaMensagem();
    });
    promise.catch( erro => {
      console.error(erro.response);
      alert("Não recebeu as mensagens");
    })
}

function renderizarMensagens(mensagens) {
    const ul = document.querySelector("main ul");
    ul.innerHTML = "";

    mensagens.forEach(mensagem => {
        const tipo = mensagem.type;
        const remetente = mensagem.from;
        const destinatario = mensagem.to;
        const horario = mensagem.time;
        const texto = mensagem.text;

        let mensagemHTML = null;
        if(tipo === "status"){
            mensagemHTML = `
            <li class= "mensagem status">
                <span class="horario">(${horario})</span>
                <span class="pessoas"><b>${remetente}</b></span>
                <span class="texto">${texto}</span>
            </li>
            `;
        } else {
            if(tipo === "message") {
                mensagemHTML = `
                <li class="mensagem publica">
                    <span class="horario">(${horario})</span>
                    <span class="pessoas"><b>${remetente}</b> para <b>${destinatario}</b>: </span>
                    <span class="texto">${texto}</span>
                </li>
                `;
            } else {
                if(remetente === usuario || destinatario === usuario){
                    mensagemHTML = `
                    <li class="mensagem reservada">
                        <span class="horario">(${horario})</span>
                        <span class="pessoas"><b>${remetente}</b> reservadamente para <b>${destinatario}</b>: </span>
                        <span class="texto">${texto}</span>
                    </li>
                    `;
                }
            }
        }

        if(mensagemHTML !== null) {
            ul.innerHTML += mensagemHTML;
        }
    });
}

function focarNaUltimaMensagem() {
    const ul = document.querySelector("main ul");
    const ultimaMensagem = ul.lastElementChild;
    ultimaMensagem.scrollIntoView();
}

function enviarMensagem() {
  let nome = document.querySelector('.entrar');
  usuario = { name: nome.value };
  const input = document.querySelector("footer input");
  mensagem = input.value;
  const promise = axios.post(`${UOL_API}/messages`, {
    from: usuario.name,
    to: "Todos",
    text: mensagem,
    type: "message"
  });

  promise.then(function(response){
    console.log("Mensagem enviada com sucesso!");
  });
  promise.catch(function (erro) {
    alert("A mensagem não foi enviada!");
  });

  input.value = "";
  
}

function manterUsuarioConectado() {
    const promise = axios.post(`${UOL_API}/status`, { name: usuario.nome });
    promise.then(resposta => console.info("Usuário continua ativo"));
    promise.catch(erro => {
      console.error(erro.response);
      alert("Ops! Parece que você caiu! (ou foi kickado...)");
      window.location.reload();
    })
}

function menu() {
  document.querySelector('.menu').classList.remove('escondido');
}