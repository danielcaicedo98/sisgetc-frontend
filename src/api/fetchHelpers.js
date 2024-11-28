// const baseURL = 'http://localhost:8000';

const baseURL = 'https://sisgetc-api.onrender.com';


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


  export const fetchWithTokenBlob = async (endpoint, data, method) => {
    const url = `${baseURL}/${endpoint}`;
    const token = localStorage.getItem('token') || '';

    if (method === 'GET') {
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        // Verifica si la respuesta es exitosa
        if (response.ok) {
            // Si se trata de un archivo, retorna el blob
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.startsWith('application/ms-excel')) {
                const blob = await response.blob();
                // Aquí puedes hacer lo que necesites con el archivo (ej. descargarlo)
                return blob;
            }

            // Si no es un archivo, regresa la respuesta como JSON
            return response.json();
        } else {
            // Si la respuesta no es exitosa, lanzar un error
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
    }
} 