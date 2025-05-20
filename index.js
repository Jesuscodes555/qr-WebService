// Importación de módulos necesarios
import express from 'express';  // Framework web para Node.js
import { v4 as uuidv4 } from 'uuid';  // Generador de IDs únicos
import cors from 'cors';  // Middleware para habilitar CORS (Cross-Origin Resource Sharing)

// Inicialización de la aplicación Express
const app = express();
// Definición del puerto. Usa el puerto definido en variables de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// === CONFIGURACIÓN DE MIDDLEWARE ===

// Middleware para parsear JSON en las solicitudes entrantes
app.use(express.json());
// Middleware para habilitar CORS - permite solicitudes desde otros dominios
// Configuración más permisiva para desarrollo
app.use(cors({
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Accept'] // Headers permitidos
}));

// === BASE DE DATOS EN MEMORIA ===
// En un entorno de producción, esto se reemplazaría por una base de datos real
let codigos = [
  {
    id: "a1b2c3d4e5f6",  // ID único del código QR
    data: "https://ejemplo.com",  // Datos contenidos en el código QR
    type: "qr"  // Tipo de código (siempre "qr" en este caso)
  },
  {
    id: "b2c3d4e5f6g7",
    data: "Contacto: Juan Pérez, Tel: 555-1234",
    type: "qr"
  }
];

// === MIDDLEWARE PERSONALIZADO MODIFICADO ===
// Ahora solo verifica los headers para peticiones POST
app.use((req, res, next) => {
  // Solo verificamos headers para peticiones POST
  if (req.method === 'POST') {
    // Obtiene los headers de la solicitud
    const contentType = req.get('Content-Type');
    const accept = req.get('Accept');
    
    // Verifica si los headers son correctos para POST
    if (!contentType || !contentType.includes('application/json') ||
        !accept || !accept.includes('application/json')) {
      // Si los headers no son correctos, devuelve un error 406 Not Acceptable
      return res.status(406).json({ 
        error: 'Not Acceptable', 
        message: 'Para peticiones POST, los headers Accept y Content-Type deben ser application/json' 
      });
    }
  }
  // Si los headers son correctos o no es una petición POST, continúa
  next();
});

// === DEFINICIÓN DE RUTAS (ENDPOINTS) ===

// 1. GET /codigos - Obtener todos los códigos QR
app.get('/codigos', (req, res) => {
  // Simplemente devuelve el array completo de códigos
  res.json(codigos);
});

// 2. GET /codigos/{id} - Obtener un código específico por ID
// El patrón [a-zA-Z0-9]+ asegura que el ID solo contenga letras y números
app.get('/codigos/:id([a-zA-Z0-9-]+)', (req, res) => {
  // Busca el código con el ID especificado
  const codigo = codigos.find(c => c.id === req.params.id);
  
  // Si no se encuentra el código, devuelve un error 404
  if (!codigo) {
    return res.status(404).json({ error: 'Not Found', message: 'Código no encontrado' });
  }
  
  // Si se encuentra el código, lo devuelve como respuesta
  res.json(codigo);
});

// 3. POST /codigos - Crear un nuevo código QR
app.post('/codigos', (req, res) => {
  // Extrae los datos del cuerpo de la solicitud
  const { data, type } = req.body;
  
  // Validación básica: el campo "data" es obligatorio
  if (!data) {
    return res.status(400).json({ error: 'Bad Request', message: 'El campo "data" es requerido' });
  }
  
  // Crea un nuevo objeto de código QR
  const newCodigo = {
    id: uuidv4().substring(0, 12),  // Genera un ID único y lo acorta a 12 caracteres
    data,  // Datos del código QR
    type: type || 'qr'  // Usa el tipo proporcionado o 'qr' por defecto
  };
  
  // Añade el nuevo código al array
  codigos.push(newCodigo);
  // Devuelve el nuevo código con un estado 201 Created
  res.status(201).json(newCodigo);
});

// 4. DELETE /codigos/{id} - Eliminar un código QR por ID
app.delete('/codigos/:id', (req, res) => {
  // Guarda la longitud inicial del array para verificar después si se eliminó algún elemento
  const initialLength = codigos.length;
  
  // Filtra el array para eliminar el código con el ID especificado
  codigos = codigos.filter(c => c.id !== req.params.id);
  
  // Si la longitud no cambió, significa que no se encontró ningún código con ese ID
  if (codigos.length === initialLength) {
    return res.status(404).json({ error: 'Not Found', message: 'Código no encontrado' });
  }
  
  // Si se eliminó correctamente, devuelve un estado 204 No Content (sin cuerpo de respuesta)
  res.status(204).end();
});

// === MANEJO DE RUTAS NO ENCONTRADAS ===
// Este middleware se ejecuta cuando ninguna ruta anterior coincide con la solicitud
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'Ruta no encontrada' });
});

// === INICIAR EL SERVIDOR ===
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

// Exporta la app para pruebas o para usar en otros archivos
export { app };