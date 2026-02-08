const express = require('express');
const { body, validationResult } = require('express-validator');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation rules
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters')
];

// POST /api/contact
router.post('/', contactValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }

    const { name, email, message } = req.body;

    try {
        // Send email
        await emailService.sendContactEmail(name, email, message);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later or email me directly.'
        });
    }
});

module.exports = router;
