import express from 'express';
import routes from "./src/routes/index.js";
import {connectDB} from "./src/config/database.js";

const index = express();
await connectDB();

index.use(express.json());
index.use(express.urlencoded({extended: false}));

index.use('/api', routes);

const port = process.env.PORT || 3000;
index.listen(port, () => {
    console.log(`Server running on port ${port}`);
});