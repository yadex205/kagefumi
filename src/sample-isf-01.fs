/*{
  "DESCRIPTION": "Sample ISF program",
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
      "DEFAULT": 0.5,
      "MIN": 0.0,
      "MAX": 1.0
    },
    {
      "NAME": "switch1",
      "TYPE": "bool",
      "DEFAULT": 1.0
    },
    {
      "NAME": "switch2",
      "TYPE": "long",
      "DEFAULT": 2,
      "MIN": 0,
      "MAX": 2,
      "LABELS": ["A", "B", "C"]
    },
    {
      "NAME": "color",
      "TYPE": "color",
      "DEFAULT": [0.5, 0.5, 0.5, 1.0]
    }
  ]
}*/

void main() {
  if (switch1 == false) {
    gl_FragColor = vec4(color.rgb * level, 1.0);
  } else if (switch2 == 0) {
    gl_FragColor = vec4(color.r * level, color.gb, 1.0);
  } else if (switch2 == 1) {
    gl_FragColor = vec4(color.r, color.g * level, color.b, 1.0);
  } else if (switch2 == 2) {
    gl_FragColor = vec4(color.rg, color.b * level * mod(TIME, 1.0) * 2.0, 1.0);
  }
}
