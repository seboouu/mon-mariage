// Gestion de la galerie photos
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewGrid = document.getElementById('previewGrid');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadMessage = document.getElementById('uploadMessage');
    
    let selectedFiles = [];
    let currentPhotoIndex = 0;
    let galleryPhotos = [];

    // Initialiser les photos de la galerie au chargement
    initGallery();

    // Click sur la zone d'upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    // Drag & Drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    // Sélection de fichiers
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });

    // Traitement des fichiers
    function handleFiles(files) {
        selectedFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
        
        if (selectedFiles.length === 0) {
            showMessage('Veuillez sélectionner des fichiers image valides.', 'error');
            return;
        }

        // Vérifier la taille des fichiers (max 10 Mo)
        const maxSize = 10 * 1024 * 1024; // 10 Mo
        const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);
        
        if (oversizedFiles.length > 0) {
            showMessage(`${oversizedFiles.length} photo(s) dépasse(nt) 10 Mo et seront ignorées.`, 'error');
            selectedFiles = selectedFiles.filter(file => file.size <= maxSize);
        }

        if (selectedFiles.length > 0) {
            displayPreview();
        }
    }

    // Afficher l'aperçu des photos
    function displayPreview() {
        previewGrid.innerHTML = '';
        previewContainer.style.display = 'block';

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="preview-remove" onclick="removePreview(${index})">✕</button>
                `;
                previewGrid.appendChild(previewItem);
            };
            
            reader.readAsDataURL(file);
        });
    }

    // Supprimer une photo de l'aperçu
    window.removePreview = function(index) {
        selectedFiles.splice(index, 1);
        if (selectedFiles.length === 0) {
            previewContainer.style.display = 'none';
            fileInput.value = '';
        } else {
            displayPreview();
        }
    };

    // Upload des photos
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            if (selectedFiles.length === 0) {
                showMessage('Aucune photo à envoyer.', 'error');
                return;
            }

            // IMPORTANT: Ici, vous devrez implémenter l'upload vers votre serveur
            // Pour l'instant, on simule l'upload et on affiche les photos localement
            
            uploadBtn.disabled = true;
            uploadBtn.textContent = 'Envoi en cours...';

            // Simulation d'upload (à remplacer par un vrai upload)
            setTimeout(() => {
                // Ajouter les photos à la galerie (stockage local pour démo)
                selectedFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        addPhotoToGallery(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });

                showMessage(`${selectedFiles.length} photo(s) ajoutée(s) avec succès ! 🎉`, 'success');
                
                // Réinitialiser
                selectedFiles = [];
                previewContainer.style.display = 'none';
                previewGrid.innerHTML = '';
                fileInput.value = '';
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Envoyer mes photos';

                // Scroll vers la galerie
                setTimeout(() => {
                    document.getElementById('galleryGrid').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                }, 500);

            }, 2000);

            /* 
            // EXEMPLE D'UPLOAD RÉEL avec FormData (à décommenter et adapter):
            const formData = new FormData();
            selectedFiles.forEach((file, index) => {
                formData.append('photos[]', file);
            });

            fetch('votre-api-upload.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage(`${selectedFiles.length} photo(s) ajoutée(s) !`, 'success');
                    // Recharger la galerie
                    loadGalleryPhotos();
                } else {
                    showMessage('Erreur lors de l\'upload.', 'error');
                }
            })
            .catch(error => {
                showMessage('Erreur lors de l\'upload.', 'error');
                console.error('Erreur:', error);
            })
            .finally(() => {
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Envoyer mes photos';
            });
            */
        });
    }

    // Ajouter une photo à la galerie
    function addPhotoToGallery(imageSrc) {
        const galleryGrid = document.getElementById('galleryGrid');
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${imageSrc}" alt="Photo mariage">
            <div class="gallery-overlay">
                <button class="btn-view" onclick="openModal(this)">👁️ Voir</button>
            </div>
        `;
        galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
        
        // Mettre à jour le compteur
        updateGalleryCount();
    }

    // Initialiser la galerie
    function initGallery() {
        galleryPhotos = Array.from(document.querySelectorAll('.gallery-item img'));
        updateGalleryCount();
    }

    // Mettre à jour le compteur
    function updateGalleryCount() {
        const count = document.querySelectorAll('.gallery-item').length;
        const countElement = document.getElementById('galleryCount');
        if (count === 0) {
            countElement.textContent = 'Aucune photo pour le moment. Soyez le premier à partager !';
        } else if (count === 1) {
            countElement.textContent = '1 photo partagée';
        } else {
            countElement.textContent = `${count} photos partagées`;
        }
        
        // Mettre à jour la liste des photos pour le modal
        galleryPhotos = Array.from(document.querySelectorAll('.gallery-item img'));
    }

    // Afficher un message
    function showMessage(text, type) {
        uploadMessage.textContent = text;
        uploadMessage.className = 'upload-message ' + type;
        uploadMessage.style.display = 'block';

        setTimeout(() => {
            uploadMessage.style.display = 'none';
        }, 5000);
    }

    // Modal pour afficher les photos en grand
    window.openModal = function(btn) {
        const modal = document.getElementById('photoModal');
        const modalImg = document.getElementById('modalImg');
        const img = btn.closest('.gallery-item').querySelector('img');
        
        // Trouver l'index de la photo
        galleryPhotos = Array.from(document.querySelectorAll('.gallery-item img'));
        currentPhotoIndex = galleryPhotos.indexOf(img);
        
        modal.style.display = 'block';
        modalImg.src = img.src;
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function() {
        const modal = document.getElementById('photoModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.nextPhoto = function() {
        galleryPhotos = Array.from(document.querySelectorAll('.gallery-item img'));
        currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
        document.getElementById('modalImg').src = galleryPhotos[currentPhotoIndex].src;
    };

    window.prevPhoto = function() {
        galleryPhotos = Array.from(document.querySelectorAll('.gallery-item img'));
        currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
        document.getElementById('modalImg').src = galleryPhotos[currentPhotoIndex].src;
    };

    // Fermer le modal en cliquant à l'extérieur
    window.onclick = function(event) {
        const modal = document.getElementById('photoModal');
        if (event.target === modal) {
            closeModal();
        }
    };

    // Navigation au clavier
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('photoModal');
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        }
    });
});