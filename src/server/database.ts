import mysql, { type Connection } from "mysql2/promise";

let connection: Connection | undefined = undefined;

declare global {
  // eslint-disable-next-line no-var
  var dbConnection: Connection | undefined;
}

export const getConnection = async () => {
  if (!global.dbConnection) {
    console.log("Creating connection");
    global.dbConnection = await mysql.createConnection({
      host: "***REMOVED***",
      port: 8762,
      user: "***REMOVED***",
      password: "***REMOVED***",
      database: "***REMOVED***",
      namedPlaceholders: true,
      connectionLimit: 10,
    });

    global.dbConnection.once("error", (err) => {
      console.log("Connection error", err);
      global.dbConnection = undefined;
    });
  }

  connection = global.dbConnection;
  return connection;
};

/**
 * Create the database tables if they don't exist.
 */
getConnection()
  .then(async (db) => {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(16) NOT NULL UNIQUE,
        name VARCHAR(40) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        phone VARCHAR(100),
        bio TEXT,
        department VARCHAR(100) NOT NULL,
        major VARCHAR(100) NOT NULL,
        position VARCHAR(60) NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS website (
        user_id VARCHAR(16) NOT NULL,
        website_title VARCHAR(100) NOT NULL,
        
        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS education (
        id INT NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(16) NOT NULL,
        school VARCHAR(100) NOT NULL,
        major VARCHAR(100) NOT NULL,
        degree VARCHAR(40) NOT NULL,
        
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, school, major, degree),
        INDEX (user_id)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(16) NOT NULL,
        skill VARCHAR(100) NOT NULL,
        skill_en VARCHAR(100) NOT NULL,

        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, skill),
        INDEX (user_id)
      );
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS work_experience (
        id INT NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(16) NOT NULL,
        in_school TINYINT(1) NOT NULL,
        company VARCHAR(100) NOT NULL,
        position VARCHAR(100) NOT NULL,
        
        PRIMARY KEY (id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (user_id, in_school, company, position),
        INDEX (user_id)
      );
    `);

    await db.commit();
  })
  .catch((err) => console.log(err));
