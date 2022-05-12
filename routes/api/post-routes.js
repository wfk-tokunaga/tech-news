const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const sequelize = require('../../config/connection');
const { update } = require('../../models/User');

// Get all posts
router.get('/', (req, res) => {
    console.log(`====================`);
    Post.findAll({
            attributes: [
                'id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
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
                model: User,
                attributes: ['username']
            }]
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
    Post.upvote(req.body, { Vote })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json({ message: err });
        })
        // create the vote
})

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