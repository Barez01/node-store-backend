const jwt = require("jsonwebtoken");
const userSchema = require("../schema/userSchema");
const {createTable, checkRecords, returnRecords, insertRecord} = require("../utils/sqlFunctions");
const verifyToken = require("../utils/verifyUserToken");
const bcrypt = require('bcrypt');

const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

const register = async (req, res) => {
  try {
    await createTable(userSchema);
    const { username, name, password } = req.body;

    const { v4: uuidv4 } = await import('uuid');
    const id = uuidv4();

    const userAlreadyExists = await checkRecords(
      "users",
      "WHERE username = ?",
      [username]
    );

    if (userAlreadyExists && userAlreadyExists.length > 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await insertRecord(
      "users",
      {
        id: id,
      username: username,
      name: name,
      password: hashedPassword,
    });

    return res.status(200).json({
      id: id,
      username: username,
      name: name,
      access_token: generateAccessToken(id),
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    await createTable(userSchema);
    const { username, password } = req.body;

    const existingUser = await checkRecords("users", "WHERE username = ?", [username]);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      id: existingUser.id,
      name: existingUser.name,
      username: existingUser.username,
      access_token: generateAccessToken(existingUser.id),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
    register,
    login,
};