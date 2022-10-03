const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const lodash = require("lodash");

//mongo server
mongoose.connect("mongodb+srv://admin-shivam123:test-123@cluster0.ogzyvyu.mongodb.net/todolistDB", {useNewUrlParser: true});
const itemsSchema = mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
// rows in table
const item1 = new Item({
  name: "Welcome To Do List"
});
const item2 = new Item({
  name: "Add in To Do List"
});
const item3 = new Item({
  name: "Delete from To Do List"
});
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const list = mongoose.model("list",listSchema);
const defaultItems = [item1, item2, item3];

app.get("/", function(req, res){
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
    Item.insertMany(defaultItems, function(err)
  {
    if (err){
      console.log("go");
    }else{
      console.log("jkkkjj");
    }

  });
    res.redirect("/");
}else
    {
      res.render("list", {listTitle: "Today", newItem: foundItems});
    }
  });
});
app.get("/:customListName", function(req, res){
  const customListName =req.params.customListName;
  list.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        const list1 = new list({
          name: customListName,
          items: defaultItems
        });
          list1.save();
          res.redirect("/" + customListName);
      }else{
        res.render("list", {listTitle: foundList.name, newItem: foundList.items})
      }
    }
  });


});

app.post("/", function(req, res){

    let itemAdded = req.body.newItem;
    const listName = req.body.button;
    const itemA = new Item({
      name: itemAdded
        });
    if (listName === "Today"){
    itemA.save();
    res.redirect("/");
  }else{
    list.findOne({name: listName},function(err, foundList){
      foundList.items.push(itemA);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});
app.post("/delete", function(req, res){
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today"){
  Item.findByIdAndRemove(checkedId, function(err)
{
  if(!err){
    console.log("yes");

  res.redirect("/");
}
});
}else{
 list.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedId}}}, function(err, foundList){
   if (!err)
   {
     res.redirect("/" + listName);
   }
 })
}

});







app.listen(process.env.PORT || 3000, function()
{
  console.log("Here we go");
});
