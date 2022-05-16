const router = require('express').Router();
const { Comment } = require('../../models');

// Get all comments
router.get('/', (req, res) => {
    console.log(`====================`);
    Comment.findAll()
        .then(dbCommentData => {
            res.json(dbCommentData)
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// Get individual comment
router.get('/:id', (req, res) => {
    console.log(`====================`);
    Comment.findOne({
        where: {
            id: req.query.id
        },
        attributes: [
            'id', 'comment_text', 'post_id', 'user_id'
        ]
    }).then(dbCommentData => {
        res.json(dbCommentData)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// Create new comment
router.post('/', (req, res) => {
    console.log(`====================`);
    Comment.create({
            comment_text: req.body.comment_text,
            user_id: req.body.user_id,
            post_id: req.body.post_id
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// Update title of post with specific id
router.put('/:id', (req, res) => {

});

// Delete a comment with a specific id
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: "No comment with that ID found." });
            return;
        }
        res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.json(err);
    })
});



module.exports = router;