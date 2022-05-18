/* 
Contains all the user facing routes, 
such as the homepage and login page
*/

const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// Can use res.render(template, data) to render a template and fill it in with data
router.get('/', (req, res) => {
    console.log(req.session);

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
    }).then(dbPostData => {
        // Render 'homepage' with the data from our sequelize
        console.log(dbPostData[0].get({ plain: true }));
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/login', (req, res) => {
    console.log('\n=====CHECKING IF LOGGED IN=====\n');
    if (req.session.loggedIn) {
        console.log('\n=====USER IS LOGGED IN ALREADY=====\n');
        res.redirect('/');
        return;
    }
    console.log('\n=====USER IS NOT LOGGED IN, RENDERING LOGIN PAGE=====\n');
    res.render('login');
});

// Rendering a single post by id
router.get('/post/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
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
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            res.render('single-post', { post, loggedIn: req.session.loggedIn });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;