import { firebaseAdmin } from '../../firebaseAdmin'

export default async (req: any, res: any) => {
  // console.log(req)
  if (!req.cookies.token) {
    res.status(401).end()
    return
  }
  const arr = req.url.split('?confirm=')
  if (!(arr.length === 2 && arr[1] === 'true')) {
    res.status(400).end()
    return
  }
  try {
    const token = await firebaseAdmin.auth().verifyIdToken(req.cookies.token)
    await firebaseAdmin.auth().deleteUser(token.uid)
    console.log('deleted ' + token.email)
    res.status(200).end()
  } catch (error) {
    console.log(error)
    res.status(418).end()
  }
}
