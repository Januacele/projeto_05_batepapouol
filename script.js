let names = [];

//Carregar os nomes existentes dentro da API
function getName(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    
    console.log(promise);
    promise.then(Vernomes);

}
addName();

//Verifiquei se a função está correta, vendo no console
function Vernomes(response){
    console.log(response.data)
}

//Pergunto o nome do usuário com o prompt 
function addName(){
    const name = prompt("digite seu nome de usuário: ");
    const newName ={
        name : name
    };

    const promise = axios.post("ttps://mock-api.driven.com.br/api/v6/uol/participants", newName);

    promise.then(getName);
    promise.catch(TratarErro);
}



//Para entrar na sala envia a requisição para esse link com um objeto no fhormato {name:""}





function carregarDados(response){
    names = response.data;
    entrarnaSala();
}

function TratarErro(error){
    console.log(error.response);
    if (error.response.status === 409){
        alert ("Esse usuário já existe!");
    }

}

//Para manter a conexão envia a requisição para esse link com um objeto no formato {name:""} e deve ser feita a cada 5s
//const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status");



//Para buscar mensagens do servidor envia a requisição para esse link. A resposta será um array de objetos
//const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
/*{
		from: "João",
		to: "Todos",
		text: "entra na sala...",
		type: "status",
		time: "08:01:17"
	},
    Nos objetos, o campo `type` identifica o tipo da mensagem. Existem os seguintes valores:

- `status`: mensagem de estado, como entrou ou saiu da sala
- `message`: mensagem pública
- `private_message`: mensagem particular*/

//Paraenviar mensagens envia a requisição para esse link. A resposta será um array de objetos
//const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages");

/* Nesta requisição, você deve enviar um objeto como o seguinte:
{
	from: "nome do usuário",
	to: "nome do destinatário (Todos se não for um específico)",
	text: "mensagem digitada",
	type: "message" // ou "private_message" para o bônus
} */