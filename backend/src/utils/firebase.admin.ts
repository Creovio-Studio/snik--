import fbAdmin from "firebase-admin";
import serviceAccount from "../config/firebase.admin.config.json";

fbAdmin.initializeApp(serviceAccount);

export default fbAdmin;
