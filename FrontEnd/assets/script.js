
//import { login } from "./login.js";


// Appel des éléments nécessaires
const btn__addPhoto = document.querySelector(".btn__add--photo");
const btn__ValidatePhoto = document.querySelector(".btn__validate--photo");
const articleEditWorks = document.querySelector(".articles__edit--works");
const title__modal = document.getElementById("title__modal");
const jsModalBack = document.querySelector(".js-modal-back");
const form__addPhotos = document.querySelector(".form__addPhotos");
const titreInput = document.getElementById("titre");
const categSelect = document.getElementById("categ");
const inputImage = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const iconElement = document.querySelector(".fa-regular.fa-image");
const labelElement = document.querySelector("label[for=fileInput]");
const formats_p = document.getElementById("formats");
const divGallery = document.querySelector(".gallery");


const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();

// Fonction pour générer les projets dynamiquement
function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        // Création d’une balise dédiée à un seul projet
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id
        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const nameElement = document.createElement("figcaption");
        nameElement.innerText = figure.title;
        // On rattache les fiches à la div
        divGallery.appendChild(workElement);
        // Puis les élements aux fiches
        workElement.appendChild(imageElement);
        workElement.appendChild(nameElement);
    }
}
generateWorks(works); // Générer les travaux

/********************************************************** Partie login *************************************************************/

/************************************* Modal********************************/
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

/******************* Fonction qui prend en paramètre l'événément pour ouvrir la modale *******************/
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href")); // Trouver l'élément qui est cible par rapport au lien
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus(); // Par défaut mettre le premier élément en focus
    modal.classList.remove("displayNone"); // Afficher la modale en enlevant la classe displayNone
    modal.setAttribute("aria-hidden", false); // Désactiver l'attribut aria-hidden
    modal.setAttribute("aria-modal", true);// Activer l'attribut aria-modal
    modal.addEventListener("click", closeModal); // Permet de pouvoir quitter la modale en cliquant à l'extérieur de celle ci
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal); // Listener pour fermer la modale au clic de la croix
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation); // Listener pour éviter que la modale se ferme lorsqu'on clique à l'intérieur de celle ci
}


/******************* Fonction qui prend en paramètre l'événément pour fermer la modale *******************/
const closeModal = function (e) {
    if (modal === null) return // Si la modale est déjà nulle, s'arrêter ici
    e.preventDefault();
    window.setTimeout(function () {
        modal.classList.add("displayNone");  // Mettre le display:none uniquement après 0,5s (pour avoir le temps de gérer l'animation)
        modal = null; // Remettre la variable à null car la modale sera fermée donc nulle
    }, 500)
    modal.setAttribute("aria-hidden", true);
    modal.setAttribute("aria-modal", false);
    // Supprimer les listeners
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
}

/************* Fonction pour éviter que la modale se ferme lorsqu'on clique à l'intérieur de celle ci **************/
const stopPropagation = function (e) {
    e.stopPropagation();
}

/******************* Fonction pour l'accessibilité avec la navigation avec TAB et SHIFT + TAB *******************/
const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(`:focus`)); // Permet de trouver l'élément qui correspond à l'élément focus
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}


document.querySelectorAll(".js-modal").forEach(a => { // Pour chaque liens...
    a.addEventListener("click", openModal); // ... Ajouter un EventListener et lorsqu'on va cliquer sur ces liens, appeler la fonction openModal
})
// Pour la fermeture de la modale lorsqu'on clique sur "ECHAP"
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
})

/********************* Récupération du token dans le localStorage *********************/
let token = window.localStorage.getItem('token');
/************************************************************************************/


/***************************Gestion modale add photo****************************/

/*********** Lors du clic sur le bouton ajouter une photo *************/
btn__addPhoto.addEventListener("click", function (e) {
    // Passer en mode modale n°2
    title__modal.textContent = "Ajout photo";
    jsModalBack.classList.remove("displayNone");
    form__addPhotos.classList.remove("displayNone");
    articleEditWorks.style.display = 'none';
    btn__addPhoto.textContent = "Valider";


    // Écouter l'événement "input" sur les champs du formulaire afin d'afficher le bouton en gris si les champs ne sont pas remplis
    titreInput.addEventListener("input", checkFields); // Écoute les changements dans le champ titre
    categSelect.addEventListener("input", checkFields); // Écoute les changements dans le sélecteur de catégorie
    inputImage.addEventListener("input", checkFields); // Écoute les changements dans le champ d'image
    // Fonction pour vérifier les champs et mettre à jour le bouton
    function checkFields() {
        if (titreInput.value.trim() === "" || categSelect.value === "" || categSelect.value === "default" || !inputImage.files[0]) {
            // L'un des champs n'est pas rempli, donc le bouton est en gris
            btn__ValidatePhoto.style.display = "block";
            btn__addPhoto.style.display = "none";
            btn__ValidatePhoto.style.backgroundColor = "#A7A7A7";
            btn__ValidatePhoto.style.border = "1px solid #A7A7A7";
        } else {
            // Tous les champs sont remplis, donc le bouton est en vert
            btn__ValidatePhoto.style.backgroundColor = "#1D6154";
            btn__ValidatePhoto.style.border = "1px solid #1D6154";
            window.setTimeout(function () {
                document.querySelector(".error_login").classList.add("displayNone");
            }, 500)
        }

    }
    // Appeler la fonction pour vérifier l'état initial
    checkFields();
});


