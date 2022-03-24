# collaborate-on-fire-example

A simple example to get you started with collaborate-on-fire and help understand the basic structure.

## Concept
The example shows how to create a simple, stateful application using `mobx-keystone`, `mobx` and `react`. In this app, user cursors are tracked as they move around the screen in a shared environment. Any user can manipulate objects on a very basic SVG canvas by dragging them around. 

A simple multi-user game can be played using the "start adding" button (one user can press this - or more than one to make it harder). The object is to move all like colors together so that they touch.

## Setup
This example requires a firebase application with `firestore`,`realtime database` and `authentication`. 

You'll likely also want to set up `cloud storage` for storing snaphots (optional) and `hosting` (optional).

### Using Firebase CLI
Run: `firebase init`

Use the console to select:
* Realtime Database*
* Firestore*
* Hosting (optional)
* Storage (optional)

`*` = required

Follow the instructions if required to visit the web console to complete setup.

Configure firebase authentication to use 'Google' authentication (Note: provider option can be switched in RootStore.login method if desired).

### Firebase Config

1. Add a "Web App" in the firebase console. Go through the steps until you get the `firebaseConfig`
2. Copy the `firebaseConfig` object into a new file called `'src/config.js'`
3. Add `export default firebaseConfig;` at the end of that file

## File ID
A file ID is used to save data consistently across the different firebase systems. This example uses a hard-coded file ID called 'COF_EXAMPLE_FILE' that is passed to the RootStore constructor. A real-world application would need to manage the file lifecycle for maintaining file IDs.

## Run
```sh
yarn start
```

## License

MIT
