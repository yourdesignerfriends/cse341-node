const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');
const { saveContact } = require('../middleware/validate');

// GET all contacts
router.get('/', contactsController.getAll);

// GET a single contact
router.get('/:id', contactsController.getSingle);

// POST create a new contact (with validation middleware)
router.post('/', saveContact, contactsController.createContact);

// PUT update a contact (with validation middleware)
router.put('/:id', saveContact, contactsController.updateContact);

// DELETE remove a contact
router.delete('/:id', contactsController.deleteContact);

module.exports = router;