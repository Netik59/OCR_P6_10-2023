//import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis, afficherGraphiqueCommentaire } from "./avis.js";

//Récupération des projets eventuellement stockées dans le localStorage
let works = window.localStorage.getItem('works');

if (works === null) {
    // Récupération des projets depuis l'API
    const answer = await fetch('http://localhost:5678/api/works');
    works = await answer.json();
    // Transformation des projets en JSON
    const valueWorks = JSON.stringify(works);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("works", valueWorks);
} else {
    works = JSON.parse(works);
}

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
filters(btnFilterObjects, 1)

const btnFilterApartments = document.querySelector(".btnFilterApartments");
filters(btnFilterApartments, 2)

const btnFilterHotelRestau = document.querySelector(".btnFilterHotelRestau");
filters(btnFilterHotelRestau, 3)

