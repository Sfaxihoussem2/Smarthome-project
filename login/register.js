document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const registerMessage = document.getElementById('registerMessage');

  // Gestion du formulaire d'inscription
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Vérification des mots de passe
    if (password !== confirmPassword) {
      showMessage('Les mots de passe ne correspondent pas.', 'danger');
      return;
    }
    
    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
      showMessage('Le mot de passe doit contenir au moins 6 caractères.', 'danger');
      return;
    }
    
    // Afficher un message de chargement
    showMessage('Création du compte en cours...', 'info');
    
    // Appel à l'API d'inscription
    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Inscription réussie
        showMessage('Compte créé avec succès! Redirection vers la page de connexion...', 'success');
        // Stocker le token d'authentification
        localStorage.setItem('authToken', data.token);
        // Rediriger vers le tableau de bord après un court délai
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1500);
      } else {
        // Échec de l'inscription
        showMessage(data.message || 'Échec de la création du compte. Veuillez réessayer.', 'danger');
      }
    })
    .catch(error => {
      console.error('Erreur d\'inscription:', error);
      showMessage('Erreur de connexion au serveur. Veuillez réessayer plus tard.', 'danger');
    });
  });

  // Fonction pour afficher des messages
  function showMessage(message, type) {
    registerMessage.textContent = message;
    registerMessage.className = `alert alert-${type}`;
    registerMessage.classList.remove('d-none');
  }
});
