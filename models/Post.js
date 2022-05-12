const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const User = require('./User');
// const bcrypt = require('bcrypt');

class Post extends Model {
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            post_id: body.post_id
        }).then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at', [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

Post.init({
    // Table Col Definitions Here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    post_url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isUrl: true
        }
    },
    post_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'user',
            key: 'id'
        }
    }
}, {
    hooks: {

    },
    // Table config options here
    // Passing in sequelize connection
    sequelize,
    // timestamps: true,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
})

module.exports = Post;