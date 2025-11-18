const { Address } = require("../models");
// ✔️🔥🔥
exports.createAddress = async ( req, res) => {
  try {
    const userId = req.user.id_user;
    const { full_name, phone, street, postal_code, provinces} = req.body;

    if(!full_name || !phone || !street || !postal_code || !provinces){
      return res.status(400).json({
        success : false,
        message : "Your Input is null",
      });
    }

    const newAddress = await Address.create({
      user_id : userId,
      full_name,
      phone,
      street,
      postal_code,
      provinces,
    });

    return res.status(201).json({
      success : true,
      message : "Address success created",
      data : newAddress,
    });
  } catch (error) {
    console.error("createAddress ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥🔥
exports.getAllAddress = async ( req, res) => {
  try {
    const userId = req.user.id_user;

    const address = await Address.findAll({
      where : {user_id : userId},
      order : [["createdAt", "DESC"]],
    });

    // if(!address){
    //   return res.status(404).json({
    //     success : false,
    //     message : "Address Not Found",
    //   });
    // }

    return res.status(200).json({
      success : true,
      data : address,
    })
  } catch (error) {
    console.error("Get All Address ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};
// ✔️🔥🔥
exports.updateAddress = async ( req, res) => {
  try {
    const userId = req.user.id_user;
    const { id } = req.params;
    const { full_name, phone, street, postal_code, provinces} = req.body;

    if(!id) {
      return res.status(400).json({
        success : false,
        message : "Id Address Is Required!!!!",
      });
    }

    const address = await Address.findOne({
      where : { id_address : id ,user_id : userId},
    });

    if(!address) {
      return res.status(404).json({
        success : false,
        message : "Address Not Found",
      });
    }

    await address.update({
      full_name : full_name || address.full_name,
      phone : phone || address.phone,
      street : street || address.street,
      postal_code : postal_code || address.postal_code,
      provinces : provinces || address.provinces,
    });

    return res.status(200).json({
      success : true,
      message : "Update Address Success",
      data : address,
    });
  } catch (error) {
    console.error("Update Address ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server Error",
      error : error.message,
    });
  }
};
// ✔️🔥🔥
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id_user;
    const { id } = req.params;

    if(!id) {
      return res.status(400).json({
        success : false,
        message : "Id Address Required!!!",
      });
    }

    const address = await Address.findOne({
      where : {id_address : id, user_id : userId},
    });

    if(!address){
      return res.status(404).json({
        success : false,
        message : "Address Not Found",
      });
    }

    await address.destroy();

    return res.status(200).json({
      success : true,
      message : "Delete Address Success",
    });
  } catch (error) {
    console.error("Delete Address ERROR", error);
    return res.status(500).json({
      success : false,
      message : "Internal Server ERROR",
      error : error.message,
    });
  }
};