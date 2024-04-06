/*{
  "DESCRIPTION": "dreamseqs raymarching",
  "CREDIT": "Kanon Kakuno",
  "ISFVSN": "2.0",
  "VSN": "1.0.0",
  "CATEGORIES": [
    "dreamseqs",
    "GENERATOR"
  ],
  "INPUTS": [
    {
      "TYPE": "color",
      "NAME": "primaryColor",
      "LABEL": "Primary color",
      "DEFAULT": [1.0, 1.0, 1.0, 1.0]
    }
  ]
}*/

/**
 * Constants
 */

const float EPSILON = 0.001;
const float PI = 3.141592;


/**
 * Utility functions
 */

mat3 genRotateX(float rad) {
  return mat3(1, 0,         0,
              0, cos(rad),  sin(rad),
              0, -sin(rad), cos(rad));
}

mat3 genRotateY(float rad) {
  return mat3(cos(rad), 0, -sin(rad),
              0,        1, 0,
              sin(rad), 0, cos(rad));
}

mat3 genRotateZ(float rad) {
  return mat3(cos(rad),  sin(rad), 0,
              -sin(rad), cos(rad), 0,
              0,         0,        1);
}


/**
 * Raymarching fundamentals
 */

vec3 genRay() {
  vec2 normXYCoord = isf_FragNormCoord * 2.0 - 1.0;

  return normalize(genRotateZ(-normXYCoord.x * PI) * genRotateX(normXYCoord.y * PI * 0.5) * vec3(0.0, 1.0, 0.0));
}


/**
 * SDF
 */

float sdfSphere(vec3 rayPos) {
  return length(mod(rayPos, 4.0) - vec3(2.0, 2.0, 2.0)) - 1.0;
}

// @see https://www.shadertoy.com/view/lcVGzz
float sdfGyroid(vec3 rayPos) {
  return dot(cos(rayPos), sin(rayPos.yzx));
}


/**
 * Scene functions
 */

float sceneSdf(vec3 rayPos) {
  // return sdfSphere(rayPos);
  return sdfGyroid(rayPos);
}

vec3 sceneNormal(vec3 rayPos) {
  return normalize(vec3(sceneSdf(vec3(rayPos.x + EPSILON, rayPos.y, rayPos.z)) - sceneSdf(vec3(rayPos.x - EPSILON, rayPos.y, rayPos.z)),
                        sceneSdf(vec3(rayPos.x, rayPos.y + EPSILON, rayPos.z)) - sceneSdf(vec3(rayPos.x, rayPos.y - EPSILON, rayPos.z)),
                        sceneSdf(vec3(rayPos.x, rayPos.y, rayPos.z + EPSILON)) - sceneSdf(vec3(rayPos.x, rayPos.y, rayPos.z - EPSILON))));
}

void main() {
  vec3 ray = genRotateX(-0.4) * genRay() + vec3(sin(TIME) * 0.1 + sin(TIME * 2.0) * 0.1, 0.0, cos(TIME * 0.4) * 0.1 + cos(TIME * 3.0) * 0.1);
  vec3 camPos = vec3(2.0, TIME * 5.0, 0.0);

  vec3 rayPos = camPos;
  float sdfResult = 1.0;
  float rayLength = 0.0;
  for (int i = 0; i < 64; i++) {
    sdfResult = sceneSdf(rayPos);
    rayPos += sdfResult * ray;
    rayLength += sdfResult;
  }

  vec3 normal = sceneNormal(rayPos);
  float fragColor = 1 - step(sdfResult, EPSILON) * (1.0 - (rayLength * 0.05)) * clamp(dot(normal, -ray), 0.1, 1.0);

  gl_FragColor = primaryColor * vec4(vec3(fragColor), 1.0);
}
