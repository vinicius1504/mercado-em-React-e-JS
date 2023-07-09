import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import "../css/style.css";
const url_api = "https://unified-booster-392006.uc.r.appspot.com"
// const url_api ="http://localhost:8080"

async function deleteGenericJson(id, prefix) {
  const response = await fetch(`${url_api}/${prefix}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "authorization": localStorage.getItem("token")
    },
    method: 'DELETE'
  });

  return await response.json();
}


async function postGenericJson(data, prefix) {
  const response = await fetch(`${url_api}/${prefix}`, {
    headers: {
      "Content-Type": "application/json",
      "authorization": localStorage.getItem("token")
    }, method: 'post', body: JSON.stringify(data)

  })
  return await response.json()
}
async function getProdutos() {
  const response = await fetch(`${url_api}/produtos`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}

export default function Mercado() {
  const { register, handleSubmit, getValues } = useForm();
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [info, setInf] = useState({
    total: 0,
    desconto: 0,
    produtos: 0,
    produtos_dif: 0,
  });
  function adicionarProdutoAoCarrinho(produto) {
    let isContem = false
    carrinho.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque += 1;
        produto.estoque -= 1;
        isContem = true;
      }
    });
    if (!isContem) {
      let new_produto = { ...produto, estoque: 1 };
      produto.estoque -= 1;
      carrinho.push(new_produto);
    }
    atualizaDashboard("+", produto, carrinho);
  }
  function removeProdutoDoCarrinho(produto) {
    produtos.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque += 1;
        produto.estoque -= 1;
      }
    });
    let newCarrinhoSemProduto = carrinho.filter((item) => item.estoque !== 0);
    atualizaDashboard("-", produto, newCarrinhoSemProduto);
  }
  function removeTudoDoCarrinho() {
    carrinho.forEach((itemCarrinho) => {
      const produto =
        produtos.find
          ((itemProduto) => itemProduto.id === itemCarrinho.id);
      produto.estoque += itemCarrinho.estoque;
    });
    setCarrinho([])
    info.total = 0
    info.desconto = 0
    info.produtos = 0
    info.produtos_dif = 0

  };
  function atualizaDashboard(operador, produto, carrinho) {
    setCarrinho([...carrinho]);
    info.produtos_dif = carrinho.length;
    if (operador === "+") {
      info.total = produto.valor + info.total;
      info.produtos += 1;
    } else if (operador === "-") {
      info.total = info.total - produto.valor;
      info.produtos -= 1;
    }
    if (info.produtos < 1) {
      info.total = 0
    }
    atualizaDesconto();

  }
  function atualizaDesconto() {
    if (info.produtos_dif >= 3 && info.produtos_dif < 5) {
      info.desconto = info.total * 0.1;
    } else if (info.produtos_dif >= 5) {
      info.desconto = info.total * 0.2;
    } else {
      info.desconto = 0;
    }
    setInf({ ...info });
  }
  useEffect(() => {
    getProdutos().then((data) => {
      setProdutos(data);
    });
  }, []);

  function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
  async function onSubmit() {
    const data = getValues();
    data.valor = parseFloat(data.valor);
    console.log(getValues(data.id))

    await postGenericJson(data, "produtos")
      .then(data => {
        console.log('Return:', data);
        produtos.push(data); setProdutos([...produtos])
      });
  };

  function Deslogar() {                                                                                                                                                                  
    localStorage.clear();
    window.location.reload(true);
  }

  async function removerProduto(produto) {    
    Swal.fire({
    title: 'Confirmar remoção',
    text: 'Tem certeza que deseja remover este produto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não',
  }).then(async (result) => {
    if(result.isConfirmed){
    const response = await deleteGenericJson(produto.id, "produtos")
    .then(data => {
      const updatedProdutos = produtos.filter(item => item.id !== produto.id);
      setProdutos(updatedProdutos);
      console.log('Produto removido com sucesso:', data);
    })}})
  }

  
  const toggleExibirFormulario = () => {
    setExibirFormulario(!exibirFormulario);
  };


  return (
    <>
      <div className="topo">
        <div className="title">
          <h1>Mercadinho Tendi Tudo</h1>
        </div>
        <div className="login">
          <a>{localStorage.getItem("user")}</a>
          <a onClick={Deslogar}>Sair</a>
        </div>
      </div>
      <div className="pages">
        <div className="produtos">
          {produtos.map((produto) => (
            <div key={produto.id} className="card">
              <div className="cartao">
                <div className="cartao_top">
                  <p>{produto.nome}</p>
                </div>
                <div className="cartao_main">
                  <img src={produto.img} alt="" />
                </div>
                <div className="cartao_valor">
                  <p>R$: {produto.valor}</p>
                </div>
                <div className="cartao_estoque">
                  <p>Disponivel: {produto.estoque}</p>
                </div>
                <div className="cartao_botao">
                  <button className="cadbnt" onClick={() => adicionarProdutoAoCarrinho(produto)}>
                    Comprar
                  </button>
                  <div className="cartao_botao">
                    <button className="cadbnt" onClick={() => removerProduto(produto)}>
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="carrinho_page">
          <div className="carrinho_top_inf">
            <table>
              <tbody>
                <tr>
                  <td>Total R$:</td>
                  <td>
                    <span>{formatarValor(info.total)}</span>
                  </td>
                </tr>
                <tr>
                  <td>Desconto R$:</td>
                  <td>
                    <span>{formatarValor(info.desconto)}</span>
                  </td>
                </tr>
                <tr>
                  <td>Produtos Qtd:</td>
                  <td>
                    <span>{info.produtos}</span>
                  </td>
                </tr>
                <tr>
                  <td>Produtos Diferentes:</td>
                  <td>
                    <span>{info.produtos_dif}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="carrinho">
            {carrinho.map((produto) => (
              <div key={produto.id} className="card">
                <div className="cartao">
                  <div className="cartao_top">
                    <p>{produto.nome}</p>
                  </div>
                  <div className="cartao_main">
                    <img src={produto.img} alt="" />
                  </div>
                  <div className="cartao_valor">
                    <p>R$:{produto.valor}</p>
                  </div>
                  <div className="cartao_estoque">
                    <p>Quantidade: {produto.estoque}</p>
                  </div>
                  <div className="cartao_botao">
                    <button className="cadbnt" onClick={() => removeProdutoDoCarrinho(produto)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bnts_carrinho">
            <button onClick={removeTudoDoCarrinho} className="cadbnt">Limpar</button>
            <button className="cadbnt">Finalizar Conta</button>
            <button  className="cadbnt" onClick={toggleExibirFormulario}> 
            {exibirFormulario ? 
            "Ocultar Formulário" 
            : 
            "Exibir Formulário"}
            </button>
          </div>
          {exibirFormulario && (
            <div className="cadastro">
              <h2>Cadastro de Produtos</h2>
              <form method="post" onSubmit={    handleSubmit(onSubmit)}>
                <div className="inputs">
                  <div>
                    <label>
                      <input type="text" placeholder="Nome do Produto" {...register("nome")} required />
                    </label>
                    <label>
                      <input type="text" placeholder="Imagem do produto" {...register("img")} required />
                    </label>
                  </div>
                  <div>
                    <label>
                      <input type="number" placeholder="Quantidade do estoque" {...register("estoque")} required />
                    </label>
                    <label>
                      <input type="text" placeholder="Valor do produto" {...register("valor")} required />
                    </label>
                  </div>
                </div>
                <div className="btncad">
                  <button className="cadbnt" type="submit">Cadastrar</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div >


    </>
  )


}

