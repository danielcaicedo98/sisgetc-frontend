const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = 8000;
const secretKey = 'mi_clave_secreta'; // Cambia esto por una clave más segura

// Datos de ejemplo
const data = {
  users: [
    {
      email: 'admin@gmail.com',
      password: 'admin1234',
      name: 'Administrador',
    },
  ],
  providers: [
    { id: '1', name: 'Salsamentaria' },
    { id: '2', name: 'Granero' },
    { id: '3', name: 'Supermercado' },
    { id: '0e31', name: 'Unknown' },
  ],
  products: [
    { id: '1', name: 'Harina' },
    { id: '2', name: 'Huevos' },
    { id: '3', name: 'Azúcar' },
  ],
  "purchases": [
      {
        "id": "cb46",
        "fecha": "2024-10-20",
        "descripcion": "",
        "total": 50000,
        "proveedor": {
          "id": "1728844232544.6748",
          "name": "Tienda"
        },
        "productos": [
          {
            "producto": {
              "id": "1728845240779.499",
              "name": "Mantequilla"
            },
            "cantidad": "3",
            "unidad": "Unidades",
            "precio": 20000,
            "text": "Mantequilla"
          },
          {
            "producto": {
              "id": "3",
              "name": "Azúcas"
            },
            "cantidad": 1,
            "unidad": "Gramos",
            "precio": "30000",
            "text": "Azúcas"
          }
        ]
      },
      {
        "id": "42e1",
        "fecha": "2024-10-14",
        "proveedor": {
          "id": "3",
          "name": "Supermercado"
        },
        "descripcion": "",
        "total": 50000,
        "productos": [
          {
            "producto": {
              "id": "2",
              "name": "Huevos"
            },
            "cantidad": 3,
            "unidad": "Unidades",
            "precio": 50000
          }
        ]
      },
      {
        "id": "5d81",
        "fecha": "2024-10-20",
        "proveedor": {
          "id": "2",
          "name": "Granero"
        },
        "descripcion": "",
        "total": 36000,
        "productos": [
          {
            "producto": {
              "id": "3",
              "name": "Azúcar"
            },
            "cantidad": 10,
            "unidad": "Unidades",
            "precio": "6000",
            "text": "Azúcar"
          },
          {
            "producto": {
              "id": "1",
              "name": "Harina"
            },
            "cantidad": 1,
            "unidad": "Unidades",
            "precio": "30000",
            "text": "Harina"
          }
        ]
      },
      {
        "id": "a276",
        "fecha": "2024-10-14",
        "proveedor": {
          "id": "2",
          "name": "Granero"
        },
        "descripcion": "",
        "total": 30000,
        "productos": [
          {
            "producto": {
              "id": "2",
              "name": "Huevos"
            },
            "cantidad": 10,
            "unidad": "Unidades",
            "precio": 30000
          }
        ]
      },
      {
        "id": "624e",
        "fecha": "2024-10-20",
        "proveedor": {
          "id": "1",
          "name": "Salsamentaria"
        },
        "descripcion": "test",
        "total": 60000,
        "productos": [
          {
            "producto": {
              "id": "2",
              "name": "Huevos"
            },
            "cantidad": 3,
            "unidad": "Unidades",
            "precio": 10000
          },
          {
            "producto": {
              "id": "3",
              "name": "Azúcar"
            },
            "cantidad": 2000,
            "unidad": "Gramos",
            "precio": 50000,
            "text": "Azúcar"
          }
        ]
      },
      {
        "id": "224e",
        "fecha": "2024-10-20",
        "proveedor": {
          "id": "1",
          "name": "Salsamentaria"
        },
        "descripcion": "test2",
        "total": 60000,
        "productos": [
          {
            "producto": {
              "id": "2",
              "name": "Huevos"
            },
            "cantidad": 3,
            "unidad": "Unidades",
            "precio": 10000
          },
          {
            "producto": {
              "id": "1",
              "name": "Harina"
            },
            "cantidad": 2000,
            "unidad": "Gramos",
            "precio": 50000,
            "text": "Harina"
          }
        ]
      }
    ]
};

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Función para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Rutas
app.get('/users', verifyToken, (req, res) => {
  res.json(data.users);
});

app.get('/providers', verifyToken, (req, res) => {
  res.json(data.providers);
});

app.get('/products', verifyToken, (req, res) => {
  res.json(data.products);
});

app.get('/purchases', verifyToken, (req, res) => {
  res.json(data.purchases);
});

// Endpoint para login
app.post('/users/login/', (req, res) => {
  const { email, password } = req.body;
  const user = data.users.find(u => u.email === email && u.password === password);
  if (user) {
    // Generar un token
    const token = {"access": jwt.sign({ id: user.email }, secretKey, { expiresIn: '1h' })};
    res.json({ message: 'Login exitoso', token });
  } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
  }
});

// Ruta para crear una nueva compra
app.post('/purchases', verifyToken, (req, res) => {
    const newPurchase = req.body;

    // Asegúrate de que los datos necesarios estén presentes
    if (!newPurchase.fecha || !newPurchase.proveedor || !newPurchase.descripcion || !newPurchase.total || !newPurchase.productos) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Generar un ID único para la nueva compra (puedes usar otra lógica para esto)
    newPurchase.id = `${Date.now()}`; // O cualquier otro método de ID

    // Agregar la nueva compra al array de compras
    data.purchases.push(newPurchase);
    res.status(201).json(newPurchase); // Responder con la compra creada
});

// Ruta para actualizar una compra existente
app.put('/purchases/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    const updatedPurchase = req.body;

    // Encontrar la compra por ID
    const index = data.purchases.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Compra no encontrada' });
    }

    // Actualizar los datos de la compra
    data.purchases[index] = { ...data.purchases[index], ...updatedPurchase };
    res.json(data.purchases[index]); // Responder con la compra actualizada
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
