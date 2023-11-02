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


/*************************************** Partie login *****************************************/

let token = window.localStorage.getItem('token');

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

// Fonction qui prend en paramètre l'événément pour ouvrir la modale
const openModal = function (e) { 
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href")); // Trouver l'élément qui est cible par rapport au lien
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
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
    modal.classList.add("displayNone"); 
    modal.setAttribute("aria-hidden", true);
    modal.setAttribute("aria-modal", false);
    // Supprimer les listeners
    modal.removeEventListener("click", closeModal); 
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal); 
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null; // Remettre la variable à null car la modale sera fermée donc nulle 
}

// Fonction pour éviter que la modale se ferme lorsqu'on clique à l'intérieur de celle ci
const stopPropagation = function(e) {
    e.stopPropagation();
}

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(`:focus`)); // Permet de trouver l'élément qui correspond à l'élément focus
    index++;
    if (index >= focusables.length) {
        index = 0;
    }
    focusables[index].focus();
}

if (token) {
    document.querySelector(".edit_mode").classList.add("display__flex");
    document.querySelector(".edit__link--modale").classList.add("display__inline");

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

