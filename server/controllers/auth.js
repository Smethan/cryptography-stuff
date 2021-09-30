const bcrypt = require('bcryptjs')
const users = []

module.exports = {
    login: (req, res) => {
      console.log('Logging In User')
      console.log(req.body)
      const { username, password } = req.body
      for (let i = 0; i < users.length; i++) {
        if (users[i].username === username && bcrypt.compareSync(password, users[i].password)) {
          let newUserObj = users[i]
          delete newUserObj.password
          console.log(newUserObj)
          res.status(200).send(newUserObj)
          return;
        }
      }
      res.status(400).send("User not found.")
    },
    register: (req, res) => {
        console.log('Registering User')
        console.log(req.body)
        const { username, password } = req.body

        let tgtIndex = -1;

        users.forEach((userObj, index) => {
          let existing = bcrypt.compareSync(username, userObj.username)

          if (existing) {
            tgtIndex = index
          }
        });

        if (tgtIndex === -1) {
          const salt = bcrypt.genSaltSync(10);
          const newHash = bcrypt.hashSync(password, salt);

          req.body.password = newHash;
          console.log('Password hashed! Adding user...')
          users.push(req.body)
          console.log(req.body)
          res.status(200).send(req.body)
        } else {
          console.log(`user ${username} already exists! Throwing error...`)
          res.status(400).send('User already exists')
        }

        // users.push(req.body)
        // res.status(200).send(req.body)
    }
}