// Écouter les modifications de l'input pour l'image
inputImage.addEventListener("change", function () {
    const selectedImage = inputImage.files[0];
    if (selectedImage) {
        const objectURL = URL.createObjectURL(selectedImage);
        // Mettre à jour la source de l'image pour afficher la prévisualisation
        imagePreview.src = objectURL;
        imagePreview.classList.remove("displayNone") // Afficher la prévisualisation
        // Effacer ces éléments pour laisser place à la prévisualisation
        iconElement.style.display = "none";
        inputImage.style.display = "none";
        labelElement.style.display = "none";
        formats_p.style.display = "none";
    } else {
        // Réinitialiser l'image si aucun fichier n'est sélectionné
        imagePreview.src = "";
    }
});


/************* Génération de l'intérieur de la modale n°1 **************/
function generateModalWorks(works) {
    for (let i = 0; i < works.length; i++) {
        const figure = works[i];
        // Création d’une balise dédiée à un seul projet
        const workElement = document.createElement("figure");
        workElement.dataset.id = works[i].id
        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        const deleteButton = document.createElement("a");
        deleteButton.classList.add("js-link__work--delete");
        const iconElement = document.createElement("i");
        iconElement.classList.add("fa-solid", "fa-trash-can");
        // Ajoute l'élément <i> comme enfant de l'élément <a>
        deleteButton.appendChild(iconElement);
        // Mettre le même id de la balise figure à la balise a (pas besoin de faire un for)
        deleteButton.id = figure.id;
        // On rattache les fiches à la div
        articleEditWorks.appendChild(workElement);
        // Puis les élements aux fiches
        workElement.appendChild(imageElement);
        workElement.appendChild(deleteButton);
    }
}

generateModalWorks(works);

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function isTokenValid(token) {
    const decodedJWT = parseJwt(token);
    console.log(decodedJWT)
    const expirationDate = new Date(decodedJWT.exp * 1000)
    console.log(expirationDate)
    const today = new Date()
    return today < expirationDate
}

/*************************** Connexion et affichage du mode admin *******************************/
let a__log = document.getElementById("a__log");
// Si le token du local storage existe
if (token) {
    if (!isTokenValid(token)) {
        console.log(token)
        // Si le lien n'a pas d'attribut href, cela veut dire qu'il est en mode logout, donc au clic, se déconnecter
        localStorage.removeItem('token');
        location.reload();

    }
    // Passer en mode admin
    document.querySelector(".edit_mode").classList.add("display__flex"); // Permet d'afficher la barre noire au dessus
    document.querySelector(".edit__link--modale").classList.add("display__inline"); // Permet d'afficher le bouton modifier à côté de "Mes Projets"
    // Changement du lien login en logout
    a__log.removeAttribute("href");
    a__log.textContent = "logout";

    // Pour se déconnecter
    a__log.addEventListener("click", function (e) {
        // Empêcher le lien logout de suivre le lien href par défaut
        e.preventDefault();
        // Si le lien n'a pas d'attribut href, cela veut dire qu'il est en mode logout, donc au clic, se déconnecter
        if (!a__log.hasAttribute("href")) {
            localStorage.removeItem('token');
            location.reload();
        }
    });

}

// Reset le formulaire
function resetForm() {
    const icone = document.querySelector(".fa-regular.fa-image");
    icone.style.display = "block";
    imagePreview.classList.add("displayNone")
    labelElement.style.display = "flex";
    formats_p.style.display = "block";
    inputImage.value = null;
    categSelect.value = null;
    titreInput.value = null;
    document.querySelector(".error_login").classList.add("displayNone");
}

// Lors du clic sur l'icone flêche pour retourner en arrière...
jsModalBack.addEventListener("click", function (e) {
    stopPropagation(e);
    title__modal.textContent = "Galerie photo";
    jsModalBack.classList.add("displayNone");
    form__addPhotos.classList.add("displayNone");
    btn__addPhoto.textContent = "Ajouter une photo";
    btn__ValidatePhoto.style.display = "none";
    btn__addPhoto.style.display = "block";
    resetForm()

    // Réafficher travaux
    articleEditWorks.style.display = 'flex';
});

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const worksData = await response.json();
    return worksData
}


