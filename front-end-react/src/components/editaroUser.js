import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import Swal from 'sweetalert2'
// const url_api = "https://unified-booster-392006.uc.r.appspot.com"
const url_api = "http://localhost:8080";




async function sendUserDataToAPI(id, formData) {

  const json = JSON.stringify(formData);
  console.log(formData);
  // console.log(userdata)
  const response = await fetch(`${url_api}/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: localStorage.getItem('token'),
    },
    body: json,
  });
}

// async function Getusers() {
//   const response = await fetch(`${url_api}/user`, {
//       headers: {
//           "Content-Type": "application/json",
//           "authorization": localStorage.getItem("token")
//       },
//   });
//   const json = await response.json();
//   return json;

// }


function EditaroUser() {
  const { handleSubmit, register, getValues } = useForm();
  

  const handleFormSubmit = () => {
    const userdata = getValues();
    console.log(userdata)
    userdata.id = parseFloat(userdata.id)
    console.log(userdata.id)

    sendUserDataToAPI(userdata.id, userdata);
  };

  return (
    <div className="cadastrouser">
      <div>
        <h2>Editar de Usuario</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="inputscaduser">
            <div>
              <label>
                <input
                  type="text"
                  placeholder="ID"
                  {...register('id')}
                  required
                />
              </label>
              <div>
                <label>
                  <input
                    type="text"
                    placeholder="Usuário"
                    {...register('user')}
                    required
                  />
                </label>
                <label>
                  <input
                    type="password"
                    placeholder="Senha"
                    {...register('password')}
                    required
                  />
                </label>
                <label>
                  <input
                    type="text"
                    placeholder="Permissão"
                    {...register('role')}
                  />
                </label>
                <div className="btncad">
                  <button className="cadbnt" type="submit">Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditaroUser;