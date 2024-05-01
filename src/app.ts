import express from 'express';
import cors from 'cors';
import './models/index';
import {sequelize} from "./models";
import jobSeekerRoutes from "./routes/jobSeekerRoutes";
import { swaggerSpec } from './swaggerConfig';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // for parsing application/json

app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes
app.use('/job-seekers', jobSeekerRoutes);


// Sync models with the database
sequelize.sync({ force: true }).then(() => {
    console.log('Database tables altered!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
