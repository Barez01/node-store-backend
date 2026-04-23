const { checkRecords } = require("./sqlFunctions");

const checkRole = async (requesterId) => {
    try{
         const requester = await checkRecords("users", "WHERE id = ?", [
      requesterId,
    ]);

    if (!requester || requester.length === 0) {
      return {success: false, error: "You are not permitted as a valid user"};
    }

    const requesterUser = requester[0];

    if (requesterUser.role !== "admin") {
        return {success: false, error: "Only admins are permitted for this action"};
    }

    return {success: true, role: requesterUser.role};

    }catch(error){
        return {success: false, error: "You are not permitted as a valid user"};
    }
}

module.exports = checkRole;