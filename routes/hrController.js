// controller.js
const express = require('express');
const hrrouter = express.Router();
const multer = require('multer');
const path = require('path');

const { hrRegModel,loginModel,postModel,applyModel } = require('../models/userModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/public/uploads')); 
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  },
 });
 
 const upload = multer({ storage: storage });
// jobrouter.post('/userhomedata', async (req, res) => {
//     try {
//         console.log("jgdcejvcjhbjhsdbcjshbc bbbbbbbbbbb")

//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


hrrouter.get('/hrhomedata', async (req, res) => {
    try {
        uid=req.session.user_id
        const userdata = await hrRegModel.findOne({ loginid: uid });
        const logindata = await loginModel.findOne({ _id: uid });
        const postdata = await postModel.find({ hrloginid: uid });
        if (userdata) {
            res.json({userdata:userdata,logindata:logindata,postdata});
          } else {
            res.status(404).json({ error: 'User data not found' });
          }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


//  hrrouter.post('/addpost', upload.single('photo'), async (req, res) => {
//   try {
//     console.log("enter to add post");
//     console.log(req.body)
//     console.log(req.file)
//     const { role, location, experience, jobtype, description,time } = req.body; // Access other form fields from req.body
//     const photo = req.file; // Access the uploaded file using req.file
//     console.log(photo)
//     console.log(photo.originalname);
//      postphoto=photo.originalname
//      hrloginidto=req.session.user_id
//      console.log(hrloginidto)

//      const addpostto = new postModel({
//       role,
//       location,
//       experience,
//       jobtype,
//       description,
//       photo:postphoto,
//       hrloginid:hrloginidto,
//       time
//     });
//     console.log("addpostto",addpostto);
//     await addpostto.save();


//     res.status(201).json({});
//     // res.status(201).json({ user: savelogin });
//   } catch (error) {
//     res.status(500).json({ error: 'Could not insert data' });
//   }
// });
// hrrouter.post('/addpost', upload.single('photo'), async (req, res) => {
//   try {
//     // console.log("enter to add post");
//     // console.log(req.body)
//     const { role, location, experience, jobtype, description,time } = req.body; // Access other form fields from req.body
//     const photo = req.file; // Access the uploaded file using req.file
//     // console.log(photo)
//     // console.log(photo.originalname);
//      postphoto=photo.originalname
//      hrloginidto=req.session.user_id
//     //  console.log(hrloginidto)

//      const addpostto = new postModel({
//       role,
//       location,
//       experience,
//       jobtype,
//       description,
//       photo:postphoto,
//       hrloginid:hrloginidto,
//       time
//     });
//     await addpostto.save();


//     res.status(201).json({});
//     // res.status(201).json({ user: savelogin });
//   } catch (error) {
//     res.status(500).json({ error: 'Could not insert data' });
//   }
// });




hrrouter.post('/addpost', async (req, res) => {
  try {
    console.log("enter to add post");
    console.log(req.body)
    const { role, location, experience, jobtype, description,time,photo } = req.body; // Access other form fields from req.body
    // const photo = req.file; // Access the uploaded file using req.file
    // console.log(photo)
    // console.log(photo.originalname);
    //  postphoto=photo.originalname
     hrloginidto=req.session.user_id
    //  console.log(hrloginidto)

     const addpostto = new postModel({
      role,
      location,
      experience,
      jobtype,
      description,
      photo,
      hrloginid:hrloginidto,
      time
    });
    await addpostto.save();


    res.status(201).json({});
    // res.status(201).json({ user: savelogin });
  } catch (error) {
    res.status(500).json({ error: 'Could not insert data' });
  }
});

hrrouter.get('/mypost', async (req, res) => {
  try {
    // console.log("HAIII");
    uid=req.session.user_id
      const postdata = await postModel.aggregate([
        {
          $lookup: {
            from: "hrs",
            localField: "hrloginid",
            foreignField: "loginid",
            as: "allpost" 
          }
        },{
          $match: {
            hrloginid: uid
          }
        }
      ]);
      // console.log(postdata);
      if (postdata) {
          res.json({postdata:postdata});
        } else {
          res.status(404).json({ error: 'User data not found' });
        }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







hrrouter.post('/updatehrreg',upload.array('photos', 2), async (req, res) => {
  try {
    // console.log("req.body");
    // console.log(req.body);
    const {name,
      about,
      company,
      contact,}=req.body
    uid=req.session.user_id;
    photos=req.files;
    // console.log("photo--->",req.files);

    // console.log("photo--->",photos);
    const photo1 = photos[0];
    const photo2 = photos[1];
    // console.log(photo1)
    // console.log(photo2)
    const cover = photo1.originalname;
    const profile = photo2.originalname;

    const updatepdata = {
      name,
      about,
      company,
      contact,
      cover,
      profile
    };

    updatedata = await hrRegModel.updateMany({loginid:uid}, { $set: updatepdata});
    res.status(201).json({ user:updatedata });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Could not insert data' });
  }
});



hrrouter.get('/allapplications', async (req, res) => {
  try {
      uid=req.session.user_id
      // console.log(uid);
      // const ObjectId = mongoose.Types.ObjectId;
      // const hrdata = await applyModel.findOne({ loginid: uid });
      // console.log(hrdata);
      const applications = await applyModel.aggregate([
        {
          $addFields: {
            // Convert the 'postid' field to ObjectId
            postid: { $toObjectId: '$postid' }
          }
        },
        {
          $lookup: {
            from: "jobposts",
            localField: "postid",
            foreignField: "_id",
            as: "alljob" 
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "userid",
            foreignField: "loginid",
            as: "alluser" 
          }
        },
        {
          $match: {
           "alljob.hrloginid": uid
          }
        }
      ]);
      // console.log(applications);
      // console.log(applications[0].alljob);
      // console.log(applications[0].alluser);
      
      if (applications) {
          res.json({data:applications});
        } else {
          res.status(404).json({ error: 'User data not found' });
        }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


hrrouter.delete('/deletepost/:pid', async (req, res) => {
  try {
    post_id=req.params.pid
    // console.log(post_id);
    deletepost = await postModel.findByIdAndDelete(post_id);
    // deleteapplication = await applyModel.findManyAndDelete({postid:post_id});
    const deletedApplications = await applyModel.deleteMany({ postid: post_id });

    if (deletepost && deletedApplications) {
      res.status(201).json({ message:"deleted" });
    } else {
      res.status(404).json({ error: 'not deleted' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

hrrouter.get('/userprofiledata/:lid', async (req, res) => {
  try {
    login_id=req.params.lid
    console.log(login_id);
    const profiledata = await hrRegModel.findOne({ loginid:login_id });
    const postdata = await postModel.find({ hrloginid: login_id });

// console.log(postdata);
res.status(201).json({ profiledata ,postdata});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = hrrouter;