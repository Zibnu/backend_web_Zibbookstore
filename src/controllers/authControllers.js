  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const { User } = require("../models");
  const { Association } = require("sequelize");
  const { sendEmail } = require("../utils/emailServices")

  const SECRET = process.env.SECRET_KEYS;

// Register
  exports.register = async(req, res) => {
    try {
      const { username, email, password} = req.body;
      // validasi input
      if(!username || !email || !password) {
        return res.status(400).json({
          success : false,
          message : "Username, email and password REQUIRED!!"
        });
      };

      // Cek apakah email sudah terdapftar
      const existingUser = await User.findOne({ where : { email }});
      if(existingUser) {
        return res.status(409).json({
          success : false,
          message : "email already registed"
        });
      };

      // Hash PW
      const hashPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password : hashPassword,
        role : "user",
        isActive : true,
      });

      // await sendEmail(
      //   newUser.email,
      //   "Selamat Datang di ZibBookstore 🎉",
      //   "WelcomeEmail",
      //   {username : newUser.username}
      // )

      // Response
      const userResponse = {
        id_user : newUser.id_user,
        username : newUser.username,
        email : newUser.email,
        role : newUser.role,
        sts: newUser.isActive
      };
      return res.status(201).json({
        success : true,
        message : 'User Berhasil Dibuat',
        data : userResponse,
      });
    } catch (error) {
      console.error("Register Error", error);
      return res.status(500).json({
        success : false,
        message : "Server Error",
        error : error.message
      });
    };
};

// login
  exports.login = async (req, res) => {
    try {
      const { email, password} = req.body;
      // validasi input
      if(!email || !password){
        res.status(400).json({
          success : false,
          message : "Your input is nothing"
        });
      };


      // Cari User Berdasarkan email
      const user = await User.findOne({ where : { email }});
      if(!user){
        return res.status(401).json({
          success : false,
          message : "Invalid Email"
        });
      };

      // Cek apakah user Aktif
      if(!user.isActive){
        return res.status(403).json({
          success : false,
          message : "User isn't active"
        });
      };

      // Verifikasi PW
      const isPw = await bcrypt.compare(password, user.password);
      if(!isPw){
        return res.status(401).json({
          success : false,
          message : "Invalid Password"
        });
      };

      // generate JWT token
        const token = jwt.sign(
          {
            id_user : user.id_user,
            email : user.email,
            role : user.role,
          },
          SECRET,
          {expiresIn : "7d"}//Berlaku 7hari
        );

        // User data untuk Response
        // const userResponse = {
        //   id_user : user.id_user,
        //   username : user.username,
        //   email : user.email,
        //   role : user.role,
        //   sts : user.isActive,
        // };

        return res.status(200).json({
          success : true,
          message : "Login SuccessFul",
          data : {
            // user : userResponse,
            token,
            user : {
              id_user : user.id_user,
              email : user.email,
              role : user.role
            },
          }
        });
    } catch (error) {
      console.error("Login Error", error);
      return res.status(500).json({
        success : false,
        message : "Internal Server Error",
        error : error.message
      })
    }
  }

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id_user;//sudah diisi oleh middleware 

    const user = await User.findByPk(userId, {
      attributes : ["id_user", "username", "email", "role", "isActive"]
      // attributes : { exclude :["password"]}, //pw not show
      // include : [
      //   {
      //     Association : "address",
      //     attributes : [ "id_address", "full_name", "phone", "street", "postal_code", "provinces"],
      //   },
      // ],
    });

    if(!user) {
      return res.status(404).json({
        success : false,
        message : "User Not Found"
      });
    }

    return res.status(200).json({
      succes : true,
      data : user,
    });
  } catch (error) {
    console.error("Get Profile error", error);
    return res.status(500).json({
      succes : false,
      message : "Internal Server Error",
      error : error.message
    });
  };
};

// Log Out
exports.logout = async ( req, res) => {
  try {
    // Hanya response karena menggunakan JWT stateless jadi remove token ada di FRONT END

    return res.status(200).json({
      success : true,
      message : "Logout SuccessFul"
    });
  } catch (error) {
    console.error("Logout Error", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message
    });
  };
};

// Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id_user;
//     const { username } = req.body;

//     if(!username) {
//       return res.status(400).json({
//         success : false,
//         message : "Username Required!!!!!!"
//       });
//     }

//     const user = await User.findByPk(userId);
//     if(!user) {
//       return res.status(404).json({
//         success : false,
//         message : "User Not Found"
//       });
//     }

//     // Update Username
//     user.username = username;
//     await user.save();

//     const userResponse = {
//       id_user : user.id_user,
//       username : user.username,
//       email : user.email,
//       role : user.role
//     };
//     return res.status(200).json({
//       success : true,
//       message : "Profile Updated SuccessFul",
//       data : "userResponse",
//     });
//   } catch (error) {
//     console.error("Updated Profile Error", error);
//     return res.status(500).json({
//       success : false,
//       message : "In Server Error",
//       error : error.message,
//     });
//   }
// };

// // Change PW
// exports.changePw = async (req, res) => {
//   try {
//     const userId = req.user.id_user;
//     const { oldPw, newPw} = req.body;

//     if(!oldPw || !newPw) {
//       return res.status(400).json({
//         success : false,
//         message : "Your input is Null",
//       });
//     }

//     const user = await User.findByPk(userId);
//     if(!user) {
//       return res.status(404).json({
//         success : false,
//         message : "User Not Found",
//       });

//       // Verifikasi oldPw 
//       const isPasswordValid = await bcrypt.compare(oldPw, user.password);
//       if(!isPasswordValid) {
//         return res.status(401).json({
//           success : false,
//           message : "Old Password Is Wrong",
//         });
//       }

//       // Hash new PW
//       const hashNewPw = await bcrypt.hash(newPw, 10);
//       user.password = hashNewPw;
//       await user.save();

//       return res.status(200).json({
//         success : true,
//         message : password
//       })
//     }
//   } catch (error) {
    
//   }
// }