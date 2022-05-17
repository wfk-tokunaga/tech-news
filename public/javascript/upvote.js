async function upvoteClickHandler(event) {
    event.preventDefault();

    // Why dont these console log to the vscode teminal?
    console.log('\n\nbutton clicked\n\n');

    // Using this to get the post_id from the path
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    // Once we have the post_id, we can make a request
    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        alert(response.statusText);
    }


}

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);