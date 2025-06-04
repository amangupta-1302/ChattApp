import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_KEY, {
        expiresIn: "3d"
    });
    res.cookie("JwtToken", token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,// milliseconds conversion
        secure: false,
        httpOnly: true, // prevent attacks 
        samesite: "strict" // prevent attack CSRF
    })
    return token
}  