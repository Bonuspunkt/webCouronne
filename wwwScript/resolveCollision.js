function resolveCollision(circle1, circle2) {

  // First, find the normalized vector n from the center of
  // circle1 to the center of circle2
  var n = circle1.center.substract(circle2.center).normalize();

  // Find the length of the component of each of the movement
  // vectors along n.
  // a1 = v1 . n
  // a2 = v2 . n
  var a1 = circle1.moveVector.dot(n);
  var a2 = circle2.moveVector.dot(n);

  // Using the optimized version,
  // optimizedP =  2(a1 - a2)
  //              -----------
  //                m1 + m2
  var optimizedP = (2.0 * (a1 - a2)) / (circle1.mass + circle2.mass);

  // Calculate v1', the new movement vector of circle1
  // v1' = v1 - optimizedP * m2 * n
  var v1dash = circle1.moveVector.substract(n.multiply(optimizedP * circle2.mass));

  // Calculate v1', the new movement vector of circle1
  // v2' = v2 + optimizedP * m1 * n
  var v2dash = circle2.moveVector.add(n.multiply(optimizedP * circle1.mass));

  circle1.moveVector = v1dash;
  circle2.moveVector = v2dash;
}

module.exports = resolveCollision;