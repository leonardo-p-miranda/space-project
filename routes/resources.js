const express = require("express");

const { createResource, getResources, getResource, deleteResource, updateResource } = require('../controllers/resources.js');

const router = express.Router();

router.get('/', getResources);

router.post('/', createResource);

router.get('/:id', getResource);

router.delete('/:id', deleteResource);

router.put('/:id', updateResource);

module.exports = router;