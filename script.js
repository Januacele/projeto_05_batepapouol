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


function sucessoOnline(info){
    if (info.status === 200){
        setInterval(manterOnline,4000)
        console.log(200)
        setInterval(buscarMensagens, 3000)
        buscarMensagens();
    } 
}

//Mantém usuário online, verificando a cada 4segundos
function manterOnline(){
    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", newName);
    console.log("here");
}

 //entrarnaSala();
function buscarMensagens(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(receberMensagens);
}

//Receber Mensagens
function receberMensagens(msg){
    const ulChat = document.querySelector(".chat");
    ulChat.innerHTML = "";
    
    for (let i = 0; i<msg.data.length; i++){
        if(msg.data[i].type === "status"){
            ulChat.innerHTML +=
            `<li class="msg-status"> 
            <pre class="data"> (${msg.data[i].time}) </pre>
            <pre class=" strong"> ${msg.data[i].from} </pre>
            <pre class="msg"> ${msg.data[i].text} </pre>
            
        </li>` 
        } else {
            ulChat.innerHTML +=
            `<li class="mensagem"> 
            <pre class="data"> (${msg.data[i].time}) </pre>
            <pre class="nome strong"> ${msg.data[i].from} </pre>
            <pre> para </pre>
            <pre class="strong"> Todos </pre>
            <pre class="msg"> ${msg.data[i].text} </pre>
            
        </li>` 
        }   
    }
}

// Enviar mensagem 

function enviarMensagem(){
    const mensagemTexto = document.querySelector(".bottom > input").value;
    let sendmsg = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", {
        from: newName.name,
        to: "Todos",
        text: mensagemTexto,
        type: "message"
    });

    promise.then(buscarMensagens);
    promise.catch(TratarErro);
}

//Deixar o scrool na parte inferior enquanro recebe as mensagens
function scroolIntoView(){
    const element = document.querySelector(".chat");
    element.scrollIntoView();
}

// Tratar erro de usuário com mesmo nome
function TratarErro(error){
    console.log(error.response);
    if (error.response.status === 400){
        alert ("Esse usuário já existe!");
    }

}
