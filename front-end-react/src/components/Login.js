import "../css/login.css";
import Dashboard from "./Dashboard";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
    

function Login() {
  const { handleSubmit, register, getValues } = useForm();
  const [isLogin, setIsLogin] = useState(false)
  const url_api = "https://unified-booster-392006.uc.r.appspot.com"
  // const url_api = "http://localhost:8080";

  function isLoged() {
    const login = localStorage.getItem('token')
    if (login) {
      console.log(login)
      setIsLogin(true)
    } else {
      console.log('Você esta sem token')
    }
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

    async function pegar() {
      const formData = getValues();
      const json = JSON.stringify(formData);
      

      getLogin(json, '/login').then((data) => {
        console.log("Resposta do Back-End: ", data);
        localStorage.setItem("user", data.login)
        localStorage.setItem("token", data.token)
        localStorage.setItem("user",formData.user)
        setIsLogin(data.login);
      });
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
        <form method="post" onSubmit={handleSubmit(pegar)}>
          <label>
            <input type="text" placeholder="Usuário" name="user" {...register("user")} required />
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
