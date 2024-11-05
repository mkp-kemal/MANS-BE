const jwt = require('jsonwebtoken');

const protectRoute = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        
        if (!authorization) return res.status(401).json({ message: 'Unauthorized' });

        const token = authorization.split(' ')[1];
        
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;

        next();
    } catch (err) {
        // res.status(401).json({ message: 'Invalid or expired token' });
        res.status(401).json({ message: 'Terdeteksi belum login:(' });
    }
}

module.exports = protectRoute