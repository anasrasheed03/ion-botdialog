// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Load third party dependencies
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');
app.use(cors());
// Load our custom classes
const CustomerStore = require('./customerStore.js');
const MessageRouter = require('./messageRouter.js');

// Add the json file in the roo directory
const keyPath = './key.json';
if(!keyPath) {
  process.exit(1);
}

// Load and instantiate the Dialogflow client library
const { SessionsClient } = require('dialogflow');
const dialogflowClient = new SessionsClient({
  keyFilename: keyPath    //add the varibale name here
})

// Add Project id below
const projectId = "handsoff-5df82";
if(!projectId) {
  process.exit(1);
}

// Instantiate our app
const customerStore = new CustomerStore();
const messageRouter = new MessageRouter({
  customerStore: customerStore,
  dialogflowClient: dialogflowClient,
  projectId: projectId,
  customerRoom: io.of('/customer'),
  operatorRoom: io.of('/operator')
});

// Serve static html files for the customer and operator clients
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/static/customer.html`);
  console.log("posts");
});

app.get('/Operators', (req, res) => {
  res.sendFile(`${__dirname}/static/operator.html`);
});

// Begin responding to websocket and http requests
messageRouter.handleConnections();
http.listen(7000, () => {
  console.log('Listening on *:7000');
});
