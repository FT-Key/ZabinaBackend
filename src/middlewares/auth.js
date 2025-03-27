import jwt from 'jsonwebtoken';

export const authTokenAndRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Token no proporcionado' });
            }

            const user = jwt.verify(token, process.env.JWT_SECRET);

            req.user = user;

            if (typeof requiredRole === 'string' && user.rol !== requiredRole) {
                return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
            }

            if (Array.isArray(requiredRole) && !requiredRole.includes(user.rol)) {
                return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
            }
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Token no válido o error en la verificación del rol', error });
        }
    };
};