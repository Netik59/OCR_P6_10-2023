//import { editMode } from "./script.js";






// email: sophie.bluel@test.tld
// password: S0phie


const btnConnect = document.getElementById("connect");

btnConnect.addEventListener("click", async function (event) {
    event.preventDefault(); // Empêcher le formulaire de se soumettre


    // Récupérer les valeurs de l'e-mail et du mot de passe
    let valueEmail = document.getElementById("email").value
    let valuePassword = document.getElementById("motdepasse").value

    const url = 'http://localhost:5678/api/users/login';
    const data = {
        email: valueEmail,
        password: valuePassword
    };

    const response = await fetch(url, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (response.status > 499) { // Si le serveur est éteint
        console.log(response)

        return // S'arrêter ici
    }

    const body = await response.json();

    console.log(body);

    // Vérifier les identifiants
    if (response.status !== 200) { // Si le status n'est pas égal à "Connected"
        console.log(body.message)
        document.querySelector(".error_login").classList.remove("displayNone");


    }
    else if (response.status === 200) { // Si le status est égal à "connected"
        // Récupérer le token dans le body et le mettre dans le localStorage
        const token = body.token //const {token} = body --> Autre façon de l'écrire
        window.localStorage.setItem('token', token);
        window.location.href = "./index.html";
    }

});