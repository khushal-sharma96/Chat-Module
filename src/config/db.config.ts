export default () => {
    try {
        const mongoose = require('mongoose');
        const uri = process.env.DB_URL;
        console.log(process.env.APP_MODE);
        // if (process.env.APP_MODE == 'production') {
            mongoose.connect(uri).then((res:any) => {
                console.log("Production db is connected successfully.");
            }).catch((err:any) => {
                console.log(err);
            });
        // }
        // else {
        //     // mongoose.connect(uri).then(() => console.log("DB connected successfully.")).catch((err:any) => console.log(err));
        // }
    }
    catch (err) {
        console.log(err);
    }
}