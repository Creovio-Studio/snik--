import * as fbAdmin from "firebase-admin";
import serviceAccount from "../config/firebase.admin.config.json";
fbAdmin.initializeApp({
  credential: fbAdmin.credential.cert(serviceAccount as fbAdmin.ServiceAccount),
});

export default fbAdmin;
