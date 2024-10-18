require("dotenv").config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// // MongoDB connection
mongoose.connect('mongodb://localhost:27017/employees')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error:', err));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  salary: Number
});

const Employee = mongoose.model('Employee', employeeSchema);

app.get('/' , (req,res)=>{
  try{
    res.json({message : "This is from nodejs server"});
  }
  catch(err){
    res.send(err);
  }
})

app.get('/get-employees' , async (req,res)=>{
  try{
    const employees = await Employee.find();
    console.log(employees);
    res.json({"Employees": employees});
  }
  catch(err){
    res.status(500).send(err);
  }
})

// Delete API request
app.delete('/delete/:id' , async (req,res)=>{
  try{
    const id = req.params.id;
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    res.status(200).send(deletedEmployee);
  }
  catch(err){
    res.status(500).send(err);
  }
})

// POST route to add employee data
app.post('/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

