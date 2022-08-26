import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const conexion = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const url = `${conexion.connection.host}:${conexion.connection.port}`;
    console.log(`Base de datos conectada a ${url}`);
  } catch (error) {
    console.log(`Error al conectar la DB: ${error}`);
    process.exit(1); 
  }
}

export default conectarDB; 