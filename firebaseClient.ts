import firebaseClient from 'firebase/app'
import 'firebase/auth'

/*

Copy/paste your *client-side* Firebase credentials below. 

To get these, go to the Firebase Console > open your project > Gear Icon >
Project Settings > General > Your apps. If you haven't created a web app
already, click the "</>" icon, name your app, and copy/paste the snippet.
Otherwise, go to Firebase SDK Snippet > click the "Config" radio button >
copy/paste.

*/
const CLIENT_CONFIG = {
  apiKey: 'AIzaSyBDa6ysrsIb7PXz2biqKd-8-OaQs-tkbwk',
  authDomain: 'akvideo-demo.firebaseapp.com',
  projectId: 'akvideo-demo',
}

if (typeof window !== 'undefined' && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG)
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION)
  ;(window as any).firebase = firebaseClient
}

export { firebaseClient }
