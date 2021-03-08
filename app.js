const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dialogs = require('./dialogs')
const users = require('./users')
const chat = require('./chat')
const { includes } = require('./chat')

const app = express()
const port = 3000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function (req, res) {
  res.send('Hello API!')
})

app.post('/auth', function(req, res){
  console.log(req.body)
  let authUser = users.find(user => user.nickName === req.body.login)
  console.log(authUser)
  if (authUser && authUser.password === req.body.password) {
    res.send({actualUserId: authUser.id})
  }
})


app.post('/dialogs', function (req, res) {
  console.log(req.body)
  var actualUserId = req.body.actualUserId.actualUserId
  console.log(actualUserId)
  let actualDialogs = dialogs.filter(dialog => dialog.members.includes(actualUserId))
  let assembledDialogs = actualDialogs.map(dialog => dialog = {user: users.find(user => user.id === dialog.members.find(member => member !== actualUserId)), dialog: dialog})
  let actualUser = users.find(user => user.id === actualUserId)
  console.log(assembledDialogs)
  res.send({assembledDialogs: assembledDialogs, actualUser: actualUser})
})

app.post('/messages', function(req, res){
  let dialogInfo = req.body
  let messagesList = chat.find(chat => chat.id === dialogInfo.dialogId).messages
  console.log(messagesList)
  let messages = { id: req.body.dialogId, messages: messagesList}
  res.send({
    messages: messages,
    companion: users.find(user => user.id === dialogs.find(dialog => dialog.id === dialogInfo.dialogId).members.find(member => member != dialogInfo.actualUserId))
  })
})



app.post('/addmessage', function (req, res) {
  var message = req.body.message
  console.log(message)
  var id = req.body.id
  console.log(id)
  var senderId = req.body.actualUserId
  var messageId = chat.find(dialog => dialog.id === id).messages.length.toString()
  chat.find(dialog => dialog.id === id).messages.push({
    senderId: senderId,
    message: message,
    messageId: messageId
  })
  // console.log(req.body)
  // console.log(chat.find(chat => chat.id === req.body.id))
  res.send(req.body)
})


app.put('/names/:id', function (req, res) {
  var name = names.find(name => name.id === Number(req.params.id))
  res.send(name)
})

app.listen(port, function () {
  console.log('Server started...')
})
