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

// =====================
// Vecimiento del Token
// =====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.TOKEN_CADUCA = 60 * 60 * 24 * 30;

// =====================
// SEED de autenticación
// =====================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo';

// > heroku config:set variable='valor'