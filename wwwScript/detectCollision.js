function detectCollision(A, B) {

  var movevec = A.moveVector.substract(B.moveVector);

  // Early Escape test: if the length of the movevec is less
  // than distance between the centers of these circles minus
  // their radii, there's no way they can hit.
  var dist = B.center.distance(A.center);
  var sumRadii = (B.radius + A.radius);
  dist -= sumRadii;
  if (movevec.length() < dist){
    return false;
  }

  if (movevec.x === 0 && movevec.y === 0) {
    return false;
  }

  // Normalize the movevec
  var N = movevec.normalize();

  // Find C, the vector from the center of the moving
  // circle A to the center of B
  var C = B.center.substract(A.center);

  // D = N . C = ||C|| * cos(angle between N and C)
  var D = N.dot(C);

  // Another early escape: Make sure that A is moving
  // towards B! If the dot product between the movevec and
  // B.center - A.center is less that or equal to 0,
  // A isn't isn't moving towards B
  if (D <= 0){
    return false;
  }

  // Find the length of the vector C
  var lengthC = C.length();

  var F = (lengthC * lengthC) - (D * D);

  // Escape test: if the closest that A will get to B
  // is more than the sum of their radii, there's no
  // way they are going collide
  var sumRadiiSquared = sumRadii * sumRadii;
  if(F >= sumRadiiSquared){
    return false;
  }

  // We now have F and sumRadii, two sides of a right triangle.
  // Use these to find the third side, sqrt(T)
  var T = sumRadiiSquared - F;

  // If there is no such right triangle with sides length of
  // sumRadii and sqrt(f), T will probably be less than 0.
  // Better to check now than perform a square root of a
  // negative number.
  if(T < 0){
    return false;
  }

  // Therefore the distance the circle has to travel along
  // movevec is D - sqrt(T)
  var distance = D - Math.sqrt(T);

  // Get the magnitude of the movement vector
  var mag = movevec.distance;

  // Finally, make sure that the distance A has to move
  // to touch B is not greater than the magnitude of the
  // movement vector.
  if (mag < distance){
    return false;
  }

  // Set the length of the movevec so that the circles will just
  // touch
  var tillCollision = N.multiply(distance);

  var timeTillCollision = tillCollision.length() / movevec.length();

  return timeTillCollision;
}

module.exports = detectCollision;