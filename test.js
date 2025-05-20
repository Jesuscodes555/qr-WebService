// Este archivo es para probar los endpoints de la API

import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

// Función para realizar las pruebas
async function runTests() {
  console.log('Iniciando pruebas de la API de Códigos QR...\n');

  try {
    // 1. Obtener todos los códigos
    console.log('1. Probando GET /codigos');
    const getAllResponse = await fetch(`${API_URL}/codigos`, {
      headers: { 'Accept': 'application/json;encoding=utf-8' }
    });
    const allCodigos = await getAllResponse.json();
    console.log(`   ✅ Status: ${getAllResponse.status}`);
    console.log(`   📋 Códigos encontrados: ${allCodigos.length}`);
    console.log('   📄 Ejemplo de datos:', allCodigos[0]);
    console.log();

    // 2. Crear un nuevo código
    console.log('2. Probando POST /codigos');
    const newCodigo = {
      data: 'https://nuevaurl.com/test',
      type: 'qr'
    };
    
    const createResponse = await fetch(`${API_URL}/codigos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;encoding=utf-8',
        'Accept': 'application/json;encoding=utf-8'
      },
      body: JSON.stringify(newCodigo)
    });
    
    const createdCodigo = await createResponse.json();
    console.log(`   ✅ Status: ${createResponse.status}`);
    console.log('   📄 Código creado:', createdCodigo);
    console.log();

    // 3. Obtener un código específico
    console.log(`3. Probando GET /codigos/${createdCodigo.id}`);
    const getOneResponse = await fetch(`${API_URL}/codigos/${createdCodigo.id}`, {
      headers: { 'Accept': 'application/json;encoding=utf-8' }
    });
    const oneCodigo = await getOneResponse.json();
    console.log(`   ✅ Status: ${getOneResponse.status}`);
    console.log('   📄 Código obtenido:', oneCodigo);
    console.log();

    // 4. Eliminar un código
    console.log(`4. Probando DELETE /codigos/${createdCodigo.id}`);
    const deleteResponse = await fetch(`${API_URL}/codigos/${createdCodigo.id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json;encoding=utf-8' }
    });
    console.log(`   ✅ Status: ${deleteResponse.status}`);
    console.log('   🗑️ Código eliminado correctamente');
    console.log();

    // 5. Verificar que el código fue eliminado
    console.log(`5. Verificando que el código ${createdCodigo.id} fue eliminado`);
    const verifyResponse = await fetch(`${API_URL}/codigos/${createdCodigo.id}`, {
      headers: { 'Accept': 'application/json;encoding=utf-8' }
    });
    console.log(`   ✅ Status: ${verifyResponse.status} (404 esperado)`);
    console.log();

    console.log('✅ Todas las pruebas completadas con éxito!');
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
  }
}

console.log('Nota: Para ejecutar estas pruebas, asegúrate de que el servidor esté en ejecución');
console.log('Puedes iniciar el servidor con: npm run dev\n');
console.log('Este archivo es solo para referencia y pruebas manuales.');

//ejecutar pruebas
runTests();
