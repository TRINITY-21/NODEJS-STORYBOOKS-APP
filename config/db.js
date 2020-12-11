const mongoose = require('mongoose');

//connect to database
const connectDB = async()=>{
	try{
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser : true,
			newUnifiedTopology:true,
			useFindAndModify:false
		});

		console.log(`MONGODB CONNECTED: ${conn.connection.host}`);
	}
	catch(err){
		console.log(err);
		process.exit();
	}
}

module.exports = connectDB;