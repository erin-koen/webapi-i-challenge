// implement your API here
const express = require("express");
const db = require("./data/db.js");

const server = express();
server.use(express.json());

server.post("/api/users", (req, res) => {
  const { name, bio } = req.body;
 
  !name || !bio
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user" })
    : db
        .insert({ name, bio })
        .then(user => {
          res.status(201).json(user);
        })
        .catch(error => {
          res.status(500).json({
            error: "There was an error while saving the user to the database"
          });
        });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The users' information could not be retrieved" });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  console.log(id)
  !name || !bio
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name and bio for the user." })
    : db
        .update(id, { name, bio })
        .then(updated => {
          if (updated) {
            res.status(200).json(updated);
          } else {
            res
              .status(404)
              .json({
                message: "The user with the specified ID does not exist."
              });
          }
        })
        .catch(err => {
          res.status(500).json({ message: "The user information could not be modified" });
        });
});

server.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;

    db
    .remove(id)
    .then(deleted => {
        if (deleted) {
            res.status(200).end();
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" })
    })
})

server.listen(4000, () => {
  console.log(`\n** API up and running on port 4000`);
});
