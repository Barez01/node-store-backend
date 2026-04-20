const jwt = require("jsonwebtoken");
const userSchema = require("../schema/userSchema");
const {
  createTable,
  checkRecords,
  returnRecords,
  insertRecord,
} = require("../utils/sqlFunctions");
const verifyToken = require("../utils/verifyUserToken");
const bcrypt = require("bcrypt");
const checkRole = require("../utils/checkRole");

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  try {
    await createTable(userSchema);
    const { username, password } = req.body;

    const { v4: uuidv4 } = await import("uuid");
    const id = uuidv4();

    const userAlreadyExists = await checkRecords(
      "users",
      "WHERE username = ?",
      [username],
    );

    if (userAlreadyExists && userAlreadyExists.length > 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await insertRecord("users", {
      id: id,
      username: username,
      password: hashedPassword,
    });

    return res.status(200).json({
      id: id,
      username: username,
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

    const existingUser = await checkRecords("users", "WHERE username = ?", [
      username,
    ]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = existingUser[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      username: user.username,
      access_token: generateAccessToken(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    await createTable(userSchema);

    const accessToken = req.headers.authorization;
    const requester = await verifyToken(accessToken);

    if (!requester.success) {
      return res.status(401).json({ error: requester.error });
    }

    const role = await checkRole(requester.id);

    if (!role.success) {
      return res.status(401).json({ error: role.error });
    }

    const { userId, newPassword } = req.body;

    const existingUser = await checkRecords("users", "WHERE id = ?", [userId]);

    if (!existingUser || existingUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = existingUser[0];

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await updateRecord("users", { password: hashedPassword }, "WHERE id = ?", [
      userId,
    ]);

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  updatePassword,
};
