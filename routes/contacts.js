const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts');

// GET all contacts
router.get('/', contactsController.getAll);

// GET a single contact
router.get('/:id', contactsController.getSingle);

// POST create a new contact
router.post('/', contactsController.createContact);

// PUT update a contact
router.put('/:id', contactsController.updateContact);

// DELETE remove a contact
router.delete('/:id', contactsController.deleteContact);

module.exports = router;