import { fetchWithoutToken } from './fetchHelpers';

export const login = async (email, password) => {
    const data = { email, password };

    // Hacemos la petición POST al endpoint de login
    const response = await fetchWithoutToken('login', data, 'POST');
    
    if (response.ok) {
        // Guardamos el token en localStorage
        localStorage.setItem('token', response.token);
        console.log('Login exitoso');
    } else {
        console.log('Error en las credenciales:', response.message);
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    console.log('Sesión cerrada');
};
