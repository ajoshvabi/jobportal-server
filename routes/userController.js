// controller.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { userRegModel, loginModel,hrRegModel } = require('../models/userModel');

router.post('/userreg', async (req, res) => {
  try {
    // Set the default user type to 1
    const usertype = 1;

    // Extract email and password from the request body
    console.log(req.body);
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new loginModel instance
    const newlogin = new loginModel({
      email,
      password:hashedPassword,
      usertype,
    });

    // Save the login data and get the saved login ID
    const savelogin = await newlogin.save();
    const loginid = savelogin._id;

    // Extract name, about, stack, and contact from the request body
    const { name, about, stack, contact } = req.body;

    // Create a new userRegModel instance with the login ID
    const savedUser = new userRegModel({
      name,
      about,
      loginid,
      contact,
      stack,
      profile:'profilepic.jpg',
      email
    });

    // Save the user data
    await savedUser.save();

    // Respond with a 201 status and the saved login data
    res.status(201).json({ user: savelogin });
  } catch (error) {
    // Handle errors with a 500 status and an error message
    res.status(500).json({ error: 'Could not insert data' });
  }
});


// hr registration

router.post('/hrreg', async (req, res) => {
  try {
    // Set the default user type to 1
    const usertype = 2;
    console.log(req.body);

    // Extract email and password from the request body
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new loginModel instance
    const newlogin = new loginModel({
      email,
      password:hashedPassword,
      usertype,
    });

    // Save the login data and get the saved login ID
    const savelogin = await newlogin.save();
    const loginid = savelogin._id;
    // console.log("user"+savelogin);

    // Extract name, about, stack, and contact from the request body
    const { name, about, company, contact } = req.body;

    // Create a new userRegModel instance with the login ID
    const savedUser = new hrRegModel({
      name,
      about,
      loginid,
      contact,
      company,
      profile:'profilepic.jpg',

    });

    // Save the user data
    await savedUser.save();

    // Respond with a 201 status and the saved login data
    res.status(201).json({ user: savelogin });
  } catch (error) {
    // Handle errors with a 500 status and an error message
    res.status(500).json({ error: 'Could not insert data' });
  }
});




//login


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginData = await loginModel.findOne({ email });

    if (loginData) {
      bcrypt.compare(password, loginData.password, function (err, result) {
        if (err) {
          throw err;
        } else {
          if (result) {
            req.session.user_id = loginData._id;
            req.session.usertype = loginData.usertype;
            if (loginData.usertype === 0) {
              userTypeString = 'admin';
            } else if (loginData.usertype === 1) {
              userTypeString = 'user';
            } else if (loginData.usertype === 2) {
              userTypeString = 'hr';
            }
            res.status(201).json({ user: result,usertype: userTypeString  });
          } else {
            // console.log("Login failed");
            res.status(401).json({ error: 'Login failed' });
          }
        }
      });
    } else {
      // console.log("User not found");
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/logout', async (req, res) => {
  try {
   islogout= req.session.destroy(function(err) {
   })
   if(islogout){
    res.status(201).json({islogout});
   }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;

































// // controller.js
// const express = require('express');
// const router = express.Router();
// const { userRegModel,loginModel } = require('../models/userModel');



// router.post('/userreg', async (req, res) => {

//     try {
//         var usertype=1;
//         const {email,password}=req.body;
//         const newlogin= new loginModel({
//             email,
//             password,
//             usertype
//         })
//         const savelogin=await newlogin.save();
//         var loginid=savelogin._id
//             const {name,about,stack,contact}=req.body;
            
//             const savedUser = new userRegModel({
//                 name,
//                 about,
//                 loginid,
//                 contact,
//                 stack
//             })
//             await savedUser.save();
//           res.status(201).json({ user: savelogin }); 
//         } catch (error) {
//           res.status(500).json({ error: 'Could not insert data' });
//         }
//       });




// module.exports = router;


