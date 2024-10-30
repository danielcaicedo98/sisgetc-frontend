const baseURL = 'http://localhost:8000';

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
