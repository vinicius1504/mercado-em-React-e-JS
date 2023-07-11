import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
// const url_api = "https://unified-booster-392006.uc.r.appspot.com" 
const url_api = "http://localhost:8080";


async function deleteuserGenericJson(id, prefix) {
    const response = await fetch(`${url_api}/${prefix}/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        method: 'DELETE'
    });

    return await response.json();
}

async function PostCadastro(data, prefix) {
    console.log(prefix)
    const response = await fetch(`${url_api}${prefix}`, {
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
        method: 'post',
        body: data
    });
    const json = await response.json();
    return json;
}

async function Getusers() {
    const response = await fetch(`${url_api}/user`, {
        headers: {
            "Content-Type": "application/json",
            "authorization": localStorage.getItem("token")
        },
    });
    const json = await response.json();
    return json;

}

function CadastroUser() {
    const { handleSubmit, register, getValues } = useForm();
    const [GetusersDisplay, setGetusersDisplay] = useState([])
    const [termoPesquisa, setTermoPesquisa] = useState('');
    async function EnviarCadastro() {
        const formData = getValues();
        const json = JSON.stringify(formData);
        console.log(json)

        PostCadastro(json, '/user').then((data) => {
            console.log("Resposta do Back-End: ", data);
            const newUser = { id: data.id, ...formData };
            setGetusersDisplay([...GetusersDisplay, newUser]);

        })
    };
    async function removeruser(Usuario) {
        Swal.fire({
            title: 'Confirmar remoção',
            text: 'Tem certeza que deseja remover este produto?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await deleteuserGenericJson(Usuario.id, "user")
                    .then(data => {
                        console.log('Produto removido com sucesso:', data);
                        const updatedUsers = GetusersDisplay.filter(user => user.id !== Usuario.id);
                        setGetusersDisplay(updatedUsers);
                    })
            }
        })
    }
    useEffect(() => {
        Getusers().then((data) => {
            setGetusersDisplay(data);
        });
    }, []);

    useEffect(() => {
        if (termoPesquisa === '') {
            Getusers().then((data) => {
                setGetusersDisplay(data);
            });
        } else {
            // Filtrar os produtos com base no termo de pesquisa
            const produtosFiltrados = GetusersDisplay.filter((dataus) =>
                dataus.user.toLowerCase().includes(termoPesquisa.toLowerCase())
            );
            setGetusersDisplay(produtosFiltrados);
        }
    }, [termoPesquisa]);


    return (
        <div className="cadastrouser">
            <div>
                <h2>Cadastro de Usuario</h2>
                <form method="post" onSubmit={handleSubmit(EnviarCadastro)}>
                    <div className="inputscaduser">
                        <div>
                            <label>
                                <input type="text"
                                    placeholder="Usuário"
                                    name="user"
                                    {...register("user")}
                                    required />
                            </label>
                            <label>
                                <input type="text"
                                    placeholder="password"
                                    name="user"
                                    {...register("password")}
                                    required />
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="text"
                                    placeholder="Permisão"
                                    name="user"
                                    {...register("role")}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="btncad">
                        <button className="cadbnt" type="submit">Cadastrar</button>
                    </div>
                </form>

            </div>
            <div>
                <h2>Exclusão de Usuario</h2>
                <div className="Exclusao">
                    <input
                        type="text"
                        placeholder="Digite o nome do produto..."
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                    />
                    <table>
                        <tbody>
                            {GetusersDisplay.map((Usuario) => (
                                <tr key={Usuario.id}>
                                    <td><a onClick={() => removeruser(Usuario)}>X</a> User: {Usuario.user} = ID: {Usuario.id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )

}
export default CadastroUser;