/******************************** Ajout d'un projet *******************************/
btn__ValidatePhoto.addEventListener("click", async function (e) {
    if (titreInput.value.trim() === "" || categSelect.value === "" || !inputImage.files[0]) {
        document.querySelector(".error_login").classList.remove("displayNone");
    } else {
        e.preventDefault();
        const url = `http://localhost:5678/api/works`;


        const formData = new FormData(); // Créer un objet FormData

        formData.append('image', inputImage.files[0], inputImage.files[0].name); // Ajouter l'image au formulaire
        formData.append('title', titreInput.value); // Ajouter le titre au formulaire
        formData.append('category', parseInt(categSelect.value)); // Ajouter la catégorie au formulaire

        const response = await fetch(url, {
            method: `POST`,
            headers: {
                "Authorization": `Bearer ${token}`, // En-tête d'authentification
            },
            body: formData,
        })

        if (response.status === 201 || response.status === 204) {

            divGallery.innerHTML = "";
            articleEditWorks.innerHTML = "";
            const worksData = await getWorks();
            generateWorks(worksData);
            generateModalWorks(worksData);

            removeWork()

            resetForm()

        } else {
            console.log(token)
            console.log(`Statut de réponse : ${response.status}`);
        }
    }
});



/*************************** Suppression d'un projet *******************************/
async function removeWork() {
    document.querySelectorAll(".js-link__work--delete").forEach((a) => { // Pour chaque liens...
        a.addEventListener("click", async (event) => { // ... Ajouter un EventListener qui écoute le clic
            event.preventDefault();
            // Trouver le lien qui a été cliqué en utilisant l'ID
            const clickedLinkId = event.currentTarget.id;
            console.log(`Le lien avec l'ID ${clickedLinkId} a été cliqué.`);
            const url = `http://localhost:5678/api/works/${clickedLinkId}`;
            console.log(url);
            const figureToDelete = document.querySelectorAll(`[data-id="${clickedLinkId}"]`); // Récupérer la figure qui correspond au même ID que le lien
            const response = await fetch(url, {
                method: `DELETE`,
                headers: {
                    Authorization: `Bearer ${token}`, // En-tête d'authentification
                },
            })
            if (response.status === 200 || response.status === 204) { // Si le statut de la réponse est 200 ou 204 (réponse réussie sans contenu)
                console.log("La suppression a réussi")
                // Supprimer le travail
                figureToDelete.forEach(function (figure) {
                    figure.remove();
                });
            } else {
                console.log(token)
                console.log(`Statut de réponse : ${response.status}`);
            }
        });
    })
}

removeWork()


/*************************************** Partie filtres *****************************************/
// Enlève la classe .selected à tous les boutons de la classe .filters
function unselectAllbuttons() {
    const buttons = document.querySelectorAll(".filters button")
    Array.from(buttons).forEach((button) => { // Converti la liste en tableau et parcours tous les éléments du tableau
        button.classList.remove("selected") // Pour chaque élément, leur enlever la classe .dot_selected
    })
}

let isAllDisplayed = false; // Variable pour suivre l'état actuel du bouton "Tout afficher"
// Fonction pour générer les filtres
function filters(btnFilter, Id) {
    btnFilter.addEventListener("click", async function () {
        const worksData = await getWorks();
        const worksFiltered = worksData.filter(function (work) { // Appel de la fonction filtrage sur chaque élément du tableau works
            return work.categoryId === Id; // Retourner les élémennts ayant la même catégorieId que Id
        });
        divGallery.innerHTML = ""; // Efface tout le HTML de la classe .gallery
        unselectAllbuttons() // Appel de la fonction enlevant la classe .selected à tous les boutons de la classe .filters
        btnFilter.classList.add("selected") // Attribution de la classe .selected au bouton btnFilter
        generateWorks(worksFiltered); // Générer la page avec le filtre appliqué
        isAllDisplayed = false; // Variable pour suivre l'état actuel du bouton "Tout afficher"

    });
}
// Code pour le bouton "Tous" affichant tous les travaux
const btnFilterAll = document.querySelector(".btnFilterAll");
btnFilterAll.addEventListener("click", async function () {
    if (!isAllDisplayed) { // Si isAllDisplayed === false
        const worksData = await getWorks();
        divGallery.innerHTML = "";
        generateWorks(worksData); // Affiche toutes les œuvres non filtrées
        unselectAllbuttons();
        btnFilterAll.classList.add("selected");
        isAllDisplayed = true; // Met à jour l'état du bouton "Tout afficher"

    }
});

// Appel des fonctions de filtrages
const btnFilterObjects = document.querySelector(".btnFilterObjects");
filters(btnFilterObjects, 1);
const btnFilterApartments = document.querySelector(".btnFilterApartments");
filters(btnFilterApartments, 2);
const btnFilterHotelRestau = document.querySelector(".btnFilterHotelRestau");
filters(btnFilterHotelRestau, 3);

