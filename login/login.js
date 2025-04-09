document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  const forgotPasswordLink = document.getElementById('forgotPassword');
  const createAccountLink = document.getElementById('createAccount');

  // Gestion du formulaire de connexion
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Afficher un message de chargement
    showMessage('Connexion en cours...', 'info');
    
    // Appel à l'API d'authentification
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        remember
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Connexion réussie
        showMessage('Connexion réussie! Redirection...', 'success');
        // Stocker le token d'authentification
        localStorage.setItem('authToken', data.token);
        // Rediriger vers le tableau de bord après un court délai
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1500);
      } else {
        // Échec de la connexion
        showMessage(data.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.', 'danger');
      }
    })
    .catch(error => {
      console.error('Erreur de connexion:', error);
      showMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.', 'danger');
    });
  });

  // Gestion du lien "Mot de passe oublié"
  forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    
    if (!username) {
      showMessage('Veuillez entrer votre nom d\'utilisateur pour réinitialiser votre mot de passe.', 'danger');
      return;
    }
    
    showMessage('Envoi d\'un email de réinitialisation...', 'info');
    
    // Appel à l'API de réinitialisation de mot de passe
    fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showMessage('Un email de réinitialisation a été envoyé à votre adresse email.', 'success');
      } else {
        showMessage(data.message || 'Échec de l\'envoi de l\'email. Veuillez réessayer.', 'danger');
      }
    })
    .catch(error => {
      console.error('Erreur de réinitialisation:', error);
      showMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.', 'danger');
    });
  });

  // Gestion du lien "Créer un compte"
  createAccountLink.addEventListener('click', function(e) {
    e.preventDefault();
    // Rediriger vers la page d'inscription
    window.location.href = 'register.html';
  });

  // Fonction pour afficher des messages
  function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className = `alert alert-${type}`;
    loginMessage.classList.remove('d-none');
  }
});
