async function logout() {
    console.log('==========logout.js==========');
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        // This line seems to work when I make it /login
        // But being directed to '/' is supposed to check if there's a session and if not, 
        // Direct you back to the login page
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('#logout').addEventListener('click', logout);