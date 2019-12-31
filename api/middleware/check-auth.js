const jwt = require('jsonwebtoken');

const userRolesInherit = {
    'superadmin':    ['superadmin', 'admin', 'manager', 'staff', 'guest', 'authenticated', 'public'],
    'admin':         ['admin', 'manager', 'staff', 'guest', 'authenticated', 'public'],
    'manager':       ['manager', 'staff', 'guest', 'authenticated', 'public'],
    'staff':         ['staff', 'guest', 'authenticated', 'public'],
    'guest':         ['guest', 'authenticated', 'public'],
    'authenticated': ['authenticated', 'public'],
};
const userRolesParents = {
    'superadmin':    ['superadmin'],
    'admin':         ['admin'],
    'manager':       ['admin', 'manager'],
    'staff':         ['admin', 'manager', 'staff'],
    'guest':         ['admin', 'manager', 'staff', 'guest'],
    'authenticated': ['admin', 'manager', 'staff', 'guest', 'authenticated'],
};
const userRolesExact = {
    'superadmin':    ['superadmin'],
    'admin':         ['admin'],
    'manager':       ['manager'],
    'staff':         ['staff'],
    'guest':         ['guest'],
    'authenticated': ['authenticated'],
};

module.exports = {
    userRoles: this.userRoles,
    checkAuth: (req, res, next, permission, permissionType='exact') => {
        if (permission === 'public') {
            // No token required. Allow route
            next();
            return;
        }
        else if (!permission) {
            // No user role specified internally. Block route
            return res.status(400).json({
                message: 'Invalid routing',
            });
        }
        else {
            // Everything from here requires a token

            // DEBUGGING ONLY
            req.userData = {};
            req.userData.role = 'guest';
            // END DEBUGGING

            if (!req.userData && !req.userData.role) {
                // User role not detected. Block route
                return res.status(403).json({
                    message: 'User role required',
                });
            }
            else if (permission === req.userData.role) {
                // User role matches specified. Allow route
                return module.exports.checkToken(req, res, next);
            }
            else if (permission !== req.userData.role) {
                // User role doesn't match
                // Check if it's allowed in the hierarcy of user roles

                // Load user roles
                let rolePermissions = userRolesExact[req.userData.role]; // use exact user roles by default

                if (permissionType === 'inherit') { // user role and sub roles
                    rolePermissions = userRolesInherit[req.userData.role];
                }
                else if (permissionType === 'parents') { // user role and it's parents
                    rolePermissions = userRolesParents[req.userData.role];
                }

                const hasAuth = (rolePermissions.indexOf(permission));
                if (hasAuth) {
                    // User role found in hierarchy. Allow route
                    return module.exports.checkToken(req, res, next);
                }
                else {
                    // User role not detected in hierarchy. Block route
                    return res.status(401).json({
                        message: 'you dont have access',
                    });
                }
            }
            else {
                // Fail 
                return res.status(401).json({
                    message: 'Auth failed',
                });
            }
        }
    },
    checkToken: (req, res, next) => {
        try {
            console.log(req.headers);
            // Verify JWT Token
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.userData = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                message: 'Token failed',
            });
        }
    },
    hasUserRole: (role, permissionType='exact') => {
        return function(req, res, next) {
            console.log(role);
            console.log(permissionType);
            return module.exports.checkAuth(req, res, next, role, permissionType);
        }
    }
}
