import { body } from 'express-validator'

export const postCreateValidation = [
    body('title', 'Enter the title of the article').isLength({min: 3}).isString(),
    body('text', 'Enter the text of the article').isLength({min: 10}).isString(),
    body('tags', 'I	"No access"nvalid tag format').optional().isString(),
    body('imageUrl', 'Incorrect link').optional().isString(),
];