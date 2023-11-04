//import { login } from "./login.js";


const response = await fetch('http://localhost:5678/api/works');
const works = await response.json();


// Fonction pour générer les projets dynamiquement
function generateWorks(works) {
    for (let i = 0; i < works.length; i++) {

        const figure = works[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const divGallery = document.querySelector(".gallery");
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


/****************************** Modal****************************/
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

// Fonction qui prend en paramètre l'événément pour ouvrir la modale
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

// Fonction qui prend en paramètre l'événément pour fermer la modale
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

// Fonction pour éviter que la modale se ferme lorsqu'on clique à l'intérieur de celle ci
const stopPropagation = function (e) {
    e.stopPropagation();
}

// Fonction pour l'accessibilité avec la navigation avec TAB et SHIFT + TAB
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


/***************************Gestion modale add photo****************************/

const btn__addPhoto = document.querySelector(".btn__add--photo")

btn__addPhoto.addEventListener("click", function (e) {
    const articleEditWorks = document.querySelector(".articles__edit--works");
    const title__modal = document.getElementById("title__modal");
    const jsModalBack = document.querySelector(".js-modal-back");
    const form__addPhotos = document.querySelector(".form__addPhotos");
    title__modal.textContent = "Ajout photo";
    jsModalBack.classList.remove("displayNone");
    form__addPhotos.classList.remove("displayNone");
    articleEditWorks.innerHTML = "";
});


/*******************************************************************************/


let token = window.localStorage.getItem('token');  // Récupération du token dans le localStorage
let a__log = document.getElementById("a__log");

if (token) {
    document.querySelector(".edit_mode").classList.add("display__flex"); // Permet d'afficher la barre noire au dessus
    document.querySelector(".edit__link--modale").classList.add("display__inline"); // Permet d'afficher le bouton modifier à côté de "Mes Projets"

    // Changement du lien login en logout
    a__log.removeAttribute("href");
    a__log.textContent = "logout";

    // Pour se déconnecter
    a__log.addEventListener("click", function (e) {
        // Empêchez le lien de suivre le lien href par défaut
        e.preventDefault();
        if (!a__log.hasAttribute("href")) {
            localStorage.removeItem('token');
            location.reload();
        }
    });


    /************* Génération de l'intérieur de la modale **************/
    function generateModalWorks(works) {
        for (let i = 0; i < works.length; i++) {

            const figure = works[i];
            // Récupération de l'élément du DOM qui accueillera les fiches
            const articleEditWorks = document.querySelector(".articles__edit--works");
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

    document.querySelectorAll(".js-link__work--delete").forEach((a, index) => { // Pour chaque liens...
        a.addEventListener("click", async (e) => { // ... Ajouter un EventListener qui écoute le clic

            // Trouver le lien qui a été cliqué en utilisant l'ID
            const clickedLinkId = e.currentTarget.id;

            console.log(`Le lien avec l'ID ${clickedLinkId} a été cliqué.`);

            e.preventDefault();

            const url = `http://localhost:5678/api/works/${clickedLinkId}`;
            const figureToDelete = document.querySelector(`[data-id="${clickedLinkId}"]`); // Récupérer la figure qui correspond au même ID que le lien

            const response = await fetch(url, {
                method: `DELETE`,
                headers: {
                    Authorization: `Bearer ${token}`, // En-tête d'authentification
                },
            })

            if (response.status === 200 || response.status === 204) { // Si le statut de la réponse est 200 ou 204 (réponse réussie sans contenu)
                console.log("La suppression a réussi")
                figureToDelete.remove(); // Supprimer le travail
            } else {
                console.log(token)
                console.log(`Statut de réponse : ${response.status}`);
            }
        });
    })
}


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
    btnFilter.addEventListener("click", function () {
        const worksFiltered = works.filter(function (work) { // Appel de la fonction filtrage sur chaque élément du tableau works
            return work.categoryId === Id; // Retourner les élémennts ayant la même catégorieId que Id
        });
        document.querySelector(".gallery").innerHTML = ""; // Efface tout le HTML de la classe .gallery
        unselectAllbuttons() // Appel de la fonction enlevant la classe .selected à tous les boutons de la classe .filters
        btnFilter.classList.add("selected") // Attribution de la classe .selected au bouton btnFilter
        generateWorks(worksFiltered); // Générer la page avec le filtre appliqué
        isAllDisplayed = false; // Variable pour suivre l'état actuel du bouton "Tout afficher"
    });
}

// Code pour le bouton "Tous" affichant tous les travaux
const btnFilterAll = document.querySelector(".btnFilterAll");
btnFilterAll.addEventListener("click", function () {
    if (!isAllDisplayed) { // Si isAllDisplayed === false
        document.querySelector(".gallery").innerHTML = "";
        generateWorks(works); // Affiche toutes les œuvres non filtrées
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

