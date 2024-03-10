const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Afrid';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define MongoDB Schema
const userSchema = new mongoose.Schema({
  fullName: String,
  dateOfBirth: Date,
  gender: String,
  socialSecurityNumber: String,
  maritalStatus: String,
  phoneNumber: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const { fullName, dateOfBirth, gender, socialSecurityNumber, maritalStatus, phoneNumber, email } = req.body;

  const newUser = new User({
    fullName,
    dateOfBirth,
    gender,
    socialSecurityNumber,
    maritalStatus,
    phoneNumber,
    email,
  });

  newUser.save()
    .then((savedUser) => {
      console.log('User saved:', savedUser);
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Patient Registration Form</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: url('https://cdn.dribbble.com/users/879059/screenshots/4040043/ksam_concert_by_joakim_agervald.gif');
                background-size: cover;
                display: flex; 
                align-items: center;
                justify-content: center;
                height: 100vh;
              }

              .container {
                background-color: #ececee;
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }

              h1 {
                color: #101011;
              }

              .info-box {
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                margin-top: 20px;
              }

              .info-box p {
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Thank you for the application</h1>
              <div class="info-box">
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Date of Birth:</strong> ${dateOfBirth}</p>
                <p><strong>Gender:</strong> ${gender}</p>
                <p><strong>Social Security Number:</strong> ${socialSecurityNumber}</p>
                <p><strong>Marital Status:</strong> ${maritalStatus}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Email ID:</strong> ${email}</p>
              </div>
            </div>
          </body>
        </html>
      `);
    })
    .catch((error) => {
      console.error('Error saving user:', error);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Patient Registration Form listening on port ${PORT}`);
});
