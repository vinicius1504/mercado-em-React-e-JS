import "../css/login.css";
import Dashboard from "./Dashboard";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
  // const url_api = "https://unified-booster-392006.uc.r.appspot.com"
  const url_api = "http://localhost:8080";

async function PostCadastro(data, prefix) {
  console.log(prefix)
  const response = await fetch(`${url_api}${prefix}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: 'post',
    body: data
  });
  const json = await response.json();
  return json;
}

async function getLogin(data, prefix) {
  console.log(prefix)
  const response = await fetch(`${url_api}${prefix}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: 'post',
    body: data
  });
  const json = await response.json();
  return json;
}



function Login() {
  const { handleSubmit, register, getValues } = useForm();
  const [isLogin, setIsLogin] = useState(false)
  const [exibirFormulario, setExibirFormulario] = useState(false);


  function isLoged() {
    const login = localStorage.getItem('token')
    if (login) {
      console.log(login)
      setIsLogin(true)
    }
  }


    async function PegarLogin() {
      const formData = getValues();
      const json = JSON.stringify(formData);
      

      getLogin(json, '/login').then((data) => {
        console.log("Resposta do Back-End: ", data);
        localStorage.setItem("user", data.login)
        localStorage.setItem("token", data.token)
        localStorage.setItem("user",formData.user)
        localStorage.setItem("role",data.role)
        setIsLogin(data.login);
      });
      
    };
    async function PegarCadastro() {
      const formData = getValues();
      const json = JSON.stringify(formData);
      console.log(json)

      PostCadastro(json, '/user').then((data) => {
        console.log("Resposta do Back-End: ", data);
        setExibirFormulario(!exibirFormulario)
      });
      
    };
    const toggleExibirFormulario = () => {
      setExibirFormulario(!exibirFormulario);
    };


  useEffect(() => {
    isLoged();
  },)
  return isLogin ? (
    <Dashboard />
  ) : (
      <div className="login-page">
        <div className="login-form">
          <h2>Login</h2>
          <form method="post" onSubmit={handleSubmit(PegarLogin)}>
            <label>
              <input
                type="text"
                placeholder="Usuário"
                name="user"
                {...register("user")}
                required
              />
            </label>
            <label>
              <input
                type="password"
                placeholder="Senha"
                name="password"
                {...register("password")}
                required
              />
            </label>
            <button type="submit">Entrar</button>
          </form>
        </div>
      </div>  
  );
}

export default Login;
