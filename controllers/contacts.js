// I use a try/catch block to protect this function from crashing.
// The try section runs the code that should work normally.
// If something goes wrong, the catch section handles the error
// instead of letting the server break. It's like a safety net
// that keeps the API stable even when an operation fails.

// Validation lets me check the data before using it, and error 
// handling lets me catch problems after the code runs.

// I use validation to check the data BEFORE I try to work with it.
// This lets me confirm things like: the ID has the right format,
// the required fields are present, and the request body is complete.
// Validation helps me stop bad data before it reaches the database.

// I use error handling (try/catch) to protect the server WHILE the code runs.
// Even if the database fails or something unexpected happens,
// the catch block lets me handle the error safely instead of crashing the server.
// This works like a safety net that keeps the API stable.

const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

/* ============================================================
   NOTE ABOUT MY APPROACH
   - I use validation middleware to check the request data BEFORE
     it reaches these controller functions.
   - Inside the controller, I focus only on database operations
     and error handling.
   - I use try/catch to protect the server from unexpected errors
     and send them to the global error handler.
   ============================================================ */


/* ============================================================
   GET ALL CONTACTS
   ============================================================ */
const getAll = async (req, res, next) => {
    //#swagger.tags=['Contacts']
    try {
        const result = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .find();

        result.toArray()
            .then((contacts) => {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(contacts);
            })
            .catch((err) => next(err));

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   GET SINGLE CONTACT
   ============================================================ */
const getSingle = async (req, res, next) => {
    //#swagger.tags=['Contacts']
    try {
        // I validate the ID format before querying the database.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const contactId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .find({ _id: contactId });

        result.toArray()
            .then((contacts) => {
                if (!contacts[0]) {
                    return res.status(404).json({ message: "Contact not found" });
                }

                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(contacts[0]);
            })
            .catch((err) => next(err));

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   CREATE CONTACT
   - Validation is handled by middleware before reaching here.
   ============================================================ */
const createContact = async (req, res, next) => {
    //#swagger.tags=['Contacts']
    try {
        // I build the contact object using the validated request body.
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .insertOne(contact);

        if (response.acknowledged) {
            return res.status(201).json({ id: response.insertedId });
        }

        return res.status(500).json(
            response.error || "Some error occurred while creating the contact."
        );

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   UPDATE CONTACT
   - ID validation happens here.
   - Body validation happens in middleware.
   ============================================================ */
const updateContact = async (req, res, next) => {
    //#swagger.tags=['Contacts']
    try {
        // I validate the ID format before updating.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const contactId = new ObjectId(req.params.id);

        // I build the updated contact object using validated data.
        const contact = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday
        };

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .replaceOne({ _id: contactId }, contact);

        if (response.modifiedCount > 0) {
            return res.status(204).send();
        }

        return res.status(500).json(
            response.error || "Some error occurred while updating the contact."
        );

    } catch (err) {
        next(err);
    }
};


/* ============================================================
   DELETE CONTACT
   ============================================================ */
const deleteContact = async (req, res, next) => {
    //#swagger.tags=['Contacts']
    try {
        // I validate the ID format before deleting.
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const contactId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .db()
            .collection('contacts')
            .deleteOne({ _id: contactId });

        if (response.deletedCount > 0) {
            return res.status(204).send();
        }

        return res.status(500).json(
            response.error || "Some error occurred while deleting the contact."
        );

    } catch (err) {
        next(err);
    }
};


module.exports = {
    getAll,
    getSingle,
    createContact,
    updateContact,
    deleteContact
};