import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import eventRoute from './routes/eventRoute';

const port = process.env.PORT || 3001;

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campaignService';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Could not connect to the database", error);
  }
};

connectToDatabase();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/event', eventRoute);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
