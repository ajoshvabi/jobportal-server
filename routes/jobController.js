// controller.js
const express = require('express');
const jobrouter = express.Router();
const path = require('path');
const multer = require('multer');
const { userRegModel, loginModel, postModel, applyModel, hrRegModel } = require('../models/userModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../client/public/uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });



jobrouter.get('/checksession', async (req, res,next) => {
  if (req.session.user_id && req.session.usertype) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized - Please log in' });
  }
})


// const requireLogin =async (req, res, next) => {
//   if (req.session.user_id && req.session.usertype) {
//     next();
//   } else {
//     console.log("pochu");
    
//     // res.redirect('/');
//     res.status(401).json({ error: 'Unauthorized - Please log in' });
//   }
// };


jobrouter.get('/userhomedata', async (req, res) => {
  try {
    uid = req.session.user_id
    const userdata = await userRegModel.findOne({ loginid: uid });
    const logindata = await loginModel.findOne({ _id: uid });
    if (userdata) {
      res.json({ userdata: userdata, logindata: logindata });
    } else {
      res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

jobrouter.get('/fetchAppication', async (req, res) => {
  try {
    uid = req.session.user_id
    // const appicationdata = await applyModel.find({ userid: uid });
    const appicationdata = await applyModel.aggregate([
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
          as: "postdata"
        }
      },
      {
        $match: {
          userid: uid
        }
      }
    ]);
    // console.log("haiii");
    // console.log(appicationdata);

    if (appicationdata) {
      res.json({ data: appicationdata});
    } else {
      res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



jobrouter.get('/jobpostdata', async (req, res) => {
  try {
    const postdata = await postModel.aggregate([
      {
        $lookup: {
          from: "hrs",
          localField: "hrloginid",
          foreignField: "loginid",
          as: "allpost"
        }
      }
    ]).sort({ time: -1 });
    if (postdata) {
      // console.log(postdata);
      res.json({ postdata: postdata });
    } else {
      res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


jobrouter.post('/searchfor', async (req, res) => {
  try {
    // console.log("body---" + req.body.search)
    ser = req.body.search
    const caseInsensitiveRegex = new RegExp(ser, 'i');

    const searchdata = await postModel.aggregate([
      {
        $lookup: {
          from: "hrs",
          localField: "hrloginid",
          foreignField: "loginid",
          as: "allpost"
        }
      },
      {
        $match: {
          $or: [
            { "role": { $regex: caseInsensitiveRegex } },
            { "location": { $regex: caseInsensitiveRegex } },
            // { "experience": { $regex: caseInsensitiveRegex } },
            { "jobtype": { $regex: caseInsensitiveRegex } },
            { "allpost.company": { $regex: caseInsensitiveRegex } },
            { "allpost.name": { $regex: caseInsensitiveRegex } },
          ]
        }
      }
    ]).sort({ time: -1 });




    // console.log(searchdata)
    if (searchdata) {
      res.json({ searchdata: searchdata });
    } else {
      res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// jobrouter.get('/jobpostdata', async (req, res) => {
//   try {
//     const postdata = await postModel.aggregate([
//       {
//         $lookup: {
//           from: "hrs",
//           localField: "hrloginid",
//           foreignField: "loginid",
//           as: "allpost" 
//         }
//       },
//       {
//         $unwind: "$allpost" // Unwind the allpost array
//       },
//       {
//         $sort: { "allpost.time": -1 } // Sort in descending order based on the "time" field of "allpost"
//       }
//     ]);

//     if (postdata) {
//       res.json({ postdata: postdata });
//     } else {
//       res.status(404).json({ error: 'User data not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


jobrouter.post('/updateuserreg', upload.array('photos', 3), async (req, res) => {
  try {
    // console.log("req.body");

    // console.log(req.body);
    const { name,
      about,
      stack,
      contact, } = req.body
    uid = req.session.user_id;
    photos = req.files;
    // console.log("photo--->", req.files);

    // console.log("photo--->", photos);
    const photo1 = photos[0];
    const photo2 = photos[1];
    const photo3 = photos[2];
    // console.log(photo1)
    // console.log(photo2)
    const cover = photo1.originalname;
    const profile = photo2.originalname;
    const cv = photo3.originalname;

    const updatepdata = {
      name,
      about,
      stack,
      contact,
      cover,
      profile, cv
    };

    updatedata = await userRegModel.updateMany({ loginid: uid }, { $set: updatepdata });
    res.status(201).json({ user: updatedata });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Could not insert data' });
  }
});


jobrouter.post('/apply', async (req, res) => {
  try {
    userid = req.session.user_id;
    postid = req.body.postid;
    // console.log(userid);
    // console.log(postid);
    const applyornot = await applyModel.findOne({ userid, postid });
    if (!applyornot) {
      // console.log("hai")
      data = new applyModel({
        userid,
        postid
      })
      await data.save()
    }
    if (applyornot) {
      res.status(201).json();    }
       else {
      res.status(404).json({ error: 'User data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

jobrouter.get('/userprofiledata/:lid', async (req, res) => {
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







module.exports = jobrouter;