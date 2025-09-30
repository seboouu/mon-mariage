// Gestion du formulaire de confirmation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('confirmationForm');
    const nbPersonnesInput = document.getElementById('nb-personnes');
    const accompagnantsContainer = document.getElementById('accompagnants-container');

    // Afficher/masquer le champ accompagnants selon le nombre de personnes
    if (nbPersonnesInput) {
        nbPersonnesInput.addEventListener('change', function() {
            if (parseInt(this.value) > 1) {
                accompagnantsContainer.style.display = 'block';
            } else {
                accompagnantsContainer.style.display = 'none';
            }
        });
    }

    // Gestion de la soumission du formulaire
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Récupération des données du formulaire
            const formData = {
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                telephone: document.getElementById('telephone').value,
                nbPersonnes: document.getElementById('nb-personnes').value,
                nomsAccompagnants: document.getElementById('noms-accompagnants').value,
                presenceMariage: document.querySelector('input[name="presence-mariage"]:checked')?.value,
                presenceBrunch: document.querySelector('input[name="presence-brunch"]:checked')?.value,
                allergies: document.getElementById('allergies').value,
                chanson: document.getElementById('chanson').value,
                message: document.getElementById('message').value,
                dateEnvoi: new Date().toISOString()
            };

            // Validation basique
            if (!formData.presenceMariage || !formData.presenceBrunch) {
                showMessage('Merci de répondre à toutes les questions obligatoires.', 'error');
                return;
            }

            // Affichage d'un message de succès
            // NOTE: Dans une version en production, vous devrez envoyer ces données à un serveur
            console.log('Données du formulaire:', formData);
            
            showMessage('Merci ! Votre confirmation a bien été enregistrée. Nous avons hâte de vous voir !', 'success');
            
            // Réinitialiser le formulaire après 3 secondes
            setTimeout(() => {
                form.reset();
                accompagnantsContainer.style.display = 'none';
                document.getElementById('form-message').style.display = 'none';
            }, 3000);

            // IMPORTANT: Pour connecter ce formulaire à un vrai backend, vous pouvez utiliser:
            // 1. Un service comme Formspree (https://formspree.io/)
            // 2. Google Forms API
            // 3. Un backend PHP/Node.js personnalisé
            // 4. Des services comme Netlify Forms ou Vercel
            
            // Exemple avec Formspree (à décommenter et configurer):
            /*
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (response.ok) {
                    showMessage('Merci ! Votre confirmation a bien été enregistrée.', 'success');
                    form.reset();
                } else {
                    showMessage('Une erreur est survenue. Merci de réessayer.', 'error');
                }
            })
            .catch(error => {
                showMessage('Une erreur est survenue. Merci de réessayer.', 'error');
                console.error('Erreur:', error);
            });
            */
        });
    }

    // Fonction pour afficher les messages
    function showMessage(text, type) {
        const messageDiv = document.getElementById('form-message');
        messageDiv.textContent = text;
        messageDiv.className = 'form-message ' + type;
        messageDiv.style.display = 'block';

        // Scroll vers le message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});