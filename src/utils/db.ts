import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'digicard_signB',
  password: 'Oujda005',
  database: 'digicard_signB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100),
        lastName VARCHAR(100),
        organization VARCHAR(255),
        role VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create signatures table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS signatures (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        documentTitle VARCHAR(255) NOT NULL,
        signatureId VARCHAR(36) NOT NULL,
        signerName VARCHAR(255) NOT NULL,
        organization VARCHAR(255),
        role VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT true,
        pdfData LONGTEXT,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// User operations
export async function createUser(user: any) {
  const sql = `
    INSERT INTO users (id, email, password, firstName, lastName, organization, role, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    user.id,
    user.email,
    user.password,
    user.firstName || null,
    user.lastName || null,
    user.organization || null,
    user.role || 'user',
    new Date()
  ];
  return query(sql, params);
}

export async function getUserByEmail(email: string) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const results = await query(sql, [email]) as any[];
  return results[0];
}

export async function updateUserById(id: string, userData: any) {
  const sql = `
    UPDATE users 
    SET firstName = ?, lastName = ?, organization = ?, role = ?
    WHERE id = ?
  `;
  const params = [
    userData.firstName || null,
    userData.lastName || null,
    userData.organization || null,
    userData.role || 'user',
    id
  ];
  return query(sql, params);
}

export async function deleteUserById(id: string) {
  const sql = 'DELETE FROM users WHERE id = ?';
  return query(sql, [id]);
}

// Signature operations
export async function createSignature(signature: any) {
  const sql = `
    INSERT INTO signatures (
      id, userId, documentTitle, signatureId, signerName,
      organization, role, createdAt, verified, pdfData
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    signature.id,
    signature.userId,
    signature.documentTitle,
    signature.signatureId,
    signature.signerName,
    signature.organization || null,
    signature.role || null,
    new Date(),
    signature.verified || true,
    signature.pdfData || null
  ];
  return query(sql, params);
}

export async function getSignaturesByUserId(userId: string) {
  const sql = `
    SELECT * FROM signatures 
    WHERE userId = ? 
    ORDER BY createdAt DESC
  `;
  return query(sql, [userId]);
}

export async function getSignatureById(signatureId: string) {
  const sql = 'SELECT * FROM signatures WHERE signatureId = ?';
  const results = await query(sql, [signatureId]) as any[];
  return results[0];
}

export async function getAllUsers() {
  const sql = 'SELECT * FROM users ORDER BY createdAt DESC';
  return query(sql);
}

export async function getAllSignatures() {
  const sql = 'SELECT * FROM signatures ORDER BY createdAt DESC';
  return query(sql);
}