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
        console.log('=====\nUSER HAS BEEN LOGGED OUT\n=====');
        document.location.replace('/login');
    } else {
        console.log('=====\nThere was an issue logging out\n=====');
        alert(response.statusText);
    }
}

document.querySelector('#logout').addEventListener('click', logout);