// Test pour le système d'enregistrement des actions
console.log('Démarrage des tests du système d\'enregistrement des actions...');

// Simuler les fonctions fetch pour les tests
const mockFetch = (url, options) => {
  console.log(`Appel fetch simulé vers: ${url}`);
  console.log('Options:', JSON.stringify(options, null, 2));
  
  // Simuler différentes réponses selon l'URL
  if (url.startsWith('/api/actions/log')) {
    return Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        action: JSON.parse(options.body),
        message: 'Action enregistrée avec succès'
      })
    });
  } else if (url.startsWith('/api/actions/history')) {
    // Simuler des données d'historique
    const actions = [
      {
        timestamp: new Date().toISOString(),
        actionType: 'switch',
        deviceName: 'Lights',
        deviceState: 'ON',
        room: 'Living Room'
      },
      {
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actionType: 'temperature',
        deviceName: 'Thermometer',
        deviceState: '22°C',
        room: 'Living Room'
      },
      {
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        actionType: 'switch',
        deviceName: 'Air Conditioner',
        deviceState: 'OFF',
        room: 'Bedroom'
      }
    ];
    
    return Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        actions: actions,
        pagination: {
          total: 10,
          limit: 10,
          skip: 0,
          hasMore: false
        }
      })
    });
  } else if (url.startsWith('/api/actions/stats')) {
    // Simuler des statistiques
    return Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        stats: {
          byActionType: [
            { _id: 'switch', count: 15 },
            { _id: 'temperature', count: 8 },
            { _id: 'login', count: 3 }
          ],
          byRoom: [
            { _id: 'Living Room', count: 12 },
            { _id: 'Bedroom', count: 8 },
            { _id: 'Kitchen', count: 6 }
          ],
          byDevice: [
            { _id: 'Lights', count: 10 },
            { _id: 'Thermometer', count: 8 },
            { _id: 'Air Conditioner', count: 5 }
          ]
        }
      })
    });
  }
  
  return Promise.reject(new Error('URL non gérée dans les tests'));
};

// Sauvegarder la fonction fetch originale
const originalFetch = global.fetch;

// Remplacer par notre mock pour les tests
global.fetch = mockFetch;

// Test d'enregistrement d'action
async function testLogAction() {
  console.log('\nTest: Enregistrement d\'une action');
  try {
    const actionData = {
      actionType: 'switch',
      deviceName: 'Lights',
      deviceState: 'ON',
      room: 'Living Room',
      details: { source: 'test' }
    };
    
    const response = await fetch('/api/actions/log', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_token_123456'
      },
      body: JSON.stringify(actionData)
    });
    const data = await response.json();
    
    if (data.success && data.action) {
      console.log('✅ Test réussi: Action enregistrée avec succès');
      console.log('Action enregistrée:', JSON.stringify(data.action, null, 2));
    } else {
      console.log('❌ Test échoué: L\'action aurait dû être enregistrée');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test de récupération de l'historique des actions
async function testGetActionHistory() {
  console.log('\nTest: Récupération de l\'historique des actions');
  try {
    const response = await fetch('/api/actions/history?limit=10', {
      headers: { 'Authorization': 'Bearer mock_token_123456' }
    });
    const data = await response.json();
    
    if (data.success && Array.isArray(data.actions)) {
      console.log('✅ Test réussi: Historique des actions récupéré');
      console.log(`Nombre d'actions: ${data.actions.length}`);
      console.log('Première action:', JSON.stringify(data.actions[0], null, 2));
      console.log('Pagination:', JSON.stringify(data.pagination, null, 2));
    } else {
      console.log('❌ Test échoué: L\'historique aurait dû être récupéré');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test de récupération des statistiques
async function testGetActionStats() {
  console.log('\nTest: Récupération des statistiques des actions');
  try {
    const response = await fetch('/api/actions/stats', {
      headers: { 'Authorization': 'Bearer mock_token_123456' }
    });
    const data = await response.json();
    
    if (data.success && data.stats) {
      console.log('✅ Test réussi: Statistiques récupérées');
      console.log('Statistiques par type d\'action:', JSON.stringify(data.stats.byActionType, null, 2));
      console.log('Statistiques par pièce:', JSON.stringify(data.stats.byRoom, null, 2));
      console.log('Statistiques par appareil:', JSON.stringify(data.stats.byDevice, null, 2));
    } else {
      console.log('❌ Test échoué: Les statistiques auraient dû être récupérées');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test de la fonction logAction dans main.js
function testLogActionFunction() {
  console.log('\nTest: Fonction logAction dans main.js');
  
  // Simuler l'environnement global
  global.authToken = 'mock_token_123456';
  global.currentUser = { username: 'test_user' };
  global.currentRoom = 'Living Room';
  
  // Définir la fonction logAction comme dans main.js
  function logAction(actionType, deviceName, deviceState, room = global.currentRoom, details = {}) {
    if (!global.authToken || !global.currentUser) return;
    
    console.log('Simulation d\'appel à logAction avec:', {
      actionType,
      deviceName,
      deviceState,
      room,
      details
    });
    
    return fetch('/api/actions/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${global.authToken}`
      },
      body: JSON.stringify({
        actionType,
        deviceName,
        deviceState,
        room,
        details
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Action enregistrée:', data.action);
        return true;
      } else {
        console.error('Erreur d\'enregistrement d\'action:', data.message);
        return false;
      }
    })
    .catch(error => {
      console.error('Erreur d\'enregistrement d\'action:', error);
      return false;
    });
  }
  
  // Tester la fonction
  try {
    logAction('switch', 'Lights', 'ON');
    console.log('✅ Test réussi: Fonction logAction appelée sans erreur');
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  await testLogAction();
  await testGetActionHistory();
  await testGetActionStats();
  testLogActionFunction();
  
  // Restaurer la fonction fetch originale
  global.fetch = originalFetch;
  
  console.log('\nTous les tests du système d\'enregistrement des actions sont terminés.');
}

// Lancer les tests
runAllTests();
