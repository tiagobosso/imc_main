const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path"); //cuida dos caminhos do seu arquivo, para ele ser achado independente de onde esteja salvo
const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const clientesFile = path.join(__dirname, "clientes.json");
function salvarClientes(clientes){
    fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2),"utf-8")
}

function lerClientes(){//ver se o clientes que o front está mandando já existe no sistema
    if (!fs.existsSync(clientesFile)){// fs biblioteca, existtsSync é uma função da biblioteca para ver se o arquivo já existe
        return[];//retorna um array vazio
    }
    const data = fs.readFileSync(clientesFile, 'utf-8');//vai ler o arquivo e escrever ele dentro de dados com acentos e etc
    try{
        return JSON.parse(data) || []; // a função parse transforma a string em json e o || faz com que se na hora de transformar o dados dar erro, ele retorna um array vazio
    }
    catch(e){
        return [];// caso der erro ele retorna um array vazio
    }
}

app.post("/clientes", (req, res) =>{
    const { nome, cpf, cep, rua, cidade, estado, numero } = req.body;
    if (!nome || !cpf || !cep){
        return res.status(404).json({erro: "dados incompletos"})
    }
    const clientes = lerClientes(); //todos os clientes serão armazenados na constante clientes
    if (clientes.some(c=>c.cpf===cpf)){ //o c funciona como uma variavel de posição, que vai tomar cada posição de linha da const clientes e verificar se é igual ao cpf que está vindo
        return res.status(404).json({erro: "Clientes já cadastrado"})
    }
    const novoCliente = {nome, cpf, cep, rua, cidade, estado, numero};//se o cliente for novo, ele será salvo na cost novoCliente
    console.log('nnovoCLiente')
    console.log(novoCliente);
    console.log('clientes')
    console.log(clientes);
    clientes.push(novoCliente);// a função push vai salvar todos os dados dentro da const clientes sem excluir os clientes já cadastrados anteriormente, formando uma lista com os clienes antigos mais o novo
    salvarClientes(clientes)//vai salvar clientes dentro da função salvaClientes
    console.log('clientesSlavo')
    console.log(clientes)
    return res.status(201).json({mensagem: "cliente cadastrado com sucesso"})
})

/*
==================
USUARIO ENDPOINTS
==================
*/

const usuariosFile = path.join(__dirname, "usuarios.json");
function salvarUsuarios(usuarios){
    fs.writeFileSync(usuariosFile, JSON.stringify(usuarios, null, 2),"utf-8")
}

function lerUsuarios(){//ver se o usuario que o front está mandando já existe no sistema
    if (!fs.existsSync(usuariosFile)){// fs biblioteca, existtsSync é uma função da biblioteca para ver se o arquivo já existe
        return[];//retorna um array vazio
    }
    const data = fs.readFileSync(usuariosFile, 'utf-8');//vai ler o arquivo e escrever ele dentro de dados com acentos e etc
    try{
        return JSON.parse(data) || []; // a função parse transforma a string em json e o || faz com que se na hora de transformar o dados dar erro, ele retorna um array vazio
    }
    catch(e){
        return [];// caso der erro ele retorna um arry vazio
    }
}

app.post("/usuarios", (req, res) =>{
    const { nome, email, senha } = req.body;


    if (!nome || !email || !senha){
        return res.status(404).json({erro: "dados incompletos"})
    }
    const usuarios = lerUsuarios(); //todos os usuarios serão armazenados na constante usuarios
    if (usuarios.some(u=>u.email===email && u.senha===senha)){ //o 'u' funciona como uma variavel de posição, que vai tomar cada posição de linha da const usuarios e verificar se é igual ao cpf que está vindo
        return res.status(404).json({erro: "usuarios já cadastrado"})
    }
    const novoUsuario = {nome, email, senha};//se o usuario for novo, ele será salvo na cost novoUsuario
    usuarios.push(novoUsuario);// a função push vai salvar todos os dados dentro da const usuarios sem excluir os usuarios já cadastrados anteriormente, formando uma lista com os usuarios antigos mais o novo
    salvarUsuarios(usuarios)//vai salvar clientes dentro da função salvarUsuarios
    return res.status(201).json({mensagem: "usuario cadastrado com sucesso", token:"1234"})
})

//http://localhost:3000/saudacao?nome=maria
app.get("/saudacao", (req, res) => {
    const nome = req.query.nome;
    if (!nome) {
        return res.status(404).json(
            {
                erro: "nome não informado"
            }
        )
    }
    res.json(
        {
            mensagem: `saudação ${nome}!`
        }
    )
})
app.post("/imc", (req, res) => {
    const { nome, idade, altura, peso } = req.body;

    if (!nome || !idade || !altura || !peso) {
        return res.status(404).json({ erro: "dados imcompletos" })
    }
    const imc = peso / (altura * altura);
    res.json({
        nome,
        idade,
        imc: imc.toFixed(2)
    })
})
app.post("/media", (req, res) => {
    const { nota1, nota2 } = req.body;

    if (!nota1 || !nota2) {
        return res.status(404).json({ erro: "dados incompletos" })
    }
    const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;

    res.json({
        mensagem: media >= 7 ? "aprovado" : "reprovado",
        media: parseFloat(media)
    })

})

// POST http://localhost3000/login
app.post("/login", (req, res) => {
    const { user, senha } = req.body; // 'user' é o e-mail no front-end

    if (!user || !senha) {
        return res.status(404).json({ erro: "E-mail (user) e senha são obrigatórios" })
    }

    const usuarios = lerUsuarios();
    const usuario = usuarios.find(u => u.email === user);

     if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ erro: "E-mail ou senha incorretos." });
    }

    // Gera um token para a sessão
    // const token = crypto.randomUUID();
    res.json({ token, mensagem: "Login realizado com sucesso!"})
}); 
//finalzao
app.listen(port, () => {
    console.log(`servidor rodando em http://localhost:${port}`)
})