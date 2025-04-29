// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./router/user');
const patients=require('./router/patient');
const connectDB = require('./config/db');
const Device = require('./models/devicedata'); // Import the Device model
const Livedata = require('./models/livedata'); 
// Initialize dotenv for environment variables
const dgram = require('dgram');
dotenv.config();


// Initialize Express app
const app = express();

// Middleware to parse JSON bodies

app.use(express.json());
const cors = require('cors');
app.use(cors({
  origin: '*' // Replace with your frontend URL if different
}));


  connectDB();
// Use user routes
app.use('/api', userRoutes);
app.use('/api', patients);
// 



// setTimeout(() => {
//   let udpMessage = [];
//   // Your code to use udpMessage goes here
//   console.log("5 minutes have passed, udpMessage is now:", udpMessage);
// }, 1 * 60 * 1000);


// let udpMessage = []; // Array to store and update JSON messages


// const UDP_IP = '0.0.0.0'; // Listen on all available interfaces
// const UDP_PORT = 12345;   // Port to listen on

// // Create a socket to listen for incoming UDP packets
// const server = dgram.createSocket('udp4');

// // Bind the server to the UDP port
// server.bind(UDP_PORT, UDP_IP, () => {
//   console.log(`Listening for UDP packets on ${UDP_IP}:${UDP_PORT}`);
// });

// // Function to add or update the array with new data
// function addOrUpdateData(newItem) {
//   // Check if the object already exists based on a unique property (e.g., 'Device')
//   const existingIndex = udpMessage.findIndex((item) => item.Device === newItem.Device);

//   if (existingIndex !== -1) {
//     // Update the existing data by merging the new data
//     udpMessage[existingIndex] = { ...udpMessage[existingIndex], ...newItem };
//   } else {
//     // Add new data
//     udpMessage.push(newItem);
//   }
// }

// // Event listener for incoming messages
// server.on('message', (msg, rinfo) => {
//   console.log('Raw message received:', msg); // Log raw message buffer
//   console.log('Message as string:', msg.toString()); // Log message as string

//   try {
//     const receivedData = JSON.parse(msg.toString()); // Parse incoming message as JSON

//     if (Array.isArray(receivedData)) {
//       // Handle array of objects (multiple boards sending data at once)
//       receivedData.forEach(addOrUpdateData);
//     } else if (typeof receivedData === 'object' && receivedData !== null) {
//       // Handle single JSON object (data from a single board)
//       addOrUpdateData(receivedData);
//     } else {
//       console.error('Invalid data format: Expected a JSON object or an array of objects.');
//     }

//     console.log('Updated UDP Messages:', udpMessage); // Print the updated array
//   } catch (error) {
//     console.error('Error while processing message:', error.message);
//     console.error('Invalid JSON received:', msg.toString());
//   }
// });

// // Event listener for error handling
// server.on('error', (err) => {
//   console.error(`Server error: ${err.stack}`);
//   server.close();
// });
let udpMessage = []; // Array to store and update JSON messages

const UDP_IP = '0.0.0.0'; // Listen on all available interfaces
const UDP_PORT = 123456;   // Port to listen on

// Create a socket to listen for incoming UDP packets
const server = dgram.createSocket('udp4');

// Bind the server to the UDP port
function cleanupUdpMessages() {
  const now = Date.now(); // Get the current time in milliseconds

  udpMessage = udpMessage.filter((item) => {
    const itemTime = new Date(
      item.year,
      item.month - 3, // JavaScript months are zero-based
      item.day,
      item.hour,
      item.minu,
      item.sec
    ).getTime(); // Convert item's timestamp to milliseconds

    const timeDifference = now - itemTime; // Calculate the time difference in milliseconds
    console.log(`Device: ${item.Device}, Time Difference (ms): ${timeDifference}`);

    // Keep only items within the last 2 minutes
    return timeDifference <= 2 * 60 * 1000;
  });

  // console.log('Updated UDP Messages:', udpMessage); // Log the updated udpMessage array
}

// Function to add a new UDP message
function addUdpMessage(newItem) {
  udpMessage.push(newItem);
}

// Create a UDP server


// Handle incoming UDP messages
server.on('message', (msg, rinfo) => {
  // console.log(`Message received from ${rinfo.address}:${rinfo.port}`);

  try {
    const receivedData = JSON.parse(msg.toString()); // Parse incoming message as JSON

    if (Array.isArray(receivedData)) {
      // Handle array of objects (multiple boards sending data at once)
      receivedData.forEach(addUdpMessage);
    } else if (typeof receivedData === 'object' && receivedData !== null) {
      // Handle single JSON object (data from a single board)
      addUdpMessage(receivedData);
    } else {
      console.error('Invalid data format: Expected a JSON object or an array of objects.');
    }

    // console.log('Updated UDP Messages:', udpMessage); // Print the updated udpMessage array
  } catch (error) {
    console.error('Error while processing message:', error.message);
    console.error('Invalid JSON received:', msg.toString());
  }
});

// Bind the server to the UDP port
server.bind(UDP_PORT, UDP_IP, () => {
  console.log(`Listening for UDP packets on ${UDP_IP}:${UDP_PORT}`);
});

