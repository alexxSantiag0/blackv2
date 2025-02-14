// import { useEffect, useState } from "react";
// import { Usuario } from "../../models/Usuario";
// import { jezaApi } from "../../api/jezaApi";

//       /* PASO1 */
//   const [session, setSession] = useState<Usuario[]>([]);
//   /* PASO2 */
//   useEffect(() => {
//     const item = localStorage.getItem("userLogged");
//     if (item !== null) {
//       const parsedItem = JSON.parse(item);
//       setSession(parsedItem);
//     }
//   }, []);

//   const useSeguridad =async ()=>{

//     const response = await jezaApi.get(`/Permiso?usuario=${session.map((usuario) => usuario.id)}&modulo=CAT_EMPRE_DEL`);

//      alert (response)
//   }

// export default useSeguridad;

import { useEffect, useState } from "react";
import { Usuario } from "../../models/Usuario";
import { jezaApi } from "../../api/jezaApi";
import Swal from "sweetalert2";

const useSeguridad = () => {
  const [session, setSession] = useState<Usuario[]>([]);
  const filtroSeguridad = async (modulo: string): Promise<boolean> => {
    console.log(`/Permiso?usuario=${session.map((usuario) => usuario.id)}&modulo=${modulo}`);
    if (session.length > 0) {
      const response = await jezaApi.get(`/Permiso?usuario=${session.map((usuario) => usuario.id)}&modulo=${modulo}`);

      if (response.data[0].permiso === false) {
        Swal.fire({
          icon: "error",
          title: `${response.data[0].mensaje}`,
          text: `Su perfil de usuario no cuenta con los permisos necesarios para realizar esta acción, consulte a sistemas`,
        });
        console.log(response.data[0].permiso);
        return false; // No se otorga el permiso
      }
    }

    return true; // Se otorga el permiso
  };

  useEffect(() => {
    const item = localStorage.getItem("userLoggedv2");
    if (item !== null) {
      try {
        const parsedItem = JSON.parse(item);
        setSession(parsedItem); // Aquí estableces el valor de session con parsedItem
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }
  }, []);


  //   useEffect(() => {
  //     fetchData();
  //   }, [session]);

  // Resto de tu lógica
  return { session, filtroSeguridad };
};

export default useSeguridad;
