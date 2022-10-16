import { body } from 'express-validator'

export const commentCreateValidation = [
    body('text', 'Enter the text of the article').isLength({min: 2}).isString(),
];