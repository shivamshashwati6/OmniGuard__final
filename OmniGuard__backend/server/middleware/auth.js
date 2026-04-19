/**
 * OmniGuard Backend — JWT Authentication Middleware
 * Validates Bearer tokens, attaches decoded user payload to req.user.
 */

const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('../utils/errors');

/**
 * Factory: creates JWT verification middleware using the given env config.
 * @param {object} env - Validated environment config
 * @returns {Function} Express middleware
 */
function createAuthMiddleware(env) {
  return function verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('Missing or malformed authorization header');
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new AuthenticationError('Token not provided');
      }

      // Verify and decode the JWT with clock tolerance for production skew
      const decoded = jwt.verify(token, env.JWT_SECRET, {
        algorithms: ['HS256'],
        clockTolerance: 120, // 2 minutes tolerance for server-client skew
      });

      // Attach user payload to request object
      req.user = {
        uid: decoded.uid || decoded.userId,
        userId: decoded.userId, // keep for backward compatibility
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
        assignedTeam: decoded.assignedTeam || decoded.responderTeam,
      };

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        return next(error);
      }

      if (error.name === 'TokenExpiredError') {
        const logger = req.app.locals.logger;
        const decodedBase64 = req.headers.authorization.split('.')[1];
        let tokenDetails = 'unknown';
        try {
          tokenDetails = JSON.parse(Buffer.from(decodedBase64, 'base64').toString());
        } catch (e) {}
        
        logger.warn('Token expired', { 
          requestId: req.requestId,
          path: req.path,
          iat: tokenDetails.iat ? new Date(tokenDetails.iat * 1000).toISOString() : 'N/A',
          exp: tokenDetails.exp ? new Date(tokenDetails.exp * 1000).toISOString() : 'N/A',
          serverTime: new Date().toISOString()
        });
        return next(new AuthenticationError('Token has expired'));
      }

      if (error.name === 'JsonWebTokenError') {
        return next(new AuthenticationError('Invalid token'));
      }

      return next(new AuthenticationError('Authentication failed'));
    }
  };
}

module.exports = { createAuthMiddleware };
