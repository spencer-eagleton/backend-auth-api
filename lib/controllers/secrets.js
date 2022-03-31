const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const Secret = require('../models/Secret');


module.exports = Router()
  .get('/', authenticate, authorize, async (req, res, next) => {
    try {
      const secrets = [
        {
          id: '1',
          title: 'Gettin jiggy widdit',
          description: 'Its litty',
        },
      ];

      res.send(secrets);
    } catch (error) {
      next(error);
    }
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      const { id } = req.user;
      
      const { title, description } = req.body;
      const secret = await Secret.create({ id, title, description });
      res.send(secret);
    } catch (error) {
      next(error);
    }
  });
