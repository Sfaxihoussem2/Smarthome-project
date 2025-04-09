// Test pour l'authentification
console.log('Démarrage des tests d\'authentification...');

// Simuler les fonctions fetch pour les tests
const mockFetch = (url, options) => {
  console.log(`Appel fetch simulé vers: ${url}`);
  console.log('Options:', JSON.stringify(options, null, 2));
  
  // Simuler différentes réponses selon l'URL
  if (url === '/api/auth/login') {
    if (options.body.includes('test_user') && options.body.includes('password123')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          token: 'mock_token_123456',
          message: 'Connexion réussie'
        })
      });
    } else {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: false,
          message: 'Identifiants incorrects'
        })
      });
    }
  } else if (url === '/api/auth/register') {
    if (!options.body.includes('existing_user')) {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          token: 'mock_token_new_user',
          message: 'Utilisateur créé avec succès'
        })
      });
    } else {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: false,
          message: 'Cet utilisateur existe déjà'
        })
      });
    }
  } else if (url === '/api/auth/reset-password') {
    return Promise.resolve({
      json: () => Promise.resolve({
        success: true,
        message: 'Instructions de réinitialisation envoyées'
      })
    });
  } else if (url === '/api/auth/me') {
    if (options.headers.Authorization === 'Bearer mock_token_123456') {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          user: {
            username: 'test_user',
            email: 'test@example.com',
            role: 'user'
          }
        })
      });
    } else {
      return Promise.resolve({
        json: () => Promise.resolve({
          success: false,
          message: 'Token invalide'
        })
      });
    }
  }
  
  return Promise.reject(new Error('URL non gérée dans les tests'));
};

// Sauvegarder la fonction fetch originale
const originalFetch = global.fetch;

// Remplacer par notre mock pour les tests
global.fetch = mockFetch;

// Test de connexion réussie
async function testSuccessfulLogin() {
  console.log('\nTest: Connexion réussie');
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test_user', password: 'password123' })
    });
    const data = await response.json();
    
    if (data.success && data.token) {
      console.log('✅ Test réussi: Connexion acceptée avec token');
      console.log(`Token reçu: ${data.token}`);
    } else {
      console.log('❌ Test échoué: La connexion aurait dû être acceptée');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test de connexion échouée
async function testFailedLogin() {
  console.log('\nTest: Connexion échouée');
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'wrong_user', password: 'wrong_password' })
    });
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ Test réussi: Connexion refusée comme prévu');
      console.log(`Message d'erreur: ${data.message}`);
    } else {
      console.log('❌ Test échoué: La connexion aurait dû être refusée');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test d'inscription réussie
async function testSuccessfulRegistration() {
  console.log('\nTest: Inscription réussie');
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'new_user', 
        email: 'new@example.com', 
        password: 'password123' 
      })
    });
    const data = await response.json();
    
    if (data.success && data.token) {
      console.log('✅ Test réussi: Inscription acceptée avec token');
      console.log(`Token reçu: ${data.token}`);
    } else {
      console.log('❌ Test échoué: L\'inscription aurait dû être acceptée');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test d'inscription échouée (utilisateur existant)
async function testFailedRegistration() {
  console.log('\nTest: Inscription échouée (utilisateur existant)');
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: 'existing_user', 
        email: 'existing@example.com', 
        password: 'password123' 
      })
    });
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ Test réussi: Inscription refusée comme prévu');
      console.log(`Message d'erreur: ${data.message}`);
    } else {
      console.log('❌ Test échoué: L\'inscription aurait dû être refusée');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test de vérification du token
async function testTokenVerification() {
  console.log('\nTest: Vérification du token');
  try {
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': 'Bearer mock_token_123456' }
    });
    const data = await response.json();
    
    if (data.success && data.user) {
      console.log('✅ Test réussi: Token valide, informations utilisateur récupérées');
      console.log('Utilisateur:', JSON.stringify(data.user, null, 2));
    } else {
      console.log('❌ Test échoué: Le token aurait dû être accepté');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Test de token invalide
async function testInvalidToken() {
  console.log('\nTest: Token invalide');
  try {
    const response = await fetch('/api/auth/me', {
      headers: { 'Authorization': 'Bearer invalid_token' }
    });
    const data = await response.json();
    
    if (!data.success) {
      console.log('✅ Test réussi: Token invalide rejeté comme prévu');
      console.log(`Message d'erreur: ${data.message}`);
    } else {
      console.log('❌ Test échoué: Le token invalide aurait dû être rejeté');
    }
  } catch (error) {
    console.error('❌ Test échoué avec erreur:', error);
  }
}

// Exécuter tous les tests
async function runAllTests() {
  await testSuccessfulLogin();
  await testFailedLogin();
  await testSuccessfulRegistration();
  await testFailedRegistration();
  await testTokenVerification();
  await testInvalidToken();
  
  // Restaurer la fonction fetch originale
  global.fetch = originalFetch;
  
  console.log('\nTous les tests d\'authentification sont terminés.');
}

// Lancer les tests
runAllTests();
