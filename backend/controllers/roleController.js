// backend/controllers/roleController.js
const { ROLES, ROLE_PERMISSIONS } = require('../config/rbac');

const getRoles = async (req, res) => {
    try {
        // For registration, only return STUDENT and TEACHER roles
        const publicRoles = Object.values(ROLES).filter(role => 
            role === 'STUDENT' || role === 'TEACHER'
        );
        
        const roles = publicRoles.map(role => ({ role }));
        res.json(roles);
    } catch (error) {
        console.error('Error in getRoles:', error);
        res.status(500).json({ message: 'Error fetching roles' });
    }
};

const getRolePermissions = async (req, res) => {
    const { role } = req.params;
    
    if (!ROLES[role]) {
        return res.status(404).json({ message: 'Role not found' });
    }

    const permissions = ROLE_PERMISSIONS[role] || [];
    res.json({ permissions });
};

module.exports = {
    getRoles,
    getRolePermissions
};