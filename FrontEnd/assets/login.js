async function fetchData() {
    // Récupération des projets depuis l'API
    const answer = await fetch('http://localhost:5678/api/login');
    login = await answer.json();
    // Transformation des projets en JSON
    const valueLogin = JSON.stringify(login);
}

fetchData(); // Appel de la fonction asynchrone pour exécuter le code