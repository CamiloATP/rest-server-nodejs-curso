// =====================
// PORT
// =====================
process.env.PORT = process.env.PORT || 3000;

// =====================
// Entorno
// =====================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// Base de datos
// =====================
if(process.env.NODE_ENV === 'dev') {
    process.env.URLDB = 'mongodb://localhost:27017/cafe';
}else{
    // Doesn´t Work
    // urlDB = 'mongodb+srv://cafe_user:<PassWord>@cluster-iwlcb.mongodb.net/cafe';
    process.env.URLDB = process.env.MONGO_URI;
}