// Run cleanup every 1 minute
setInterval(() => {
  console.log('Running cleanup...');
  cleanupUdpMessages();
}, 1 * 60 * 1000); // 1 minute in milliseconds
app.post('/api/user/putdetails', async (req, res) => {
  const{device1}=req.body;
  // console.log("the device",device1);
  
  try {
    const data = udpMessage; // Assume this is an array of objects

    // Replace '00:5f:bf:c0:4e:3a' with the specific device you're looking for
    const specificDevice = device1;

    // Filter the data for the specific device
    const filteredData = Array.isArray(data)
      ? data.filter(item => item.Device1=== specificDevice)
      : data.Device1=== specificDevice
      ? [data]
      : [];

    // console.log('Filtered Data:', filteredData);

    res.json({
      message: 'Device data retrieved and stored successfully',
      data: filteredData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});
function cleanupUdpMessages() {
  const now = Date.now(); // Get the current time in milliseconds

  udpMessage = udpMessage.filter((item) => {
    const itemTime = new Date(
      item.year,
      item.month - 3, // JavaScript months are zero-based
      item.day,
      item.hour,
      item.minu,
      item.sec
    ).getTime(); // Convert item's timestamp to milliseconds

    const timeDifference = now - itemTime; // Calculate the time difference in milliseconds
    console.log(`Device: ${item.Device}, Time Difference (ms): ${timeDifference}`);

    // Keep only items within the last 2 minutes
    return timeDifference <= 2 * 60 * 1000;
  });

  console.log('Updated UDP Messages:', udpMessage); // Log the updated udpMessage array
}

// Simulate adding a new item to the udpMessage array
function addUdpMessage(newItem) {
  udpMessage.push(newItem);
}

patientdata=[]


// app.post('/api/user/senddetails', async (req, res) => {
//   const { updatedData } = req.body;
//   //  console.log("the update ",updatedData)
//   try {
//        patientdata = updatedData; // Assume this is an array of objects
//     res.json({
//       message: 'Device data retrieved and stored successfully',
//     });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Error fetching data' });
//   }
// });
app.post('/api/user/senddetails', async (req, res) => {
  const { updatedData } = req.body;
  // console.log(updatedData);
  patientdata = updatedData;

  try {
    const newItem = updatedData[0]; // Assuming updatedData contains the new data

    // Convert the new data's timestamp to a Date object
    const newTimestamp = new Date(newItem.year, newItem.month - 1, newItem.day, newItem.hour, newItem.minu, newItem.sec);

    // Check if data with the same `Device`, `name`, and `timestamp` already exists
    const existingData = await Livedata.findOne({
      Device: newItem.Device,
      name: newItem.name,
      timestamp: newTimestamp
    });

    if (existingData) {
      // If existing data is found, update it with the new details
      await Livedata.updateOne(
        { _id: existingData._id },
        { $set: { ...newItem, timestamp: newTimestamp } }
      );

      res.json({ message: 'Existing data updated successfully' });
      console.log("Updated existing data");
    } else {
      // If no matching data is found, create a new entry
      const deviceData = new Livedata({
        ...newItem,
        timestamp: newTimestamp
      });
      await deviceData.save();

      res.json({ message: 'New data added successfully' });
      console.log("Added new data");
    }
  } catch (error) {
    // console.error('Error fetching or saving data:', error);
    res.status(500).json({ error: 'Error fetching or saving data' });
  }
});
app.get('/api/user/getdetails/:name', async (req, res) => {
  const { name } = req.params; // Extract the name parameter from the request URL
  // console.log("name",name);
  
  try { 
    // Find all documents where the 'name' field matches the provided name
    const userDetails = await Livedata.find({ name: name });

    if (userDetails.length > 0) {
      // If records are found, send them to the frontend
      res.json({ success: true, data: userDetails });
    } else {
      // If no records are found, send an appropriate response
      res.status(404).json({ success: false, message: 'No data found for the specified name' });
    }
  } catch (error) {
    console.error('Error fetching data from the database:', error);
    res.status(500).json({ success: false, error: 'Error fetching data from the database' });
  }
});
app.post('/api/user/get/:name', async (req, res) => {
  const {name } = req.params;
  // console.log("the name",name);
  try {
    const givenName = name;

    // Filter the data for the specific device
    const filteredData = patientdata.filter(
      (item) => item.name === givenName
    );
      //  console.log(filteredData);
       
    res.json({
      message: 'Device data retrieved and stored successfully',
      data: filteredData,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});
app.post('/api/data', (req, res) => {
  const data=udpMessages;
  // console.log(data)
  res.json({ message: 'Patients retrieved successfully',data});
});




app.post('/app/user/store', async (req, res) => {
  const { doctor1, selectedGender, data } = req.body;
  console.log(doctor1, selectedGender, data );
  
  // Validate doctor1 and selectedGender
  if (!doctor1 || !selectedGender) {
    return res.status(400).json({ error: 'Doctor and patient are required.' });
  }

  try {
    // Find the existing document for the given doctor1 and selectedGender
    let record = await Livedata.findOne({ doctor: doctor1, patient: selectedGender });

    // Check if the new data already exists
    const isDuplicate = record?.data.some(
      (entry) =>
        entry.year === data.year &&
        entry.month === data.month &&
        entry.day === data.day &&
        entry.hour === data.hour &&
        entry.minu === data.minu &&
        entry.sec === data.sec
    );

    if (isDuplicate) {
      console.log('Duplicate data found, not appending.');
      return res.status(200).json({ message: 'Duplicate data, no append.' });
    }

    // If no record exists, create a new one
    if (!record) {
      record = new Livedata({
        doctor: doctor1,
        patient: selectedGender,
        data: [data],
      });
    } else {
      // Otherwise, append the new data
      record.data.push(data);
    }

    // Save the updated record
    await record.save();

    res.status(201).json({ message: 'Data stored successfully', record });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ error: 'Error storing data' });
  }
});






app.get('/', (req, res) => {
  res.send('Hello, MongoDB and Node.js!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
