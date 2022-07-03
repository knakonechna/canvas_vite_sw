import { rest } from 'msw';

export const handlers = [
    rest.post('/image',  (req, res, ctx) => {

        localStorage.setItem('image', req.body as string);
        return res(
            // Respond with a 200 status code
            ctx.status(200),
        )
    }),
    rest.get('/image', async (req, res, ctx) => {
        const image = localStorage.getItem('image');

        return res(ctx.json({image}));
    }),
    rest.delete('/image', async (req, res, ctx) => {
       localStorage.removeItem('image');

        return res(ctx.status(200));
    }),
]