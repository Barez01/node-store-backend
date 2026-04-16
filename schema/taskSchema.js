const taskSchema = `
CREATE TABLE IF NOT EXISTS tasks(
id INT AUTO_INCREMENT PRIMARY KEY,
userId VARCHAR(255) NOT NULL,
title TEXT,
description TEXT,
date DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
`;

module.exports = taskSchema;