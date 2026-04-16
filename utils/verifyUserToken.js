const jwt = require("jsonwebtoken");

const verifyToken = (auth) => {
    if(!auth?.startsWith("Bearer")){
        return {success: false, error: "Missing or invalid authorization header"};
    }

    const token = auth.slice("Bearer".length).trim();

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(typeof decoded !== "object" || decoded === null){
            return {success: false, error: "Token missing user id claim"};
        }

        const {id} = decoded;
        
        if(!id){
            return {success: false, error: "Token missing user id claim"};
        }

        return {success: true, id};
    }catch(error){
        return {success: false, error: "Invalid or expired token"};
    }
}

module.exports = verifyToken;