import * as express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send({});
});

router.get('/:id', (req, res, next) => {
    console.log(req.params.id);
});

router.post('/', (res, req, next) => {
    
});

export default router;