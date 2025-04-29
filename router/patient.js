const express = require('express');
const Patient = require('../models/patient');
const multer = require('multer'); // Import multer
const router = express.Router();

// Set up multer to store images in memory
const storage = multer.memoryStorage(); // You can change to diskStorage if needed
const upload = multer({ storage });

// The route to handle image upload and patient data update
router.put('/user/patients/:main', upload.single('image'), async (req, res) => {
  try {
    const { main } = req.params;
    const { username, nurse, contact, date, age,genter } = req.body;
    const image = req.file; // Get the uploaded image file

    console.log("The name:", main);

    // Convert the image to base64 if it exists
    let imageBase64 = undefined;
    if (image) {
      imageBase64 = image.buffer.toString('base64'); // Convert image buffer to base64
    }

    // Data to update or insert
    const updatedData = {
      main,     // Include the main field
      username,
      nurse,
      contact,
      date,
      age,
      genter,
      ...(imageBase64 && { image: imageBase64 }) // Add the image only if it's available
    };

    // Use 'upsert' to update if the document exists or insert a new one
    const result = await Patient.findOneAndUpdate(
      { username }, // Search for document with 'username'
      updatedData, // The updated data
      { new: true, upsert: true, setDefaultsOnInsert: true } // Create a new document if not found
    );

    // Response
    res.json({ message: 'Data updated or added successfully', data: result });
    console.log("Operation successful:", result);
  } catch (error) {
    console.error('Error updating or adding data:', error);
    res.status(500).json({ error: 'Error updating or adding data' });
  }
});

// Route to get all patients
router.get('/user/details/:main', async (req, res) => {
    try {
      const { main } = req.params;
   ;
      // Find all patients that match the 'main' field
      const patients = await Patient.find({ main }); // This will return an array of patients
  
      if (patients.length === 0) {
        return res.status(404).json({ message: 'No patients found for the given main value' });
      }
  
      // Return the found patients
      res.json({ message: 'Patients retrieved successfully', data: patients });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });
  router.post('/user/patient/:username', async (req, res) => {
    try {
      const { username } = req.params;
      console.log("the test",username);
      
      // Find all patients that match the 'main' field
      const patients = await Patient.findOne({ username });
      if (patients.length === 0) {
        return res.status(404).json({ message: 'No patients found for the given main value' });
      }
  
      // Return the found patients
      console.log(patients)
      res.json({ message: 'Patients retrieved successfully', data:patients });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });

  


  // router.post('/user/putdetails', async (req, res) => {
  //   try {
  //     const {lastJsonData} = req.body;

  //     console.log("the data ",lastJsonData);
    
     
  //     res.json({ message: 'Patients retrieved successfully',lastJsonData});
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     res.status(500).json({ error: 'Error fetching data' });
  //   }
  // });


module.exports = router;
