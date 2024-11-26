const baseURL = 'http://localhost:8000';

// const baseURL = 'https://sisgetc-api.onrender.com';


// Peticiones sin token (por ejemplo, para login o endpoints públicos)
export const fetchWithoutToken = async (endpoint, data, method = 'GET') => {    
    const url = `${baseURL}/${endpoint}`;

    if (method === 'GET') {
        const response = await fetch(url);
        return response.json();
    } else {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }
};

// Peticiones con token (por ejemplo, para acceder a rutas protegidas)
export const fetchWithToken = async (endpoint, data, method ) => {
    const url = `${baseURL}/${endpoint}`;
    const token = localStorage.getItem('token') || '';

    if (method === 'GET' || method === 'DELETE') {
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.json();
    } else {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        return response.json();
    }
};



export const fetchWithTokenForm = async (endpoint, body, method) => {
    const headers = {};
  
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(body);
    }
  
    const options = {
      method,
      headers: {
        ...headers,
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: method !== "GET" ? body : undefined,
    };
  
    const response = await fetch(`${baseURL}/${endpoint}`, options);
    return response.json();
  };
  
// export const fetchWithTokenForm = async (endpoint, data, method) => {
//     const url = `${baseURL}/${endpoint}`;
//     const token = localStorage.getItem('token') || '';

//     const headers = {
//         'Authorization': `Bearer ${token}`,
//     };

//     // Verificar si estamos enviando un 'GET' o 'DELETE' (sin cuerpo)
//     if (method === 'GET' || method === 'DELETE') {
//         const response = await fetch(url, {
//             method,
//             headers,
//         });
//         return response.json();
//     } else {
//         // Crear FormData
//         const formData = new FormData();

//         // Agregar datos a FormData
//         for (let key in data) {
//             if (key === 'photo' && data[key] instanceof File) {
//                 // Verifica si el campo es un archivo
//                 formData.append(key, data[key]);
//             } else {
//                 // Si no es un archivo, agrega el dato normalmente
//                 formData.append(key, data[key]);
//             }
//         }

//         // Realizar la solicitud con FormData (sin especificar Content-Type)
//         const response = await fetch(url, {
//             method,
//             headers,
//             body: formData, // Usar FormData en lugar de JSON.stringify
//         });

//         return response.json();
//     }
// };