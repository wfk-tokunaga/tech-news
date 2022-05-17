const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const { update } = require('../../models/User');

// Get all posts
router.get('/', (req, res) => {
    console.log(`====================`);
    Post.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            attributes: [
                'id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            include: [{
                model: Comment,
                attributes: [
                    'comment_text', 'user_id', 'post_id', 'created_at'
                ],
                // Nested include to replace user_id with username
                include: {
                    model: User,
                    attributes: ['username']
                }
            }, {
                model: User,
                attributes: ['username']
            }],
        }).then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })


});

// Get individual post
router.get('/:id', (req, res) => {
    console.log(`====================`);
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            include: [{
                    model: Comment,
                    attributes: [
                        'comment_text', 'user_id', 'post_id', 'created_at'
                    ],
                    // Nested include to replace user_id with username
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        }).then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: "No post found with this id" });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

// Create a new post
router.post('/', (req, res) => {
    console.log(`====================`);
    Post.create({
            title: req.body.title,
            post_url: req.body.post_url,
            user_id: req.body.user_id,
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/upvote', (req, res) => {
    // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Post.upvote({...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

// Update title of post with specific id
router.put('/:id', (req, res) => {
    Post.update({
        title: req.body.title
    }, {
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: "No post found with that id." })
            return;
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Delete a post with a specific id
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(dbPostData => {
        // Check if post exists
        if (!dbPostData) {
            res.status(404).json({ message: "Could not find a post with that id." });
            return
        }
        res.json(dbPostData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});



module.exports = router;