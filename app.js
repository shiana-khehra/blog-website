//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import lodash from 'lodash';
import mongoose from 'mongoose';
import { isGeneratorFunction } from "util/types";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogsDB");

const blogSchema = {
  title: String,
  content: String
};

const Blog = mongoose.model("Blog", blogSchema);

const blog1 = new Blog ({
  title: "Home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

app.get("/", function(req, res){
  Blog.find({}, function(err, foundList){
    if(!err) {
      if(foundList.length === 0) {
        blog1.save();
      }
      res.render("home", {postsContainer: foundList});
    } else {
      console.log(err);
    }
  });
});
 
app.get("/about", function(req, res){
  res.render("about", {postsContainer: posts});
});

app.get("/contact", function(req, res){
  res.render("contact", {postsContainer: posts});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:test", function(req, res){
  Blog.findOne({_id: req.params.test}, function(err, foundBlog){
    if(!err) {
      if(!foundBlog) {
        res.render("post", {pageHead: "Ooops!", pageContent: "Blog Not Found"});
      } else {
        res.render("post", {pageHead: foundBlog.title, pageContent: foundBlog.content});
      }
    }
  });
});

app.post("/compose", function(req, res){
  const newBlog = new Blog ({
    title: req.body.title,
    content: req.body.body
  });

  newBlog.save(function(err){
    if(!err) {
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
