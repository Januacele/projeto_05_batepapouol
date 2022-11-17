const UOL_API = "https://mock-api.driven.com.br/api/v6/uol";
const TEMPOATUALIZACAOCONEXAO = 5000;
const TEMPOOBTERMENSAGENS = 3000;
let usuario = null;


function obterNomeUsuario(){
    usuario = prompt("digite seu nome de usuário: ");
    const promise = axios.post(`${UOL_API}/participants`, { name: usuario });

    promise.then(() => {
        obterMensagens();
        setInterval(obterMensagens, TEMPOOBTERMENSAGENS);
        setInterval(manterUsuarioConectado, TEMPOATUALIZACAOCONEXAO);
    });
    promise.catch(erro => obterNomeUsuario());
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
    const input = document.querySelector("footer input");
    const mensagem = input.value;
    const promise = axios.post(`${UOL_API}/messages`, {
      from: usuario,
      to: "Todos",
      text: mensagem,
      type: "message"
    });
  
    promise.then(resposta => {
        console.log(resposta.data);
    });
    promise.catch(erro => {
      console.error("Deu ruim na hora de enviar mensagem!");
      alert("A mensagem não foi enviada!");
      window.location.reload();
    });
  
    input.value = "";
    
  }