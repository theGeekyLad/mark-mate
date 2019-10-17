# Mark Mate

This project is a WYSIWYG note taking web-app that syncs all notes with a dedicated server. What's unique here is that **Markdown** editing and preview is supported.

## Technologies

- **Angular 8** for the web-app
- **Angular Material** for UI
- **Node.js** for notes management

The web-app makes POST requests to the Node.js server for performing all CRUD operations on notes. The Node.js server maps all requests to file commands on the server computer.

## Setup

Though it's as simple as running the two servers, additional configuration is required for more practical use cases. Kindly follow these sections sequentially.

### Authentication

- Open `notes.server.js`
- Look for the following code snippet and add / remove users as required
```javascript
// creds harcoded
const creds = {
    'slayer': {
        password: 'Crazyslayer03',
        dir: '/home/thegeekylad/Karthikay'
    },
    'lazygeek': {
        password: 'Si4s29',
        dir: '/home/thegeekylad/Charan'
    }
}
```
_**Note:** These users have been added just for reference and must be removed. Ensure that the parent directory to a given user's directory exists, i.e. in this case `/home/thegeekylad/` exists._

### Public Server _(Optional)_

This project gives you the liberty to run the servers on a system configured with public IP in order to access the services outside your home network.

Though this is optional, here's what you will have to do:

- Get your system IP
    - Run `ifconfig` on Linux
    - Run `ipconfig` on Windows
- Get your public IP _(make a Google search phrased "what is my ip")_
- Open `angular.json` and add the following lines
```json
"projects": {
    "mark-mate": {
        "architect": {
            "serve": {
                "options": {
                    "host": "Type your system IP address here."
                }
            }
        }
    }
}
```
_**Note:** Just include this structure in your `angular.json ` but **do not** replace anything else._
- Open `notes.server.js` in your fav. code editor
    - Look for the line `const serverDomain = 'localhost';`
    - Replace _localhost_ with your **system IP**
    - Save and exit
- Open `src/app/home/home.component.ts` in your fav. code editor
    - Look for the line `this.noteServerDomain = 'localhost';`
    - Replace _localhost_ with your **public IP** _(which is different from system IP)_
    - Save and exit

### Run

- Clone this project
- Open a terminal from the extracted project directory
- Run `npm install`
- Run `ng serve`
- Open another such terminal
- Run `node notes-server.js`
- Visit `http://localhost:4200/`
- If you've configured public IP, visit `http://your-public-ip:4200/` from any device

## Niggles

While the project is quite simple per se, here are a few niggles that persist and will be taken care of in future commits:

- Creating a new note does not immediately save it
- Every page refresh asks for authentication
- Deleting a note does not prompt for reassurance
- Login credentials are to be hardcoded

Feel free to contribute. Thanks!