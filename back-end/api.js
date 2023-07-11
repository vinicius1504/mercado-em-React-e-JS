const produtos_banco_de_dados = [
  {
    id: 1,
    nome: "Batata",
    img: "https://mercadoorganico.com/6428-large_default/batata-inglesa-organica-500g-osm.jpg",
    valor: 10.42,
    estoque: 100,
  },
  {
    id: 2,
    nome: "Pera",
    img: "https://media.istockphoto.com/id/529401513/pt/foto/.jpg?s=612x612&w=0&k=20&c=DSUVrqR2bW1PFrUgtEDPoe4Yamkg6nS5W646RwWKVP8=",
    valor: 4.59,
    estoque: 230,
  },
  {
    id: 3,
    nome: "Uva",
    img: "https://mercadoterra.s3.amazonaws.com/web/media/2020/04/uva-thompson.png",
    valor: 12.1,
    estoque: 100,
  },
  {
    id: 4,
    nome: "Maça",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/280px-Red_Apple.jpg",
    valor: 9.45,
    estoque: 10,
  },
  {
    id: 5,
    nome: "Fruta do Conde",
    img: "https://static3.tcdn.com.br/img/img_prod/350075/muda_de_fruta_do_conde_com_60cm_feita_de_semente_5073_1_20220412114217.jpg",
    valor: 46.33,
    estoque: 330,
  },
  {
    id: 6,
    nome: "Amora",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Blackberries_%28Rubus_fruticosus%29.jpg/250px-Blackberries_%28Rubus_fruticosus%29.jpg",
    valor: 12.83,
    estoque: 13,
  },
  {
    id: 7,
    nome: "Kiwi",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kiwi_%28Actinidia_chinensis%29_1_Luc_Viatour.jpg/280px-Kiwi_%28Actinidia_chinensis%29_1_Luc_Viatour.jpg",
    valor: 22.52,
    estoque: 121,
  }
];

const db_fake = [
  { id: 0, user: "vinicius", password: "12345", img_user:"dsds" , role: "admin" },
  { id: 1, user: "rafael", password: "12345", role: "admin" },
  { id: 2, user: "alison", password: "12345", role: "admin" },
  { id: 3, user: "fernando", password: "12345", role: "admin" },
  { id: 4, user: "danillo", password: "12345", role: "admin" },
  { id: 5, user: "jonathan", password: "12345", role: "admin" },
  { id: 6, user: "pedro", password: "12345", role: "admin" },
  { id: 7, user: "yago", password: "12345", role: "admin" },
  { id: 8, user: "eliz", password: "12345", role: "admin" },
  { id: 9, user: "vinicius_leite", password: "12345", role: "admin" },
  { id: 10, user: "maria", password: "12345", role: "admin" },
];

function insertItem(item) {
  produtos_banco_de_dados.push(item);
}

function updateItem(id, updatedItem) {
  const index = produtos_banco_de_dados.findIndex((item) => item.id === id);
  if (index !== -1) {
    produtos_banco_de_dados[index] = {
     ...updatedItem
    };
  }
  console.log(produtos_banco_de_dados)
}

function deleteItem(id) {
  const index = produtos_banco_de_dados.findIndex((item) => item.id === id);
  if (index !== -1) {
    produtos_banco_de_dados.splice(index, 1);
  }
}
//-------------------------------------------------------------------

function insertUser(item) {
  db_fake.push(item);
}

function updateUser(id, updatedUser) {
  const index = db_fake.findIndex((item) => item.id === id);
  if (index !== -1) {
    db_fake[index] = {
     ...updatedUser
    };
  }
}
function deleteUser(id) {
  const index = db_fake.findIndex((item) => item.id === id);
  if (index !== -1) {
    db_fake.splice(index, 1);
  }
}
const jwt = require("jsonwebtoken");
const secretKey = "suaChaveSecreta";
var express = require("express");
var cors = require("cors");
var app = express();
const port = 8080;
app.use(cors());
app.use(express.json());
let id = produtos_banco_de_dados.length + 1;

let id_user = db_fake.length + 1;

app.get("/", (req, res) => {
  res
    .status(200)
    .jsonp("API da Turma de Front-End do SENAC Academy HUB Campo Grande - MS!");
});

app.post("/login", (req, res) => {
  const { user, password } = req.body;
  const isUser = db_fake.find(
    (data) => data.user === user && data.password === password
  );
  if (isUser) {
    const token = jwt.sign({ isUser }, secretKey);
    res.status(200).jsonp({ login: true, role: isUser.role, token: token });
  } else {
    res.status(404).jsonp({ login: false });
  }
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" });
    }
    req.user = decoded.user;
    next();
  });
}

app.get("/produtos",verifyToken, (req, res) => {
  res.status(200).jsonp(produtos_banco_de_dados);
});

app.post("/produtos", verifyToken, (req, res) => {
  var newItem = req.body;
  newItem.id = id;
  insertItem(newItem);
  id += 1;
  res.status(200).jsonp(newItem);
});

app.put("/produtos/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const updatedItem = req.body;
  updateItem(id, updatedItem);
  res.status(200).jsonp(updatedItem);
});

app.delete("/produtos/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  deleteItem(id);
  res.status(200).jsonp(id);
});

// ---------------------- user ----------------------------------
app.get("/user",verifyToken, (req, res) => {
  res.status(200).jsonp(db_fake);
});

app.get("/user/:id",verifyToken, (req, res) => {
  const user =  db_fake.find(data => data.id ===req.params.id);
  if(user!=-1){
    res.status(200).jsonp(user);
  }else{
    res.status(404);
  }
});

app.post("/user", verifyToken, (req, res) => {
  var newUser = req.body;
  newUser.id = id_user;
  insertUser(newUser);
  id_user += 1;
  res.status(200).jsonp(newUser);
});

app.put("/user/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;
  updateUser(id, updatedUser);
  res.status(200).jsonp(updatedUser);
});

app.delete("/user/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  deleteUser(id);
  res.status(200).jsonp(id);
});

app.listen(port, "0.0.0.0", verifyToken, () => {
  console.log(`Example app listening on port ${port}`);
});
