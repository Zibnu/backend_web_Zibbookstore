const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { where } = require("sequelize");

class Authcontroller {
  // Regis
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;

      // Cek input kosong
      if (!username || !email || !password) {
        return res.status(400).json({ message: "all fields are required" });
      }

      // Cek apakah email sudah ada
      const exixtingUser = await User.findOne({ where: { email } });
      if (!exixtingUser) {
        return res.status(400).json({ message: "Email Already Register" });
      }

      // hash password
      const hashPassword = await bcrypt.hash(password, 10);

      // Buat user baru
      const user = await User.create({
        username,
        email,
        password: hashPassword,
        isActive: true,
      });

      return res.status(201).json({
        message: "User Register Successfully",
        user: {
          id: user.id_user,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Server Error",
      });
    }
  }
  // Login 
  static async login(req, res){
    try {
      const { email, password} = req.body

      //cek input
      if ( !email || !password) {
        return res.status(400).json({ message: "all fields are required" });
      }

      // Cari User
      const user = await User.findOne({where : {email}})
      if(!user){
        res.status(401).json({message : "email not register"})
      }

      //cek password
      const isMath = await bcrypt.compare(password, user.password)
      if(!isMath){
        res.status(401).json({message : "Password is Wrong"})
      }

      // Buat token JWT
      const token = jwt.sign(
        {id : user.id_user, email : user.email},
        process.env.SECRET_KEYS,
        {expiresIn : "2d"}
      )
      return res.json({
        message : "login Successful",
        token
      })
    } catch (error) {
      console.error(error);
      return res.status(500).json({message : "Server Error"})
    }
  }
}
module.exports = Authcontroller
