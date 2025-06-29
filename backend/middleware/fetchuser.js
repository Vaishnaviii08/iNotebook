import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const fetchuser = (req, res, next) => {
    //Get the user from the jwt token and append id to req object
    const token = req.header('authToken');
    
    if(!token) {
        return res.status(401).send({error : "Please authenticate using a valid token"}); 
    }
    
    try {

        const data = jwt.verify(token, JWT_SECRET);

        req.user = data.user;

        next()
    } catch (error) {
        console.log('Full error:', error);//d

        res.status(401).send({error : "Please authenticate using a valid token"});
    }
}

export default fetchuser;