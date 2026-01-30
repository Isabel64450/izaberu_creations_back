function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: "Accès refusé : votre rôle ne vous autorise pas à poursuivre" });
        }

        next();
    };
}

export default authorizeRoles;