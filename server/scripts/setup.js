import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

/**
 * Script de inicialización de la base de datos
 * Crea el usuario admin si no existe
 */
const setup = async () => {
  try {
    console.log('🚀 Inicializando base de datos...\n');
    
    // Verificar si el usuario admin existe
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      ['admin@laliga.com']
    );
    
    if (existingUsers.length === 0) {
      console.log('📝 Creando usuario admin...');
      
      // Hash de la contraseña "admin123"
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        ['Administrador', 'admin@laliga.com', hashedPassword, 'admin']
      );
      
      console.log('✅ Usuario admin creado correctamente');
      console.log('   Email: admin@laliga.com');
      console.log('   Password: admin123\n');
    } else {
      console.log('✅ Usuario admin ya existe\n');
      
      // Verificar si el password es correcto
      const [users] = await pool.query(
        'SELECT password FROM users WHERE email = ?',
        ['admin@laliga.com']
      );
      
      const isValid = await bcrypt.compare('admin123', users[0].password);
      
      if (!isValid) {
        console.log('⚠️  El password del admin parece incorrecto. Actualizando...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await pool.query(
          'UPDATE users SET password = ? WHERE email = ?',
          [hashedPassword, 'admin@laliga.com']
        );
        
        console.log('✅ Password actualizado correctamente\n');
      } else {
        console.log('✅ Password del admin es correcto\n');
      }
    }
    
    // Resumen de la base de datos
    const [teams] = await pool.query('SELECT COUNT(*) as count FROM teams');
    const [matches] = await pool.query('SELECT COUNT(*) as count FROM matches');
    const [tournaments] = await pool.query('SELECT COUNT(*) as count FROM tournaments');
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
    
    console.log('📊 Estado de la base de datos:');
    console.log(`   Usuarios: ${users[0].count}`);
    console.log(`   Equipos: ${teams[0].count}`);
    console.log(`   Torneos: ${tournaments[0].count}`);
    console.log(`   Partidos: ${matches[0].count}`);
    
    console.log('\n✅ Inicialización completada!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('\n⚠️  Las tablas no existen.');
      console.log('   Ejecuta primero el script SQL:');
      console.log('   mysql -u root -p < database/schema.sql\n');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n⚠️  La base de datos no existe.');
      console.log('   Crea la base de datos primero o ejecuta el script SQL completo.\n');
    }
    
    process.exit(1);
  }
};

setup();
