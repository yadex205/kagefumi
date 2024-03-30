/*{
  "DESCRIPTION": "Sample ISF program 02",
  "CREDIT": "Kanon Kakuno",
  "ISFVSN": "2.0",
  "VSN": "1.0.0",
  "CATEGORY": [
    "GENERATOR"
  ],
  "INPUTS": [
    {
      "NAME": "level",
      "LABEL": "Level",
      "TYPE": "float",
      "DEFAULT": 1.0,
      "MIN": 0.0,
      "MAX": 1.0
    }
  ]
}*/

void main() {
  gl_FragColor = vec4(level, level, level, 1.0);
}
