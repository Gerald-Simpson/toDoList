import { auth } from 'express-oauth2-jwt-bearer';

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
export const checkJwt = auth({
  audience: 'http://localhost:3001/',
  issuerBaseURL: `https://dev-lqrmsqwllauuo8yp.uk.auth0.com/`,
});
