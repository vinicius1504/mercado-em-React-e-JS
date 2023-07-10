import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import "../css/style.css";
const url_api = "https://unified-booster-392006.uc.r.appspot.com"  
// const url_api = "http://localhost:8080"   

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
  const [termoPesquisa, setTermoPesquisa] = useState('');
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
    if (carrinho.length === 0) {
      let new_produto = { ...produto, estoque: 1 };
      produto.estoque -= 1;
      carrinho.push(new_produto);
      console.log(produtos)
    } else {
      let isContem = false;
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
    }

    setCarrinho([...carrinho]);
    info.total = Number((produto.valor + info.total).toFixed(2))
    info.produtos += 1
    info.produtos_dif = carrinho.length
    //verificar
    if (carrinho.length < 3 && carrinho.length < 5) {
      info.desconto = 0
    }
    if (carrinho.length === 3 && carrinho.length <= 5) {
      info.desconto = ((info.total * 0.1).toFixed(2))
      console.log(info.desconto)
    } else if (carrinho.length === 5) {
      info.desconto = ((info.total * 0.2).toFixed(2))
      console.log(info.desconto)
    }
    //verificar
    setInf(info);
  }

  function removeProdutoDoCarrinho(produto) {

    carrinho.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque -= 1;
        info.total = Number((info.total - produto.valor).toFixed(2));
        info.produtos -= 1;

        const produtoIndex = produtos.findIndex((p) => p.id === produto.id);
        if (produtoIndex !== -1) {
          const newProdutos = [...produtos];
          newProdutos[produtoIndex].estoque += 1;
          setProdutos(newProdutos);
        }
      }
    });

    if (info.total <= 0.01) {
      info.total = 0;
    }
    let newCarrinhoSemProduto = carrinho.filter((item) => item.estoque !== 0);
    info.produtos_dif = newCarrinhoSemProduto.length

    if (info.produtos_dif < 3) {
      info.desconto = 0
    }
    if (info.produtos_dif === 3 && info.produtos_dif <= 5) {
      info.desconto = ((info.total * 0.1).toFixed(2))

    } else if (info.produtos_dif >= 5) {
      info.desconto = ((info.total * 0.1).toFixed(2))

    }
    setCarrinho(newCarrinhoSemProduto);
    setInf(info);

  }

  //Limpar o carrinho
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
  function btn_finalizar() {
    Swal.fire(`Total de sua compra foi: ${(info.total - info.desconto).toFixed(2)}`)

  }

  // função para pesquisar
  useEffect(() => {
    if (termoPesquisa === '') {
      getProdutos().then((data) => {
        setProdutos(data);
      });
    } else {
      // Filtrar os produtos com base no termo de pesquisa
      const produtosFiltrados = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
      );
      setProdutos(produtosFiltrados);
    }
  }, [termoPesquisa]);


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
      if (result.isConfirmed) {
        const response = await deleteGenericJson(produto.id, "produtos")
          .then(data => {
            const updatedProdutos = produtos.filter(item => item.id !== produto.id);
            setProdutos(updatedProdutos);
            console.log('Produto removido com sucesso:', data);
          })
      }
    })
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
      <div className="meio">
        <div className="pesquisa">
          <input
            type="text"
            placeholder="Digite o nome do produto..."
            value={termoPesquisa}
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>
        <div className="meio_title">
          <h1>Meu Carrinho</h1>
        </div>
      </div>
      <div className="pages">

        <div className="produtos">
          {produtos.map((produto) => (
            <div key={produto.id} className="card">
              <div className="cartao">
                <div className="remover">
                  <a onClick={() => removerProduto(produto)}>X</a>
                </div>
                <div className="cartao_top_produos">
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
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bnts_carrinho">
            <button onClick={removeTudoDoCarrinho} className="cadbnt">Limpar</button>
            <button className="cadbnt" onClick={btn_finalizar}>Finalizar Conta</button>
            <button className="cadbnt" onClick={toggleExibirFormulario}>
              {exibirFormulario ?
                "Ocultar Formulário"
                :
                "Exibir Formulário"}
            </button>
          </div>
          {exibirFormulario && (
            <div className="cadastro">
              <h2>Cadastro de Produtos</h2>
              <form method="post" onSubmit={handleSubmit(onSubmit)}>
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

