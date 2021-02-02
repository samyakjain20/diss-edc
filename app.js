const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const morgan = require('morgan');
const Topic = require('./models/topic');
const { get } = require('lodash');
const { render } = require('ejs');
const { create } = require('./models/topic');

const User = require('./models/User');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));   //middleware
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
// const dbURI = 'mongodb+srv://rupesh_123:RupeshSK30@cluster0.43yoq.mongodb.net/node-auth';
const dbURI = 'mongodb+srv://admin_forum:adminforum@cluster0.w7lbe.mongodb.net/discussion?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    app.listen(3000)
    console.log('connected to db')
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.use(authRoutes);
// app.get('/', (req, res) => res.render('home'));
// app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.get('/', (req, res) => {
  res.redirect('/topics');
});

app.get('/about', (req,res) => {
  res.render('about', {title: 'About'});
});

//topic routes
app.get('/topics/create', (req,res) => {
  // const User = checkUser;
  // app.get(authRoutes);
  // console.log(User.email);
  // if(User.email == "rupesh123@gmail.com"){
    res.render('create', {title: 'Create a new topic'});
  // }else {
  //   res.render('404', {title: '404 Page' });
  // }
});

app.get('/topics', (req,res) => {
  Topic.find().sort({createdAt: -1 })
    .then((result) => {
        res.render('index', {title: "all topics", topics: result })
    })
    .catch((err) => {
        console.log(err);
    });
});

app.post('/topics',(req,res) => {
  const topic= new Topic(req.body);

  topic.save()
    .then((result) => {
        res.redirect("/topics");
    })
    .catch((err) => {
        console.log(err);
    });
}) 

app.get('/topics/:id', (req,res) => {
  const id= req.params.id;
  Topic.findById(id)
    .then((result) => {
        res.render('details', {topic: result, title: "Topic Details"});
    })
})

app.delete('/topics/:id', (req, res) => {
  const id = req.params.id;
  Topic.findByIdAndDelete(id)
  .then(result => {
    res.json({ redirect: '/topics' });
  })
  .catch(err => {
    console.log(err);
  });
});

app.post('/comment',(req,res) => {
  // blog.update({"_id": ObjectId(req.body.post_id)},{
  //   $push: {
  //     "comments": {username: req.body.username, comment: req.body.comment}
  //   }, function (error, post) {
  //     res.send("comment successfully");
  //   }
  // });
  const id = req.body.post_id;
  Topic.findById(id)
    .then(result => {
      topic = result,
      topic.update( {"_id": mongoose.isValidObjectId(req.body.post_id)},{
        $push: {
          "comments": {username: req.body.username, comment: req.body.comment}
        }, function (error, post) {
          res.send("comment successfully");
          res.redirect('/topic/:id');
        },
      });
    })
});

app.post('/do-comment', (req, res) => {
  const id= req.params.id;
  blog.collection("topics").findById(id).update(
    {"_id": mongoose.isValidObjectId(req.body.post_id)},
    {$push:{ "comments":{username:req.body.email, comment:req.body.comment}}}
  )
  .catch((err) => {
    console.log(err);
  });
  
})

//404 page
app.use((req,res) => {
  res.render('404', {title: '404 Page' });
});